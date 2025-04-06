import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  IconButton, 
  Pagination, 
  Stack,
  CircularProgress,
  CardMedia,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface Music {
  id: number;
  title: string;
  image: string;
  viewCount: string;
  link: string;
}

interface MusicListProps {
  musics: Music[];
  loading?: boolean;
}

const MusicList: React.FC<MusicListProps> = ({ musics, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const topMusicsCount = 5;
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  
  // Separar as músicas em dois grupos: top 5 e restante
  const topMusics = musics.slice(0, topMusicsCount);
  const remainingMusics = musics.slice(topMusicsCount);
  const totalPages = Math.ceil(remainingMusics.length / itemsPerPage);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRemainingMusics = remainingMusics.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }
  
  if (musics.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h5" color="text.secondary">
          Nenhuma música encontrada
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Top 5 músicas com destaque */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {topMusics.map((music) => (
          <Card 
            key={music.id} 
            elevation={3}
            sx={{ 
              display: 'flex',
              transition: 'transform 0.2s, box-shadow 0.2s', 
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: 6 
              },
              height: isMobile ? '100px' : '140px',
              flexDirection: isMobile ? 'row' : 'row'
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: isMobile ? 100 : 140 }}
              image={music.image}
              alt={music.title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flex: '1 0 auto', py: 1, px: isMobile ? 1 : 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant={isMobile ? "body1" : "subtitle1"} 
                      component="div" 
                      noWrap 
                      title={music.title}
                      sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                      {music.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      noWrap
                      sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                    >
                      {music.viewCount} visualizações
                    </Typography>
                  </Box>
                  <IconButton 
                    color="primary"
                    aria-label="play music"
                    component="a"
                    href={music.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    size={isMobile ? "small" : "large"}
                  >
                    <PlayArrowIcon fontSize={isMobile ? "medium" : "large"} />
                  </IconButton>
                </Box>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Stack>

      {/* Divisor entre as seções */}
      <Divider sx={{ my: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Outras Músicas
        </Typography>
      </Divider>

      {/* Músicas restantes com menor destaque */}
      {currentRemainingMusics.length > 0 && (
        <Stack spacing={2}>
        {currentRemainingMusics.map((music) => (
          <Card 
            key={music.id} 
            elevation={1}
            sx={{ 
              display: 'flex',
              transition: 'transform 0.2s',
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: 2
              },
              height: '100px',
              opacity: 0.9
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: isMobile ? 80 : 100 }}
              image={music.image}
              alt={music.title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flex: '1 0 auto', py: 1, px: isMobile ? 1 : 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="body1" 
                      component="div" 
                      noWrap 
                      title={music.title}
                      sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
                    >
                      {music.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      noWrap
                      sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                    >
                      {music.viewCount} visualizações
                    </Typography>
                  </Box>
                  <IconButton 
                    color="primary"
                    size="small"
                    aria-label="play music"
                    component="a"
                    href={music.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlayArrowIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Box>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Stack>
      )}
      {currentRemainingMusics.length === 0 && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Envie uma música para ser adicionada à lista
          </Typography>
        </Box>
      )}
      
      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            size={isMobile ? "medium" : "large"}
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 'bold'
              }
            }}
          />
          <Typography 
            variant="body2" 
            color="text.secondary"
            align="center"
            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
          >
            Exibindo {startIndex + 1}-{Math.min(endIndex, remainingMusics.length)} de {remainingMusics.length} músicas adicionais
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default MusicList;