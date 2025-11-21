import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Building, Package } from 'lucide-react';
import API from '../../services/api';
import Button from '../ui/Button';

const PendingApprovalCard = ({ type = 'shelter' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingItems();
  }, [type]);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      let endpoint = '';
      if (type === 'shelter') {
        endpoint = '/admin/shelters/pending';
      } else if (type === 'pet') {
        endpoint = '/admin/pets/pending';
      }

      if (endpoint) {
        const response = await API.get(endpoint);
        setItems(response.data);
      }
    } catch (error) {
      console.error(`Error fetching pending ${type}s:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      let endpoint = '';
      if (type === 'shelter') {
        endpoint = `/admin/shelters/${id}/approve`;
      } else if (type === 'pet') {
        endpoint = `/admin/pets/${id}/approve`;
      }

      await API.put(endpoint, { reason: 'Approved' });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error approving ${type}:`, error);
      alert(`Error approving ${type}`);
    }
  };

  const handleReject = async (id) => {
    try {
      const reason = prompt('Enter rejection reason:');
      if (reason) {
        let endpoint = '';
        if (type === 'shelter') {
          endpoint = `/admin/shelters/${id}/reject`;
        } else if (type === 'pet') {
          endpoint = `/admin/pets/${id}/reject`;
        }

        await API.put(endpoint, { reason });
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error(`Error rejecting ${type}:`, error);
      alert(`Error rejecting ${type}`);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center py-8">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const title = type === 'shelter' ? 'Pending Shelter Approvals' : 'Pending Pet Approvals';
  const Icon = type === 'shelter' ? Building : Package;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon size={20} className="text-white/80" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-white/60 text-center py-8">No pending approvals</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">
                  {type === 'shelter' ? item.organizationName : item.name}
                </h4>
                <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
                  PENDING
                </span>
              </div>

              <p className="text-white/60 text-sm mb-4">
                {type === 'shelter' ? item.description : `${item.breed} - ${item.age} years old`}
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(item.id)}
                  variant="success"
                  size="sm"
                  className="flex-1"
                  icon={CheckCircle}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(item.id)}
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  icon={XCircle}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingApprovalCard;