# 💼 JobMate Pro – AI-Powered Resume & ATS Optimization Platform

**JobMate Pro** is an advanced, React-based web application that helps job seekers optimize their resumes with professional ATS scoring, skill gap analysis, job description matching, and actionable insights. Built to empower students and professionals to create interview-winning resumes that pass Applicant Tracking Systems (ATS) and impress recruiters.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🚀 Features

### 🎯 **ATS Scoring System (0-100)**
- Real-time ATS compatibility analysis with detailed breakdown
- Visual circular progress indicator with color-coded ratings
- Scoring based on 5 key factors:
  - Section completeness (40%)
  - Skills matching (30%)
  - Action verbs usage (15%)
  - Quantifiable achievements (10%)
  - Contact information (5%)

### 🔍 **Job Description Comparison**
- **Compare Mode**: Match your resume against specific job postings
- Job match percentage with visual progress bar
- Identifies matched vs. missing keywords from job descriptions
- Provides targeted optimization suggestions

### 📊 **Skill Gap Analysis**
- Category-wise skill breakdown across 21 job roles
- Visual progress bars showing skill coverage percentage
- Identifies top missing skills in each category
- Matches against **794+ unique skills** from comprehensive database

### 💡 **Smart Suggestions Engine**
- AI-powered, prioritized recommendations (Critical/High/Medium)
- Context-aware tips based on comprehensive analysis
- Specific, actionable improvement items with visual indicators
- Tailored suggestions for job matching and ATS optimization

### 📄 **Resume Upload & Analysis**
- Upload resumes in PDF format or paste text manually
- Advanced text extraction using `pdfjs-dist`
- Analyzes 8 key resume sections:
  - Contact Information
  - Professional Summary
  - Education
  - Work Experience
  - Technical Skills
  - Projects
  - Certifications
  - Achievements

### 📈 **Interactive Analytics Dashboard**
- **Multiple tabs** for organized insights:
  - **Overview**: Key metrics, sections analysis, statistics
  - **Skills**: Found skills with category-wise gap analysis
  - **Suggestions**: Prioritized improvement recommendations
  - **Keywords**: Matched vs. missing keywords (compare mode)
- Real-time metrics visualization
- Action verb detection (17+ powerful verbs)
- Quantifiable achievement tracking

### 📥 **Professional PDF Reports**
- Beautifully designed, multi-page PDF reports
- Color-coded ATS score display
- Comprehensive statistics and metrics
- Top suggestions for improvement
- Professional branding and formatting

### 🎨 **Modern UI/UX**
- Stunning gradient backgrounds with glassmorphism effects
- Smooth animations and micro-interactions
- Fully responsive design (mobile, tablet, desktop)
- Loading states with professional spinners
- Interactive hover effects and transitions

---

## 🧠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React.js** | Frontend framework | 18.x |
| **pdfjs-dist** | PDF text extraction | 4.x |
| **jsPDF** | PDF report generation | 2.x |
| **CSS3** | Modern styling & animations | - |
| **JavaScript ES6+** | Core logic & algorithms | - |
| **skills.json** | 794+ skills database (21 categories) | Custom |

---

## ⚙️ Installation & Setup

Follow these steps to run JobMate Pro locally:

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/Srivishnuboddu/Resume_checker_with_React.git
cd Resume_checker_with_React
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```

### 3️⃣ **Add Skills Database**
Place the provided `skills.json` file in the `src/data/` directory:
```
src/
  └── data/
      └── skills.json
```

### 4️⃣ **Start Development Server**
```bash
npm start
```

### 5️⃣ **Open in Browser**
Visit **http://localhost:3000** to view the app in action! 🎉

---

## 🧩 How It Works

### **Step-by-Step Process:**

1. **📤 Upload or Paste Resume**
   - User uploads a `.pdf` file or pastes resume text manually
   - Optional: Paste job description for comparison mode

2. **🔍 Extract & Analyze**
   - App extracts text using `pdfjs-dist` library
   - Performs comprehensive analysis:
     - Structure validation (8 sections)
     - Skill matching (794+ skills)
     - Action verb detection (17+ verbs)
     - Quantifiable achievement detection
     - Job description keyword matching (if provided)

3. **📊 Generate Insights**
   - **ATS Score**: 0-100 based on 5 factors
   - **Job Match**: Percentage alignment with JD
   - **Skill Gaps**: Category-wise analysis
   - **Suggestions**: Prioritized recommendations
   - **Overall Rating**: Excellent/Good/Fair/Needs Work

4. **📥 View Results**
   - Interactive dashboard with 4 tabs
   - Visual metrics and progress bars
   - Color-coded sections and keywords
   - Detailed statistics

5. **📄 Export Report**
   - Download professional PDF report
   - Includes all analysis and suggestions
   - Formatted with branding and colors

---

## 📁 Sample Output

### **Example Analysis Dashboard:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ATS SCORE: 78/100
         Rating: Good
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 KEY METRICS
├─ Skills Found: 24
├─ Action Verbs: 8
├─ Quantifiable Achievements: 5
└─ Job Match: 72%

✅ RESUME SECTIONS (8/8)
├─ ✓ Contact Information
├─ ✓ Professional Summary
├─ ✓ Education
├─ ✓ Work Experience
├─ ✓ Technical Skills
├─ ✓ Projects
├─ ✓ Certifications
└─ ✓ Achievements

🛠️ SKILLS FOUND (24)
React, Node.js, JavaScript, TypeScript, 
MongoDB, PostgreSQL, Docker, AWS, Git,
Python, REST API, GraphQL, Redux, Express,
Tailwind CSS, Jest, CI/CD, Agile...

📈 SKILL GAP ANALYSIS
Frontend Developer:  ████████░░ 80% (12/15)
Backend Developer:   ██████░░░░ 60% (10/16)
Full Stack:          ████████░░ 75% (9/12)

💡 TOP SUGGESTIONS
🔴 CRITICAL
   • Add quantifiable achievements with metrics

🟠 HIGH  
   • Include missing keywords: Kubernetes, TypeScript
   • Add professional summary highlighting strengths

🟡 MEDIUM
   • Use more action verbs in experience section
   • Add links to GitHub and portfolio

🎯 MATCHED KEYWORDS (72%)
✅ react, javascript, nodejs, mongodb, docker,
   api, git, agile, frontend, backend...

⚠️ MISSING KEYWORDS
❌ kubernetes, typescript, graphql, ci/cd,
   testing, unit-testing, microservices...
```

