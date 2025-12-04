import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { normalizeMediaUrl } from '../utils/mediaUrl';

export default function ManagePets() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [filter, setFilter] = useState('all');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Check if user is admin or superadmin
        const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

        // Use different endpoint based on role
        const endpoint = isAdmin ? '/pets' : '/pets/my-pets';
        const response = await api.get(endpoint);
        console.log('API Response:', response.data); // Debug log

        let petsData;
        if (isAdmin) {
          // For admins, the response is already PetResponse objects
          petsData = response.data.map(pet => ({
            ...pet,
            status: pet.status || 'available',
            applications: pet.applications || 0,
            addedDate: pet.addedDate || new Date().toISOString().split('T')[0],
            listingStatus: pet.listingStatus || 'APPROVED'
          }));
        } else {
          // For regular users, transform as before
          petsData = response.data.map(pet => ({
            ...pet,
            status: pet.status || 'available',
            applications: pet.applications || 0,
            addedDate: pet.addedDate || new Date().toISOString().split('T')[0]
          }));
        }

        setPets(petsData);
      } catch (error) {
        console.error('Error fetching pets:', error);
        alert('Failed to load pets. Check console for details.');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      console.log('Current user:', user); // Debug log
      fetchPets();
    }
  }, [user]);

  const filteredPets = filter === 'all' ? pets :
    filter === 'pending_review' ? pets.filter(pet => pet.listingStatus === 'PENDING_REVIEW') :
      pets.filter(pet => pet.status === filter);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading pets...</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#28a745';
      case 'adopted': return '#6c757d';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const handleStatusChange = async (petId, newStatus) => {
    const formData = new FormData();
    formData.append('status', newStatus);
    // Add other required fields with current values
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      formData.append('name', pet.name);
      formData.append('species', pet.species);
      formData.append('breed', pet.breed);
      formData.append('age', pet.age);
      formData.append('gender', pet.gender);
      formData.append('location', pet.location);
      formData.append('description', pet.description);
    }

    try {
      await api.put(`/pets/${petId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPets(pets.map(p => p.id === petId ? { ...p, status: newStatus } : p));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update pet status');
    }
  };

  const handleDelete = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await api.delete(`/pets/${petId}`);
        setPets(pets.filter(pet => pet.id !== petId));
      } catch (error) {
        console.error('Error deleting pet:', error);
        alert('Failed to delete pet');
      }
    }
  };

  const handleDatabaseStatusChange = async (petId, newStatus) => {
    try {
      // Handle different status changes based on available endpoints
      if (newStatus === 'APPROVED') {
        await api.put(`/pets/${petId}/approve`);
      } else if (newStatus === 'REJECTED') {
        await api.put(`/pets/${petId}/reject`);
      } else if (newStatus === 'PENDING_REVIEW') {
        // For pending review, we need to set it back - this might require a backend change
        alert('Setting status to PENDING_REVIEW requires backend implementation');
        return;
      } else if (newStatus === 'DRAFT' || newStatus === 'ADOPTED') {
        // These statuses might need new backend endpoints
        alert(`Setting status to ${newStatus} requires backend implementation. Available: APPROVED, REJECTED`);
        return;
      }

      // Refresh pets
      const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
      const endpoint = isAdmin ? '/pets' : '/pets/my-pets';
      const response = await api.get(endpoint);

      let petsData;
      if (isAdmin) {
        petsData = response.data.map(pet => ({
          ...pet,
          status: pet.status || 'available',
          applications: pet.applications || 0,
          addedDate: pet.addedDate || new Date().toISOString().split('T')[0],
          listingStatus: pet.listingStatus || 'APPROVED'
        }));
      } else {
        petsData = response.data.map(pet => ({
          ...pet,
          status: pet.status || 'available',
          applications: pet.applications || 0,
          addedDate: pet.addedDate || new Date().toISOString().split('T')[0]
        }));
      }

      setPets(petsData);
      alert(`Pet database status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating database status:', error);
      alert('Failed to update pet database status');
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Please Log In</h1>
        <p>You need to be logged in to manage your pets.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manage Pets</h1>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Logged in as: {user?.name} (ID: {user?.id}) | Role: {user?.role}
        </div>
        <Link
          to="/add-pet"
          className="site-button site-button--primary"
        >
          Add New Pet
        </Link>
      </div>

      {/* Filter Controls */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h3>Filter Pets</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === 'all'}
              onChange={(e) => setFilter(e.target.value)}
            />
            All Pets ({pets.length})
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="available"
              checked={filter === 'available'}
              onChange={(e) => setFilter(e.target.value)}
            />
            Available ({pets.filter(p => p.status === 'available').length})
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="pending"
              checked={filter === 'pending'}
              onChange={(e) => setFilter(e.target.value)}
            />
            Pending Adoption ({pets.filter(p => p.status === 'pending').length})
          </label>
          {isAdmin && (
            <label>
              <input
                type="radio"
                name="filter"
                value="pending_review"
                checked={filter === 'pending_review'}
                onChange={(e) => setFilter(e.target.value)}
              />
              Pending Review ({pets.filter(p => p.listingStatus === 'PENDING_REVIEW').length})
            </label>
          )}
          <label>
            <input
              type="radio"
              name="filter"
              value="adopted"
              checked={filter === 'adopted'}
              onChange={(e) => setFilter(e.target.value)}
            />
            Adopted ({pets.filter(p => p.status === 'adopted').length})
          </label>
        </div>
      </div>

      {/* Pets Table */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Pet</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Species</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
              {isAdmin && <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Database Status</th>}
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Applications</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Added</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPets.map(pet => (
              <tr key={pet.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={normalizeMediaUrl(pet.imageUrl)}
                      alt={pet.name}
                      style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <span style={{ fontWeight: 'bold' }}>{pet.name}</span>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>{pet.species}</td>
                <td style={{ padding: '15px' }}>
                  <select
                    value={pet.status}
                    onChange={(e) => handleStatusChange(pet.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(pet.status),
                      color: 'white'
                    }}
                  >


                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                  </select>
                </td>
                {isAdmin && (
                  <td style={{ padding: '15px' }}>
                    <select
                      value={pet.listingStatus || 'APPROVED'}
                      onChange={(e) => handleDatabaseStatusChange(pet.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: '#f8f9fa',
                        color: '#333',
                        fontSize: '12px',
                        fontFamily: 'Kanit, sans-serif'
                      }}
                    >
                      <option value="DRAFT" disabled style={{ color: '#999' }}>DRAFT (Not implemented)</option>
                      <option value="PENDING_REVIEW" disabled style={{ color: '#999' }}>PENDING_REVIEW (Not implemented)</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="ADOPTED" disabled style={{ color: '#999' }}>ADOPTED (Not implemented)</option>
                    </select>
                  </td>
                )}
                <td style={{ padding: '15px' }}>{pet.applications}</td>
                <td style={{ padding: '15px' }}>{pet.addedDate}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/edit-pet/${pet.id}`)}
                      className="site-button site-button--secondary"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pet.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPets.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            color: '#666'
          }}>
            <h3>No pets found</h3>
            <p>No pets match the selected filter.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginTop: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>
            {pets.filter(p => p.status === 'available').length}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Available Pets</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>
            {pets.filter(p => p.status === 'pending').length}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Pending Adoption</p>
        </div>

        {isAdmin && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#17a2b8' }}>
              {pets.filter(p => p.listingStatus === 'PENDING_REVIEW').length}
            </h3>
            <p style={{ margin: 0, color: '#666' }}>Pending Review</p>
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6c757d' }}>
            {pets.filter(p => p.status === 'adopted').length}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Successfully Adopted</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
            {pets.reduce((sum, pet) => sum + pet.applications, 0)}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Total Applications</p>
        </div>
      </div>
    </div>
  );
}
