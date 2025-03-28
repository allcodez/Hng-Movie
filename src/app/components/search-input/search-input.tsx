import { useState } from 'react';
import { SearchNormal, CloseCircle } from 'iconsax-react';
import './search-input.css';

const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your search logic here
        console.log('Searching for:', searchQuery);
    };

    const toggleSearch = () => {
        setIsSearchActive(!isSearchActive);
    };

    return (
        <div className={`search-container ${isSearchActive ? 'active' : ''}`}>
            <form
                className="input-wrapper"
                onSubmit={handleSearchSubmit}
                role="search"
            >
                <input
                    type="search"
                    name="search"
                    aria-label="search"
                    placeholder="Search here..."
                    className="search-field"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchQuery(e.target.value)
                    }
                />

                <button
                    type="submit"
                    className="search-submit"
                    aria-label="submit search"
                >
                    <SearchNormal size="20" variant="Outline" />
                </button>

                <button
                    type="button"
                    className="search-close"
                    aria-label="close search"
                    onClick={toggleSearch}
                >
                    <CloseCircle size="20" variant="Outline" />
                </button>
            </form>
        </div>
    );
};

export default SearchInput;