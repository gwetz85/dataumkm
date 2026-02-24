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

const credentials: Record<string, {password: string, profile: string}> = {
  'agus': { password: '19081985', profile: 'Administrator' },
  'dewi': { password: '10122000', profile: 'Operator' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const backupInterval = setInterval(() => {
        try {
            const backupData = {
                entrepreneurs: localStorage.getItem('entrepreneurs'),
                institutions: localStorage.getItem('institutions'),
                user: localStorage.getItem('user'),
                user_profiles: localStorage.getItem('user_profiles'),
                comparisonData: localStorage.getItem('comparisonData'),
                timestamp: new Date().toISOString(),
            };

            // Only create backup if there's some data to prevent empty backups
            if (backupData.entrepreneurs || backupData.institutions || backupData.user) {
              localStorage.setItem('sipdata_autobackup', JSON.stringify(backupData));
            }
        } catch (error) {
            console.error('Failed to create automatic backup:', error);
        }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(backupInterval);
  }, []);

  useEffect(() => {
    const storedUserJSON = localStorage.getItem('user');
    if (storedUserJSON) {
        try {
            const storedUser = JSON.parse(storedUserJSON);
            if (storedUser && storedUser.username && storedUser.profile) {
                const userIsValid = Object.keys(credentials).includes(storedUser.username);
                if (userIsValid) {
                    const allProfiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
                    const userData = allProfiles[storedUser.username] || {};
                    const userWithProfileData = {
                        ...storedUser,
                        data: userData,
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
    
    const validUser = credentials[username];
    
    if (validUser && validUser.password === password) {
        const allProfiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
        const userData = allProfiles[username] || {};

        const userToStore: User = { 
            username: username, 
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
          const updatedUser = { ...user, data: data };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser)); // Update session

          // Persist profile data separately
          const allProfiles = JSON.parse(localStorage.getItem('user_profiles') || '{}');
          allProfiles[user.username] = updatedUser.data;
          localStorage.setItem('user_profiles', JSON.stringify(allProfiles));
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
