"use client";
import { useRef, useEffect, useState } from "react";
import "./home.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

interface Genre {
  id: number;
  name: string;
}

const Photos = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);

  const sliderImagesRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const previewsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  const fetchGenres = async () => {
    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/genre/movie/list?language=en',
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`
          }
        }
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data.results.slice(0, 5));
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getGenreNames = (genreIds: number[]): string => {
    return genreIds
      .map(id => genres.find(g => g.id === id)?.name)
      .filter((name): name is string => !!name)
      .slice(0, 2)
      .join(', ');
  };

  const getReleaseYear = (dateString: string): string => {
    return dateString ? new Date(dateString).getFullYear().toString() : 'N/A';
  };

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteMovies");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Error parsing favorites", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movieId: number) => {
    setFavorites(prev =>
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  useGSAP(
    () => {
      if (movies.length === 0 || loading) return;

      gsap.registerPlugin(CustomEase);
      CustomEase.create(
        "hop2",
        "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
      );

      let currentImg = 1;
      const totalSlides = movies.length;
      let indicatorRotation = 0;

      function updateCounterAndTitlePosition() {
        if (!counterRef.current || !titlesRef.current) return;

        const counterY = -20 * (currentImg - 1);
        const titleY = -60 * (currentImg - 1);

        gsap.to(counterRef.current, {
          y: counterY,
          duration: 1,
          ease: "hop2",
        });

        gsap.to(titlesRef.current, {
          y: titleY,
          duration: 1,
          ease: "hop2",
        });
      }

      function updateActiveSlidePreview() {
        previewsRef.current.forEach(prev => prev?.classList.remove("active"));
        const activePreview = previewsRef.current[currentImg - 1];
        if (activePreview) activePreview.classList.add("active");
      }

      function animateSlide(direction: "left" | "right") {
        if (!sliderImagesRef.current || !indicatorsRef.current) return;

        const currentSlide = sliderImagesRef.current.lastElementChild;
        if (!currentSlide) return;

        const currentMovie = movies[currentImg - 1];
        const slideImg = document.createElement("div");
        slideImg.classList.add("img");

        const slideImgElem = document.createElement("img");
        slideImgElem.src = `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`;
        slideImgElem.alt = currentMovie.title;
        gsap.set(slideImgElem, { x: direction === "left" ? -500 : 500 });

        slideImg.appendChild(slideImgElem);
        sliderImagesRef.current.appendChild(slideImg);

        const tl = gsap.timeline();

        tl.to(currentSlide.querySelector("img"), {
          x: direction === "left" ? 500 : -500,
          duration: 1.5,
          ease: "hop2",
        })
          .fromTo(
            slideImg,
            {
              clipPath:
                direction === "left"
                  ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
                  : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 1.5,
              ease: "hop2",
            },
            0
          )
          .to(
            slideImgElem,
            {
              x: 0,
              duration: 1.5,
              ease: "hop2",
            },
            0
          )
          .call(() => cleanupSlides(), null, 1.5);

        indicatorRotation += direction === "left" ? -90 : 90;
        gsap.to(indicatorsRef.current.children, {
          rotate: indicatorRotation,
          duration: 1,
          ease: "hop2",
        });
      }

      function cleanupSlides() {
        if (!sliderImagesRef.current) return;

        const imgElements = sliderImagesRef.current.querySelectorAll<HTMLDivElement>(".img");
        if (imgElements.length > totalSlides) {
          gsap.to(imgElements[0], {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              imgElements[0].remove();
            },
          });
        }
      }

      function handleClick(event: MouseEvent) {
        if (!sliderRef.current || movies.length === 0) return;

        const sliderWidth = sliderRef.current.clientWidth;
        const clickPosition = event.clientX;

        const clickedPreview = (event.target as HTMLElement).closest(".preview");
        if (clickedPreview) {
          const clickedIndex = previewsRef.current.indexOf(clickedPreview as HTMLDivElement);
          if (clickedIndex !== -1 && clickedIndex + 1 !== currentImg) {
            currentImg = clickedIndex + 1;
            animateSlide(clickedIndex + 1 < currentImg ? "left" : "right");
            updateActiveSlidePreview();
            updateCounterAndTitlePosition();
            return;
          }
        }

        if (clickPosition < sliderWidth / 2 && currentImg !== 1) {
          currentImg--;
          animateSlide("left");
        } else if (clickPosition > sliderWidth / 2 && currentImg !== totalSlides) {
          currentImg++;
          animateSlide("right");
        }

        updateActiveSlidePreview();
        updateCounterAndTitlePosition();
      }

      if (sliderRef.current) {
        sliderRef.current.addEventListener("click", handleClick);
      }

      return () => {
        if (sliderRef.current) {
          sliderRef.current.removeEventListener("click", handleClick);
        }
      };
    },
    { scope: sliderRef, dependencies: [movies, loading] }
  );

  if (loading) {
    return (
      <div className="slider skeleton-loader">
        <div className="slider-images">
          <div className="img skeleton"></div>
        </div>
        <div className="slider-title">
          <div className="slider-title-wrapper">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="movie-info-group skeleton">
                <p className="movie-title skeleton-text"></p>
                <p className="movie-meta skeleton-text"></p>
                <p className="movie-about skeleton-text"></p>
              </div>
            ))}
          </div>
        </div>
        <div className="slider-counter">
          <div className="counter">
            {[...Array(5)].map((_, i) => (
              <p key={i} className="skeleton-text"></p>
            ))}
          </div>
          <div>
            <p className="skeleton-text">&mdash;</p>
          </div>
          <div>
            <p className="skeleton-text">5</p>
          </div>
        </div>
        <div className="slider-preview">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="preview skeleton"></div>
          ))}
        </div>
        <div className="slider-indicators">
          <p className="skeleton-text">+</p>
          <p className="skeleton-text">+</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slider error-state">
        <div className="error-message">
          <p>Error loading movies: {error}</p>
          <button onClick={fetchMovies} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="slider empty-state">
        <p>No movies found</p>
        <button onClick={fetchMovies} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="slider" ref={sliderRef}>
      <div className="slider-images" ref={sliderImagesRef}>
        <div className="img">
          <img
            src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`}
            alt={movies[0].title}
            className="filter"
          />
          <div className="movie-info">
            <h3>{movies[0].title}</h3>
            <div className="movie-meta">
              <span className="rating">★ {movies[0].vote_average.toFixed(1)}</span>
              <span>{getReleaseYear(movies[0].release_date)} • {getGenreNames(movies[0].genre_ids)}</span>
            </div>
            <p className="overview">{movies[0].overview}</p>
            <button
              onClick={() => toggleFavorite(movies[0].id)}
              className={`bookmark-btn ${favorites.includes(movies[0].id) ? 'bookmarked' : ''}`}
            >
              {favorites.includes(movies[0].id) ? 'Bookmarked ★' : 'Bookmark ☆'}
            </button>
          </div>
        </div>
      </div>

      <div className="slider-title">
        <div className="slider-title-wrapper" ref={titlesRef}>
          {movies.map(movie => (
            <div key={movie.id} className="movie-info-group">
              <p className="movie-title">{movie.title}</p>
              {/* <p className="movie-meta">
                {getReleaseYear(movie.release_date)} • {getGenreNames(movie.genre_ids)}
              </p>
              <p className="movie-about">{movie.overview}</p> */}
            </div>
          ))}
        </div>
      </div>

      <div className="slider-counter">
        <div className="counter" ref={counterRef}>
          {movies.map((_, index) => (
            <p key={index}>{index + 1}</p>
          ))}
        </div>
        <div>
          <p>&mdash;</p>
        </div>
        <div>
          <p>{movies.length}</p>
        </div>
      </div>

      <div className="slider-preview">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`preview ${index === 0 ? "active" : ""}`}
            ref={el => {
              if (el) previewsRef.current[index] = el;
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={`${movie.title} poster`}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(movie.id);
              }}
              className={`bookmark-btn small ${favorites.includes(movie.id) ? 'bookmarked' : ''}`}
            >
              {favorites.includes(movie.id) ? '★' : '☆'}
            </button>
          </div>
        ))}
      </div>

      <div className="slider-indicators" ref={indicatorsRef}>
        <p>+</p>
        <p>+</p>
      </div>
    </div>
  );
};

export default Photos;

