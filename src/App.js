import React, { useState } from "react";
import "./App.css";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = new URL("./pdf.worker.js", import.meta.url);

import skillData from "./data/skills.json";
import jsPDF from "jspdf";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";


function App() {
  const [showModal, setShowModal] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [analyzedText, setAnalyzedText] = useState("");

  const handleAnalyze = () => {
    if (resumeText.trim() === "") {
      alert("Please enter or upload your resume first.");
      return;
    }

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

    // Check resume structure
    const structureMatches = resumeIndicators.filter((word) =>
      lowerText.includes(word)
    );

    // Match from skills.json
    const allSkills = Object.values(skillData).flat();
    const skillMatches = allSkills.filter((skill) =>
      lowerText.includes(skill.toLowerCase())
    );

    // Final analysis
    if (structureMatches.length < 3 && skillMatches.length < 3) {
      setAnalyzedText(
        "❌ This content doesn't appear to be a valid resume. Please paste a proper resume."
      );
    } else {
      const tips = [
        "• Add a GitHub or portfolio link if not present.",
        "• Highlight key technical projects with outcomes.",
        "• Use strong action verbs like “Developed”, “Led”, “Created”.",
        "• Tailor your resume to match job description keywords.",
      ];

      const feedback = `✅ Analysis Complete:

🎯 Resume Sections Detected: ${structureMatches.length}/10
🧠 Skill Keywords Found: ${skillMatches.length}

📝 Tips to Improve Your Resume:
${tips.join("\n")}

✨ Skills matched: ${skillMatches.slice(0, 10).join(", ") || "None"}
`;

      setAnalyzedText(feedback);
    }
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
        setAnalyzedText("");
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("JobMate Resume Analysis Report", 15, 20);
    doc.setFontSize(10);

    const splitText = doc.splitTextToSize(analyzedText, 180);
    doc.text(splitText, 15, 30);

    doc.save("JobMate_Resume_Analysis.pdf");
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
                <>
                  <pre className="analysis-output">{analyzedText}</pre>
                  <button className="pdf-btn" onClick={handleDownloadPDF}>
                    Download PDF Report 📥
                  </button>
                </>
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
