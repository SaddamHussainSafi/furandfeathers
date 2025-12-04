const backendBase =
  (import.meta.env?.VITE_BACKEND_BASE_URL ||
    import.meta.env?.VITE_UPLOAD_BASE ||
    import.meta.env?.VITE_API_BASE_URL ||
    "").replace(/\/+$/, "");

export const normalizeMediaUrl = (url) => {
  if (!url || typeof url !== "string") return url;

  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  // Swap localhost/127.0.0.1 with the deployed backend host when present.
  const swapped = backendBase
    ? trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, backendBase)
    : trimmed;

  if (/^https?:\/\//i.test(swapped)) return swapped;

  if (backendBase) {
    return `${backendBase}/${swapped.replace(/^\/+/, "")}`;
  }

  return swapped.startsWith("/") ? swapped : `/${swapped}`;
};
