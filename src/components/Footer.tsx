import React from 'react';
import { Box, Typography, Grid, Link, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, Mail } from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,  // Aumentar el padding vertical
        width: '100%',
        borderTop: `1px solid ${theme => theme.palette.divider}`,
      }}
    >
      <Grid container spacing={4} sx={{ maxWidth: 'lg', margin: '0 auto' }}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            LIEN
          </Typography>
          <Typography variant="body2" paragraph>
            Librería Interactiva y Electrónica, tu plataforma para conectar con el conocimiento.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Link href="#" color="inherit" sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: '#c6ff00' } }}>
              <Facebook />
            </Link>
            <Link href="#" color="inherit" sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: '#c6ff00' } }}>
              <Twitter />
            </Link>
            <Link href="#" color="inherit" sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: '#c6ff00' } }}>
              <Instagram />
            </Link>
            <Link href="mailto:info@lien.com" color="inherit" sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: '#c6ff00' } }}>
              <Mail />
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Enlaces
          </Typography>
          <Link href="/home" color="inherit" sx={{ display: 'block', mb: 1, '&:hover': { textDecoration: 'underline' } }}>
            Inicio
          </Link>
          <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, '&:hover': { textDecoration: 'underline' } }}>
            Acerca de
          </Link>
          <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, '&:hover': { textDecoration: 'underline' } }}>
            Contacto
          </Link>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" gutterBottom>
            Contacto
          </Typography>
          <Typography variant="body2" paragraph>
            Correo: <Link href="mailto:info@lien.com" color="inherit">info@lien.com</Link>
          </Typography>
          <Typography variant="body2">
            Teléfono: 7771319651
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3, bgcolor: 'white' }} />
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} LIEN. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
