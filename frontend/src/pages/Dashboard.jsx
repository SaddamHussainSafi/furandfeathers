import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { slugifyPetName } from "../utils/petSlug";
import SectionHero from "../components/SectionHero";
import { normalizeMediaUrl } from "../utils/mediaUrl";
import "../styles/table.css";

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  const fetchMyPets = async () => {
    const res = await api.get("/pets/my-pets");
    setPets(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      await api.delete(`/pets/${id}`);
      setPets(pets.filter((p) => p.id !== id));
    }
  };

  useEffect(() => {
    fetchMyPets();
  }, []);

  return (
    <div className="page">
      <SectionHero
        badge={<span>My shelter</span>}
        title="My Pets"
        subtitle="Manage your published pet profiles. Keep details fresh so adopters can make confident decisions."
        actions={(
          <div className="form-hero__actions">
            <button className="site-button site-button--primary" onClick={() => navigate("/add-pet")}>+ Add New Pet</button>
          </div>
        )}
      />

      <section className="page-section">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Species</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.id}>
                  <td>
                    {pet.imageUrl && (
                      <img
                        src={normalizeMediaUrl(pet.imageUrl)}
                        alt={pet.name}
                        width="70"
                        style={{ cursor: "pointer", borderRadius: 12 }}
                        onClick={() => navigate(`/pet/${slugifyPetName(pet.name)}`)}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="site-button site-button--secondary"
                      onClick={() => navigate(`/pet/${slugifyPetName(pet.name)}`)}
                    >
                      {pet.name}
                    </button>
                  </td>
                  <td>{pet.species}</td>
                  <td>{pet.age}</td>
                  <td>
                    <div className="table-actions">
                      <button className="site-button site-button--secondary" onClick={() => navigate(`/edit-pet/${pet.id}`)}>
                        Edit
                      </button>
                      <button className="site-button site-button--primary" onClick={() => handleDelete(pet.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;


