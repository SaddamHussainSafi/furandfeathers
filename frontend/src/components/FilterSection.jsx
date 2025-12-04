import React, { useState } from "react";

const FilterSection = ({ onFiltersChange }) => {
  const [activeFilters, setActiveFilters] = useState({
    species: [],
    moods: [],
    search: "",
    ageRange: [0, 20],
    location: "",
    gender: "",
    vaccinated: false,
    trained: false,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const speciesOptions = [
    { id: "dog", label: "Dogs", icon: "https://cdn-icons-png.flaticon.com/512/620/620851.png" },
    { id: "cat", label: "Cats", icon: "https://cdn-icons-png.flaticon.com/512/1818/1818401.png" },
    { id: "bird", label: "Birds", icon: "https://cdn-icons-png.flaticon.com/512/616/616630.png" },
    { id: "rabbit", label: "Rabbits", icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
    { id: "other", label: "Others", icon: "https://cdn-icons-png.flaticon.com/512/616/616430.png" },
  ];

  const moodOptions = [
    { id: "gentle", label: "Gentle", icon: "https://cdn-icons-png.flaticon.com/512/2107/2107957.png" },
    { id: "energetic", label: "Energetic", icon: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png" },
    { id: "calm", label: "Calm", icon: "https://cdn-icons-png.flaticon.com/512/1165/1165672.png" },
    { id: "playful", label: "Playful", icon: "https://cdn-icons-png.flaticon.com/512/1067/1067566.png" },
    { id: "kidFriendly", label: "Kid-friendly", icon: "https://cdn-icons-png.flaticon.com/512/1534/1534400.png" },
  ];

  const handleSpeciesToggle = (speciesId) => {
    const newSpecies = activeFilters.species.includes(speciesId)
      ? activeFilters.species.filter(s => s !== speciesId)
      : [...activeFilters.species, speciesId];

    const newFilters = { ...activeFilters, species: newSpecies };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleMoodToggle = (moodId) => {
    const newMoods = activeFilters.moods.includes(moodId)
      ? activeFilters.moods.filter(m => m !== moodId)
      : [...activeFilters.moods, moodId];

    const newFilters = { ...activeFilters, moods: newMoods };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const newFilters = { ...activeFilters, search: e.target.value };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAdvancedFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      species: [],
      moods: [],
      search: "",
      ageRange: [0, 20],
      location: "",
      gender: "",
      vaccinated: false,
      trained: false,
    };
    setActiveFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const surpriseMe = () => {
    // This would typically fetch a random pet and navigate to its details
    console.log("Surprise me clicked!");
  };

  return (
    <div className="filter-section" style={{ position: "sticky", top: 0, zIndex: 100, background: "#fff" }}>
      <div
        className="filter-container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          background: "rgba(253, 251, 248, 0.95)",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {/* Main Filter Bar */}
        <div className="main-filters" style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", marginBottom: "15px" }}>
          {/* Search Box */}
          <div className="search-box" style={{ flex: "1", minWidth: "250px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search pets..."
              value={activeFilters.search}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "12px 45px 12px 20px",
                borderRadius: "20px",
                border: "2px solid #e0e0e0",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => e.target.style.borderColor = "#4ECDC4"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
            <div style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#666" }}>
              Search
            </div>
          </div>

          {/* Species Filters */}
          <div className="species-filters" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {speciesOptions.map((species) => (
              <button
                key={species.id}
                onClick={() => handleSpeciesToggle(species.id)}
                className={`filter-chip ${activeFilters.species.includes(species.id) ? "active" : ""}`}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "2px solid #e0e0e0",
                  background: activeFilters.species.includes(species.id) ? "#4ECDC4" : "#fff",
                  color: activeFilters.species.includes(species.id) ? "#fff" : "#333",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <img src={species.icon} alt="" style={{ width: 18, height: 18 }} loading="lazy" />
                <span>{species.label}</span>
              </button>
            ))}
          </div>

          {/* Mood Filters */}
          <div className="mood-filters" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodToggle(mood.id)}
                className={`filter-chip ${activeFilters.moods.includes(mood.id) ? "active" : ""}`}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "2px solid #e0e0e0",
                  background: activeFilters.moods.includes(mood.id) ? "#FFB6C1" : "#fff",
                  color: activeFilters.moods.includes(mood.id) ? "#fff" : "#333",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <img src={mood.icon} alt="" style={{ width: 18, height: 18 }} loading="lazy" />
                <span>{mood.label}</span>
              </button>
            ))}
          </div>

          {/* More Filters Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: "2px solid #e0e0e0",
              background: "#fff",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
            }}
          >
            More Filters 
          </button>
        </div>

        {/* Active Filters Display */}
        {(activeFilters.species.length > 0 || activeFilters.moods.length > 0 || activeFilters.search) && (
          <div className="active-filters" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px", alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#666" }}>Active filters:</span>
            {activeFilters.species.map(speciesId => {
              const species = speciesOptions.find(s => s.id === speciesId);
              return (
                <span key={speciesId} className="active-filter-chip" style={{
                  background: "#4ECDC4", color: "#fff", padding: "4px 8px", borderRadius: "12px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px"
                }}>
                  {species.emoji} {species.label}
                  <button onClick={() => handleSpeciesToggle(speciesId)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}>x</button>
                </span>
              );
            })}
            {activeFilters.moods.map(moodId => {
              const mood = moodOptions.find(m => m.id === moodId);
              return (
                <span key={moodId} className="active-filter-chip" style={{
                  background: "#FFB6C1", color: "#fff", padding: "4px 8px", borderRadius: "12px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px"
                }}>
                  {mood.emoji} {mood.label}
                  <button onClick={() => handleMoodToggle(moodId)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "0.8rem" }}>x</button>
                </span>
              );
            })}
            {activeFilters.search && (
              <span className="active-filter-chip" style={{
                background: "#FFD700", color: "#333", padding: "4px 8px", borderRadius: "12px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px"
              }}>
                Search: "{activeFilters.search}"
                <button onClick={() => handleSearchChange({ target: { value: "" } })} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: "0.8rem" }}>x</button>
              </span>
            )}
            <button onClick={clearFilters} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline" }}>
              Clear all
            </button>
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="advanced-filters" style={{
            borderTop: "1px solid #e0e0e0",
            paddingTop: "20px",
            marginTop: "15px",
            animation: "slideDown 0.3s ease-out"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              {/* Age Range */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Age Range</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={activeFilters.ageRange[1]}
                  onChange={(e) => handleAdvancedFilterChange("ageRange", [0, parseInt(e.target.value)])}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666" }}>
                  <span>0 years</span>
                  <span>{activeFilters.ageRange[1]}+ years</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Location</label>
                <input
                  type="text"
                  placeholder="City or shelter name"
                  value={activeFilters.location}
                  onChange={(e) => handleAdvancedFilterChange("location", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    outline: "none"
                  }}
                />
              </div>

              {/* Gender */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Gender</label>
                <select
                  value={activeFilters.gender}
                  onChange={(e) => handleAdvancedFilterChange("gender", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    outline: "none"
                  }}
                >
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={activeFilters.vaccinated}
                    onChange={(e) => handleAdvancedFilterChange("vaccinated", e.target.checked)}
                  />
                  <span>Vaccinated</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={activeFilters.trained}
                    onChange={(e) => handleAdvancedFilterChange("trained", e.target.checked)}
                  />
                  <span>House-trained</span>
                </label>
              </div>
            </div>

            {/* Surprise Me Button */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={surpriseMe}
                style={{
                  background: "linear-gradient(45deg, #4ECDC4, #44A08D)",
                  color: "#fff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(78, 205, 196, 0.3)",
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                 Surprise Me!
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .filter-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .filter-chip.active {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .active-filter-chip:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default FilterSection;
