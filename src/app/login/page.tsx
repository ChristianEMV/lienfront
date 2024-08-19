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
} from "@mui/material";
import logo from "../../assets/imgs/LIEN.png";
import Image from "next/image";
import imagenFondo from "../../../public/fondo.jpg";
import Link from "next/link";
import { login } from "../../services/api";
import { useRouter } from 'next/navigation';

interface LoginForm {
  username: string;
  password: string;
}

function Page() {
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter(); 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const { username, password } = form;

    if (username.trim() === "") {
      setError("El nombre de usuario es obligatorio.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const response = await login(form);

      if (response) {
        const { id_token, access_token, refresh_token, role } = response;
        localStorage.setItem('authToken',id_token);
        localStorage.setItem('userRole', role);
        router.push('/');
        alert("Inicio de sesión exitoso");
      }
    } catch (error) {
      setError(error.response?.data?.error_message || "Error al iniciar sesión");
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${imagenFondo.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Image src={logo} alt="Logo de LIEN" width={120} height={120} style={{ objectFit: "contain" }} />
            <Typography
              variant="h5"
              component="h2"
              color="#13a984"
              fontWeight="bold"
              align="center"
              sx={{ mb: 2 }}
            >
              Inicio de Sesión
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Usuario"
                name="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={form.username}
                onChange={handleChange}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "text.primary",
                  },
                  "& .MuiInputBase-root": {
                    borderRadius: 1,
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#13a984",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  }
                }}
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={form.password}
                onChange={handleChange}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "text.primary",
                  },
                  "& .MuiInputBase-root": {
                    borderRadius: 1,
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#13a984",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "16px",
                  borderRadius: 1,
                }}
              >
                Iniciar Sesión
              </Button>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link href="/register">
                  <Typography variant="body2" color="primary">
                    ¿No has cambiado tu contraseña? cambiala aqui
                  </Typography>
                </Link>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Page;
