# DHARMA FIR Analyzer

AI-powered FIR (First Information Report) text analysis system for extracting structured information and legal insights from police complaints.

![DHARMA FIR Analyzer](https://img.shields.io/badge/DHARMA-FIR%20Analyzer-blue?style=for-the-badge&logo=scales)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![HTML/CSS/JS](https://img.shields.io/badge/Tech-HTML%2FCSS%2FJS-orange?style=flat-square)

## 🎯 Project Overview

This project processes police complaint text (English + Telugu mix), extracts structured information, and suggests relevant legal insights using advanced text processing algorithms. The system is designed to assist legal professionals and law enforcement in quickly analyzing FIR documents and identifying applicable legal sections.

**✨ Pure Frontend Implementation - No Backend Required!**

## 🚀 Features

### Core Functionality
- **Bilingual Text Processing**: Handles English and Telugu mixed content seamlessly
- **Information Extraction**: Automatically extracts complainant details, accused information, incident details, and offences
- **Legal Mapping**: Maps incidents to relevant BNS 2023, SC/ST Act, and Arms Act sections
- **Evidence Analysis**: Identifies and categorizes evidence and witness information
- **Risk Assessment**: Provides risk analysis and case severity evaluation

### User Interface
- **Clean, Responsive UI**: Modern interface optimized for all devices
- **Real-time Analysis**: Instant processing and results display with progress indicators
- **Interactive Results**: Detailed breakdown of analysis with expandable sections
- **Export Capabilities**: JSON export functionality
- **Sample Data**: Pre-loaded sample FIR for testing and demonstration

### Technical Features
- **Advanced Text Processing**: Pattern matching and natural language processing
- **Legal Knowledge Base**: Comprehensive database of legal sections embedded in JavaScript
- **Confidence Scoring**: AI-powered confidence assessment for extracted information
- **Processing Analytics**: Detailed processing time and performance metrics

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (Vanilla)**: Pure JavaScript for optimal performance with embedded legal data
- **Font Awesome**: Professional iconography
- **Google Fonts**: Typography with Inter font family

## 📁 Project Structure

```
dharma-fir-analyzer/
├── public/
│   ├── index.html             # Main HTML file
│   ├── styles.css             # Comprehensive styling
│   └── script.js              # Complete JavaScript with embedded legal data
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### **Option 1: VS Code Live Server (Recommended)**

1. **Clone the repository**
   ```bash
   git clone https://github.com/r91781585-tech/dharma-fir-analyzer.git
   cd dharma-fir-analyzer
   ```

2. **Open VS Code** and navigate to the project folder

3. **Right-click on `public/index.html`** and select **"Open with Live Server"**

4. **That's it!** The application will open in your browser and work perfectly

### **Option 2: Direct Browser Opening**

1. **Download the repository** or clone it locally

2. **Navigate to the `public` folder**

3. **Double-click `index.html`** to open in your default browser

4. **Start analyzing FIR texts immediately!**

### **Option 3: Any Web Server**

You can serve the `public` folder using any web server:
```bash
# Python 3
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server public

# PHP
php -S localhost:8000 -t public
```

## 📊 Sample Input/Output

### Input FIR Text:
```
On 14th September 2025, at about 8:15 PM, complainant Rajesh Kumar, S/o Venkat Rao, 
Age 34, Community: Scheduled Caste, R/o H.No. 12-34, Gandhi Nagar, Hyderabad, 
reported that he was returning home from work when three unknown persons stopped him 
near the bus stop and started abusing him using caste-based slurs saying 
"నీవు ఎలా ఇక్కడ నడుస్తున్నావు" and forcibly snatched his mobile phone worth Rs. 25,000...
```

### Extracted Output:
```json
{
  "complainant": {
    "name": "Rajesh Kumar",
    "guardian": "Venkat Rao",
    "age": "34",
    "community": "Scheduled Caste",
    "address": "H.No. 12-34, Gandhi Nagar, Hyderabad"
  },
  "incident": {
    "date": "14th September 2025",
    "time": "8:15 PM",
    "location": "near the bus stop",
    "type": "Caste-based Crime"
  },
  "offences": [
    {"name": "Caste-based Discrimination", "severity": "high"},
    {"name": "Robbery/Theft", "severity": "high"},
    {"name": "Verbal Abuse", "severity": "medium"}
  ],
  "legalSections": [
    {
      "act": "SC/ST Prevention of Atrocities Act, 1989",
      "section": "3(1)(r)",
      "title": "Caste-based abuse and humiliation",
      "severity": "high",
      "confidence": 92
    },
    {
      "act": "Bharatiya Nyaya Sanhita 2023",
      "section": "309",
      "title": "Robbery",
      "severity": "high",
      "confidence": 88
    }
  ]
}
```

## 🎯 How to Use

1. **Open the Application**: Use any of the methods above to open `index.html`

2. **Load Sample Data**: Click "Load Sample" to see a pre-filled FIR text

3. **Analyze FIR**: Click "Analyze FIR" to process the text

4. **View Results**: See the extracted information organized in cards:
   - Complainant Details
   - Accused Information
   - Incident Details
   - Applicable Legal Sections
   - Identified Offences
   - Evidence & Witnesses

5. **Export Results**: Click "Export JSON" to download the analysis results

## ✨ Key Features Demonstrated

### ✅ Information Extraction
- **Complainant Details**: Name, age, community, address extraction
- **Accused Information**: Multiple accused persons with details
- **Incident Analysis**: Date, time, location, and type classification
- **Evidence Categorization**: Automatic classification of evidence types

### ✅ Legal Section Mapping
- **BNS 2023**: Bharatiya Nyaya Sanhita sections
- **SC/ST Act**: Prevention of Atrocities Act sections
- **Arms Act**: Illegal weapons possession sections
- **Confidence Scoring**: AI-powered relevance assessment

### ✅ Advanced Processing
- **Bilingual Support**: English and Telugu mixed content
- **Pattern Recognition**: Advanced regex and text analysis
- **Risk Assessment**: Case severity evaluation
- **Real-time Processing**: Instant analysis with progress indicators

## 🎮 Try It Now!

**🌐 [Live Demo](https://r91781585-tech.github.io/dharma-fir-analyzer/public/)**

*Click the link above to try the application immediately in your browser!*

## 🔧 Customization

### Adding New Legal Sections
Edit the `LEGAL_DATA` object in `script.js`:

```javascript
const LEGAL_DATA = {
  "your_act": {
    "name": "Your Act Name",
    "sections": {
      "123": {
        "title": "Section Title",
        "description": "Section description",
        "keywords": ["keyword1", "keyword2"]
      }
    }
  }
};
```

### Modifying Analysis Logic
The main analysis functions in `script.js`:
- `extractComplainant()` - Complainant information extraction
- `extractAccused()` - Accused persons extraction
- `identifyOffences()` - Offence pattern matching
- `mapLegalSections()` - Legal section mapping

## 🌟 Technical Highlights

### Advanced Text Processing
- **Regex Pattern Matching**: Complex patterns for information extraction
- **Natural Language Processing**: Text analysis and classification
- **Bilingual Support**: Unicode handling for Telugu text
- **Confidence Algorithms**: Statistical confidence calculation

### Modern Web Technologies
- **ES6+ JavaScript**: Modern JavaScript features and syntax
- **CSS Grid & Flexbox**: Responsive layout design
- **CSS Animations**: Smooth transitions and loading effects
- **Progressive Enhancement**: Works without JavaScript for basic viewing

### Performance Optimizations
- **Client-side Processing**: No server dependencies
- **Efficient Algorithms**: Optimized text processing
- **Lazy Loading**: Progressive content loading
- **Memory Management**: Proper cleanup and optimization

## 📱 Browser Compatibility

- ✅ **Chrome** (Recommended)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**
- ✅ **Mobile Browsers**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow JavaScript ES6+ standards
- Maintain responsive design principles
- Add comprehensive comments for complex logic
- Test thoroughly across different browsers

## 📄 License

This project is licensed under the MIT License:

```
MIT License

Copyright (c) 2025 DHARMA FIR Analyzer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **Legal Experts**: For guidance on legal section mappings and classifications
- **Open Source Community**: For the excellent libraries and tools
- **Web Standards**: For providing robust APIs and specifications

---

**🎯 Perfect for legal professionals, law enforcement, and developers interested in legal tech!**

*This project demonstrates advanced frontend development skills, text processing algorithms, and domain expertise in legal technology - all without requiring any backend infrastructure.*