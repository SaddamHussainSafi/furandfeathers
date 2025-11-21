export const getUserInitials = (name = '') => {
  if (!name) return '';
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  const first = parts[0].slice(0, 1);
  const last = parts[parts.length - 1].slice(0, 1);
  return `${first}${last}`.toUpperCase();
};

export const getAvatarPlaceholder = (name = '') => {
  const initials = getUserInitials(name) || 'FF';
  return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(initials)}`;
};
