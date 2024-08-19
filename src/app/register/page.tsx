"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  Snackbar,
} from "@mui/material";
import logo from "../../assets/imgs/LIEN.png";
import Image from "next/image";
import imagenFondo from "../../../public/fondo.jpg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { changePassword } from "../../services/api";

interface User {
  username: string;
  temporary_password: string;
  new_password: string;
}

function Page() {
  const [username, setUsername] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setSnackbarOpen(false); 

    if (
      username.trim() === "" ||
      temporaryPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmNewPassword.trim() === ""
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (username.includes(" ")) {
      setError("El nombre de usuario no debe contener espacios.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("La nueva contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un carácter especial.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Las nuevas contraseñas no coinciden.");
      return;
    }

    const user: User = {
      username,
      temporary_password: temporaryPassword,
      new_password: newPassword,
    };

    try {
      await changePassword(user);
      setSuccess(true);
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error) {
      setError("Error al cambiar la contraseña.");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    router.push("/home"); 
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${imagenFondo.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Card
            sx={{
              padding: 3,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Image src={logo} alt="Logo de LIEN" width={120} height={120} style={{ objectFit: "contain" }} />
                <Typography
                  variant="h5"
                  component="h2"
                  color="#13a984"
                  fontWeight="bold"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  Cambio de Contraseña
                </Typography>
              </Box>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                action={
                  <Button color="inherit" onClick={handleSnackbarClose}>
                    Cerrar
                  </Button>
                }
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  Contraseña cambiada exitosamente. Inicia sesión con tu nueva contraseña.
                </Alert>
              </Snackbar>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Nombre de Usuario"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root": {
                      color: "text.primary",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#13a984",
                    },
                  }}
                />
                <TextField
                  label="Contraseña Temporal"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root": {
                      color: "text.primary",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#13a984",
                    },
                  }}
                />
                <TextField
                  label="Nueva Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root": {
                      color: "text.primary",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#13a984",
                    },
                  }}
                />
                <TextField
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiInputLabel-root": {
                      color: "text.primary",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#13a984",
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#13a984",
                    "&:hover": {
                      backgroundColor: "#0e8e69",
                    },
                  }}
                >
                  Cambiar Contraseña
                </Button>
              </form>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                ¿Recuperaste tu contraseña? <Link href="/login">Inicia sesión</Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Page;
