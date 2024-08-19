"use client";

import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import Box from "@mui/material/Box";
import logo from "../assets/imgs/logo.png";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Menu, MenuItem, Divider } from "@mui/material";
import { useRouter } from 'next/navigation';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAny, setIsAny] = useState<boolean>(false); // Inicializado a false

  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsAny(false);
    window.location.reload();
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');
      console.log(token)
      console.log("log1",isAny)

      if (token) {  // Verifica si el token existe y no está vacío
        setIsAny(true); // Usuario autenticado
      } else {
        setIsAny(false); // Usuario no autenticado
      }

    if (role !== 'admin') {
      setIsAdmin(false);
    } else {
      setIsAdmin(true);
    }

  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        margin: 0,
        marginBottom: "16px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            onClick={handleClick}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" color="black">
            LIEN
          </Typography>
        </Box>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Link href="/home" legacyBehavior>
            <a>
              <Image
                src={logo}
                alt="Logo"
                style={{
                  height: "50px",
                  maxHeight: "50px",
                  objectFit: "contain",
                }}
              />
            </a>
          </Link>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!isAny ? (
            <Link href="/login" legacyBehavior>
              <Button color="primary" startIcon={<LoginIcon />}>
                Iniciar sesión
              </Button>
            </Link>
          ) : (
            <Button color="primary" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Cerrar sesión
            </Button>
          )}
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 2,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: 2,
            minWidth: 200,
          },
        }}
      >
        <Divider />
        <Link href="/home" legacyBehavior>
          <MenuItem
            onClick={handleClose}
            sx={{
              paddingY: 1.5,
              "&:hover": {
                backgroundColor: "#f0f0f0",
                color: "#1976d2",
              },
            }}
          >
            <HomeIcon sx={{ mr: 1 }} />
            Inicio
          </MenuItem>
        </Link>

        {isAdmin && [
          <Divider key="divider-library" />,
          <Link href="/library" legacyBehavior key="library">
            <MenuItem
              onClick={handleClose}
              sx={{
                paddingY: 1.5,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  color: "#1976d2",
                },
              }}
            >
              <MenuBookIcon sx={{ mr: 1 }} />
              Biblioteca
            </MenuItem>
          </Link>
        ]}

        {isAdmin && [
          <Divider key="divider-prestamos" />,
          <Link href="/prestamos" legacyBehavior key="prestamos">
            <MenuItem
              onClick={handleClose}
              sx={{
                paddingY: 1.5,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  color: "#1976d2",
                },
              }}
            >
              <PendingActionsIcon sx={{ mr: 1 }} />
              Prestamos
            </MenuItem>
          </Link>
        ]}

        {isAdmin && [
          <Divider key="divider-users" />,
          <Link href="/users" legacyBehavior key="users">
            <MenuItem
              onClick={handleClose}
              sx={{
                paddingY: 1.5,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  color: "#1976d2",
                },
              }}
            >
              <PeopleAltIcon sx={{ mr: 1 }} />
              Usuarios
            </MenuItem>
          </Link>
        ]}
      </Menu>

    </AppBar>
  );
}

export default Navbar;
