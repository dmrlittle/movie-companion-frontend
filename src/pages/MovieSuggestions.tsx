
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookmarkIcon, Sparkles } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import Navigation from '@/components/Navigation';
import { useMovieContext } from '@/contexts/MovieContext';

interface MovieSuggestion {
  movie_id: string;
  title: string;
  overview: string;
  release_year: number;
  poster_url: string;
  ai_pitch: string;
}

const loadingMessages = [
  "🎬 Analyzing your preferences...",
  "🍿 Searching through thousands of movies...",
  "✨ Finding the perfect matches...",
  "🎭 Consulting our film database...",
  "🌟 Curating personalized recommendations...",
  "🎪 Almost ready with your suggestions..."
];

const MovieSuggestions = () => {
  const { suggestions, setSuggestions, lastPrompt, setLastPrompt } = useMovieContext();
  const [prompt, setPrompt] = useState(lastPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleGetSuggestions = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Please enter a prompt',
        description: 'Describe what kind of movies you\'re looking for',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setLoadingMessageIndex(0);
    setLastPrompt(prompt); // Save the prompt to context
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data || []); // Update context state
        toast({
          title: 'Suggestions loaded!',
          description: `Found ${data?.length || 0} movie recommendations`
        });
      } else {
        throw new Error('Failed to get suggestions');
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to get movie suggestions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (movie: MovieSuggestion) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          movie_id: movie.movie_id,
          title: movie.title,
          poster_url: movie.poster_url,
          release_year: movie.release_year,
          overview: movie.overview
        })
      });

      if (response.ok) {
        toast({
          title: 'Bookmarked!',
          description: `Added "${movie.title}" to your bookmarks`
        });
      } else if (response.status === 409) {
        throw new Error((await response.json()).detail);
      } else {
        throw new Error('Failed to bookmark movie');
      }
    } catch (error) {
      console.error('Error bookmarking movie:', error);
      toast({
        title: 'Failed',
        description: `${error}`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Movie Suggestions</h1>
            <p className="text-muted-foreground">
              Tell us what you're in the mood for and we'll find the perfect movies!
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What are you looking for?</CardTitle>
              <CardDescription>
                Describe your mood, genre preferences, or reference movies you enjoyed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g., I want something like Parasite but more hopeful, or psychological thrillers with great cinematography..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
                disabled={isLoading}
              />
              <Button 
                onClick={handleGetSuggestions}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Getting suggestions...
                  </div>
                ) : (
                  'Get Suggestions'
                )}
              </Button>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <Sparkles className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
                </div>
                <p className="text-lg font-medium text-primary animate-fade-in">
                  {loadingMessages[loadingMessageIndex]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Our AI is working its magic...
                </p>
              </div>
            </div>
          )}

          {suggestions.length > 0 && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={movie}
                  onBookmark={() => handleBookmark(movie)}
                  showBookmarkButton={true}
                />
              ))}
            </div>
          )}

          {suggestions.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Enter a prompt above to get personalized movie suggestions!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieSuggestions;
