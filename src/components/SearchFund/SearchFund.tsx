import React, { useState, useEffect, useCallback } from 'react';
import { FundSearchResult } from '@/types';
import { Search } from '@mui/icons-material';
import {
  TextField,
  CircularProgress,
  Button,
  Badge,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box
} from '@mui/material';

interface SearchFundProps {
  onSearch: (keyword: string) => Promise<FundSearchResult[]>;
  onSelect: (fund: FundSearchResult) => void;
  isLoading?: boolean;
}

const SearchFund: React.FC<SearchFundProps> = ({ onSearch, onSelect }) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<FundSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // 防抖搜索
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (keyword.trim()) {
        setSearchLoading(true);
        const searchResults = await onSearch(keyword);
        setResults(searchResults);
        setShowResults(true);
        setSearchLoading(false);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [keyword, onSearch]);

  // 处理选择基金
  const handleSelect = useCallback((fund: FundSearchResult) => {
    onSelect(fund);
    setKeyword('');
    setResults([]);
    setShowResults(false);
  }, [onSelect]);

  // 处理点击外部关闭结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container w-full relative">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="输入基金代码或名称搜索"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => keyword.trim() && setShowResults(true)}
        sx={{
          borderRadius: '0.75rem',
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 0.2rem rgba(22, 93, 255, 0.2)',
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '1rem',
            padding: '0.75rem 0',
          },
        }}
        InputProps={{
          endAdornment: searchLoading && (
            <CircularProgress size={20} color="primary" sx={{ ml: 1 }} />
          ),
        }}
      />

      {showResults && results.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            mt: 1,
            borderRadius: '0.75rem',
            maxHeight: '300px',
            overflow: 'auto',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <List sx={{ p: 0 }}>
            {results.map((fund, index) => (
              <ListItem
                key={fund.code}
                component="div"
                sx={{
                  px: 2.5,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  animationDelay: `${index * 0.05}s`
                }}
                onClick={() => handleSelect(fund)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {fund.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Badge variant="standard" color="info" sx={{ fontSize: '0.75rem', border: '1px solid', borderColor: 'info.main', backgroundColor: 'background.paper', color: 'info.main', '& .MuiBadge-badge': { border: '1px solid', borderColor: 'info.main', backgroundColor: 'background.paper', color: 'info.main' } }}>
                            {fund.code}
                          </Badge>
                          <Typography variant="caption" sx={{ color: 'info.main' }}>
                            {fund.type}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(fund);
                        }}
                        sx={{
                          ml: 2,
                          textTransform: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          height: '32px'
                        }}
                      >
                        添加
                      </Button>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {showResults && results.length === 0 && !searchLoading && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            mt: 1,
            borderRadius: '0.75rem',
            p: 3,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search className="h-6 w-6 text-info" />
            </Box>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'info.main', mb: 0.5 }}>
            未找到相关基金
          </Typography>
          <Typography variant="caption" sx={{ color: 'info.main' }}>
            请尝试其他关键词或检查基金代码是否正确
          </Typography>
        </Paper>
      )}
    </div>
  );
};

export default SearchFund;