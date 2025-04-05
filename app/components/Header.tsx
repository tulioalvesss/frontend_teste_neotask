import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container, 
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isUserAdmin, refreshAuthState } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const redirectToLogin = () => {
    navigate('/login');
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    refreshAuthState();
    navigate('/');
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    <MenuItem key="home" component={Link} to="/" onClick={handleMenuClose}>
      Início
    </MenuItem>,
    isUserAdmin && (
      <MenuItem 
        key="admin"
        component={Link} 
        to="/admin" 
        onClick={handleMenuClose}
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <AdminPanelSettingsIcon fontSize="small" />
        Admin
      </MenuItem>
    ),
    isLoggedIn ? (
      <MenuItem key="logout" onClick={handleLogout}>Sair</MenuItem>
    ) : (
      <MenuItem key="login" onClick={redirectToLogin}>Logar</MenuItem>
    )
  ].filter(Boolean);

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: isMobile ? 1 : 0 }}>
            <MusicNoteIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                mr: 2, 
                fontWeight: 700,
                letterSpacing: '0.1rem',
                fontSize: { xs: '1.2rem', md: '1.4rem' }
              }}
            >
              MODA DE VIOLA
            </Typography>
          </Box>
          
          {!isMobile ? (
            <Box sx={{ display: 'flex', ml: 'auto' }}>
              <Button color="inherit" component={Link} to="/" sx={{ mx: 1 }}>Início</Button>
              {isUserAdmin && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin" 
                  sx={{ mx: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <AdminPanelSettingsIcon fontSize="small" />
                  Admin
                </Button>
              )}
              {isLoggedIn ? (
                <Button color="inherit" sx={{ mx: 1 }} onClick={handleLogout}>Sair</Button>
              ) : (
                <Button color="inherit" sx={{ mx: 1 }} onClick={redirectToLogin}>Logar</Button>
              )}
            </Box>
          ) : (
            <>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ ml: 'auto' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    width: '200px',
                    mt: 1
                  }
                }}
              >
                {menuItems}
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;