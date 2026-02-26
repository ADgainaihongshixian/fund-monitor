import { useState } from 'react';
import PreciousMetalList from '@/components/precious-metal-list';
import Navbar from '@/components/navbar';
import { usePreciousMetalData } from '@/hooks/usePreciousMetalData';
import { usePreciousMetalAutoRefresh } from '@/hooks/usePreciousMetalAutoRefresh';
import usePreciousMetalStore from '@/stores/preciousMetalStore';
import { GOLD_COLOR } from '@/constant/enum';
import SecondaryCard from '@/components/common/secondary-card';
import ErrorAlert from '@/components/common/error-alert';
import SettingDialog from '@/components/common/setting-dialog';
import BodyCom from '@/components/common/body-com';
import {
  Refresh,
  Settings,
} from '@mui/icons-material';
import {
  Button,
  Container,
  Box,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';

const PreciousMetalPage = () => {
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
    <BodyCom
      otherChildren={
        <SettingDialog
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          autoRefresh={autoRefresh}
          handleAutoRefreshToggle={handleAutoRefreshToggle}
          refreshInterval={refreshInterval}
          handleRefreshIntervalChange={handleRefreshIntervalChange}
        />
      }
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 0, md: 0 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 2, flexWrap: 'wrap' }}>
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
                px: 2,
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
                px: 2,
                py: 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: GOLD_COLOR,
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

        <SecondaryCard isAutoRefreshEnabled={isAutoRefreshEnabled} lastUpdate={lastUpdate} length={metals.length} />
        <ErrorAlert error={error} />

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
    </BodyCom>
  );
};

export default PreciousMetalPage;