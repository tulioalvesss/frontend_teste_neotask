import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  CircularProgress
} from '@mui/material';
import { register } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isHydrated } = useAuth();

  const validateForm = (): boolean => {
    // Resetar o erro
    setError('');
    
    // Validar nome
    if (!name.trim()) {
      setError('Por favor, informe seu nome');
      return false;
    }
    
    // Validar email
    if (!email.trim()) {
      setError('Por favor, informe seu email');
      return false;
    }
    
    // Validar formato de email com expressão regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, informe um email válido');
      return false;
    }
    
    // Validar senha
    if (!password) {
      setError('Por favor, informe uma senha');
      return false;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    // Validar confirmação de senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isHydrated) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register({ 
        name, 
        email, 
        password 
      });
      setSuccess(true);
      
      // Limpar o formulário
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Após 2 segundos, chamar a função de sucesso (provavelmente para mudar para a aba de login)
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
      
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao registrar. Por favor, tente novamente.');
      }
      console.error('Erro no registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom align="center">
        Crie sua conta
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nome completo"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
        
        <TextField
          fullWidth
          label="Email"
          type="email"
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
          helperText="Mínimo de 6 caracteres"
        />
        
        <TextField
          fullWidth
          label="Confirmar senha"
          type="password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Registro realizado com sucesso! Você já pode fazer login.</Alert>}
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
        </Button>
      </form>
    </Box>
  );
};

export default Register; 