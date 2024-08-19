"use client";

import React, { useState, useEffect } from "react";
import {
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
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getUsers, addUser, deleteUser } from "../../services/api";
import { useRouter } from 'next/navigation';

interface User {
  iduser: number;
  nombre: string;
  email: string;
  phone: string;
  username: string;
  fechanacimiento: string;
}

interface DeleteUserParams {
  username: string;
}

function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<DeleteUserParams | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    iduser: 0,
    nombre: "",
    email: "",
    phone: "",
    username: "",
    fechanacimiento: "",
  });
  const [addError, setAddError] = useState("");
  const router = useRouter(); 

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        setSnackbarMessage("Error al cargar los usuarios. Intente de nuevo.");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]); 

  const handleDeleteClick = (user: User) => {
    setUserToDelete({ username: user.username });
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setLoading(true);
      try {
        await deleteUser(userToDelete);
        setUsers((prevUsers) => prevUsers.filter(user => user.username !== userToDelete?.username));
        setSnackbarMessage("Usuario eliminado exitosamente");
      } catch (error) {
        setSnackbarMessage("Error al eliminar el usuario. Intente de nuevo.");
      } finally {
        setOpenSnackbar(true);
        setLoading(false);
        handleCloseDeleteDialog();
      }
    }
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewUser({
      iduser: 0,
      nombre: "",
      email: "",
      phone: "",
      fechanacimiento: "",
      username: "",
    });
    setAddError("");
  };

  const handleAddUserChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    field: keyof User
  ) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      [field]: event.target.value as string,
    }));
  };

  const handleAddUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !newUser.nombre ||
      !newUser.email ||
      !newUser.phone ||
      !newUser.fechanacimiento ||
      !newUser.username
    ) {
      setAddError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const addedUser = await addUser(newUser);
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setSnackbarMessage("Usuario agregado exitosamente");
      window.location.reload();
      setNewUser({
        iduser: 0,
        nombre: "",
        email: "",
        phone: "",
        fechanacimiento: "",
        username: "",
      });
      setAddError("");
    } catch (error) {
      setAddError("Error al agregar usuario. Intente de nuevo.");
    } finally {
      setLoading(false);
      handleCloseAddModal();
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
        Usuarios
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Agregar Usuario
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Usuario
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Correo Electrónico
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Fecha Nacimiento
              </TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.iduser}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#ffffff",
                }}
              >
                <TableCell>{user.iduser}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.fechanacimiento}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Eliminar">
                    <IconButton
                      aria-label="eliminar"
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este usuario?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <form onSubmit={handleAddUserSubmit}>
          <DialogTitle>Agregar Usuario</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                id="nombre"
                label="Nombre"
                type="text"
                fullWidth
                variant="outlined"
                value={newUser.nombre}
                onChange={(e) => handleAddUserChange(e, "nombre")}
                required
              />
              <TextField
                margin="dense"
                id="email"
                label="Correo Electrónico"
                type="email"
                fullWidth
                variant="outlined"
                value={newUser.email}
                onChange={(e) => handleAddUserChange(e, "email")}
                required
              />
              <TextField
                margin="dense"
                id="phone"
                label="Teléfono"
                type="tel"
                fullWidth
                variant="outlined"
                value={newUser.phone}
                onChange={(e) => handleAddUserChange(e, "phone")}
                required
              />
              <TextField
                margin="dense"
                id="username"
                label="Usuario"
                type="text"
                fullWidth
                variant="outlined"
                value={newUser.username}
                onChange={(e) => handleAddUserChange(e, "username")}
                required
              />
              <TextField
                margin="dense"
                id="fechanacimiento"
                label="Fecha de Nacimiento"
                type="date"
                fullWidth
                variant="outlined"
                value={newUser.fechanacimiento}
                onChange={(e) => handleAddUserChange(e, "fechanacimiento")}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {addError && <Alert severity="error">{addError}</Alert>}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddModal}>Cancelar</Button>
            <Button
              type="submit"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Agregar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default Page;
