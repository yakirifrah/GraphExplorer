import React, { useState } from 'react';
import {TextField} from '@mui/material';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                               onSearch,
                                             }) => {
  const [input, setInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(input.trim());
    }
  };


  return (
      <TextField
        placeholder="Search nodes or relationships, press enter to apply"
        variant="outlined"
        fullWidth
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        size="small"
        sx={{ marginBottom: 2 }}
      />

  );
};

export default SearchBar;
