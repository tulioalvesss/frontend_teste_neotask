import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '~/components/Login';
import Register from '../components/Register';
import { isAuthenticated } from '~/services/authService';
import { useAuth } from '~/contexts/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

interface LocationState {
  returnTo?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const returnPath = state?.returnTo || '/';
  const { isHydrated, isLoggedIn, refreshAuthState } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    // Só verifica autenticação e redireciona após a hidratação
    if (!isHydrated) return;
    
    // Atualiza o estado global de autenticação
    refreshAuthState();
    
    // Se o usuário já estiver autenticado, redireciona para a página anterior ou inicial
    if (isLoggedIn) {
      navigate(returnPath);
    }
  }, [navigate, returnPath, isHydrated, refreshAuthState, isLoggedIn]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Função para lidar com o fechamento do login (após autenticação bem-sucedida)
  const handleAuthSuccess = () => {
    // Verifica novamente o estado de autenticação
    refreshAuthState();
    
    // Redireciona para a página anterior ou inicial após o login
    if (isAuthenticated()) {
      navigate(returnPath);
    } else {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          position: 'relative',
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.secondary.main, 0.8)})`,
            zIndex: -1,
            borderRadius: 2,
            opacity: 0.1
          }}
        />
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center" 
          color="white"
          sx={{ 
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
            mb: 1
          }}
        >
          Acesse sua conta
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ mb: 4 }} 
          align="center" 
          color="white"
        >
          Entre com suas credenciais ou crie uma conta
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 0, 
            width: '100%', 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
        >
          <Box>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              aria-label="login tabs"
              sx={{
                '& .MuiTab-root': {
                  py: 2,
                  fontSize: '1rem'
                }
              }}
            >
              <Tab 
                icon={<LockOutlinedIcon />} 
                iconPosition="start"
                label="Login" 
                id="auth-tab-0" 
                aria-controls="auth-tabpanel-0" 
              />
              <Tab 
                icon={<PersonAddOutlinedIcon />} 
                iconPosition="start"
                label="Registrar-se" 
                id="auth-tab-1" 
                aria-controls="auth-tabpanel-1" 
              />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Login onClose={handleAuthSuccess} isInPage={true} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Register onRegisterSuccess={() => {
              // Após registro bem-sucedido, muda para a tab de login
              setTabValue(0);
            }} />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
} 