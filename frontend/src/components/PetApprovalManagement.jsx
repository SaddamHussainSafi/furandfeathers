import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import API from '../services/api';

const PetApprovalManagement = () => {
  const [pendingPets, setPendingPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingPets();
  }, []);

  const fetchPendingPets = async () => {
    try {
      const response = await API.get('/admin/pets/pending');
      setPendingPets(response.data);
    } catch (error) {
      console.error('Error fetching pending pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (petId) => {
    setActionLoading(true);
    try {
      await API.post(`/admin/pets/${petId}/approve`, null, {
        params: { adminId: JSON.parse(localStorage.getItem('user')).id }
      });
      setPendingPets(pendingPets.filter(pet => pet.id !== petId));
    } catch (error) {
      console.error('Error approving pet:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (petId) => {
    setActionLoading(true);
    try {
      await API.post(`/admin/pets/${petId}/reject`, null, {
        params: { adminId: JSON.parse(localStorage.getItem('user')).id }
      });
      setPendingPets(pendingPets.filter(pet => pet.id !== petId));
    } catch (error) {
      console.error('Error rejecting pet:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pet Approval Management</h1>
        <div className="text-sm text-gray-600">
          {pendingPets.length} pending approval{pendingPets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {pendingPets.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up!</h3>
          <p className="mt-1 text-sm text-gray-500">No pets are currently pending approval.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingPets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {pet.imageUrl && (
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pet.species} • {pet.breed} • {pet.age}
                      </p>
                      <p className="text-sm text-gray-500">{pet.location}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-700">{pet.description}</p>
                  </div>

                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Gender: {pet.gender}</span>
                    <span>Status: {pet.status}</span>
                    {pet.owner && (
                      <span>Owner: {pet.owner.name} ({pet.owner.email})</span>
                    )}
                    <span>Submitted: {formatDate(pet.createdAt)}</span>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedPet(pet)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>

                  <button
                    onClick={() => handleApprove(pet.id)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(pet.id)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pet Details Modal */}
      {selectedPet && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Pet Details</h3>
              <button
                onClick={() => setSelectedPet(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedPet.imageUrl && (
                <img
                  src={selectedPet.imageUrl}
                  alt={selectedPet.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPet.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Species</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPet.species}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Breed</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPet.breed}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPet.age}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPet.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPet.location}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedPet.description}</p>
              </div>

              {selectedPet.owner && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner Information</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPet.owner.name} ({selectedPet.owner.email})
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedPet(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedPet.id);
                    setSelectedPet(null);
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Approve Pet
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedPet.id);
                    setSelectedPet(null);
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Reject Pet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetApprovalManagement;