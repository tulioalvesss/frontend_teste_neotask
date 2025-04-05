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
  IconButton, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Tooltip,
  Snackbar,
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SaveIcon from '@mui/icons-material/Save';
import { getAllSongs, updateSong, deleteSong } from '~/services/SongService';
import { useAuth } from '~/contexts/AuthContext';

interface Song {
  id: number;
  title: string;
  image: string;
  viewCount: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ApprovedSongsList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLink, setEditLink] = useState('');
  const { isLoggedIn, checkAuthStatus, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    
    if (checkAuthStatus()) {
      fetchApprovedSongs();
    }
  }, [checkAuthStatus, isHydrated]);

  const fetchApprovedSongs = async () => {
    try {
      setLoading(true);
      const data = await getAllSongs();
      
      if (Array.isArray(data)) {
        setSongs(data);
      } else {
        setError('Formato de dados inválido recebido do servidor');
      }
    } catch (err) {
      setError('Erro ao carregar músicas aprovadas');
      console.error('Erro ao buscar músicas:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!isHydrated || !dateString) return dateString || 'Data indisponível';
    
    try {
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

  const openYoutubeLink = (link: string): void => {
    window.open(link, '_blank');
  };

  const handleEditClick = (song: Song) => {
    setCurrentSong(song);
    setEditTitle(song.title);
    setEditLink(song.link);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setCurrentSong(null);
  };

  const handleSaveEdit = async () => {
    if (!currentSong) return;
    
    try {
      // Usando o serviço para atualizar a música
      await updateSong(currentSong.id, { 
        title: editTitle, 
        link: editLink 
      });
      
      // Atualizando o estado local
      const updatedSongs = songs.map(song => 
        song.id === currentSong.id 
          ? { ...song, title: editTitle, link: editLink } 
          : song
      );
      
      setSongs(updatedSongs);
      setSuccessMessage('Música atualizada com sucesso!');
      setEditDialogOpen(false);
    } catch (err) {
      setError('Erro ao atualizar música');
      console.error(err);
    }
  };

  const handleDeleteClick = (song: Song) => {
    setCurrentSong(song);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setCurrentSong(null);
  };

  const handleConfirmDelete = async () => {
    if (!currentSong) return;
    
    try {
      // Usando o serviço para excluir a música
      await deleteSong(currentSong.id);
      
      // Atualizando o estado local
      const updatedSongs = songs.filter(song => song.id !== currentSong.id);
      setSongs(updatedSongs);
      
      setSuccessMessage('Música excluída com sucesso!');
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Erro ao excluir música');
      console.error(err);
    }
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
        Gerenciamento de Músicas Aprovadas
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Alert severity="info" sx={{ flexGrow: 1 }}>
          Total de músicas: {songs.length}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchApprovedSongs}
          sx={{ ml: 2 }}
        >
          Atualizar Lista
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      {songs.length === 0 ? (
        <Alert severity="info">Não há músicas aprovadas cadastradas.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell>Imagem</TableCell>
                <TableCell>Título</TableCell>
                <TableCell align="center">Visualizações</TableCell>
                <TableCell align="center">Link</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {songs.map((song) => (
                <TableRow key={song.id} hover>
                  <TableCell>
                    <img 
                      src={song.image} 
                      alt={song.title} 
                      style={{ width: '80px', height: '45px', objectFit: 'cover' }} 
                    />
                  </TableCell>
                  <TableCell>{song.title}</TableCell>
                  <TableCell align="center">{song.viewCount}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Abrir no YouTube">
                      <IconButton 
                        color="error" 
                        onClick={() => openYoutubeLink(song.link)}
                      >
                        <YouTubeIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditClick(song)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(song)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog para edição de música */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Música</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {currentSong && (
              <img 
                src={currentSong.image} 
                alt={currentSong.title} 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', marginBottom: '16px' }} 
              />
            )}
            <TextField
              fullWidth
              label="Título da Música"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Link do YouTube"
              value={editLink}
              onChange={(e) => setEditLink(e.target.value)}
              margin="normal"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="inherit">Cancelar</Button>
          <Button 
            onClick={handleSaveEdit} 
            color="primary" 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir a música "{currentSong?.title}"? 
            <br />
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
