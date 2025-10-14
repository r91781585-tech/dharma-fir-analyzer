// DHARMA FIR Analyzer - Standalone Version (HTML/CSS/JavaScript Only)

// Legal sections data embedded directly in JavaScript
const LEGAL_DATA = {
  "bns_2023": {
    "name": "Bharatiya Nyaya Sanhita 2023",
    "sections": {
      "115": {
        "title": "Voluntarily causing hurt",
        "description": "Whoever voluntarily causes hurt shall be punished with imprisonment of either description for a term which may extend to one year, or with fine which may extend to ten thousand rupees, or with both.",
        "keywords": ["hurt", "injury", "assault", "physical harm"]
      },
      "116": {
        "title": "Voluntarily causing grievous hurt",
        "description": "Whoever voluntarily causes grievous hurt shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        "keywords": ["grievous hurt", "serious injury", "permanent damage"]
      },
      "309": {
        "title": "Robbery",
        "description": "Whoever commits robbery shall be punished with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine; and, if the robbery be committed on the highway between sunset and sunrise, the imprisonment may be extended to fourteen years.",
        "keywords": ["robbery", "theft", "force", "snatching", "highway robbery"]
      },
      "351": {
        "title": "Criminal intimidation",
        "description": "Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person, commits criminal intimidation.",
        "keywords": ["threat", "intimidation", "fear", "coercion"]
      },
      "223": {
        "title": "General provisions for punishment",
        "description": "General criminal offense provisions under Bharatiya Nyaya Sanhita 2023.",
        "keywords": ["general", "criminal", "offense"]
      }
    }
  },
  "sc_st_act": {
    "name": "Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989",
    "sections": {
      "3(1)(r)": {
        "title": "Abuses or humiliates members of SC/ST",
        "description": "Whoever, not being a member of a Scheduled Caste or a Scheduled Tribe, abuses or humiliates a member of a Scheduled Caste or a Scheduled Tribe in any place within public view.",
        "keywords": ["caste abuse", "humiliation", "scheduled caste", "scheduled tribe", "public humiliation"]
      },
      "3(1)(s)": {
        "title": "Promotes or attempts to promote feelings of enmity, hatred or ill-will against SC/ST",
        "description": "Whoever promotes or attempts to promote feelings of enmity, hatred or ill-will against members of the Scheduled Castes or the Scheduled Tribes.",
        "keywords": ["enmity", "hatred", "ill-will", "caste discrimination"]
      },
      "3(1)(u)": {
        "title": "Intentionally insults or intimidates with intent to humiliate SC/ST",
        "description": "Whoever intentionally insults or intimidates with intent to humiliate a member of a Scheduled Caste or a Scheduled Tribe in any place within public view.",
        "keywords": ["insult", "intimidate", "humiliate", "public view"]
      }
    }
  },
  "arms_act": {
    "name": "Arms Act, 1959",
    "sections": {
      "25": {
        "title": "Punishment for contravention of license or rule",
        "description": "Whoever acquires, has in his possession or carries any prohibited arms or prohibited ammunition shall be punishable with imprisonment for a term which shall not be less than five years but which may extend to ten years and shall also be liable to fine.",
        "keywords": ["prohibited arms", "illegal weapons", "unlicensed firearms", "ammunition"]
      }
    }
  },
  "keywords_to_sections": {
    "caste": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(s)"],
    "scheduled caste": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(s)", "sc_st_act.3(1)(u)"],
    "scheduled tribe": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(s)", "sc_st_act.3(1)(u)"],
    "abuse": ["sc_st_act.3(1)(r)", "bns_2023.115"],
    "humiliation": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(u)"],
    "robbery": ["bns_2023.309"],
    "theft": ["bns_2023.309"],
    "snatching": ["bns_2023.309"],
    "assault": ["bns_2023.115", "bns_2023.116"],
    "hurt": ["bns_2023.115", "bns_2023.116"],
    "injury": ["bns_2023.115", "bns_2023.116"],
    "threat": ["bns_2023.351"],
    "intimidation": ["bns_2023.351", "sc_st_act.3(1)(u)"],
    "weapon": ["arms_act.25"],
    "pistol": ["arms_act.25"],
    "gun": ["arms_act.25"],
    "firearm": ["arms_act.25"],
    "arms": ["arms_act.25"],
    "discrimination": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(s)"],
    "derogatory": ["sc_st_act.3(1)(r)", "sc_st_act.3(1)(u)"],
    "slur": ["sc_st_act.3(1)(r)"],
    "beaten": ["bns_2023.115", "bns_2023.116"],
    "hit": ["bns_2023.115", "bns_2023.116"],
    "stick": ["bns_2023.115"],
    "forcibly": ["bns_2023.309"],
    "snatch": ["bns_2023.309"]
  }
};

class FIRAnalyzer {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadingSteps = ['step1', 'step2', 'step3', 'step4'];
        this.currentStep = 0;
        this.analysisResults = null;
    }

    initializeElements() {
        // Input elements
        this.firTextArea = document.getElementById('firText');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.clearBtn = document.getElementById('clearBtn');

        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.processingTime = document.getElementById('processingTime');
        this.confidenceScore = document.getElementById('confidenceScore');

        // Result cards
        this.complainantDetails = document.getElementById('complainantDetails');
        this.accusedDetails = document.getElementById('accusedDetails');
        this.incidentDetails = document.getElementById('incidentDetails');
        this.legalSections = document.getElementById('legalSections');
        this.offencesList = document.getElementById('offencesList');
        this.evidenceWitnesses = document.getElementById('evidenceWitnesses');

        // Export buttons
        this.exportJsonBtn = document.getElementById('exportJson');
        this.exportPdfBtn = document.getElementById('exportPdf');
        this.shareResultsBtn = document.getElementById('shareResults');
    }

    bindEvents() {
        this.analyzeBtn.addEventListener('click', () => this.analyzeFIR());
        this.sampleBtn.addEventListener('click', () => this.loadSampleText());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.exportJsonBtn.addEventListener('click', () => this.exportToJSON());
        this.exportPdfBtn.addEventListener('click', () => this.exportToPDF());
        this.shareResultsBtn.addEventListener('click', () => this.shareResults());

        // Auto-resize textarea
        this.firTextArea.addEventListener('input', this.autoResizeTextarea);
    }

    loadSampleText() {
        const sampleFIR = `On 14th September 2025, at about 8:15 PM, complainant Rajesh Kumar, S/o Venkat Rao, Age 34, Community: Scheduled Caste, R/o H.No. 12-34, Gandhi Nagar, Hyderabad, Telangana, reported the following incident:

The complainant was returning home from work when he was stopped by three unknown persons near the bus stop. The accused persons, identified as:
1. Ramesh (approximately 25 years old)
2. Suresh (approximately 30 years old) 
3. One unknown person

The accused persons started abusing the complainant using caste-based slurs in Telugu saying "నీవు ఎలా ఇక్కడ నడుస్తున్నావు" (How dare you walk here) and other derogatory remarks about his caste. They then forcibly snatched his mobile phone (Samsung Galaxy A54, worth Rs. 25,000) and wallet containing Rs. 3,500 cash and important documents including Aadhaar card.

When the complainant resisted, accused Ramesh hit him with a wooden stick on his left arm causing injury. The complainant also noticed that accused Suresh was carrying what appeared to be a country-made pistol.

Witnesses present at the scene:
1. Lakshmi Devi (vegetable vendor)
2. Auto driver Ravi Kumar

The complainant immediately reported the matter to the local police station. Medical examination was conducted at Government Hospital showing minor injuries on left arm.

Evidence collected:
- CCTV footage from nearby shop
- Medical report
- Witness statements
- Torn shirt of complainant

This incident appears to involve caste-based discrimination, robbery, assault, and illegal possession of arms. Appropriate legal action is requested under relevant sections of BNS 2023, SC/ST Prevention of Atrocities Act, and Arms Act.`;

        this.firTextArea.value = sampleFIR;
        this.autoResizeTextarea.call(this.firTextArea);
    }

    clearText() {
        this.firTextArea.value = '';
        this.resultsSection.style.display = 'none';
        this.analysisResults = null;
    }

    autoResizeTextarea() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

    async analyzeFIR() {
        const firText = this.firTextArea.value.trim();
        
        if (!firText) {
            this.showNotification('Please enter FIR text to analyze', 'warning');
            return;
        }

        if (firText.length < 50) {
            this.showNotification('FIR text should be at least 50 characters long', 'warning');
            return;
        }

        this.showLoading();
        const startTime = Date.now();

        try {
            // Simulate processing steps
            await this.simulateAnalysis();
            
            // Generate analysis results
            const results = this.generateAnalysisResults(firText);
            
            const processingTime = Date.now() - startTime;
            this.displayResults(results, processingTime);
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showNotification('Analysis failed. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async simulateAnalysis() {
        const steps = [
            { id: 'step1', delay: 800, name: 'Language Detection' },
            { id: 'step2', delay: 1200, name: 'Information Extraction' },
            { id: 'step3', delay: 1000, name: 'Legal Mapping' },
            { id: 'step4', delay: 600, name: 'Analysis Complete' }
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, steps[i].delay));
            this.updateLoadingStep(i);
        }
    }

    generateAnalysisResults(firText) {
        const results = {
            complainant: this.extractComplainant(firText),
            accused: this.extractAccused(firText),
            incident: this.extractIncident(firText),
            offences: this.identifyOffences(firText),
            legalSections: this.mapLegalSections(firText),
            evidence: this.extractEvidence(firText),
            confidence: this.calculateConfidence(firText),
            metadata: {
                textLength: firText.length,
                languageDetected: this.detectLanguage(firText),
                processingSteps: ['preprocessing', 'extraction', 'mapping', 'insights']
            }
        };

        this.analysisResults = results;
        return results;
    }

    extractComplainant(text) {
        const complainant = {};
        
        // Extract name
        const nameMatch = text.match(/complainant\s+([A-Za-z\s]+?)(?:,|\s+S\/o|\s+D\/o|\s+W\/o)/i);
        complainant.name = nameMatch ? nameMatch[1].trim() : 'Not specified';
        
        // Extract father's/guardian's name
        const guardianMatch = text.match(/(?:S\/o|D\/o|W\/o)\s+([A-Za-z\s]+?)(?:,|Age|\s+age)/i);
        complainant.guardian = guardianMatch ? guardianMatch[1].trim() : 'Not specified';
        
        // Extract age
        const ageMatch = text.match(/Age[:\s]*(\d+)/i);
        complainant.age = ageMatch ? ageMatch[1] : 'Not specified';
        
        // Extract community
        const communityMatch = text.match(/Community[:\s]*([^,\n]+)/i);
        complainant.community = communityMatch ? communityMatch[1].trim() : 'Not specified';
        
        // Extract address
        const addressMatch = text.match(/(?:R\/o|Address)[:\s]*([^,\n]+(?:,[^,\n]+)*)/i);
        complainant.address = addressMatch ? addressMatch[1].trim() : 'Not specified';
        
        return complainant;
    }

    extractAccused(text) {
        const accused = [];
        
        // Look for numbered accused persons
        const numberedPattern = /(\d+)\.\s*([A-Za-z\s]+?)(?:\s*\(([^)]+)\))?(?:\s*,|\s*\n|$)/g;
        let match;
        
        while ((match = numberedPattern.exec(text)) !== null) {
            accused.push({
                serialNo: parseInt(match[1]),
                name: match[2].trim(),
                details: match[3] ? match[3].trim() : 'Details not specified',
                identified: !match[2].toLowerCase().includes('unknown')
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

    extractIncident(text) {
        const incident = {};
        
        // Extract date
        const dateMatch = text.match(/On\s+(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4})/i);
        incident.date = dateMatch ? dateMatch[1] : 'Not specified';
        
        // Extract time
        const timeMatch = text.match(/at\s+about\s+([^,\n]+)/i);
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

    identifyOffences(text) {
        const offences = [];
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
              offence: 'Theft of Personal Property', severity: 'medium' }
        ];
        
        offencePatterns.forEach(({ pattern, offence, severity }) => {
            if (pattern.test(text)) {
                offences.push({ name: offence, severity, detected: true });
            }
        });
        
        return offences.length > 0 ? offences : 
            [{ name: 'General Criminal Offense', severity: 'medium', detected: false }];
    }

    mapLegalSections(text) {
        const applicableSections = [];
        const textLower = text.toLowerCase();
        
        // Check each keyword mapping from LEGAL_DATA
        Object.entries(LEGAL_DATA.keywords_to_sections).forEach(([keyword, sections]) => {
            if (textLower.includes(keyword.toLowerCase())) {
                sections.forEach(sectionRef => {
                    const [act, sectionNum] = sectionRef.split('.');
                    const actData = LEGAL_DATA[act];
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

    extractEvidence(text) {
        const evidence = [];
        const witnesses = [];
        
        // Evidence patterns
        const evidencePatterns = [
            /cctv|camera|footage|video/i,
            /medical|report|examination|injury|hospital/i,
            /photograph|photo|image|picture/i,
            /document|paper|id|card|certificate/i,
            /torn|damaged|broken|destroyed/i
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

    // Helper methods
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
        // Simple severity mapping
        if (sectionRef.includes('sc_st_act') || sectionRef.includes('309') || sectionRef.includes('arms_act.25')) {
            return 'high';
        }
        if (sectionRef.includes('115') || sectionRef.includes('351')) {
            return 'medium';
        }
        return 'medium';
    }

    calculateSectionConfidence(keyword, text) {
        const keywordCount = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        const textLength = text.length;
        return Math.min(0.95, (keywordCount / textLength) * 1000 + 0.4);
    }

    calculateConfidence(text) {
        let score = 0;
        let factors = 0;
        
        // Text length factor
        if (text.length > 200) { score += 20; factors++; }
        if (text.length > 500) { score += 10; factors++; }
        
        // Information completeness
        if (/complainant\s+[A-Za-z\s]+/i.test(text)) { score += 20; factors++; }
        if (/Age[:\s]*\d+/i.test(text)) { score += 10; factors++; }
        if (/On\s+\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}/i.test(text)) { score += 15; factors++; }
        if (/at\s+about\s+/i.test(text)) { score += 10; factors++; }
        
        // Legal keywords presence
        const legalKeywords = ['caste', 'robbery', 'assault', 'threat', 'weapon'];
        const foundKeywords = legalKeywords.filter(keyword => 
            text.toLowerCase().includes(keyword)
        ).length;
        score += foundKeywords * 5;
        factors++;
        
        return factors > 0 ? Math.min(95, Math.max(65, score / factors * 10)) : 75;
    }

    // Display methods
    displayResults(results, processingTime) {
        // Update meta information
        this.processingTime.textContent = `Processed in ${processingTime}ms`;
        this.confidenceScore.textContent = `Confidence: ${Math.round(results.confidence)}%`;
        
        // Display all sections
        this.displayComplainantDetails(results.complainant);
        this.displayAccusedDetails(results.accused);
        this.displayIncidentDetails(results.incident);
        this.displayLegalSections(results.legalSections);
        this.displayOffences(results.offences);
        this.displayEvidenceWitnesses(results.evidence);
        
        // Show results section with animation
        this.resultsSection.style.display = 'block';
        this.resultsSection.classList.add('fade-in');
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    displayComplainantDetails(complainant) {
        this.complainantDetails.innerHTML = `
            <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">${complainant.name}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Guardian:</span>
                <span class="info-value">${complainant.guardian}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Age:</span>
                <span class="info-value">${complainant.age}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Community:</span>
                <span class="info-value">${complainant.community}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Address:</span>
                <span class="info-value">${complainant.address}</span>
            </div>
        `;
    }

    displayAccusedDetails(accused) {
        const accusedHtml = accused.map((person, index) => `
            <div class="info-item">
                <span class="info-label">Accused ${index + 1}:</span>
                <span class="info-value">${person.name} (${person.details})</span>
            </div>
        `).join('');
        
        this.accusedDetails.innerHTML = accusedHtml;
    }

    displayIncidentDetails(incident) {
        this.incidentDetails.innerHTML = `
            <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value">${incident.date}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Time:</span>
                <span class="info-value">${incident.time}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Location:</span>
                <span class="info-value">${incident.location}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Type:</span>
                <span class="info-value">${incident.type}</span>
            </div>
        `;
    }

    displayLegalSections(sections) {
        const sectionsHtml = sections.map(section => `
            <div class="legal-section">
                <div class="legal-section-title">${section.act} - Section ${section.section}</div>
                <div class="legal-section-desc"><strong>${section.title}:</strong> ${section.description}</div>
                <div style="margin-top: 8px; font-size: 0.8rem; color: #666;">
                    Confidence: ${Math.round(section.confidence * 100)}% | Severity: ${section.severity}
                </div>
            </div>
        `).join('');
        
        this.legalSections.innerHTML = sectionsHtml;
    }

    displayOffences(offences) {
        const offencesHtml = offences.map(offence => `
            <div class="offence-item">
                ${offence.name} 
                <span style="font-size: 0.8rem; opacity: 0.8;">(${offence.severity} severity)</span>
            </div>
        `).join('');
        
        this.offencesList.innerHTML = offencesHtml;
    }

    displayEvidenceWitnesses(evidenceData) {
        const evidenceHtml = evidenceData.evidence.map(item => `
            <div class="evidence-item">
                <strong>${item.type}:</strong> ${item.description}
                ${item.collected ? ' ✓' : ' (Pending)'}
            </div>
        `).join('');
        
        const witnessesHtml = evidenceData.witnesses.map(witness => `
            <div class="evidence-item">
                <strong>Witness:</strong> ${witness.name} - ${witness.details}
            </div>
        `).join('');
        
        this.evidenceWitnesses.innerHTML = evidenceHtml + witnessesHtml;
    }

    // Loading and utility methods
    showLoading() {
        this.loadingOverlay.style.display = 'flex';
        this.currentStep = 0;
        this.resetLoadingSteps();
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    resetLoadingSteps() {
        this.loadingSteps.forEach(stepId => {
            const step = document.getElementById(stepId);
            step.classList.remove('active', 'completed');
        });
        document.getElementById('step1').classList.add('active');
    }

    updateLoadingStep(stepIndex) {
        if (stepIndex > 0) {
            const prevStep = document.getElementById(this.loadingSteps[stepIndex - 1]);
            prevStep.classList.remove('active');
            prevStep.classList.add('completed');
        }
        
        if (stepIndex < this.loadingSteps.length) {
            const currentStep = document.getElementById(this.loadingSteps[stepIndex]);
            currentStep.classList.add('active');
        }
    }

    exportToJSON() {
        if (!this.analysisResults) {
            this.showNotification('No analysis results to export', 'warning');
            return;
        }
        
        const dataStr = JSON.stringify(this.analysisResults, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `fir-analysis-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Analysis exported as JSON', 'success');
    }

    exportToPDF() {
        this.showNotification('PDF export feature coming soon!', 'info');
    }

    shareResults() {
        if (!this.analysisResults) {
            this.showNotification('No analysis results to share', 'warning');
            return;
        }
        
        if (navigator.share) {
            navigator.share({
                title: 'DHARMA FIR Analysis Results',
                text: 'FIR analysis completed with legal insights',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const resultsText = JSON.stringify(this.analysisResults, null, 2);
            navigator.clipboard.writeText(resultsText).then(() => {
                this.showNotification('Results copied to clipboard', 'success');
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1001',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '300px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            backgroundColor: this.getNotificationColor(type)
        });
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#22543d',
            warning: '#c05621',
            error: '#c53030',
            info: '#2b6cb0'
        };
        return colors[type] || '#2b6cb0';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FIRAnalyzer();
});

// Add some utility functions
window.FIRUtils = {
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    validateFIRText: (text) => {
        const minLength = 50;
        const hasDate = /\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}/.test(text);
        const hasComplainant = /complainant/i.test(text);
        
        return {
            isValid: text.length >= minLength && hasDate && hasComplainant,
            issues: [
                ...(text.length < minLength ? ['Text too short (minimum 50 characters)'] : []),
                ...(!hasDate ? ['No date found in text'] : []),
                ...(!hasComplainant ? ['No complainant mentioned'] : [])
            ]
        };
    }
};