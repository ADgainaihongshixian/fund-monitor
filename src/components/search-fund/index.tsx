import { useState, useEffect, useCallback, useRef } from 'react';
import { FundSearchResult, SearchFundProps } from '@/types/fund';
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

/**
 * 基金搜索组件
 * 提供基金搜索功能，展示搜索结果并支持选择基金
 */
const SearchFund = ({ onSearch, onSelect, totalFunds }: SearchFundProps) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<FundSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const onSearchRef = useRef(onSearch);
  const searchRequestIdRef = useRef(0);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    const isCurrentRequest = () => requestId === searchRequestIdRef.current;

    const timer = setTimeout(() => {
      setSearchLoading(true);
      onSearchRef.current(keyword)
        .then(data => isCurrentRequest() && (setResults(data), setShowResults(true)))
        .catch(() => isCurrentRequest() && (setResults([]), setShowResults(false)))
        .finally(() => isCurrentRequest() && setSearchLoading(false));
    }, 150);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSelect = useCallback((fund: FundSearchResult) => {
    onSelect(fund);
    setKeyword('');
    setResults([]);
    setShowResults(false);
  }, [onSelect]);

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

  const highlightText = (text: string, keyword: string) => {
    if (!keyword.trim()) return text;
    const regex = new RegExp(`(${keyword.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ?
        <Box key={index} component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{part}</Box>
        :
        part
    );
  };

  return (
    <Box className="search-container" sx={{ width: '100%', position: 'relative' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={totalFunds ? `在 ${totalFunds.toLocaleString()} 只基金中搜索...` : "输入基金代码或名称搜索"}
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
          autoComplete: 'off',
        }}
      />

      {showResults && !!results.length && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            mt: 2,
            borderRadius: '0.75rem',
            maxHeight: '300px',
            overflowY: 'auto',
            overflowX: 'hidden',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <Box sx={{ px: 2.5, py: 1, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              找到 {results.length} 只相关基金
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {results.slice(0, 50).map((fund, index) => (
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
                  animationDelay: `${index * 0.02}s`
                }}
                onClick={() => handleSelect(fund)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {highlightText(fund.name, keyword)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Badge variant="standard" color="info" sx={{ fontSize: '0.75rem', border: '1px solid', borderColor: 'info.main', backgroundColor: 'background.paper', color: 'info.main', borderRadius: 1, height: '16px', lineHeight: '16px', px: 0.5, '& .MuiBadge-badge': { border: '1px solid', borderColor: 'info.main', backgroundColor: 'background.paper', color: 'info.main' } }}>
                            {fund.code}
                          </Badge>
                          <Typography variant="caption" sx={{ color: 'info.main', lineHeight: '16px' }}>
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
            {results.length > 50 && (
              <Box sx={{ px: 2.5, py: 1.5, textAlign: 'center', bgcolor: 'action.hover' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  还有 {results.length - 50} 只基金未显示，请输入更精确的关键词
                </Typography>
              </Box>
            )}
          </List>
        </Paper>
      )}

      {showResults && !results.length && !searchLoading && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            mt: 2,
            borderRadius: '0.75rem',
            p: 3,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search sx={{ width: 24, height: 24, color: 'info.main' }} />
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
    </Box>
  );
};

export default SearchFund;