import React from 'react';
import { Modal, Box, IconButton, Paper, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Login from './Login';
import { Link } from 'react-router-dom';
interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  redirectAfterLogin?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  open, 
  onClose,
  redirectAfterLogin
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      aria-labelledby="login-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxWidth: 400,
        width: '100%',
      }}>
        <IconButton
          aria-label="fechar"
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Login onClose={handleClose} />
        </Paper>
        <Paper elevation={0} sx={{ p: 2 }}>
          Ainda não tem uma conta? <Link onClick={handleClose} to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Registrar</Link>
        </Paper>
      </Box>
    </Modal>
  );
};

export default LoginModal; 