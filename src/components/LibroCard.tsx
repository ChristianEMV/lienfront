import React, { useState, useEffect, memo } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CardContent,
  Card,
  CardMedia,
  CardActionArea,
  Modal,
  Tooltip,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface LibroCardProps {
  book: {
    idbook: number;
    titulo: string;
    autor: string;
    fecha_publicacion: number;
    editorial: string;
    categoria: string;
    descripcion: string;
    coverImage: string;
    status: boolean;
  };
}

const randomImageUrls = [
  "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad",
  "https://images.unsplash.com/photo-1560807707-8cc77767d783",
  "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
  "https://images.unsplash.com/photo-1556740749-8864f6717d7e4",

];

const getRandomImageUrl = () => {
  return randomImageUrls[Math.floor(Math.random() * randomImageUrls.length)];
};

const LibroCard: React.FC<LibroCardProps> = memo(({ book }) => {
  const [openModal, setOpenModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(book.coverImage ? `/images/${book.coverImage}` : getRandomImageUrl());
  const fallbackImageUrl = "/fallback.png";

  useEffect(() => {
    setImageUrl(book.coverImage ? `/images/${book.coverImage}` : getRandomImageUrl());
  }, [book.coverImage]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleImageError = () => {
    setImageUrl(fallbackImageUrl);
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }} onClick={handleOpenModal}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={imageUrl}
            alt={book.titulo}
            onError={handleImageError}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {book.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Por: {book.autor}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {book.descripcion}
            </Typography>
          </CardContent>
        </CardActionArea>
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <Tooltip title={book.status ? "Disponible" : "No disponible"}>
            <IconButton size="small" color={book.status ? "success" : "error"}>
              {book.status ? <CheckCircleIcon /> : <CancelIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Card>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Image
                src={imageUrl}
                alt={book.titulo}
                width={200}
                height={300}
                onError={handleImageError}
                layout="responsive"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {book.titulo}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Por: {book.autor}
              </Typography>
              <Typography variant="body1" paragraph>
                {book.descripcion}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Link
                href={{
                  pathname: "/solicitud",
                  query: { book: JSON.stringify(book) },
                }}
                legacyBehavior
              >
                <Button variant="contained" color="primary">
                  Más información
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
});

export default LibroCard;
