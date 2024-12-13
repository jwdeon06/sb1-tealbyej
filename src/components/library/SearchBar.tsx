import type { FC } from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search library..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}

export default SearchBar;