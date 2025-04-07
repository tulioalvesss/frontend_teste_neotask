import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Chip, 
  IconButton, 
  Tooltip, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link, useNavigate } from 'react-router-dom';
import { getPendingSuggestions, approveSuggestion, rejectSuggestion } from '~/services/SuggestionService';
import { isAuthenticated } from '~/services/authService';
import { useAuth } from '~/contexts/AuthContext';
import LoginModal from './LoginModal';

interface SuggestionSong {
  id: number;
  image?: string;
  title?: string;
  link?: string;
  viewCount?: string;
  status?: string;
  createdAt?: string;
  created_at?: string; // Formato alternativo
  name?: string; // Nome alternativo para título
  youtubeLink?: string; // Nome alternativo para link
  [key: string]: any; // Para aceitar propriedades adicionais
}

interface PendingSuggestionsListProps {
  useModal?: boolean;
}

export default function PendingSuggestionsList({ useModal = true }: PendingSuggestionsListProps) {
  const [pendingSuggestions, setPendingSuggestions] = useState<SuggestionSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, checkAuthStatus, isHydrated } = useAuth();

  useEffect(() => {
    // Só verifica autenticação depois da hidratação
    if (!isHydrated) return;

    const authStatus = checkAuthStatus();
    if (!authStatus) {
      if (useModal) {
        setLoginModalOpen(true);
      } else {
        // Redirecionar para a página de login
        navigate('/login', { state: { returnTo: window.location.pathname } });
      }
    } else {
      fetchPendingSuggestions();
    }
  }, [navigate, useModal, checkAuthStatus, isHydrated]);

  const handleLoginClose = () => {
    setLoginModalOpen(false);
    if (isAuthenticated()) {
      fetchPendingSuggestions();
    }
  };

  const fetchPendingSuggestions = async () => {
    try {
      setLoading(true);
      const data = await getPendingSuggestions();      
      // Verificar se os dados têm o formato esperado
      if (Array.isArray(data)) {
        setPendingSuggestions(data);
      } else if (data && typeof data === 'object') {
        // Se for um objeto, pode ter uma propriedade que contém o array
        const possibleArrayProperties = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (possibleArrayProperties.length > 0) {
          const arrayProperty = possibleArrayProperties[0];
          setPendingSuggestions(data[arrayProperty]);
        } else {
          setPendingSuggestions([]);
          setError('Formato de dados inválido recebido do servidor');
        }
      } else {
        console.error('Formato de dados inválido:', data);
        setPendingSuggestions([]);
        setError('Formato de dados inválido recebido do servidor');
      }
    } catch (err) {
      setError('Erro ao carregar sugestões pendentes');
      console.error('Erro ao buscar sugestões:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveSuggestion(id);
      setSuccessMessage('Sugestão aprovada com sucesso!');
      fetchPendingSuggestions();
    } catch (err) {
      setError('Erro ao aprovar sugestão');
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectSuggestion(id);
      setSuccessMessage('Sugestão rejeitada com sucesso!');
      fetchPendingSuggestions();
    } catch (err) {
      setError('Erro ao rejeitar sugestão');
      console.error(err);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    try {
      if (!dateString) return 'Data indisponível';
      
      // Verifica se a string da data é válida
      const timestamp = Date.parse(dateString);
      if (isNaN(timestamp)) {
        return 'Data inválida';
      }
      
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Erro na data';
    }
  };

  const openYoutubeLink = (link: string | undefined): void => {
    if (!link) return;
    window.open(link, '_blank');
  };

  // Função auxiliar para adaptar o formato dos dados, independente da estrutura recebida
  const normalizeData = (suggestion: SuggestionSong) => {
    return {
      id: suggestion.id,
      title: suggestion.title || suggestion.name || '',
      image: suggestion.image || '',
      viewCount: suggestion.viewCount || '',
      link: suggestion.link || suggestion.youtubeLink || '',
      status: suggestion.status || '',
      createdAt: suggestion.createdAt || suggestion.created_at || '',
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Sugestões de Músicas Aguardando Aprovação
      </Typography>

      {!isLoggedIn && !loading && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              component={Link} 
              to="/login"
            >
              Fazer Login
            </Button>
          }
        >
          Você precisa estar autenticado para gerenciar sugestões.
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        Total de registros recebidos: {pendingSuggestions.length}
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {pendingSuggestions.length === 0 ? (
        <Alert severity="info">Não há sugestões pendentes no momento.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell>Título</TableCell>
                <TableCell>Imagem</TableCell>
                <TableCell>Visualizações</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Data</TableCell>
                <TableCell align="center">Link</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingSuggestions.map((suggestion) => {
                const normalizedSuggestion = normalizeData(suggestion);
                const isPending = normalizedSuggestion.status === 'pending';
                return (
                  <TableRow 
                    key={normalizedSuggestion.id} 
                    hover
                    sx={{ 
                      opacity: isPending ? 1 : 0.6,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                     <TableCell>
                      <img src={normalizedSuggestion.image} alt={normalizedSuggestion.title} style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
                    </TableCell>
                    <TableCell>{normalizedSuggestion.title || 'Sem título'}</TableCell>
                    <TableCell>{normalizedSuggestion.viewCount || 'Sem visualizações'}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={normalizedSuggestion.status === 'pending' ? 'Pendente' :
                               normalizedSuggestion.status === 'approved' ? 'Aprovado' :
                               normalizedSuggestion.status === 'rejected' ? 'Rejeitado' :
                               normalizedSuggestion.status} 
                        color={normalizedSuggestion.status === 'pending' ? 'warning' : 
                               normalizedSuggestion.status === 'approved' ? 'success' : 
                               normalizedSuggestion.status === 'rejected' ? 'error' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">{formatDate(normalizedSuggestion.createdAt)}</TableCell>
                    <TableCell align="center">
                      {normalizedSuggestion.link ? (
                        <Tooltip title="Abrir no YouTube">
                          <IconButton 
                            color="error" 
                            onClick={() => openYoutubeLink(normalizedSuggestion.link)}
                          >
                            <YouTubeIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        'Sem link'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {normalizedSuggestion.status === 'pending' ? (
                          <>
                            <Tooltip title="Aprovar">
                              <IconButton 
                                color="success" 
                                onClick={() => handleApprove(normalizedSuggestion.id)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Rejeitar">
                              <IconButton 
                                color="error" 
                                onClick={() => handleReject(normalizedSuggestion.id)}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            {normalizedSuggestion.status === 'approved' ? 'Aprovada' : 
                             normalizedSuggestion.status === 'rejected' ? 'Rejeitada' : ''}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <LoginModal 
        open={loginModalOpen} 
        onClose={handleLoginClose}
      />
    </Box>
  );
} 