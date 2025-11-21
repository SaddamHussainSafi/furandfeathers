import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import API from '../services/api';

const PendingApprovalsCard = () => {
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    const fetchPendingShelters = async () => {
      try {
        const response = await API.get('/admin/shelters/pending');
        setShelters(response.data);
      } catch (error) {
        console.error('Error fetching pending shelters:', error);
      }
    };
    fetchPendingShelters();
  }, []);

  const handleApprove = async (shelterId) => {
    try {
      await API.put(`/admin/shelters/${shelterId}/approve`, { reason: 'Approved' });
      setShelters(shelters.filter(s => s.id !== shelterId));
      alert('Shelter approved!');
    } catch (error) {
      alert('Error approving shelter');
    }
  };

  const handleReject = async (shelterId) => {
    try {
      const reason = prompt('Enter rejection reason:');
      if (reason) {
        await API.put(`/admin/shelters/${shelterId}/reject`, { reason });
        setShelters(shelters.filter(s => s.id !== shelterId));
        alert('Shelter rejected!');
      }
    } catch (error) {
      alert('Error rejecting shelter');
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-white/20 lg:col-span-2">
      <h3 className="text-white font-semibold mb-4">Pending Shelter Approvals</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {shelters.length === 0 ? (
          <p className="text-white/60 text-center py-8">No pending approvals</p>
        ) : (
          shelters.map((shelter) => (
            <div key={shelter.id} className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{shelter.organizationName}</h4>
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                  PENDING
                </span>
              </div>
              <p className="text-white/60 text-sm mb-3">{shelter.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(shelter.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 rounded-lg transition"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(shelter.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded-lg transition"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingApprovalsCard;