import React from 'react';
import { Box, Container, Typography, Link, Divider, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 4,
        mt: 8,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid>
            <Typography variant="h6" color="primary" gutterBottom>
              Tião Carreiro & Pardinho
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              O melhor da música caipira brasileira
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="primary" aria-label="facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="youtube">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid>
            <Typography variant="h6" color="primary" gutterBottom>
              Links Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="#" color="text.secondary" underline="hover" sx={{ mb: 1 }}>
                Início
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ mb: 1 }}>
                Sobre a Dupla
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ mb: 1 }}>
                Discografia
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ mb: 1 }}>
                Contato
              </Link>
            </Box>
          </Grid>
          
          <Grid>
            <Typography variant="h6" color="primary" gutterBottom>
              Contato
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Email: contato@tiaocarreiroepardinho.com.br
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Telefone: (11) 9999-9999
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Tião Carreiro & Pardinho - Todos os direitos reservados
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 