import { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const GoogleOneTapLogin = () => {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const initializedRef = useRef(false);
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    useEffect(() => {
        // Don't show One Tap if user is already logged in
        if (user || !GOOGLE_CLIENT_ID) return;

        // Debounce initialization to prevent race conditions in React Strict Mode
        const timer = setTimeout(() => {
            if (initializedRef.current || !window.google) return;

            initializedRef.current = true;

            try {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: async (response) => {
                        try {
                            console.log('One Tap login triggered');
                            const res = await api.post('/auth/google', {
                                idToken: response.credential
                            });

                            if (res.data.status === 'success') {
                                login(res.data.user, res.data.token);
                                navigate('/dashboard');
                            }
                        } catch (error) {
                            console.error('One Tap login error:', error);
                        }
                    },
                    use_fedcm_for_prompt: false,
                    cancel_on_tap_outside: true,
                });

                window.google.accounts.id.prompt();
            } catch (error) {
                console.error('One Tap initialization error:', error);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            if (window.google?.accounts?.id?.cancel) {
                window.google.accounts.id.cancel();
            }
        };
    }, [user, login, navigate, GOOGLE_CLIENT_ID]);

    return null;
};

export default GoogleOneTapLogin;
