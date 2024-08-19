"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import RestoreIcon from '@mui/icons-material/Restore';
import ProfileLayout from "./layout";

const userData = {
  name: "Christian Vergara",
  email: "christianvergara@gmail.com",
  avatar: "/images/avatar.jpg",
};

const loanData = [
  {
    book: "Libro 1",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    intro: "Introducción del libro 1",
    estado: "prestado",
  },
  {
    book: "Libro 2",
    startDate: "2023-12-20",
    endDate: "2024-01-10",
    intro: "Introducción del libro 2",
    estado: "devuelto",
  },
];

function Page() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(userData.name);
  const [editedEmail, setEditedEmail] = useState(userData.email);
  const [editedPassword, setEditedPassword] = useState("");
  const [editedConfirmPassword, setEditedConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleSaveChanges = () => {
    setError("");
    setSuccess("");

    if (editedName.trim() === "" || editedEmail.trim() === "") {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (editedPassword !== editedConfirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Aquí podrías realizar una llamada a la API para guardar los cambios
    setSuccess("Perfil actualizado exitosamente.");
    handleCloseDialog();
  };

  return (
    <ProfileLayout>
      <Box sx={{ padding: 3 }}>
        <Card
          sx={{
            background: "linear-gradient(135deg, #f5f5f5, #ffffff)",
            padding: 3,
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  alt={userData.name}
                  src={userData.avatar}
                  sx={{
                    width: 100,
                    height: 100,
                    border: "3px solid #3f51b5",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </Grid>
              <Grid item>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {userData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userData.email}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleEditClick}
                >
                  Editar Perfil
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <BookIcon /> Libro
                </TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Introducción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanData.map((loan, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                  }}
                >
                  <TableCell>{loan.book}</TableCell>
                  <TableCell>{loan.startDate}</TableCell>
                  <TableCell>{loan.endDate}</TableCell>
                  <TableCell>{loan.intro}</TableCell>
                  <TableCell>
                    {loan.estado === "prestado" ? (
                      <RestoreIcon color="warning" />
                    ) : (
                      <CheckCircleIcon color="success" />
                    )}
                    {loan.estado}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={
                        loan.estado === "prestado" ? "secondary" : "primary"
                      }
                      startIcon={
                        loan.estado === "prestado" ? (
                          <HowToVoteIcon />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                      sx={{ textTransform: "none" }}
                    >
                      {loan.estado === "prestado" ? "Devolver" : "Ver Detalles"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Nombre de Usuario"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                sx={{ bgcolor: "background.paper" }}
              />
              <TextField
                label="Correo Electrónico"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                sx={{ bgcolor: "background.paper" }}
              />
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedPassword}
                onChange={(e) => setEditedPassword(e.target.value)}
                sx={{ bgcolor: "background.paper" }}
              />
              <TextField
                label="Confirmar Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={editedConfirmPassword}
                onChange={(e) => setEditedConfirmPassword(e.target.value)}
                sx={{ bgcolor: "background.paper" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges} color="primary">
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProfileLayout>
  );
}

export default Page;
