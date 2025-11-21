export const slugifyPetName = (name = '') => {
  return name.trim().replace(/\s+/g, '_20');
};

export const unslugifyPetName = (slug = '') => {
  return slug.replace(/_20/g, ' ');
};

export default slugifyPetName;
