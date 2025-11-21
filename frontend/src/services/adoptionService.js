import api from '../utils/api';

export const submitAdoptionApplication = async payload => {
  const { data } = await api.post('/adoptions', payload);
  return data;
};

export const fetchMyAdoptions = async () => {
  const { data } = await api.get('/adoptions/my');
  return data;
};

export const fetchManageAdoptions = async () => {
  const { data } = await api.get('/adoptions/manage');
  return data;
};

export const fetchAdoptionApplication = async id => {
  const { data } = await api.get(`/adoptions/${id}`);
  return data;
};

export const updateAdoptionStatus = async (id, payload) => {
  const { data } = await api.put(`/adoptions/${id}/status`, payload);
  return data;
};
