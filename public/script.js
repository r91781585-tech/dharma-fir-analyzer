// DHARMA FIR Analyzer - Main JavaScript File

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

        this.showLoading();
        const startTime = Date.now();

        try {
            // Simulate API processing with realistic delays
            await this.simulateAnalysis();
            
            // Generate mock analysis results
            const results = this.generateMockResults(firText);
            
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
            { id: 'step1', delay: 1000, name: 'Language Detection' },
            { id: 'step2', delay: 1500, name: 'Information Extraction' },
            { id: 'step3', delay: 1200, name: 'Legal Mapping' },
            { id: 'step4', delay: 800, name: 'Analysis Complete' }
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, steps[i].delay));
            this.updateLoadingStep(i);
        }
    }

    generateMockResults(firText) {
        // Extract information using simple text analysis
        const results = {
            complainant: this.extractComplainantInfo(firText),
            accused: this.extractAccusedInfo(firText),
            incident: this.extractIncidentInfo(firText),
            offences: this.identifyOffences(firText),
            legalSections: this.mapLegalSections(firText),
            evidence: this.extractEvidence(firText),
            confidence: Math.floor(Math.random() * 15) + 85 // 85-100%
        };

        this.analysisResults = results;
        return results;
    }

    extractComplainantInfo(text) {
        const complainant = {};
        
        // Extract name
        const nameMatch = text.match(/complainant\s+([A-Za-z\s]+),/i);
        complainant.name = nameMatch ? nameMatch[1].trim() : 'Not specified';
        
        // Extract father's name
        const fatherMatch = text.match(/S\/o\s+([A-Za-z\s]+),/i);
        complainant.father = fatherMatch ? fatherMatch[1].trim() : 'Not specified';
        
        // Extract age
        const ageMatch = text.match(/Age\s+(\d+)/i);
        complainant.age = ageMatch ? ageMatch[1] : 'Not specified';
        
        // Extract community
        const communityMatch = text.match(/Community:\s*([^,\n]+)/i);
        complainant.community = communityMatch ? communityMatch[1].trim() : 'Not specified';
        
        // Extract address
        const addressMatch = text.match(/R\/o\s+([^,]+(?:,[^,]+)*)/i);
        complainant.address = addressMatch ? addressMatch[1].trim() : 'Not specified';
        
        return complainant;
    }

    extractAccusedInfo(text) {
        const accused = [];
        
        // Look for numbered accused persons
        const accusedMatches = text.match(/\d+\.\s*([A-Za-z\s]+)(?:\s*\([^)]+\))?/g);
        if (accusedMatches) {
            accusedMatches.forEach(match => {
                const nameMatch = match.match(/\d+\.\s*([A-Za-z\s]+)/);
                const ageMatch = match.match(/\(([^)]+)\)/);
                
                accused.push({
                    name: nameMatch ? nameMatch[1].trim() : 'Unknown',
                    details: ageMatch ? ageMatch[1] : 'Age not specified'
                });
            });
        }
        
        // If no numbered list, look for general accused mentions
        if (accused.length === 0) {
            const generalMatch = text.match(/accused\s+([A-Za-z\s]+)/i);
            if (generalMatch) {
                accused.push({
                    name: generalMatch[1].trim(),
                    details: 'Details not specified'
                });
            }
        }
        
        return accused.length > 0 ? accused : [{ name: 'Unknown', details: 'Not identified' }];
    }

    extractIncidentInfo(text) {
        const incident = {};
        
        // Extract date
        const dateMatch = text.match(/On\s+(\d+(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4})/i);
        incident.date = dateMatch ? dateMatch[1] : 'Not specified';
        
        // Extract time
        const timeMatch = text.match(/at\s+about\s+([^,\n]+)/i);
        incident.time = timeMatch ? timeMatch[1].trim() : 'Not specified';
        
        // Extract location
        const locationMatch = text.match(/near\s+([^,\n]+)|at\s+([^,\n]+)/i);
        incident.location = locationMatch ? (locationMatch[1] || locationMatch[2]).trim() : 'Not specified';
        
        // Extract brief description
        const sentences = text.split(/[.!?]+/);
        const incidentSentence = sentences.find(s => 
            s.toLowerCase().includes('incident') || 
            s.toLowerCase().includes('reported') ||
            s.toLowerCase().includes('happened')
        );
        incident.description = incidentSentence ? incidentSentence.trim() : 'Incident details extracted from full text';
        
        return incident;
    }

    identifyOffences(text) {
        const offences = [];
        const textLower = text.toLowerCase();
        
        // Define offence patterns
        const offencePatterns = [
            { pattern: /caste|scheduled caste|sc\/st|discrimination/i, offence: 'Caste-based Discrimination' },
            { pattern: /robbery|snatched|forcibly.*took|stolen/i, offence: 'Robbery' },
            { pattern: /assault|hit|beaten|injured|attack/i, offence: 'Physical Assault' },
            { pattern: /pistol|gun|weapon|arms/i, offence: 'Illegal Possession of Arms' },
            { pattern: /abuse|slur|derogatory|offensive language/i, offence: 'Verbal Abuse' },
            { pattern: /threat|intimidation|fear/i, offence: 'Criminal Intimidation' },
            { pattern: /mobile|phone|wallet|money|cash/i, offence: 'Theft of Personal Property' }
        ];
        
        offencePatterns.forEach(({ pattern, offence }) => {
            if (pattern.test(text)) {
                offences.push(offence);
            }
        });
        
        return offences.length > 0 ? offences : ['General Criminal Offense'];
    }

    mapLegalSections(text) {
        const sections = [];
        const textLower = text.toLowerCase();
        
        // BNS 2023 Sections
        if (/robbery|snatched|forcibly.*took/i.test(text)) {
            sections.push({
                act: 'BNS 2023',
                section: 'Section 309',
                title: 'Robbery',
                description: 'Whoever commits robbery shall be punished with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine'
            });
        }
        
        if (/assault|hit|beaten|hurt/i.test(text)) {
            sections.push({
                act: 'BNS 2023',
                section: 'Section 115',
                title: 'Voluntarily causing hurt',
                description: 'Whoever voluntarily causes hurt shall be punished with imprisonment of either description for a term which may extend to one year, or with fine which may extend to ten thousand rupees, or with both'
            });
        }
        
        if (/threat|intimidation|fear/i.test(text)) {
            sections.push({
                act: 'BNS 2023',
                section: 'Section 351',
                title: 'Criminal intimidation',
                description: 'Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person'
            });
        }
        
        // SC/ST Act
        if (/caste|scheduled caste|sc\/st|discrimination|derogatory/i.test(text)) {
            sections.push({
                act: 'SC/ST Prevention of Atrocities Act, 1989',
                section: 'Section 3(1)(r)',
                title: 'Caste-based abuse and humiliation',
                description: 'Whoever, not being a member of a Scheduled Caste or a Scheduled Tribe, abuses or humiliates a member of a Scheduled Caste or a Scheduled Tribe'
            });
        }
        
        // Arms Act
        if (/pistol|gun|weapon|arms|firearm/i.test(text)) {
            sections.push({
                act: 'Arms Act, 1959',
                section: 'Section 25',
                title: 'Punishment for contravention of license or rule',
                description: 'Whoever acquires, has in his possession or carries any prohibited arms or prohibited ammunition shall be punishable with imprisonment for a term which shall not be less than five years but which may extend to ten years'
            });
        }
        
        return sections.length > 0 ? sections : [{
            act: 'BNS 2023',
            section: 'Section 223',
            title: 'General provisions for punishment',
            description: 'General criminal offense provisions'
        }];
    }

    extractEvidence(text) {
        const evidence = [];
        const witnesses = [];
        
        // Extract evidence
        const evidencePatterns = [
            /cctv|camera|footage/i,
            /medical|report|examination|injury/i,
            /photograph|photo|image/i,
            /document|paper|id|card/i,
            /torn|damaged|broken/i
        ];
        
        evidencePatterns.forEach(pattern => {
            const matches = text.match(new RegExp(`[^.!?]*${pattern.source}[^.!?]*`, 'gi'));
            if (matches) {
                matches.forEach(match => {
                    evidence.push(match.trim());
                });
            }
        });
        
        // Extract witnesses
        const witnessMatches = text.match(/witness[^:]*:?\s*\n?([^.!?]*(?:[.!?][^.!?]*)*)/gi);
        if (witnessMatches) {
            witnessMatches.forEach(match => {
                const names = match.match(/\d+\.\s*([A-Za-z\s]+)(?:\s*\([^)]+\))?/g);
                if (names) {
                    names.forEach(name => {
                        const cleanName = name.replace(/\d+\.\s*/, '').replace(/\([^)]+\)/, '').trim();
                        witnesses.push(cleanName);
                    });
                }
            });
        }
        
        return {
            evidence: evidence.length > 0 ? evidence : ['Physical evidence to be collected'],
            witnesses: witnesses.length > 0 ? witnesses : ['Witness statements to be recorded']
        };
    }

    displayResults(results, processingTime) {
        // Update meta information
        this.processingTime.textContent = `Processed in ${processingTime}ms`;
        this.confidenceScore.textContent = `Confidence: ${results.confidence}%`;
        
        // Display complainant details
        this.displayComplainantDetails(results.complainant);
        
        // Display accused details
        this.displayAccusedDetails(results.accused);
        
        // Display incident details
        this.displayIncidentDetails(results.incident);
        
        // Display legal sections
        this.displayLegalSections(results.legalSections);
        
        // Display offences
        this.displayOffences(results.offences);
        
        // Display evidence and witnesses
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
                <span class="info-label">Father's Name:</span>
                <span class="info-value">${complainant.father}</span>
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
                <span class="info-label">Description:</span>
                <span class="info-value">${incident.description}</span>
            </div>
        `;
    }

    displayLegalSections(sections) {
        const sectionsHtml = sections.map(section => `
            <div class="legal-section">
                <div class="legal-section-title">${section.act} - ${section.section}</div>
                <div class="legal-section-desc"><strong>${section.title}:</strong> ${section.description}</div>
            </div>
        `).join('');
        
        this.legalSections.innerHTML = sectionsHtml;
    }

    displayOffences(offences) {
        const offencesHtml = offences.map(offence => `
            <div class="offence-item">${offence}</div>
        `).join('');
        
        this.offencesList.innerHTML = offencesHtml;
    }

    displayEvidenceWitnesses(evidenceData) {
        const evidenceHtml = evidenceData.evidence.map(item => `
            <div class="evidence-item"><strong>Evidence:</strong> ${item}</div>
        `).join('');
        
        const witnessesHtml = evidenceData.witnesses.map(witness => `
            <div class="evidence-item"><strong>Witness:</strong> ${witness}</div>
        `).join('');
        
        this.evidenceWitnesses.innerHTML = evidenceHtml + witnessesHtml;
    }

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
        if (!this.analysisResults) {
            this.showNotification('No analysis results to export', 'warning');
            return;
        }
        
        // Simple PDF export simulation
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

// Add some utility functions for enhanced functionality
window.FIRUtils = {
    // Format date for display
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Validate FIR text
    validateFIRText: (text) => {
        const minLength = 100;
        const hasDate = /\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}/.test(text);
        const hasComplainant = /complainant/i.test(text);
        
        return {
            isValid: text.length >= minLength && hasDate && hasComplainant,
            issues: [
                ...(text.length < minLength ? ['Text too short (minimum 100 characters)'] : []),
                ...(!hasDate ? ['No date found in text'] : []),
                ...(!hasComplainant ? ['No complainant mentioned'] : [])
            ]
        };
    },
    
    // Extract keywords for search
    extractKeywords: (text) => {
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const keywords = words.filter(word => 
            word.length > 3 && !stopWords.includes(word)
        );
        
        // Count frequency
        const frequency = {};
        keywords.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        
        // Return top keywords
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }
};