const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const natural = require('natural');
const compromise = require('compromise');

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Legal sections knowledge base
const legalSections = require('../knowledge-base/legal-sections.json');

/**
 * FIR Analysis Service
 */
class FIRAnalysisService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.sentiment = new natural.SentimentAnalyzer('English', 
      natural.PorterStemmer, ['negation']);
  }

  /**
   * Main analysis function
   */
  async analyzeFIR(firText) {
    try {
      const startTime = Date.now();
      
      // Step 1: Language detection and preprocessing
      const preprocessed = this.preprocessText(firText);
      
      // Step 2: Information extraction
      const extractedInfo = this.extractInformation(preprocessed);
      
      // Step 3: Legal section mapping
      const legalMapping = this.mapLegalSections(firText, extractedInfo);
      
      // Step 4: Generate insights
      const insights = this.generateInsights(extractedInfo, legalMapping);
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        processingTime,
        confidence: this.calculateConfidence(extractedInfo),
        results: {
          complainant: extractedInfo.complainant,
          accused: extractedInfo.accused,
          incident: extractedInfo.incident,
          offences: extractedInfo.offences,
          legalSections: legalMapping,
          evidence: extractedInfo.evidence,
          insights: insights,
          metadata: {
            textLength: firText.length,
            languageDetected: this.detectLanguage(firText),
            processingSteps: ['preprocessing', 'extraction', 'mapping', 'insights']
          }
        }
      };
    } catch (error) {
      console.error('FIR Analysis Error:', error);
      return {
        success: false,
        error: error.message,
        results: null
      };
    }
  }

  /**
   * Preprocess the FIR text
   */
  preprocessText(text) {
    // Remove extra whitespace and normalize
    let processed = text.replace(/\s+/g, ' ').trim();
    
    // Handle Telugu text (basic transliteration markers)
    processed = processed.replace(/[\u0C00-\u0C7F]/g, (match) => {
      // Keep Telugu text as is for now
      return match;
    });
    
    return processed;
  }

  /**
   * Extract structured information from FIR text
   */
  extractInformation(text) {
    const doc = compromise(text);
    
    return {
      complainant: this.extractComplainant(text, doc),
      accused: this.extractAccused(text, doc),
      incident: this.extractIncident(text, doc),
      offences: this.extractOffences(text, doc),
      evidence: this.extractEvidence(text, doc)
    };
  }

  /**
   * Extract complainant information
   */
  extractComplainant(text, doc) {
    const complainant = {};
    
    // Extract name
    const namePattern = /complainant\s+([A-Za-z\s]+?)(?:,|\s+S\/o|\s+D\/o|\s+W\/o)/i;
    const nameMatch = text.match(namePattern);
    complainant.name = nameMatch ? nameMatch[1].trim() : 'Not specified';
    
    // Extract father's/husband's name
    const relationPattern = /(?:S\/o|D\/o|W\/o)\s+([A-Za-z\s]+?)(?:,|Age|\s+age)/i;
    const relationMatch = text.match(relationPattern);
    complainant.guardian = relationMatch ? relationMatch[1].trim() : 'Not specified';
    
    // Extract age
    const agePattern = /Age[:\s]*(\d+)/i;
    const ageMatch = text.match(agePattern);
    complainant.age = ageMatch ? parseInt(ageMatch[1]) : null;
    
    // Extract community/caste
    const communityPattern = /Community[:\s]*([^,\n]+)/i;
    const communityMatch = text.match(communityPattern);
    complainant.community = communityMatch ? communityMatch[1].trim() : 'Not specified';
    
    // Extract address
    const addressPattern = /(?:R\/o|Address)[:\s]*([^,\n]+(?:,[^,\n]+)*)/i;
    const addressMatch = text.match(addressPattern);
    complainant.address = addressMatch ? addressMatch[1].trim() : 'Not specified';
    
    return complainant;
  }

  /**
   * Extract accused information
   */
  extractAccused(text, doc) {
    const accused = [];
    
    // Look for numbered accused persons
    const numberedPattern = /(\d+)\.\s*([A-Za-z\s]+?)(?:\s*\(([^)]+)\))?(?:\s*,|\s*\n|$)/g;
    let match;
    
    while ((match = numberedPattern.exec(text)) !== null) {
      accused.push({
        serialNo: parseInt(match[1]),
        name: match[2].trim(),
        details: match[3] ? match[3].trim() : 'Details not specified',
        identified: match[2].toLowerCase() !== 'unknown'
      });
    }
    
    // If no numbered list found, look for general mentions
    if (accused.length === 0) {
      const generalPattern = /accused\s+(?:person[s]?\s+)?([A-Za-z\s]+)/gi;
      const generalMatches = text.match(generalPattern);
      
      if (generalMatches) {
        generalMatches.forEach((match, index) => {
          const nameMatch = match.match(/accused\s+(?:person[s]?\s+)?([A-Za-z\s]+)/i);
          if (nameMatch) {
            accused.push({
              serialNo: index + 1,
              name: nameMatch[1].trim(),
              details: 'General mention',
              identified: !nameMatch[1].toLowerCase().includes('unknown')
            });
          }
        });
      }
    }
    
    return accused.length > 0 ? accused : [{
      serialNo: 1,
      name: 'Unknown',
      details: 'Not identified',
      identified: false
    }];
  }

  /**
   * Extract incident details
   */
  extractIncident(text, doc) {
    const incident = {};
    
    // Extract date
    const datePattern = /On\s+(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4})/i;
    const dateMatch = text.match(datePattern);
    incident.date = dateMatch ? dateMatch[1] : 'Not specified';
    
    // Extract time
    const timePattern = /at\s+about\s+([^,\n]+)/i;
    const timeMatch = text.match(timePattern);
    incident.time = timeMatch ? timeMatch[1].trim() : 'Not specified';
    
    // Extract location
    const locationPatterns = [
      /near\s+([^,\n]+)/i,
      /at\s+([^,\n]+)/i,
      /in\s+([^,\n]+)/i
    ];
    
    let location = 'Not specified';
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match && !match[1].includes('about')) {
        location = match[1].trim();
        break;
      }
    }
    incident.location = location;
    
    // Extract incident type
    incident.type = this.classifyIncidentType(text);
    
    // Extract brief summary
    const sentences = text.split(/[.!?]+/);
    const relevantSentence = sentences.find(s => 
      s.toLowerCase().includes('incident') || 
      s.toLowerCase().includes('reported') ||
      s.toLowerCase().includes('complaint')
    );
    
    incident.summary = relevantSentence ? 
      relevantSentence.trim().substring(0, 200) + '...' : 
      'Incident details extracted from FIR text';
    
    return incident;
  }

  /**
   * Extract offences from text
   */
  extractOffences(text, doc) {
    const offences = new Set();
    const textLower = text.toLowerCase();
    
    // Define offence detection patterns
    const offencePatterns = [
      { pattern: /caste|scheduled\s+caste|sc\/st|discrimination|humiliat/i, 
        offence: 'Caste-based Discrimination', severity: 'high' },
      { pattern: /robbery|loot|snatch|forcibly.*(?:took|taken)|stolen/i, 
        offence: 'Robbery/Theft', severity: 'high' },
      { pattern: /assault|attack|hit|beat|injur|hurt|harm/i, 
        offence: 'Physical Assault', severity: 'medium' },
      { pattern: /pistol|gun|weapon|firearm|arms/i, 
        offence: 'Illegal Possession of Arms', severity: 'high' },
      { pattern: /abuse|slur|derogatory|offensive|insult/i, 
        offence: 'Verbal Abuse', severity: 'medium' },
      { pattern: /threat|intimidat|fear|coer/i, 
        offence: 'Criminal Intimidation', severity: 'medium' },
      { pattern: /mobile|phone|wallet|money|cash|property/i, 
        offence: 'Theft of Personal Property', severity: 'medium' },
      { pattern: /dacoity|gang.*robbery|group.*crime/i, 
        offence: 'Dacoity', severity: 'high' },
      { pattern: /false.*evidence|fabricat.*evidence/i, 
        offence: 'Giving False Evidence', severity: 'high' }
    ];
    
    const detectedOffences = [];
    offencePatterns.forEach(({ pattern, offence, severity }) => {
      if (pattern.test(text)) {
        detectedOffences.push({ name: offence, severity, detected: true });
        offences.add(offence);
      }
    });
    
    return detectedOffences.length > 0 ? detectedOffences : 
      [{ name: 'General Criminal Offense', severity: 'medium', detected: false }];
  }

  /**
   * Extract evidence and witnesses
   */
  extractEvidence(text, doc) {
    const evidence = [];
    const witnesses = [];
    
    // Evidence patterns
    const evidencePatterns = [
      /cctv|camera|footage|video/i,
      /medical|report|examination|injury|hospital/i,
      /photograph|photo|image|picture/i,
      /document|paper|id|card|certificate/i,
      /torn|damaged|broken|destroyed/i,
      /fingerprint|dna|forensic/i
    ];
    
    evidencePatterns.forEach(pattern => {
      const matches = text.match(new RegExp(`[^.!?]*${pattern.source}[^.!?]*`, 'gi'));
      if (matches) {
        matches.forEach(match => {
          evidence.push({
            type: this.categorizeEvidence(match),
            description: match.trim(),
            collected: true
          });
        });
      }
    });
    
    // Witness extraction
    const witnessSection = text.match(/witness[^:]*:?\s*\n?([^.!?]*(?:[.!?][^.!?]*)*)/gi);
    if (witnessSection) {
      witnessSection.forEach(section => {
        const names = section.match(/\d+\.\s*([A-Za-z\s]+)(?:\s*\([^)]+\))?/g);
        if (names) {
          names.forEach(name => {
            const cleanName = name.replace(/\d+\.\s*/, '').replace(/\([^)]+\)/, '').trim();
            const details = name.match(/\(([^)]+)\)/);
            witnesses.push({
              name: cleanName,
              details: details ? details[1] : 'Witness details not specified',
              statement: 'Statement to be recorded'
            });
          });
        }
      });
    }
    
    return {
      evidence: evidence.length > 0 ? evidence : 
        [{ type: 'Physical', description: 'Evidence to be collected', collected: false }],
      witnesses: witnesses.length > 0 ? witnesses : 
        [{ name: 'Witness identification pending', details: 'To be identified', statement: 'Statement pending' }]
    };
  }

  /**
   * Map legal sections based on extracted information
   */
  mapLegalSections(text, extractedInfo) {
    const applicableSections = [];
    const textLower = text.toLowerCase();
    
    // Check each keyword mapping
    Object.entries(legalSections.keywords_to_sections).forEach(([keyword, sections]) => {
      if (textLower.includes(keyword.toLowerCase())) {
        sections.forEach(sectionRef => {
          const [act, sectionNum] = sectionRef.split('.');
          const actData = legalSections[act];
          const sectionData = actData?.sections?.[sectionNum];
          
          if (sectionData) {
            applicableSections.push({
              act: actData.name,
              section: sectionNum,
              title: sectionData.title,
              description: sectionData.description,
              severity: this.getSectionSeverity(sectionRef),
              confidence: this.calculateSectionConfidence(keyword, text)
            });
          }
        });
      }
    });
    
    // Remove duplicates and sort by confidence
    const uniqueSections = applicableSections.filter((section, index, self) => 
      index === self.findIndex(s => s.section === section.section && s.act === section.act)
    ).sort((a, b) => b.confidence - a.confidence);
    
    return uniqueSections.length > 0 ? uniqueSections : [{
      act: 'Bharatiya Nyaya Sanhita 2023',
      section: '223',
      title: 'General criminal offense',
      description: 'General provisions for criminal offenses',
      severity: 'medium',
      confidence: 0.5
    }];
  }

  /**
   * Generate insights and recommendations
   */
  generateInsights(extractedInfo, legalMapping) {
    const insights = {
      summary: this.generateSummary(extractedInfo),
      recommendations: this.generateRecommendations(extractedInfo, legalMapping),
      riskAssessment: this.assessRisk(extractedInfo, legalMapping),
      nextSteps: this.suggestNextSteps(extractedInfo, legalMapping)
    };
    
    return insights;
  }

  /**
   * Helper methods
   */
  detectLanguage(text) {
    const teluguChars = (text.match(/[\u0C00-\u0C7F]/g) || []).length;
    const totalChars = text.length;
    const teluguPercentage = (teluguChars / totalChars) * 100;
    
    if (teluguPercentage > 20) return 'Mixed (English + Telugu)';
    if (teluguPercentage > 5) return 'Primarily English with Telugu';
    return 'English';
  }

  classifyIncidentType(text) {
    const types = [
      { pattern: /caste.*discrimination|sc\/st/i, type: 'Caste-based Crime' },
      { pattern: /robbery|theft|loot/i, type: 'Property Crime' },
      { pattern: /assault|violence|attack/i, type: 'Violent Crime' },
      { pattern: /threat|intimidation/i, type: 'Intimidation' },
      { pattern: /arms|weapon|gun/i, type: 'Arms Related' }
    ];
    
    for (const { pattern, type } of types) {
      if (pattern.test(text)) return type;
    }
    
    return 'General Criminal Complaint';
  }

  categorizeEvidence(evidenceText) {
    if (/cctv|camera|video/i.test(evidenceText)) return 'Video Evidence';
    if (/medical|injury|hospital/i.test(evidenceText)) return 'Medical Evidence';
    if (/photo|image/i.test(evidenceText)) return 'Photographic Evidence';
    if (/document|paper/i.test(evidenceText)) return 'Documentary Evidence';
    if (/torn|damaged/i.test(evidenceText)) return 'Physical Evidence';
    return 'Physical Evidence';
  }

  getSectionSeverity(sectionRef) {
    const { high, medium, low } = legalSections.severity_levels;
    if (high.sections.includes(sectionRef)) return 'high';
    if (medium.sections.includes(sectionRef)) return 'medium';
    if (low.sections.includes(sectionRef)) return 'low';
    return 'medium';
  }

  calculateSectionConfidence(keyword, text) {
    const keywordCount = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const textLength = text.length;
    return Math.min(0.9, (keywordCount / textLength) * 1000 + 0.3);
  }

  calculateConfidence(extractedInfo) {
    let score = 0;
    let factors = 0;
    
    // Complainant information completeness
    if (extractedInfo.complainant.name !== 'Not specified') { score += 20; factors++; }
    if (extractedInfo.complainant.age) { score += 10; factors++; }
    if (extractedInfo.complainant.address !== 'Not specified') { score += 15; factors++; }
    
    // Incident details completeness
    if (extractedInfo.incident.date !== 'Not specified') { score += 15; factors++; }
    if (extractedInfo.incident.location !== 'Not specified') { score += 15; factors++; }
    
    // Accused information
    if (extractedInfo.accused.some(a => a.identified)) { score += 20; factors++; }
    
    // Evidence availability
    if (extractedInfo.evidence.evidence.some(e => e.collected)) { score += 5; factors++; }
    
    return factors > 0 ? Math.min(95, Math.max(60, score / factors * 10)) : 75;
  }

  generateSummary(extractedInfo) {
    const { complainant, incident, accused, offences } = extractedInfo;
    
    return `FIR filed by ${complainant.name || 'complainant'} on ${incident.date || 'specified date'} ` +
           `regarding ${offences.map(o => o.name).join(', ').toLowerCase()} involving ` +
           `${accused.length} accused person(s). Incident occurred at ${incident.location || 'specified location'}.`;
  }

  generateRecommendations(extractedInfo, legalMapping) {
    const recommendations = [];
    
    // Based on legal sections
    if (legalMapping.some(s => s.act.includes('SC/ST'))) {
      recommendations.push('File case under SC/ST Prevention of Atrocities Act');
      recommendations.push('Ensure fast-track court proceedings');
    }
    
    if (legalMapping.some(s => s.act.includes('Arms'))) {
      recommendations.push('Conduct thorough search for illegal weapons');
      recommendations.push('Verify arms licenses of accused');
    }
    
    // Based on evidence
    if (extractedInfo.evidence.evidence.some(e => e.type === 'Video Evidence')) {
      recommendations.push('Preserve CCTV footage immediately');
    }
    
    if (extractedInfo.evidence.evidence.some(e => e.type === 'Medical Evidence')) {
      recommendations.push('Conduct detailed medical examination');
    }
    
    return recommendations.length > 0 ? recommendations : [
      'Conduct thorough investigation',
      'Record witness statements',
      'Collect physical evidence'
    ];
  }

  assessRisk(extractedInfo, legalMapping) {
    let riskScore = 0;
    const factors = [];
    
    // High-severity sections
    if (legalMapping.some(s => s.severity === 'high')) {
      riskScore += 30;
      factors.push('High-severity legal sections applicable');
    }
    
    // Caste-based crime
    if (extractedInfo.offences.some(o => o.name.includes('Caste'))) {
      riskScore += 25;
      factors.push('Caste-based discrimination involved');
    }
    
    // Arms involvement
    if (extractedInfo.offences.some(o => o.name.includes('Arms'))) {
      riskScore += 20;
      factors.push('Illegal arms possession suspected');
    }
    
    // Multiple accused
    if (extractedInfo.accused.length > 2) {
      riskScore += 15;
      factors.push('Multiple accused persons');
    }
    
    let riskLevel = 'Low';
    if (riskScore > 50) riskLevel = 'High';
    else if (riskScore > 25) riskLevel = 'Medium';
    
    return {
      level: riskLevel,
      score: Math.min(100, riskScore),
      factors: factors
    };
  }

  suggestNextSteps(extractedInfo, legalMapping) {
    const steps = [];
    
    steps.push('Register FIR under appropriate sections');
    steps.push('Conduct preliminary investigation');
    
    if (extractedInfo.evidence.witnesses.length > 0) {
      steps.push('Record witness statements under Section 161 CrPC');
    }
    
    if (legalMapping.some(s => s.act.includes('SC/ST'))) {
      steps.push('Inform SC/ST Commission');
      steps.push('Ensure investigation by DSP level officer');
    }
    
    if (extractedInfo.offences.some(o => o.severity === 'high')) {
      steps.push('Consider arrest of accused if evidence sufficient');
    }
    
    steps.push('Submit charge sheet within stipulated time');
    
    return steps;
  }
}

// Initialize service
const firAnalysisService = new FIRAnalysisService();

// API Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { firText } = req.body;
    
    if (!firText || firText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'FIR text is required and must be at least 50 characters long'
      });
    }
    
    const result = await firAnalysisService.analyzeFIR(firText);
    res.json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during analysis'
    });
  }
});

app.get('/api/legal-sections', (req, res) => {
  res.json({
    success: true,
    data: legalSections
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DHARMA FIR Analyzer API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);

// Additional Cloud Functions
exports.scheduledAnalysis = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    console.log('Running scheduled analysis cleanup...');
    // Cleanup old analysis data, update statistics, etc.
    return null;
  });

exports.onAnalysisComplete = functions.firestore
  .document('analyses/{analysisId}')
  .onCreate(async (snap, context) => {
    const analysisData = snap.data();
    console.log('New analysis completed:', context.params.analysisId);
    
    // Send notifications, update statistics, etc.
    return null;
  });