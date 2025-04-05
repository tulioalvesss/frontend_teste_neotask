import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import MusicList from '../components/MusicList';
import SuggestionForm from '../components/SuggestionForm';
import LoginModal from '../components/LoginModal';
import { getAllSongs } from '~/services/SongService';
import { createSuggestion } from '~/services/SuggestionService';

interface Music {
  id: number;
  title: string;
  image: string;
  viewCount: string;
  link: string;
}

export default function Home() {
  const [topMusics, setTopMusics] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllSongs()
      .then((data: Music[]) => {
        setTopMusics(data);
      })
      .catch(error => {
        console.error("Erro ao carregar músicas:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleNewSuggestion = (newMusic: { title: string; link: string;}) => {
    createSuggestion({
      title: newMusic.title,
      link: newMusic.link
    }).then((data: any) => {
      console.log(data);
    });
  };
  
  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLoginClose = () => {
    setLoginModalOpen(false);
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', py: 6, minHeight: '85vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{
           p: 4, 
           borderRadius: 2, 
           mb: 4,
           backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url("https://cultura.uol.com.br/upload/radio/estudiof/20210721172843_est-dio-f-21-07-fm-2-.png")',
           backgroundSize: 'cover',
           backgroundPosition: 'center'
           }}>
              <Box>
                <Typography 
                  variant="h2" 
                  component="h2" 
                  gutterBottom
                  color="secondary.main"
                  sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 'bold' }}
                >
                  Sugira uma nova música
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Conhece alguma música incrível da dupla que não está na lista? Compartilhe conosco!
                </Typography>
                <SuggestionForm 
                  onSubmit={handleNewSuggestion} 
                  onLoginClick={handleLoginClick}
                />
              </Box>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '2rem', md: '2.5rem' }, 
                  color: 'secondary.main',
                  fontWeight: 'bold'
                }}
              >
                Tião Carreiro & Pardinho
              </Typography>
              <Typography 
                variant="h2" 
                component="h2" 
                gutterBottom 
                color="text.secondary"
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                Lista de Músicas
              </Typography>
              <Divider sx={{ width: '50%', margin: '0 auto', mb: 4 }} />
            </Box>
            
            <MusicList musics={topMusics} loading={loading} />
          </Paper>
        </Box>
      </Container>
      
      <LoginModal open={loginModalOpen} onClose={handleLoginClose} />
    </Box>
  );
} 