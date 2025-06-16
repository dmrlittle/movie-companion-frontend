
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BookmarkIcon } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/suggestions" className="text-xl font-bold">
              Movie Companion
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/suggestions">
                <Button 
                  variant={location.pathname === '/suggestions' ? 'default' : 'ghost'}
                  size="sm"
                >
                  Suggestions
                </Button>
              </Link>
              
              <Link to="/bookmarks">
                <Button 
                  variant={location.pathname === '/bookmarks' ? 'default' : 'ghost'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <BookmarkIcon className="h-4 w-4" />
                  Bookmarks
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {user?.username}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-2">
            <Link to="/suggestions" className="flex-1">
              <Button 
                variant={location.pathname === '/suggestions' ? 'default' : 'ghost'}
                size="sm"
                className="w-full"
              >
                Suggestions
              </Button>
            </Link>
            
            <Link to="/bookmarks" className="flex-1">
              <Button 
                variant={location.pathname === '/bookmarks' ? 'default' : 'ghost'}
                size="sm"
                className="w-full flex items-center gap-2"
              >
                <BookmarkIcon className="h-4 w-4" />
                Bookmarks
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
