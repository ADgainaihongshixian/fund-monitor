import React, { useState } from 'react';
import PreciousMetalList from '@/components/precious-metal-list';
import Navbar from '@/components/navbar';
import { usePreciousMetalData } from '@/hooks/usePreciousMetalData';
import { usePreciousMetalAutoRefresh } from '@/hooks/usePreciousMetalAutoRefresh';
import usePreciousMetalStore from '@/stores/preciousMetalStore';
import {
  Refresh,
  Settings,
  Schedule,
  ErrorOutline,
  Close,
  Info,
} from '@mui/icons-material';
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Switch,
  CircularProgress,
  Stack,
  IconButton,
} from '@mui/material';

const PreciousMetalPage: React.FC = () => {
  const { metals, isLoading, lastUpdate, error, refreshMetals } = usePreciousMetalData();
  const { isAutoRefreshEnabled } = usePreciousMetalAutoRefresh();
  const { autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval } = usePreciousMetalStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleRefreshIntervalChange = (interval: number) => {
    setRefreshInterval(interval * 1000);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <main>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 4, flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={refreshMetals}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : <Refresh />}
                sx={{
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                  textTransform: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                {isLoading ? '刷新中...' : '刷新'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsSettingsOpen(true)}
                startIcon={<Settings />}
                sx={{
                  borderRadius: '0.75rem',
                  borderWidth: '1.5px',
                  borderColor: 'divider',
                  color: 'text.primary',
                  textTransform: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(245, 158, 11, 0.04)',
                    borderWidth: '1.5px',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                设置
              </Button>
            </Stack>
          </Stack>

          <Card variant="outlined" sx={{ mb: 4, borderRadius: '0.75rem', borderColor: 'divider' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: isAutoRefreshEnabled ? 'success.main' : 'text.secondary',
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      自动刷新:{' '}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: isAutoRefreshEnabled ? 'success.main' : 'text.secondary' }}
                    >
                      {isAutoRefreshEnabled ? '开启' : '关闭'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      最后更新: {lastUpdate || '未更新'}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    品种数量:{' '}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {metals.length}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {error && (
            <Alert
              severity="error"
              icon={<ErrorOutline sx={{ fontSize: 20, color: 'error.main', mt: 0.5 }} />}
              sx={{ mb: 4, borderRadius: '0.75rem', animation: 'slideUp 0.3s ease-out' }}
            >
              <Stack spacing={0.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'error.main' }}>
                  操作失败
                </Typography>
                <Typography variant="body2" sx={{ color: 'error.main', opacity: 0.8 }}>
                  {error}
                </Typography>
              </Stack>
            </Alert>
          )}

          <Box sx={{ mb: 8 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                贵金属行情
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                数据来源：新浪财经
              </Typography>
            </Stack>
            <PreciousMetalList metals={metals} />
          </Box>
        </Container>
      </main>

      <Dialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        aria-labelledby="settings-dialog-title"
        aria-describedby="settings-dialog-description"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '1rem',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle id="settings-dialog-title" sx={{ p: 3, pb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  bgcolor: 'warning.light',
                  p: 1.5,
                  borderRadius: 2,
                }}
              >
                <Settings sx={{ fontSize: 20, color: 'warning.main' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                设置
              </Typography>
            </Stack>
            <IconButton
              edge="end"
              onClick={() => setIsSettingsOpen(false)}
              aria-label="close"
              sx={{ color: 'text.secondary' }}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent id="settings-dialog-description" sx={{ p: 3 }}>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                自动刷新
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                开启后，系统将自动刷新贵金属行情数据
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Switch
                  checked={autoRefresh}
                  onChange={handleAutoRefreshToggle}
                  color="primary"
                  size="small"
                />
              </Box>
            </Stack>

            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                刷新间隔
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                {[30, 60, 120, 300].map((seconds) => (
                  <Button
                    key={seconds}
                    variant={refreshInterval === seconds * 1000 ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleRefreshIntervalChange(seconds)}
                    disabled={!autoRefresh}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {seconds}秒
                  </Button>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
                设置自动刷新的时间间隔
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
            <Info sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              提示: 频繁刷新可能会导致API调用受限
            </Typography>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PreciousMetalPage;
