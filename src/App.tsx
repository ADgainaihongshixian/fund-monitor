import { useEffect, useState } from 'react';
import './App.css';
import FundList from '@/components/FundList/FundList';
import AddFund from '@/components/AddFund/AddFund';
import Chart from '@/components/Chart/Chart';
import { useFundData } from '@/hooks/useFundData';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { FundData } from '@/types';
import useFundStore from '@/stores/fundStore';
import {
  AccountBalance,
  Refresh,
  Add,
  Settings,
  Schedule,
  ErrorOutline,
  Close,
  Info
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Modal,
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Switch,
  Badge,
  CircularProgress
} from '@mui/material';

function App() {
  const { funds, isLoading, lastUpdate, error, refreshFunds, removeFund, addFund, searchFunds } = useFundData();
  const { isAutoRefreshEnabled } = useAutoRefresh();
  const { autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval } = useFundStore();
  const [isAddFundOpen, setIsAddFundOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 初始加载时添加默认基金
  useEffect(() => {
    if (funds.length === 0) {
      // 这里可以添加一些默认基金，或者让用户手动添加
    }
  }, []);

  // 处理添加基金
  const handleAddFund = async (code: string) => {
    await addFund(code);
  };

  // 处理基金点击
  const handleFundClick = (fund: FundData) => {
    setSelectedFund(fund);
  };

  // 关闭详情模态框
  const handleCloseDetail = () => {
    setSelectedFund(null);
  };

  // 处理自动刷新切换
  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  // 处理刷新间隔变更
  const handleRefreshIntervalChange = (interval: number) => {
    setRefreshInterval(interval * 1000); // 转换为毫秒
  };

  return (
    <div className="App">
      {/* 导航栏 */}
      <AppBar position="sticky" color="default" elevation={2} sx={{ zIndex: 1400 }}>
        <Toolbar>
          <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, sm: 3, md: 4 } }}>
            <div className="flex items-center">
              <div className="flex bg-gradient-to-r from-primary to-primary-dark p-2 rounded-lg mr-3">
                <AccountBalance className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                基金实时估值监控
              </Typography>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <Button
                variant="contained"
                color="primary"
                onClick={refreshFunds}
                disabled={isLoading}
                sx={{
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  fontWeight: 500,
                  px: { xs: 2.5, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-white/20">
                    {isLoading ? (
                      <CircularProgress size={14} sx={{ color: 'white' }} />
                    ) : (
                      <Refresh className="h-3.5 w-3.5" />
                    )}
                  </div>
                  {isLoading ? '刷新中...' : '刷新'}
                </div>
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsAddFundOpen(true)}
                sx={{
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  fontWeight: 500,
                  px: { xs: 2.5, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-white/20">
                    <Add className="h-3.5 w-3.5" />
                  </div>
                  添加
                </div>
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsSettingsOpen(true)}
                sx={{
                  borderRadius: '0.75rem',
                  borderWidth: '1.5px',
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'text.primary',
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  fontWeight: 500,
                  px: { xs: 2.5, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    borderWidth: '1.5px',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-gray-100">
                    <Settings className="h-3.5 w-3.5 text-gray-600" />
                  </div>
                  设置
                </div>
              </Button>
            </div>
          </Container>
        </Toolbar>
      </AppBar>

      {/* 主内容区 */}
      <main className="container mx-auto px-3 sm:px-4 pt-24 sm:pt-28 pb-12 sm:pb-16">
        {/* 状态栏 */}
        <Card variant="outlined" sx={{ mb: { xs: 4, sm: 5 }, p: { xs: 2, sm: 2.5 }, borderRadius: '0.75rem', borderColor: 'divider' }}>
          <CardContent sx={{ p: 0 }}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isAutoRefreshEnabled ? 'bg-success' : 'bg-info'}`}></div>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>自动刷新: </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isAutoRefreshEnabled ? 'success.main' : 'info.main' }}>
                    {isAutoRefreshEnabled ? '开启' : '关闭'}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <Schedule className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-info" />
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    最后更新: {lastUpdate || '未更新'}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Typography variant="body2" sx={{ color: 'info.main' }}>基金数量: </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{funds.length}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 错误提示 */}
        {error && (
          <Alert
            severity="error"
            icon={<ErrorOutline className="h-4 sm:h-5 w-4 sm:w-5 text-danger mt-0.5 flex-shrink-0" />}
            sx={{ mb: { xs: 4, sm: 5 }, borderRadius: '0.75rem', animation: 'slideUp 0.3s ease-out' }}
          >
            <div>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'error.main', mb: 0.5 }}>操作失败</Typography>
              <Typography variant="body2" sx={{ color: 'error.main', opacity: 0.8 }}>{error}</Typography>
            </div>
          </Alert>
        )}

        {/* 基金列表 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.125rem' } }}>
              我的基金
            </Typography>
            {funds.length > 0 && (
              <Typography variant="body2" sx={{ color: 'info.main' }}>
                点击卡片查看详情
              </Typography>
            )}
          </div>
          <FundList
            funds={funds}
            onRemoveFund={removeFund}
            onFundClick={handleFundClick}
          />
        </div>
      </main>

      {/* 添加基金模态框 */}
      <AddFund
        isOpen={isAddFundOpen}
        onClose={() => setIsAddFundOpen(false)}
        onAddFund={handleAddFund}
        searchFunds={searchFunds}
      />

      {/* 基金详情模态框 */}
      <Modal
        open={!!selectedFund}
        onClose={handleCloseDetail}
        aria-labelledby="fund-detail-modal-title"
        aria-describedby="fund-detail-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: '1rem',
          boxShadow: 24,
          maxWidth: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div className="p-6 border-b border-divider flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <AccountBalance className="h-5 w-5 text-primary" />
              </div>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {selectedFund?.name} 详情
              </Typography>
              <Badge variant="standard" color="primary" sx={{ fontSize: '0.75rem', border: '1px solid', borderColor: 'primary.main', backgroundColor: 'background.paper', color: 'primary.main', '& .MuiBadge-badge': { border: '1px solid', borderColor: 'primary.main', backgroundColor: 'background.paper', color: 'primary.main' } }}>
                {selectedFund?.code}
              </Badge>
            </div>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseDetail}
              aria-label="close"
              sx={{ color: 'text.secondary' }}
            >
              <Close className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="p-6">
            {selectedFund && (
              <Chart fundCode={selectedFund.code} fundName={selectedFund.name} />
            )}
          </div>
        </Box>
      </Modal>

      {/* 设置模态框 */}
      <Modal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        aria-labelledby="settings-modal-title"
        aria-describedby="settings-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          borderRadius: '1rem',
          boxShadow: 24,
          maxWidth: { xs: '100%', sm: '90%', md: '600px' },
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div className="p-6 border-b border-divider flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-info/10 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-info" />
              </div>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                设置
              </Typography>
            </div>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setIsSettingsOpen(false)}
              aria-label="close"
              sx={{ color: 'text.secondary' }}
            >
              <Close className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
                    自动刷新
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    开启后，系统将自动刷新基金估值数据
                  </Typography>
                </div>
                <Switch
                  checked={autoRefresh}
                  onChange={handleAutoRefreshToggle}
                  color="primary"
                  size="small"
                />
              </div>
            </div>

            <div className="mb-6">
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary', mb: 2 }}>
                刷新间隔
              </Typography>
              <div className="flex flex-wrap items-center gap-3">
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
                      fontSize: '0.875rem'
                    }}
                  >
                    {seconds}秒
                  </Button>
                ))}
              </div>
              <Typography variant="body2" sx={{ color: 'info.main', mt: 1.5 }}>
                设置自动刷新的时间间隔
              </Typography>
            </div>

            <div className="pt-6 border-t border-divider">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-info" />
                <Typography variant="body2" sx={{ color: 'info.main' }}>
                  提示: 频繁刷新可能会导致API调用受限
                </Typography>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default App;