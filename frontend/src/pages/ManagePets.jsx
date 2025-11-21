import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function ManagePets() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [filter, setFilter] = useState('all');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    location: '',
    description: '',
    status: 'Available',
    image: null,
  });

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

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setEditForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      location: pet.location,
      description: pet.description,
      status: pet.status,
      image: null,
    });
    setShowEditModal(true);
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

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm({ ...editForm, [name]: files ? files[0] : value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      await api.put(`/pets/${editingPet.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
      setShowEditModal(false);
      setEditingPet(null);
      alert('Pet updated successfully!');
    } catch (error) {
      console.error('Error updating pet:', error);
      alert('Failed to update pet');
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
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
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
                      src={pet.imageUrl}
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
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <select
                      onChange={(e) => {
                        if (e.target.value === 'edit') handleEdit(pet);
                        else if (e.target.value === 'delete') handleDelete(pet.id);
                        e.target.value = ''; // Reset select
                      }}
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <option value="">Actions</option>
                      <option value="edit">Edit</option>
                      <option value="delete">Delete</option>
                    </select>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2>Edit Pet</h2>
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Pet Name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  name="species"
                  placeholder="Species"
                  value={editForm.species}
                  onChange={handleEditChange}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  name="breed"
                  placeholder="Breed"
                  value={editForm.breed}
                  onChange={handleEditChange}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  name="age"
                  placeholder="Age"
                  value={editForm.age}
                  onChange={handleEditChange}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <select
                  name="gender"
                  value={editForm.gender}
                  onChange={handleEditChange}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={editForm.location}
                  onChange={handleEditChange}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="4"
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleEditChange}
                  style={{ width: '100%', padding: '8px' }}
                />
                <small>Leave empty to keep current image</small>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Update Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
