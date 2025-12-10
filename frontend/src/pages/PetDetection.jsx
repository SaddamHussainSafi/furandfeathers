import React, { useState } from "react";
import api from "../api";
import SectionHero from "../components/SectionHero";
import "../styles/forms.css";

const PetDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [parsedResult, setParsedResult] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const parseAnalysis = (text) => {
    const parsed = {};
    const lines = text
      .split(".")
      .map((line) => line.trim())
      .filter((line) => line);
    lines.forEach((line) => {
      if (line.toLowerCase().includes("species") || line.toLowerCase().includes("appears to be")) {
        parsed.species = line;
      } else if (line.toLowerCase().includes("breed")) {
        parsed.breed = line;
      } else if (line.toLowerCase().includes("age") || line.toLowerCase().includes("years old")) {
        parsed.age = line;
      } else if (line.toLowerCase().includes("color") || line.toLowerCase().includes("fur")) {
        parsed.color = line;
      } else if (line.toLowerCase().includes("emotion") || line.toLowerCase().includes("emotional state")) {
        parsed.emotion = line;
      } else if (line.toLowerCase().includes("size")) {
        parsed.size = line;
      } else if (line.toLowerCase().includes("gender")) {
        parsed.gender = line;
      } else if (line.toLowerCase().includes("distinctive") || line.toLowerCase().includes("features")) {
        parsed.features = line;
      }
    });
    return parsed;
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first");
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await api.post("/ai/pet-detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.analysis);
      setParsedResult(parseAnalysis(res.data.analysis));
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error analyzing image. Please try again.";
      setResult(message);
      setParsedResult({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <SectionHero
        badge={<span>AI powered</span>}
        title="AI Pet Detection"
        subtitle="Upload a photo to identify species, breed, color and more. Results are generated with AI and may include helpful hints."
      />

      <section className="page-section">
        <div className="form-fields">
          <label className="form-group">
            <span>Upload a pet image</span>
            <div className="file-drop">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className="file-drop__content">
                <strong>Choose a file</strong>
                <span>or drag and drop here</span>
              </div>
            </div>
          </label>

          {preview && (
            <div className="form-preview form-preview--compact">
              <img src={preview} alt="preview" />
              <span>Preview</span>
            </div>
          )}

          <div className="form-actions">
            <button
              onClick={handleUpload}
              disabled={loading || !image}
              className="site-button site-button--primary"
              type="button"
            >
              {loading ? "Analyzing..." : "Detect Pet Info"}
            </button>
          </div>
        </div>
      </section>

      {(Object.keys(parsedResult).length > 0 || result) && (
        <section className="page-section">
          <h3 className="section-heading">Detection Results</h3>
          <div className="section-grid section-grid--three">
            {Object.entries(parsedResult).map(([key, value]) => (
              <div key={key} className="surface-card">
                <h4 className="capitalize">{key}</h4>
                <p>{value}</p>
              </div>
            ))}
          </div>
          {result && !Object.keys(parsedResult).length && (
            <div className="surface-card" style={{ marginTop: "1rem" }}>
              <h4>Analysis</h4>
              <p style={{ whiteSpace: "pre-line" }}>{result}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default PetDetection;
