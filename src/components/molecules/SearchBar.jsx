import { useState } from 'react';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search campaigns...", 
  onSearch, 
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        icon={<ApperIcon name="Search" size={20} />}
        className="pr-10"
      />
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm('');
            if (onSearch) onSearch('');
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;