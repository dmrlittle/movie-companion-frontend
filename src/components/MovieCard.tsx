
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkIcon } from 'lucide-react';

interface Movie {
  movie_id: string;
  title: string;
  overview: string;
  release_year: number;
  poster_url: string;
  ai_pitch?: string;
}

interface MovieCardProps {
  movie: Movie;
  onBookmark?: () => void;
  onRemove?: () => void;
  showBookmarkButton?: boolean;
  showRemoveButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onBookmark, 
  onRemove, 
  showBookmarkButton = false,
  showRemoveButton = false
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.poster_url || '/placeholder.svg'}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {movie.title}
            </h3>
            <span className="text-sm text-muted-foreground ml-2 flex-shrink-0">
              {movie.release_year}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {movie.overview}
          </p>
          
          {movie.ai_pitch && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm italic">
                "{movie.ai_pitch}"
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            {showBookmarkButton && onBookmark && (
              <Button
                onClick={onBookmark}
                size="sm"
                className="flex items-center gap-2"
              >
                <BookmarkIcon className="h-4 w-4" />
                Bookmark
              </Button>
            )}
            
            {showRemoveButton && onRemove && (
              <Button
                onClick={onRemove}
                size="sm"
                variant="destructive"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
