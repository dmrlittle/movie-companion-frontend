
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MovieSuggestion {
  movie_id: string;
  title: string;
  overview: string;
  release_year: number;
  poster_url: string;
  ai_pitch: string;
}

interface MovieContextType {
  suggestions: MovieSuggestion[];
  setSuggestions: (suggestions: MovieSuggestion[]) => void;
  lastPrompt: string;
  setLastPrompt: (prompt: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [lastPrompt, setLastPrompt] = useState('');

  const value = {
    suggestions,
    setSuggestions,
    lastPrompt,
    setLastPrompt
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