---

## 🌟 Highlights & Differentiators

| Feature | JobMate Pro | Competitors |
|---------|-------------|-------------|
| **ATS Scoring** | ✅ Detailed (5 factors) | ❌ Basic/Generic |
| **Job Matching** | ✅ Real-time comparison | ❌ Limited |
| **Skill Database** | ✅ 794+ skills (21 categories) | ❌ 50-100 skills |
| **Skill Gap Analysis** | ✅ Category-wise breakdown | ❌ None |
| **Suggestions** | ✅ Prioritized & specific | ❌ Generic tips |
| **PDF Reports** | ✅ Professional design | ❌ Plain text |
| **UI/UX** | ✅ Modern, animated | ❌ Basic forms |
| **Pricing** | ✅ **100% Free** | ❌ Freemium/Paid |

---

## 📊 Skills Database Statistics

### **Coverage Overview:**
- **Total Unique Skills**: 794
- **Job Categories**: 21
- **Total Skills (with variations)**: 1,206

### **Category Breakdown:**
| Domain | Categories | Skills |
|--------|-----------|--------|
| **Development** | 9 | 400+ |
| **Data & AI** | 4 | 180+ |
| **Cloud & DevOps** | 3 | 150+ |
| **Design & Product** | 3 | 95+ |
| **Specialized** | 2 | 90+ |

### **Top Skills by Frequency:**
1. Python (10 categories)
2. Git (9 categories)
3. Docker (9 categories)
4. AWS (8 categories)
5. Kubernetes (7 categories)

*See `SKILLS_DATABASE.md` for complete breakdown*

---

## 🔐 Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "pdfjs-dist": "^4.x",
    "jspdf": "^2.x"
  }
}
```

---

## 📂 Project Structure

```
jobmate-pro/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   └── skills.json          # 794+ skills database
│   ├── App.js                   # Main component
│   ├── App.css                  # Styling
│   ├── index.js
│   └── pdf.worker.js            # PDF.js worker
├── package.json
├── README.md
└── SKILLS_DATABASE.md           # Skills documentation
```

---

## 🎯 Use Cases

### **For Job Seekers:**
- ✅ Optimize resumes for ATS systems
- ✅ Identify missing skills for target roles
- ✅ Compare resume against job descriptions
- ✅ Get actionable improvement suggestions

### **For Students:**
- ✅ Learn what recruiters look for
- ✅ Build industry-standard resumes
- ✅ Discover skill gaps for desired careers
- ✅ Track resume improvement over time

### **For Career Changers:**
- ✅ Identify transferable skills
- ✅ Understand new industry requirements
- ✅ Bridge skill gaps with learning paths
- ✅ Tailor resumes for different roles

---

## 💻 Future Enhancements

### **Planned Features:**
- [ ] 🤖 AI-powered resume rewriting suggestions
- [ ] 📚 Resume template library (ATS-friendly)
- [ ] 🔄 Version control and tracking
- [ ] 🌐 LinkedIn profile import
- [ ] 📧 Email delivery of reports
- [ ] 📊 Industry benchmarking
- [ ] 🎓 Cover letter analysis
- [ ] 🔗 Chrome extension
- [ ] 💾 Cloud storage integration
- [ ] 🌍 Multi-language support

### **Technical Improvements:**
- [ ] Backend API with user authentication
- [ ] Database for storing analysis history
- [ ] Advanced NLP for better skill detection
- [ ] Machine learning for scoring optimization
- [ ] Real-time collaborative editing
- [ ] Integration with job boards
---

## 👨‍💻 Author

**Developed by:** BODDU SRI VISHNU

🎓 **B.Tech Final Year** | Passionate about Web Development & AI Technologies  
📧 **Email:** boddusrivishnu1234@gmail.com  
💼 **LinkedIn:** (https://www.linkedin.com/in/sri-vishnu-boddu-ba4269259/)  
🐙 **GitHub:** (https://github.com/Srivishnuboddu) 
🌐 **Portfolio:** (https://srivishnu-portfolio.vercel.app/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You're free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

**With attribution required**
---

## 📞 Support

Need help or have questions?

- 📧 **Email**: boddusrivishnu1234@gmail.com

---

## ⭐ Show Your Support

If you found **JobMate Pro** helpful, please consider:

- ⭐ **Starring** the repository
- 🔀 **Forking** for your own use
- 📢 **Sharing** with friends and colleagues
- 💬 **Providing feedback** for improvements

---

<div align="center">

### Made with ❤️ for Job Seekers Everywhere

**JobMate Pro** | Empowering Careers, One Resume at a Time

[⬆ Back to Top](#-jobmate-pro--ai-powered-resume--ats-optimization-platform)

</div>

---

## 📋 Quick Start Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Add `skills.json` to `src/data/`
- [ ] Start development server (`npm start`)
- [ ] Upload test resume
- [ ] Explore all features
- [ ] Download PDF report
- [ ] Star the repo ⭐

---

**Last Updated:** February 2025  
**Version:** 2.0.0  
**Status:** Active Development 🚀
