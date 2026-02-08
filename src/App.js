import React, { useState, useEffect } from "react";
import "./App.css";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import "./pdf.worker.js";
import skillData from "./data/skills.json";
import jsPDF from "jspdf";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [analyzedData, setAnalyzedData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const handleAnalyze = () => {
    if (resumeText.trim() === "") {
      alert("Please enter or upload your resume first.");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis = performDetailedAnalysis(resumeText, jobDescription);
      setAnalyzedData(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const performDetailedAnalysis = (text, jd) => {
    const lowerText = text.toLowerCase();
    const lowerJD = jd.toLowerCase();

    // Resume structure analysis
    const structureIndicators = {
      contact: ["email", "phone", "linkedin", "github", "portfolio"],
      summary: ["summary", "objective", "profile", "about"],
      education: [
        "education",
        "degree",
        "university",
        "college",
        "b.tech",
        "m.tech",
        "bachelor",
        "master",
      ],
      experience: [
        "experience",
        "work",
        "internship",
        "job",
        "position",
        "role",
      ],
      skills: ["skills", "technologies", "tools", "languages", "frameworks"],
      projects: ["projects", "built", "developed", "created"],
      certifications: ["certification", "certificate", "certified", "license"],
      achievements: ["achievement", "award", "honor", "recognition"],
    };

    const sectionScores = {};
    let totalSections = 0;

    Object.keys(structureIndicators).forEach((section) => {
      const found = structureIndicators[section].some((keyword) =>
        lowerText.includes(keyword),
      );
      sectionScores[section] = found;
      if (found) totalSections++;
    });

    // Skill matching
    const allSkills = Object.values(skillData).flat();
    const skillMatches = allSkills.filter((skill) =>
      lowerText.includes(skill.toLowerCase()),
    );

    // Action verbs analysis
    const actionVerbs = [
      "developed",
      "created",
      "led",
      "managed",
      "designed",
      "implemented",
      "achieved",
      "improved",
      "increased",
      "reduced",
      "launched",
      "built",
      "collaborated",
      "optimized",
      "automated",
      "streamlined",
      "delivered",
    ];

    const verbCount = actionVerbs.filter((verb) =>
      lowerText.includes(verb),
    ).length;

    // Quantifiable achievements
    const hasNumbers = /\d+%|\d+x|\$\d+|\d+ million|\d+ thousand/i.test(text);
    const numberMatches = text.match(/\d+%|\d+x|\$\d+/g) || [];

    // ATS Score calculation
    const atsScore = calculateATSScore({
      totalSections,
      skillMatches: skillMatches.length,
      verbCount,
      hasNumbers,
      hasContact: sectionScores.contact,
    });

    // Job match analysis (if JD provided)
    let jobMatchScore = 0;
    let missingKeywords = [];
    let matchedKeywords = [];

    if (jd.trim()) {
      const jdWords = lowerJD.split(/\s+/).filter((word) => word.length > 3);
      const uniqueJDWords = [...new Set(jdWords)];

      uniqueJDWords.forEach((word) => {
        if (lowerText.includes(word)) {
          matchedKeywords.push(word);
        } else if (allSkills.map((s) => s.toLowerCase()).includes(word)) {
          missingKeywords.push(word);
        }
      });

      jobMatchScore = Math.min(
        100,
        Math.round(
          (matchedKeywords.length / Math.max(uniqueJDWords.length, 1)) * 100,
        ),
      );
    }

    // Skill gap analysis
    const skillCategories = Object.keys(skillData);
    const skillGaps = {};

    skillCategories.forEach((category) => {
      const categorySkills = skillData[category];
      const matched = categorySkills.filter((skill) =>
        lowerText.includes(skill.toLowerCase()),
      );
      skillGaps[category] = {
        total: categorySkills.length,
        matched: matched.length,
        missing: categorySkills
          .filter((skill) => !lowerText.includes(skill.toLowerCase()))
          .slice(0, 5),
      };
    });

    // Improvement suggestions
    const suggestions = generateSuggestions({
      sectionScores,
      verbCount,
      hasNumbers,
      skillMatches: skillMatches.length,
      jobMatchScore,
      missingKeywords,
    });

    return {
      atsScore,
      jobMatchScore: jd.trim() ? jobMatchScore : null,
      sectionScores,
      skillMatches: skillMatches.slice(0, 20),
      totalSkills: skillMatches.length,
      actionVerbCount: verbCount,
      quantifiableAchievements: numberMatches.length,
      suggestions,
      missingKeywords: missingKeywords.slice(0, 10),
      matchedKeywords: matchedKeywords.slice(0, 15),
      skillGaps,
      overallRating: calculateOverallRating(atsScore),
    };
  };

  const calculateATSScore = ({
    totalSections,
    skillMatches,
    verbCount,
    hasNumbers,
    hasContact,
  }) => {
    let score = 0;

    // Section completeness (40 points)
    score += (totalSections / 8) * 40;

    // Skills (30 points)
    score += Math.min(30, (skillMatches / 15) * 30);

    // Action verbs (15 points)
    score += Math.min(15, (verbCount / 10) * 15);

    // Quantifiable achievements (10 points)
    score += hasNumbers ? 10 : 0;

    // Contact info (5 points)
    score += hasContact ? 5 : 0;

    return Math.round(score);
  };

  const calculateOverallRating = (score) => {
    if (score >= 80) return { text: "Excellent", color: "#00c853" };
    if (score >= 60) return { text: "Good", color: "#43a047" };
    if (score >= 40) return { text: "Fair", color: "#fb8c00" };
    return { text: "Needs Work", color: "#e53935" };
  };

  const generateSuggestions = ({
    sectionScores,
    verbCount,
    hasNumbers,
    skillMatches,
    jobMatchScore,
    missingKeywords,
  }) => {
    const suggestions = [];

    if (!sectionScores.contact) {
      suggestions.push({
        type: "critical",
        text: "Add contact information (email, phone, LinkedIn)",
        icon: "📧",
      });
    }

    if (!sectionScores.summary) {
      suggestions.push({
        type: "high",
        text: "Add a professional summary highlighting your key strengths",
        icon: "📝",
      });
    }

    if (skillMatches < 10) {
      suggestions.push({
        type: "high",
        text: "Add more technical skills relevant to your target role",
        icon: "🛠️",
      });
    }

    if (verbCount < 5) {
      suggestions.push({
        type: "medium",
        text: "Use more strong action verbs (developed, led, created, etc.)",
        icon: "💪",
      });
    }

    if (!hasNumbers) {
      suggestions.push({
        type: "high",
        text: "Add quantifiable achievements (e.g., 'Improved performance by 40%')",
        icon: "📊",
      });
    }

    if (!sectionScores.projects) {
      suggestions.push({
        type: "medium",
        text: "Include relevant projects with technologies used and outcomes",
        icon: "🚀",
      });
    }

    if (missingKeywords.length > 0) {
      suggestions.push({
        type: "high",
        text: `Add missing keywords from job description: ${missingKeywords.slice(0, 3).join(", ")}`,
        icon: "🎯",
      });
    }

    if (jobMatchScore !== null && jobMatchScore < 60) {
      suggestions.push({
        type: "critical",
        text: "Tailor your resume better to match the job description",
        icon: "🔍",
      });
    }

    return suggestions;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedarray = new Uint8Array(reader.result);

        const pdf = await getDocument({ data: typedarray }).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          text += pageText + "\n";
        }

        setResumeText(text);
        setAnalyzedData(null);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDownloadPDF = () => {
    if (!analyzedData) return;

    const doc = new jsPDF();

    // Header
    doc.setFillColor(67, 172, 254);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("JobMate Resume Analysis", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Professional Resume Evaluation Report", 105, 30, {
      align: "center",
    });

    // Reset color
    doc.setTextColor(0, 0, 0);
    let yPos = 50;

    // ATS Score
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("ATS Score", 20, yPos);
    doc.setFontSize(24);
    doc.setTextColor(analyzedData.overallRating.color);
    doc.text(`${analyzedData.atsScore}/100`, 20, yPos + 10);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(`Rating: ${analyzedData.overallRating.text}`, 20, yPos + 18);

    yPos += 35;

    // Statistics
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Key Metrics", 20, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`✓ Skills Found: ${analyzedData.totalSkills}`, 20, yPos);
    yPos += 6;
    doc.text(`✓ Action Verbs: ${analyzedData.actionVerbCount}`, 20, yPos);
    yPos += 6;
    doc.text(
      `✓ Quantifiable Achievements: ${analyzedData.quantifiableAchievements}`,
      20,
      yPos,
    );
    yPos += 6;

    if (analyzedData.jobMatchScore !== null) {
      doc.text(`✓ Job Match Score: ${analyzedData.jobMatchScore}%`, 20, yPos);
      yPos += 6;
    }

    yPos += 10;

    // Suggestions
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Improvement Suggestions", 20, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

    analyzedData.suggestions.slice(0, 8).forEach((suggestion, idx) => {
      const lines = doc.splitTextToSize(
        `${idx + 1}. ${suggestion.icon} ${suggestion.text}`,
        170,
      );
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5 + 2;

      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Generated by JobMate | Page ${i} of ${pageCount}`, 105, 285, {
        align: "center",
      });
    }

    doc.save("JobMate_Advanced_Resume_Analysis.pdf");
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="app-title">💼 JobMate Pro</h1>
        <p className="subtitle">
          AI-Powered Resume & ATS Optimization Platform
        </p>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h2>Optimize. Analyze. Land Your Dream Job. 🚀</h2>
          <p>
            Get ATS-friendly analysis, skill gap insights, and job match scoring
            in seconds.
          </p>
          <button
            className="start-btn"
            onClick={() => {
              setResumeText("");
              setAnalyzedData(null);
              setJobDescription("");
              setShowModal(true);
            }}
          >
            Start Free Analysis
          </button>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">ATS Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">21</span>
              <span className="stat-label">Job Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">794+</span>
              <span className="stat-label">Unique Skills</span>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="feature-card fade-in-up">
            <div className="feature-icon">🎯</div>
            <h3>ATS Score</h3>
            <p>
              Get real-time ATS compatibility score with detailed breakdown.
            </p>
          </div>
          <div className="feature-card fade-in-up delay1">
            <div className="feature-icon">🔍</div>
            <h3>Job Match Analysis</h3>
            <p>
              Compare your resume against job descriptions for perfect
              alignment.
            </p>
          </div>
          <div className="feature-card fade-in-up delay2">
            <div className="feature-icon">📊</div>
            <h3>Skill Gap Report</h3>
            <p>
              Identify missing skills and get personalized learning
              recommendations.
            </p>
          </div>
          <div className="feature-card fade-in-up delay3">
            <div className="feature-icon">✨</div>
            <h3>Smart Suggestions</h3>
            <p>
              AI-powered tips to improve resume impact and keyword optimization.
            </p>
          </div>
          <div className="feature-card fade-in-up delay4">
            <div className="feature-icon">📈</div>
            <h3>Section Analysis</h3>
            <p>
              Detailed evaluation of each resume section with actionable
              insights.
            </p>
          </div>
          <div className="feature-card fade-in-up delay5">
            <div className="feature-icon">📄</div>
            <h3>Professional Reports</h3>
            <p>Download comprehensive PDF reports for your records.</p>
          </div>
        </section>

        {showModal && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target.className === "modal-overlay") setShowModal(false);
            }}
          >
            <div className="modal">
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>

              <h3 className="modal-title">📝 Resume Analysis Dashboard</h3>

              <div className="mode-toggle">
                <button
                  className={!compareMode ? "active" : ""}
                  onClick={() => setCompareMode(false)}
                >
                  Resume Only
                </button>
                <button
                  className={compareMode ? "active" : ""}
                  onClick={() => setCompareMode(true)}
                >
                  Compare with Job
                </button>
              </div>

              <div className="input-section">
                <label>Your Resume *</label>
                <textarea
                  rows="6"
                  placeholder="Paste your resume text here or upload PDF below..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="resume-input"
                />

                {compareMode && (
                  <>
                    <label>Job Description (Optional)</label>
                    <textarea
                      rows="4"
                      placeholder="Paste job description to get match score..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="jd-input"
                    />
                  </>
                )}
              </div>

              <div className="btn-group">
                <button
                  className="analyze-btn"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "🔍 Analyze Resume"}
                </button>
                <label className="upload-btn">
                  📤 Upload PDF
                  <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {isAnalyzing && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Analyzing your resume...</p>
                </div>
              )}

              {analyzedData && !isAnalyzing && (
                <div className="results-container">
                  <div className="score-card">
                    <div className="ats-score">
                      <div
                        className="score-circle"
                        style={{
                          background: `conic-gradient(${analyzedData.overallRating.color} ${analyzedData.atsScore * 3.6}deg, #e0e0e0 0deg)`,
                        }}
                      >
                        <div className="score-inner">
                          <span className="score-value">
                            {analyzedData.atsScore}
                          </span>
                          <span className="score-max">/100</span>
                        </div>
                      </div>
                      <div className="score-label">
                        <span
                          style={{ color: analyzedData.overallRating.color }}
                        >
                          {analyzedData.overallRating.text}
                        </span>
                        <p>ATS Compatibility</p>
                      </div>
                    </div>

                    {analyzedData.jobMatchScore !== null && (
                      <div className="match-score">
                        <div className="match-bar">
                          <div
                            className="match-fill"
                            style={{
                              width: `${analyzedData.jobMatchScore}%`,
                              backgroundColor:
                                analyzedData.jobMatchScore >= 70
                                  ? "#00c853"
                                  : analyzedData.jobMatchScore >= 50
                                    ? "#fb8c00"
                                    : "#e53935",
                            }}
                          ></div>
                        </div>
                        <span className="match-percentage">
                          {analyzedData.jobMatchScore}% Job Match
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="tabs">
                    <button
                      className={activeTab === "overview" ? "active" : ""}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </button>
                    <button
                      className={activeTab === "skills" ? "active" : ""}
                      onClick={() => setActiveTab("skills")}
                    >
                      Skills
                    </button>
                    <button
                      className={activeTab === "suggestions" ? "active" : ""}
                      onClick={() => setActiveTab("suggestions")}
                    >
                      Suggestions
                    </button>
                    {compareMode && (
                      <button
                        className={activeTab === "keywords" ? "active" : ""}
                        onClick={() => setActiveTab("keywords")}
                      >
                        Keywords
                      </button>
                    )}
                  </div>

                  <div className="tab-content">
                    {activeTab === "overview" && (
                      <div className="overview-tab">
                        <div className="metrics-grid">
                          <div className="metric-box">
                            <span className="metric-icon">🛠️</span>
                            <span className="metric-value">
                              {analyzedData.totalSkills}
                            </span>
                            <span className="metric-label">Skills Found</span>
                          </div>
                          <div className="metric-box">
                            <span className="metric-icon">💪</span>
                            <span className="metric-value">
                              {analyzedData.actionVerbCount}
                            </span>
                            <span className="metric-label">Action Verbs</span>
                          </div>
                          <div className="metric-box">
                            <span className="metric-icon">📊</span>
                            <span className="metric-value">
                              {analyzedData.quantifiableAchievements}
                            </span>
                            <span className="metric-label">
                              Quantifiable Achievements
                            </span>
                          </div>
                        </div>

                        <div className="sections-analysis">
                          <h4>Resume Sections</h4>
                          <div className="sections-grid">
                            {Object.entries(analyzedData.sectionScores).map(
                              ([section, present]) => (
                                <div
                                  key={section}
                                  className={`section-item ${present ? "present" : "missing"}`}
                                >
                                  <span>{present ? "✓" : "✗"}</span>
                                  <span>
                                    {section.charAt(0).toUpperCase() +
                                      section.slice(1)}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "skills" && (
                      <div className="skills-tab">
                        <div className="skills-found">
                          <h4>✅ Skills Found ({analyzedData.totalSkills})</h4>
                          <div className="skill-tags">
                            {analyzedData.skillMatches.map((skill, idx) => (
                              <span key={idx} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="skill-gaps">
                          <h4>📈 Skill Gap Analysis</h4>
                          {Object.entries(analyzedData.skillGaps).map(
                            ([category, data]) =>
                              data.matched > 0 && (
                                <div key={category} className="gap-category">
                                  <div className="gap-header">
                                    <span className="gap-title">
                                      {category}
                                    </span>
                                    <span className="gap-ratio">
                                      {data.matched}/{data.total}
                                    </span>
                                  </div>
                                  <div className="gap-bar">
                                    <div
                                      className="gap-fill"
                                      style={{
                                        width: `${(data.matched / data.total) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                  {data.missing.length > 0 && (
                                    <div className="missing-skills">
                                      <small>
                                        Consider adding:{" "}
                                        {data.missing.slice(0, 3).join(", ")}
                                      </small>
                                    </div>
                                  )}
                                </div>
                              ),
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "suggestions" && (
                      <div className="suggestions-tab">
                        {analyzedData.suggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            className={`suggestion-item ${suggestion.type}`}
                          >
                            <span className="suggestion-icon">
                              {suggestion.icon}
                            </span>
                            <div className="suggestion-content">
                              <span className="suggestion-badge">
                                {suggestion.type}
                              </span>
                              <p>{suggestion.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "keywords" && compareMode && (
                      <div className="keywords-tab">
                        {analyzedData.matchedKeywords.length > 0 && (
                          <div className="keywords-section">
                            <h4>✅ Matched Keywords</h4>
                            <div className="keyword-tags">
                              {analyzedData.matchedKeywords.map((kw, idx) => (
                                <span key={idx} className="keyword-tag matched">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {analyzedData.missingKeywords.length > 0 && (
                          <div className="keywords-section">
                            <h4>⚠️ Missing Keywords</h4>
                            <div className="keyword-tags">
                              {analyzedData.missingKeywords.map((kw, idx) => (
                                <span key={idx} className="keyword-tag missing">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button className="pdf-btn" onClick={handleDownloadPDF}>
                    📥 Download Full Report (PDF)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 JobMate Pro | Empowering Job Seekers Worldwide 💪</p>
        <p className="footer-links">
          <a href="#privacy">Privacy</a> •<a href="#terms">Terms</a> •
          <a href="#contact">Contact</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
