
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import MovieCard from '@/components/MovieCard';
import Navigation from '@/components/Navigation';

interface BookmarkedMovie {
  movie_id: string;
  title: string;
  overview: string;
  release_year: number;
  poster_url: string;
}

const BookmarkedMovies = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data || []);
      } else {
        throw new Error('Failed to fetch bookmarks');
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookmarks. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (movieId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookmarks/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBookmarks(bookmarks.filter(movie => movie.movie_id !== movieId));
        toast({
          title: 'Removed',
          description: 'Movie removed from bookmarks'
        });
      } else {
        throw new Error('Failed to remove bookmark');
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove bookmark. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Bookmarked Movies</h1>
            <p className="text-muted-foreground">
              Your saved movie collection
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your bookmarks...</p>
            </div>
          ) : bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarks.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={movie}
                  onRemove={() => handleRemoveBookmark(movie.movie_id)}
                  showRemoveButton={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't bookmarked any movies yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Visit the suggestions page to discover and bookmark movies!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkedMovies;
