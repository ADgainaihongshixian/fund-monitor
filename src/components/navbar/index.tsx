import { useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GOLD_COLOR } from '@constant/enum';
import { useResizeObserver } from '@hooks/useResizeObserver';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalance,
  Diamond,
  Close as CloseIcon,
  AccountBalanceWallet
} from '@mui/icons-material';


interface NavbarProps {
  setNavbarHeight: (height: number) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  isPreciousMetal?: boolean;
}

const navItems: NavItem[] = [
  { label: '基金', path: '/', icon: <AccountBalance /> },
  { label: '贵金属', path: '/precious-metal', icon: <Diamond />, isPreciousMetal: true },
];

const Navbar = (props: NavbarProps) => {
  const { setNavbarHeight } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const [targetRef, size] = useResizeObserver();

  useLayoutEffect(() => {
    setNavbarHeight(size?.height || 64);
  }, [size?.height]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/fund';
    }
    return location.pathname === path;
  };

  const getItemColor = (item: NavItem, active: boolean) => {
    if (active && item.isPreciousMetal) {
      return GOLD_COLOR;
    }
    return active ? 'primary.main' : 'text.secondary';
  };

  const getTextColor = (item: NavItem, active: boolean) => {
    if (active && item.isPreciousMetal) {
      return GOLD_COLOR;
    }
    return active ? 'primary.main' : 'text.primary';
  };

  const getBgColor = (item: NavItem, active: boolean) => {
    if (active && item.isPreciousMetal) {
      return alpha(GOLD_COLOR, 0.1);
    }
    return active ? alpha(theme.palette.primary.main, 0.1) : 'transparent';
  };

  const getHoverBgColor = (item: NavItem, active: boolean) => {
    if (active && item.isPreciousMetal) {
      return alpha(GOLD_COLOR, 0.15);
    }
    return active ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.grey[500], 0.12);
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            }}
          >
            <AccountBalance sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            金融监控
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1, pt: 2 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1.5,
                  my: 0.5,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  ...(active && {
                    backgroundColor: getBgColor(item, true),
                    '&:hover': {
                      backgroundColor: getHoverBgColor(item, true),
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: getItemColor(item, active),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                    color: getTextColor(item, active),
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          © 2026 金融监控系统
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
        }}
        ref={targetRef}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: 2,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              }}
            >
              <AccountBalanceWallet sx={{ color: 'white', fontSize: { xs: 18, sm: 20 } }} />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                letterSpacing: '-0.02em',
              }}
            >
              金融监控
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: alpha(theme.palette.grey[500], 0.08),
                borderRadius: 3,
                p: 0.5,
              }}
            >
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    startIcon={
                      <Box sx={{ color: getItemColor(item, active) }}>
                        {item.icon}
                      </Box>
                    }
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: 2.5,
                      textTransform: 'none',
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.9375rem',
                      color: getTextColor(item, active),
                      backgroundColor: active ? 'white' : 'transparent',
                      boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: active ? 'white' : alpha(theme.palette.grey[500], 0.12),
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {isMobile && (
            <IconButton
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                color: 'text.primary',
                backgroundColor: alpha(theme.palette.grey[500], 0.08),
                borderRadius: 2,
                p: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.grey[500], 0.15),
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            borderRadius: '16px 0 0 16px',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
