import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tab, 
  Tabs, 
  CircularProgress, 
  Alert,
  Button
} from '@mui/material';
import { Navigate } from 'react-router';
import PendingSuggestionsList from '~/components/PendingSuggestionsList';
import ApprovedSongsList from '~/components/ApprovedSongsList';
import AddSongModal from '~/components/AddSongModal';
import { isAdmin } from '~/services/authService';
import { useAuth } from '~/contexts/AuthContext';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

export default function AdminPage() {
  const [tabValue, setTabValue] = useState(0);
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { isHydrated } = useAuth();
  
  useEffect(() => {
    // Só verifica se é admin após a hidratação
    if (!isHydrated) return;
    
    // Verificar se o usuário é administrador
    const checkAdmin = () => {
      setIsAdminUser(isAdmin());
      setLoading(false);
    };
    
    checkAdmin();
  }, [isHydrated]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Redirecionar se não for administrador
  if (isAdminUser === false) {
    return <Navigate to="/" />;
  }
  
  return (
    <Box sx={{ bgcolor: '#f5f5f5', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2,
            borderRadius: 2,
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            >
              Painel do Administrador
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setModalOpen(true)}
            >
              Adicionar Música
            </Button>
          </Box>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
              <Tab label="Sugestões Pendentes" />
              <Tab label="Músicas Aprovadas" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <PendingSuggestionsList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ApprovedSongsList />
          </TabPanel>
        </Paper>
      </Container>
      
      <AddSongModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          // Aqui você pode adicionar lógica para atualizar a lista de músicas
          setModalOpen(false);
        }}
      />
    </Box>
  );
} 