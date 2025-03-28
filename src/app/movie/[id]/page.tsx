"use client";
import React, { useEffect, useRef, useState } from "react";
import "./moviedetails.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Bookmark, Star } from "iconsax-react";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }[];
  };
}

const MovieDetailsPage = ({ params }: { params: { id: string } }) => {
  const container = useRef<HTMLDivElement>(null);
  const aboutCopyRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}?append_to_response=credits&language=en-US`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();
        setMovie(data);

        // Check if movie is bookmarked
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedMovies') || '[]');
        setIsBookmarked(bookmarks.includes(data.id));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.id]);


  const toggleBookmark = () => {
    if (!movie) return;

    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedMovies') || '[]');
    let updatedBookmarks;

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((id: number) => id !== movie.id);
    } else {
      updatedBookmarks = [...bookmarks, movie.id];
    }

    localStorage.setItem('bookmarkedMovies', JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <h2>Movie not found</h2>
      </div>
    );
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const director = movie.credits.crew.find(person => person.job === 'Director');
  const topCast = movie.credits.cast.slice(0, 5);

  return (
      <div className="movie-page" ref={container}>

        <div className="container">
          <div className="movie-intro">
            <div className="col movie-portrait-img">
              <div className="movie-portrait">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <button
                  className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
                  onClick={toggleBookmark}
                >
                  <Bookmark variant={isBookmarked ? 'Bold' : 'Outline'} />
                  {isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                </button>
              </div>
            </div>
            <div className="col movie-copy-wrapper">
              <div className="movie-copy-title">
                <h1>{movie.title}</h1>
              </div>

              <div className="movie-meta">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span>•</span>
                <span className="rating">
                  <Star variant="Bold" size={16} />
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>

              <div className="movie-genres">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="movie-copy" ref={aboutCopyRef}>
                <h3>Overview</h3>
                <p>{movie.overview}</p>

                {director && (
                  <>
                    <h3>Director</h3>
                    <p>{director.name}</p>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MovieDetailsPage;