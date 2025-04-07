import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Typography, 
  Alert,
  Snackbar,
  Stack,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useAuth } from '../contexts/AuthContext';
import { SanitizationService } from '../services/sanitizationService';

interface SuggestionFormProps {
  onSubmit: (data: { title: string; link: string; }) => void;
  onLoginClick?: () => void;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({ onSubmit, onLoginClick }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [titleError, setTitleError] = useState('');
  const [linkError, setLinkError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=).+/,
      /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/).+/,
      /^(https?:\/\/)?(www\.)?(youtube\.com\/v\/).+/,
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=).+/,
    ];
    return youtubeRegex.some(regex => regex.test(url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      if (onLoginClick) {
        onLoginClick();
      }
      return;
    }
    
    let isValid = true;
    
    // Validação do título
    if (!title.trim()) {
      setTitleError('Por favor, informe o título da música');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    // Validação do link do YouTube
    if (!link.trim()) {
      setLinkError('Por favor, informe o link do YouTube');
      isValid = false;
    } else if (!validateYoutubeUrl(link)) {
      setLinkError('Por favor, informe um link válido do YouTube');
      isValid = false;
    } else {
      setLinkError('');
    }

    if (isValid) {
      try {
        setLoading(true);
        // Sanitiza os inputs antes de enviar
        const sanitizedTitle = SanitizationService.sanitizeInput(title);
        const sanitizedLink = SanitizationService.sanitizeURL(link);

        if (!sanitizedLink) {
          setLinkError('URL inválida');
          return;
        }

        await onSubmit({
          title: sanitizedTitle,
          link: sanitizedLink
        });
        setTitle('');
        setLink('');
        setShowSuccess(true);
      } catch (error) {
        console.error('Erro ao enviar sugestão:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>        
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Título da Música"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!titleError}
              helperText={titleError}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: 'text.secondary' }}>
                    <Typography variant="body2">🎵</Typography>
                  </Box>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Link do YouTube"
              variant="outlined"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              error={!!linkError}
              helperText={linkError}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: 'text.secondary' }}>
                    <YouTubeIcon />
                  </Box>
                ),
              }}
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {isLoggedIn 
                ? loading ? 'Enviando...' : 'Enviar Sugestão' 
                : 'Fazer Login para Enviar'}
            </Button>
          </Stack>
        </form>
      </Paper>
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Sugestão enviada com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SuggestionForm; 