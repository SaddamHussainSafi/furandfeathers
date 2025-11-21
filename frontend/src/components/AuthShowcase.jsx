import { useEffect, useMemo, useState } from "react";
import "../styles/auth.css";

const FALLBACK_PHOTOS = [
  {
    id: "fallback-1",
    src: "https://images.pexels.com/photos/4587995/pexels-photo-4587995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=800",
    photographer: "Blue Bird",
    url: "https://www.pexels.com/photo/woman-in-white-crew-neck-shirt-holding-brown-and-white-short-coated-dog-4587995/",
  },
  {
    id: "fallback-2",
    src: "https://images.pexels.com/photos/5732719/pexels-photo-5732719.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=800",
    photographer: "Nataliya Vaitkevich",
    url: "https://www.pexels.com/photo/a-woman-with-two-dogs-5732719/",
  },
  {
    id: "fallback-3",
    src: "https://images.pexels.com/photos/9770197/pexels-photo-9770197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=800",
    photographer: "Thirdman",
    url: "https://www.pexels.com/photo/crop-designer-drawing-sketch-of-clothed-dog-9770197/",
  },
];

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || "sOGcnI70hI5Wm1SBo0UUuBmoKNMRKFnS4QZuhj4f5f0hQ6fagVnIeN24";
const PHOTO_LIMIT = 12;
const SEARCH_TERMS = [
  "colorful pet portrait",
  "vibrant animal studio",
  "playful pets neon",
  "adopted pets colorful",
];

export default function AuthShowcase({ mode = "login", children }) {
  const [photo, setPhoto] = useState(() => FALLBACK_PHOTOS[Math.floor(Math.random() * FALLBACK_PHOTOS.length)]);

  const copy = useMemo(
    () => ({
      login: {
        eyebrow: "Fur & Feathers",
        title: "Welcome Back",
        body: "Sign in and keep every adoption story, health update, and shelter conversation in one beautifully organized workspace.",
      },
      signup: {
        eyebrow: "New Here?",
        title: "Create an Account",
        body: "Bring your shelter, foster pets, and adopters together with a calming, colorful hub designed for compassionate teams.",
      },
    }),
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchPhotos = async () => {
      if (!PEXELS_API_KEY) return;
      try {
        const query = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            query
          )}&orientation=portrait&per_page=${PHOTO_LIMIT}&size=large`,
          {
            headers: { Authorization: PEXELS_API_KEY },
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error(`Pexels error: ${res.status}`);
        const data = await res.json();
        if (data?.photos?.length) {
          const nextPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
          setPhoto({
            id: nextPhoto.id,
            src: nextPhoto.src.portrait || nextPhoto.src.large2x || nextPhoto.src.large,
            photographer: nextPhoto.photographer,
            url: nextPhoto.url,
          });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to fetch Pexels photos:", error);
        }
      }
    };

    fetchPhotos();

    return () => controller.abort();
  }, []);

  return (
    <div className="auth-shell-wrapper">
      <div className="auth-shell">
      <div className="auth-shell__panel auth-shell__panel--media">
        <div className="auth-media">
          <div className="auth-media__image" style={{ backgroundImage: `url(${photo?.src})` }} />
          <div className="auth-media__overlay" />
          <div className="auth-media__brand">
            <p className="auth-media__eyebrow">{copy[mode]?.eyebrow}</p>
            <p className="auth-media__title">{copy[mode]?.title}</p>
            <p className="auth-media__body">{copy[mode]?.body}</p>
          </div>
          {photo && (
            <div className="auth-media__credit">
              <span>Photo by {photo.photographer}</span>
              <a href={photo.url} target="_blank" rel="noreferrer">
                View on Pexels
              </a>
            </div>
          )}
          <div className="auth-media__stats">
            <div>
              <p className="auth-stat__label">Happy Matches</p>
              <p className="auth-stat__value">2,184+</p>
            </div>
            <div>
              <p className="auth-stat__label">Shelters onboard</p>
              <p className="auth-stat__value">84</p>
            </div>
            <div>
              <p className="auth-stat__label">Avg. response</p>
              <p className="auth-stat__value">12m</p>
            </div>
          </div>
        </div>
      </div>
        <div className="auth-shell__panel auth-shell__panel--form">{children}</div>
      </div>
    </div>
  );
}
