import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { login } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onClose: () => void;
  isInPage?: boolean;
}

const Login: React.FC<LoginProps> = ({ onClose, isInPage = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshAuthState, isHydrated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isHydrated) {
      // Se ainda não hidratou, não tenta login
      return;
    }
    
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      setSuccess(true);
      
      // Atualiza o estado global de autenticação
      refreshAuthState();
      
      // Adiciona um pequeno atraso para mostrar a mensagem de sucesso antes de fechar
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: unknown) {
      setError('Falha na autenticação. Verifique suas credenciais.');
      console.error('Erro na requisição de login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      {!isInPage && (
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <TextField
          fullWidth
          label="Senha"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Login realizado com sucesso!</Alert>}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
