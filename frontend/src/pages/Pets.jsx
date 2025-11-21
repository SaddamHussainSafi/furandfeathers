import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import PetCard from "../components/PetCard";
import FilterSection from "../components/FilterSection";
import SectionHero from "../components/SectionHero";
import "../styles/pets.css";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    species: [],
    moods: [],
    search: "",
    ageRange: [0, 20],
    location: "",
    gender: "",
    vaccinated: false,
    trained: false,
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get("/pets");
        setPets(res.data);
        setFilteredPets(res.data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    let filtered = [...pets];

    // Species filter
    if (filters.species.length > 0) {
      filtered = filtered.filter(pet =>
        filters.species.some(species =>
          pet.species?.toLowerCase().includes(species.toLowerCase()) ||
          (species === "dog" && pet.species?.toLowerCase().includes("dog")) ||
          (species === "cat" && pet.species?.toLowerCase().includes("cat")) ||
          (species === "bird" && pet.species?.toLowerCase().includes("bird")) ||
          (species === "rabbit" && pet.species?.toLowerCase().includes("rabbit")) ||
          (species === "other" && !["dog", "cat", "bird", "rabbit"].some(s =>
            pet.species?.toLowerCase().includes(s)
          ))
        )
      );
    }

    // Mood/Personality filter (this would need to be mapped from pet data)
    if (filters.moods.length > 0) {
      filtered = filtered.filter(pet => {
        // This is a simplified mapping - in real implementation, you'd have personality traits in pet data
        const petPersonality = pet.personality || pet.temperament || "";
        return filters.moods.some(mood => {
          switch (mood) {
            case "gentle":
              return petPersonality.toLowerCase().includes("gentle") || petPersonality.toLowerCase().includes("calm");
            case "energetic":
              return petPersonality.toLowerCase().includes("energetic") || petPersonality.toLowerCase().includes("active");
            case "calm":
              return petPersonality.toLowerCase().includes("calm") || petPersonality.toLowerCase().includes("quiet");
            case "playful":
              return petPersonality.toLowerCase().includes("playful") || petPersonality.toLowerCase().includes("fun");
            case "kidFriendly":
              return petPersonality.toLowerCase().includes("kid") || petPersonality.toLowerCase().includes("family");
            default:
              return false;
          }
        });
      });
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(pet =>
        pet.name?.toLowerCase().includes(searchLower) ||
        pet.breed?.toLowerCase().includes(searchLower) ||
        pet.species?.toLowerCase().includes(searchLower) ||
        pet.color?.toLowerCase().includes(searchLower) ||
        pet.personality?.toLowerCase().includes(searchLower)
      );
    }

    // Age range filter
    filtered = filtered.filter(pet => {
      const age = parseInt(pet.age) || 0;
      return age >= filters.ageRange[0] && age <= filters.ageRange[1];
    });

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(pet =>
        pet.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        pet.shelter?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(pet =>
        pet.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    // Vaccination filter
    if (filters.vaccinated) {
      filtered = filtered.filter(pet => pet.vaccinated === true);
    }

    // Training filter
    if (filters.trained) {
      filtered = filtered.filter(pet => pet.trained === true);
    }

    setFilteredPets(filtered);
  }, [pets, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const uniqueLocationCount = useMemo(() => {
    const unique = new Set();
    pets.forEach((pet) => {
      const key = (pet.location || pet.shelter || "").trim().toLowerCase();
      if (key) {
        unique.add(key);
      }
    });
    return unique.size;
  }, [pets]);

  const heroMetrics = [
    { label: "Available today", value: loading ? "..." : pets.length },
    { label: "Matching your filters", value: loading ? "..." : filteredPets.length },
    { label: "Cities represented", value: loading ? "..." : uniqueLocationCount || 0 },
  ];

  const scrollToFilters = () => {
    const target = document.getElementById("pet-filters");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToListings = () => {
    const target = document.getElementById("pets-grid");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="page">
      <section className="surface-card pets-hero">
        <div className="pets-hero__copy">
          <p className="pets-hero__eyebrow">Curated by local shelters</p>
          <h1>Meet companions that fit your rhythm</h1>
          <p>
            Browse verified profiles, uncover personalities, and match with pets whose energy aligns with
            your routines. Everything is updated daily so you always see who is ready to meet you.
          </p>
          <div className="pets-hero__actions">
            <button className="site-button site-button--primary" type="button" onClick={scrollToListings}>
              Browse available pets
            </button>
            <button className="site-button site-button--secondary" type="button" onClick={scrollToFilters}>
              Refine filters
            </button>
          </div>
          <ul className="pets-hero__list">
            <li>Live availability synced from partner shelters</li>
            <li>Filter by lifestyle, temperament, and care needs</li>
            <li>Chat with adopters and shelters inside one inbox</li>
          </ul>
        </div>
        <div className="pets-hero__panel">
          <div className="pets-hero__metrics">
            {heroMetrics.map((metric) => (
              <div key={metric.label} className="pets-hero__metric">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
          <div className="pets-hero__cta">
            <div>
              <p className="pets-hero__cta-label">Need a guided match?</p>
              <h4>Chat with Furly</h4>
              <p>Our AI assistant asks a few questions and recommends pets instantly.</p>
            </div>
            <button
              className="site-button site-button--primary"
              type="button"
              onClick={() => navigate("/furly-chat")}
            >
              Talk to Furly
            </button>
          </div>
        </div>
      </section>

      <section id="pet-filters" className="surface-card pets-filter-panel">
        <FilterSection onFiltersChange={handleFiltersChange} />
      </section>

      <SectionHero title={`Available Pets ${filteredPets.length !== pets.length ? `(${filteredPets.length})` : ''}`} subtitle="Discover companions ready for their forever homes." />
      <section id="pets-grid" className="page-section">
        {loading ? (
          <div className="section-grid section-grid--three">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="surface-card">
                <div style={{ height: 160, background: 'rgba(15,23,42,0.06)', borderRadius: 12 }} />
                <div style={{ height: 20, background: 'rgba(15,23,42,0.06)', marginTop: 12, borderRadius: 6 }} />
                <div style={{ height: 16, background: 'rgba(15,23,42,0.06)', marginTop: 8, borderRadius: 6 }} />
              </div>
            ))}
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="surface-card" style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem' }}>
              {pets.length === 0 ? "No pets available right now." : "No pets match your current filters."}
            </p>
            {pets.length > 0 && filteredPets.length === 0 && (
              <button
                className="site-button site-button--primary"
                onClick={() => setFilters({ species: [], moods: [], search: "", ageRange: [0, 20], location: "", gender: "", vaccinated: false, trained: false })}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="section-grid section-grid--three">
            {filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Pets;


