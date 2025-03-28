"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import './navbar.css';
import {
    Facebook,
    ShoppingCart,
    SearchNormal,
    Menu,
    CloseSquare
} from 'iconsax-react';

const Navbar = () => {
    const [isNavActive, setIsNavActive] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isHeaderActive, setIsHeaderActive] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setIsHeaderActive(window.scrollY >= 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleNav = () => {
        setIsNavActive(!isNavActive);
    };

    const closeNav = () => {
        setIsNavActive(false);
    };

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive);
    };

    // Social media icons mapping
    const socialIcons = [
        { Component: Facebook, name: 'Facebook' },
    ];

    return (
        <>
            <header className="header">
                <div className={`header-bottom skewBg ${isHeaderActive ? 'active' : ''}`} data-header>
                    <div className="container">
                        <a href="#" className="logo">Gamics</a>

                        <nav className={`navbar ${isNavActive ? 'active' : ''}`} data-navbar>
                            <ul className="navbar-list">
                                {[
                                    { id: 'home', text: 'Home' },
                                    { id: 'live', text: 'Live' },
                                    { id: 'features', text: 'Features' },
                                    { id: 'shop', text: 'Shop' },
                                    { id: 'blog', text: 'Blog' },
                                    { id: 'contact', text: 'Contact' }
                                ].map((item) => (
                                    <li className="navbar-item" key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            className="navbar-link skewBg"
                                            data-nav-link
                                            onClick={closeNav}
                                        >
                                            {item.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="header-actions">
                            <button className="cart-btn" aria-label="cart">
                                <ShoppingCart size={24} variant="Outline" />
                                <span className="cart-badge">{cartCount}</span>
                            </button>

                            <button
                                className="search-btn"
                                aria-label="open search"
                                onClick={toggleSearch}
                            >
                                <SearchNormal size={24} variant="Outline" />
                            </button>

                            <button
                                className="nav-toggle-btn"
                                aria-label="toggle menu"
                                onClick={toggleNav}
                            >
                                {isNavActive ? (
                                    <CloseSquare size={24} variant="Outline" className="close" />
                                ) : (
                                    <Menu size={24} variant="Outline" className="menu" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

        </>
    );
};

export default Navbar;