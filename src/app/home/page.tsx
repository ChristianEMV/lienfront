'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import LibroCard from '../../components/LibroCard';
import { getBooks } from '../../services/api';

const Page = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (err) {
        setError('Error al recuperar los libros');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getOpacity = () => {
    return Math.max(0, 1 - scrollPosition / 1800);
  };

  return (
    <Container maxWidth="md" sx={{ paddingY: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography variant="h4" gutterBottom>
            Biblioteca virtual
          </Typography>
          <Grid container spacing={4}>
            {books.map((book) => (
              <Grid item key={book.idbook} xs={12} sm={6} md={4}>
                <LibroCard book={book} />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              position: 'fixed',
              bottom: 1,
              left: 16,
              width: '300px',
              height: 'auto',
              opacity: getOpacity(),
              transition: 'opacity 0.5s ease-out',
            }}
          >
            <img
              src="/../salto3.png"
              alt="niño brincando 1"
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
          <Box
            sx={{
              position: 'fixed',
              bottom: 190,
              right: 16,
              width: '300px',
              height: 'auto',
              opacity: getOpacity(),
              transition: 'opacity 0.5s ease-out',
            }}
          >
            <img
              src="/../salto4.png"
              alt="niño brincando 2"
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Page;
