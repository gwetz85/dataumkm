'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
    fullName?: string;
    nik?: string;
    birthPlace?: string;
    birthDate?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
}

export interface User {
    username: string;
    profile: string; // role
    data: UserProfile;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username?: string, password?: string) => boolean;
  logout: () => void;
  updateUserProfile: (data: UserProfile) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const validUsers = [
  { username: 'agus', password: '19081985', profile: 'Administrator' },
  { username: 'dewi', password: '10122000', profile: 'Operator' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This is to migrate from the old `isAuthenticated` key
    localStorage.removeItem('isAuthenticated'); 

    const storedUserJSON = localStorage.getItem('user');
    if (storedUserJSON) {
        try {
            const storedUser = JSON.parse(storedUserJSON);
            if (storedUser && storedUser.username && storedUser.profile) {
                const userIsValid = validUsers.some(u => u.username === storedUser.username);
                if (userIsValid) {
                    // Ensure user object has the 'data' field
                    const userWithProfileData = {
                        ...storedUser,
                        data: storedUser.data || {},
                    };
                    setUser(userWithProfileData);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('user');
                }
            } else {
                 localStorage.removeItem('user');
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
        }
    }
    setLoading(false);
  }, []);

  const login = (username?: string, password?: string): boolean => {
    if (!username || !password) return false;
    const validUser = validUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (validUser) {
        const existingStoredUser = JSON.parse(localStorage.getItem('user') || '{}');
        let userData = {};
        if (existingStoredUser.username === validUser.username) {
            userData = existingStoredUser.data || {};
        }

        const userToStore: User = { 
            username: validUser.username, 
            profile: validUser.profile,
            data: userData,
        };

        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userToStore);
        setIsAuthenticated(true);
        router.push('/');
        return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const updateUserProfile = (data: UserProfile) => {
      if (user) {
          const updatedUser = { ...user, data: { ...user.data, ...data } };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
      }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
