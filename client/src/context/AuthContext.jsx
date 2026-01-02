import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize Socket
        const newSocket = io('https://hotel-backend-uasi.onrender.com');
        setSocket(newSocket);

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
            newSocket.emit('join_room', userInfo._id);

            // Fetch fresh profile data to ensure local storage is up-to-date (e.g. phone number)
            axios.get('https://hotel-backend-uasi.onrender.com/api/users/profile')
                .then(({ data }) => {
                    // Merge new profile data with existing token/info (profile endpoint doesn't return token)
                    const updatedUser = { ...userInfo, ...data };
                    // Ensure token is preserved if not in profile response (it isn't)
                    setUser(updatedUser);
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                })
                .catch(err => {
                    console.error('Failed to refresh user profile:', err);
                    // Optionally logout if 401, but keeping it simple for now (just don't update)
                });
        }
        setLoading(false);

        return () => newSocket.close();
    }, []);

    const login = async (identifier, password) => {
        const { data } = await axios.post('https://hotel-backend-uasi.onrender.com/api/users/login', { identifier, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        if (socket) {
            socket.emit('join_room', data._id);
        }
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post('https://hotel-backend-uasi.onrender.com/api/users/register', userData);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        if (socket) {
            socket.emit('join_room', data._id);
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        // socket.disconnect() is optional, but maybe just leave it
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, socket }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
