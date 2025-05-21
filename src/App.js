import React, { useState } from "react";
import "./App.css";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [analyzedText, setAnalyzedText] = useState("");

  const handleAnalyze = () => {
    if (resumeText.trim() === "") return;

    const lowerText = resumeText.toLowerCase();

    const resumeIndicators = [
      "education",
      "experience",
      "skills",
      "projects",
      "certifications",
      "internship",
      "contact",
      "summary",
      "b.tech",
      "linkedin",
      "github",
    ];

    const matchScore = resumeIndicators.filter((word) =>
      lowerText.includes(word)
    ).length;

    if (matchScore < 3) {
      setAnalyzedText(
        "❌ This content doesn't appear to be a valid resume. Please paste a proper resume."
      );
    } else {
      setAnalyzedText(
        `✅ Analysis Complete:\n\n• Add a GitHub/Portfolio link if not present.\n• Highlight key technical projects.\n• Use strong action verbs like “Developed”, “Led”, “Created”.\n• Make sure your resume matches keywords in job descriptions.\n\n🎯 Matched resume elements: ${matchScore}/10`
      );
    }
  };
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(
          "📄 PDF content preview:\n\n" + reader.result.slice(0, 1000)
        );
        setAnalyzedText("");
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="app-title">💼 JobMate</h1>
        <p className="subtitle">Smarter Resume & Skill Analyzer</p>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h2>Build. Analyze. Succeed. 🚀</h2>
          <p>Paste or upload your resume and get smart feedback instantly.</p>
          <button
            className="start-btn"
            onClick={() => {
              setResumeText("");
              setAnalyzedText("");
              setShowModal(true);
            }}
          >
            Get Started
          </button>
        </section>

        <section className="features">
          <div className="feature-card fade-in-up">
            <h3>📄 Resume Upload</h3>
            <p>Paste or upload your resume easily.</p>
          </div>
          <div className="feature-card fade-in-up delay1">
            <h3>🛠️ Skill Match</h3>
            <p>Matches your skills with job roles instantly.</p>
          </div>
          <div className="feature-card fade-in-up delay2">
            <h3>📊 Smart Feedback</h3>
            <p>Get suggestions like adding projects or GitHub links.</p>
          </div>
          <div className="feature-card fade-in-up delay3">
            <h3>📤 PDF Export</h3>
            <p>Download your feedback as a stylish PDF report.</p>
          </div>
        </section>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>📝 Input Your Resume</h3>
              <textarea
                rows="6"
                placeholder="Paste your resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <div className="btn-group">
                <button onClick={handleAnalyze}>Analyze</button>
                <label className="upload-btn">
                  Upload PDF
                  <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
              {analyzedText && (
                <pre className="analysis-output">{analyzedText}</pre>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 JobMate | Empowering Freshers 💪</p>
      </footer>
    </div>
  );
}

export default App;
