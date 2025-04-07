import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { createSong } from '~/services/SongService';

interface AddSongModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSongModal({ open, onClose, onSuccess }: AddSongModalProps) {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!link) {
      setError('Por favor, insira o link da música');
      setSuccess(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createSong(link);
      setSuccess('Música adicionada com sucesso!');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      setError('Erro ao adicionar música. Por favor, tente novamente.');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLink('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Nova Música</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success">
              {success}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Link da Música"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Cole o link da música aqui"
            error={!!error}
            helperText={error}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
} 