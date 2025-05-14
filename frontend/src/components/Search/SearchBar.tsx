import React, { useState } from 'react';
import {
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import {Search as SearchIcon,Clear as ClearIcon} from '@mui/icons-material';


interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
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

  const handleClear = () => {
    setInput('');
    onSearch('');
  };

  const handleSearch = () => {
    onSearch(input.trim());
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          placeholder="Search nodes or relationships..."
          variant="outlined"
          fullWidth
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: input && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSearch}
          sx={{ minWidth: 40 }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default SearchBar;
