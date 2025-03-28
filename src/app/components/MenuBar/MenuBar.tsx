"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./MenuBar.css";
import MenuBtn from "../MenuBtn/MenuBtn";
import { SearchNormal1 } from "iconsax-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
}

interface MenuBarProps {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ isOpen, toggleMenu, closeMenu }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.results.slice(0, 5)); // Show top 5 results
    } catch (error) {
      console.error("Error searching movies:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchMovies(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

const handleMovieSelect = (movieId: number) => {
  router.push(`/movie/${movieId}`);

  setShowSearch(false);
  setSearchQuery("");
  setSearchResults([]);
};

  return (
    <>
      <div className="menu-bar">
        <div className="menu-toggle-wrapper">
          <MenuBtn isOpen={isOpen} toggleMenu={toggleMenu} />
        </div>

        <div className="logo auth-link" onClick={closeMenu}>
          <Link href="/">Dashboard</Link>
        </div>
        <div className="logo" onClick={closeMenu}>
          <Link href="/">ALLMOVIEZ</Link>
        </div>
        <div className="logo auth-link" onClick={closeMenu}>
          <Link href="/">Profile</Link>
        </div>

        <div className="search-icon" onClick={() => setShowSearch(true)}>
          <SearchNormal1 size="24" color="#ffffff" variant="Outline" />
        </div>
      </div>

      {showSearch && (
        <div className="search-overlay">
          <div className="search-container">
            <button
              className="close-search"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
            >
              &times;
            </button>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-button">
                <SearchNormal1 size="24" color="#ffffff" />
              </button>
            </form>

            {isSearching ? (
              <div className="search-loading">Searching...</div>
            ) : (
              searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="search-result-item"
                      onClick={() => handleMovieSelect(movie.id)}
                    >
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          className="search-result-poster"
                        />
                      ) : (
                        <div className="search-result-poster placeholder">
                          No Image
                        </div>
                      )}
                      <div className="search-result-info">
                        <h4>{movie.title}</h4>
                        {movie.release_date && (
                          <p>{new Date(movie.release_date).getFullYear()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MenuBar;