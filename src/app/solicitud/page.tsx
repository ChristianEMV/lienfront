"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import { grey } from "@mui/material/colors";

interface Book {
  idbook: number;
  titulo: string;
  autor: string;
  fecha_publicacion: string;
  editorial: string;
  categoria: string;
  descripcion: string;
  status: boolean;
  coverImage: string;
}

const BookDetails = () => {
  const searchParams = useSearchParams();
  const bookData = JSON.parse(searchParams.get("book") || "{}") as Book;

  const handleImageError = () => {
    bookData.coverImage = "/fallback.png";
  };

  return (
    <Box
      sx={{
        padding: 4,
        background: "linear-gradient(to right, #f7f8fa, #e3e8f0)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card
            sx={{
              boxShadow: 5,
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              backgroundColor: grey[50],
            }}
          >
            <CardMedia
              component="img"
              height="400"
              image={
                bookData.coverImage
                  ? bookData.coverImage.startsWith("http")
                    ? bookData.coverImage
                    : `/images/${bookData.coverImage}`
                  : "/fallback.png"
              }
              alt={bookData.titulo}
              onError={handleImageError}
            />
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                {bookData.titulo}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Autor: {bookData.autor}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ marginY: 1 }}>
                Publicado en: {bookData.fecha_publicacion}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ marginY: 1 }}>
                Editorial: {bookData.editorial}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ marginY: 1 }}>
                Categoría: {bookData.categoria}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="body2" color="text.secondary" paragraph>
                {bookData.descripcion}
              </Typography>
              <Typography variant="body1" color={bookData.status ? "success.main" : "error.main"}>
                Estado: {bookData.status ? "Disponible" : "No disponible"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <BookDetails />
    </Suspense>
  );
}
