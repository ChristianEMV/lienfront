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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { eliminarPrestamo, recuperarPrestamos, crearPrestamo, getBooks, getUsers } from "../../services/api";
import { useRouter } from 'next/navigation';

interface Loan {
  idprestamo: string;
  fecha_inicio: string;
  fecha_fin: string;
  iduser: string;
  idbook: string;
  titulo: string;
  fecha_publicacion: string;
  autor: string;
  editorial: string;
  status: number;
  descripcion: string;
  categoria: string;
}

interface PrestamoDelete {
  idprestamo: string;
  idbook: string;
}

interface Book {
  idbook: string;
  titulo: string;
  autor: string;
  fecha_publicacion: string;
  editorial: string;
  categoria: string;
  descripcion: string;
  status: string;
}

interface User {
  iduser: number;
  username: string;
  nombre: string;
  email: string;
  phone: string;
  fechanacimiento: string;
}

const Page = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newLoan, setNewLoan] = useState({
    idprestamo: '0',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    iduser: '',
    idbook: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/');
      return;
    }
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await recuperarPrestamos();
        setLoans(response);
      } catch (error) {
        setSnackbarMessage("Error al recuperar los préstamos");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response);
      } catch (error) {
        setSnackbarMessage("Error al recuperar los libros");
        setOpenSnackbar(true);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        setSnackbarMessage("Error al recuperar los usuarios");
        setOpenSnackbar(true);
      }
    };

    fetchLoans();
    fetchBooks();
    fetchUsers();
  }, []);

  const handleDeleteClick = (loan: Loan) => {
    setLoanToDelete(loan);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setLoanToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (loanToDelete) {
      setLoading(true);
      const prestamoDelete: PrestamoDelete = {
        idprestamo: loanToDelete.idprestamo,
        idbook: loanToDelete.idbook,
      };

      try {
        await eliminarPrestamo(prestamoDelete);
        setLoans(loans.filter((loan) => loan.idprestamo !== loanToDelete.idprestamo));
        setSnackbarMessage("Préstamo eliminado exitosamente");
        window.location.reload();
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage("Error al eliminar el préstamo");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
        handleCloseDeleteDialog();
      }
    }
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewLoan({
      idprestamo: '0',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
      iduser: '',
      idbook: ''
    });
  };

  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setNewLoan((prevLoan) => ({
      ...prevLoan,
      [name as string]: value,
    }));
  };

  const handleConfirmAdd = async () => {
    setLoading(true);
    try {
      const formattedLoan = {
        ...newLoan,
        iduser: String(newLoan.iduser),
        idbook: String(newLoan.idbook),
      };
  
      await crearPrestamo(formattedLoan);
  
      setLoans([...loans, {
        ...formattedLoan,
        titulo: books.find(book => book.idbook === newLoan.idbook)?.titulo || '',
        fecha_publicacion: books.find(book => book.idbook === newLoan.idbook)?.fecha_publicacion || '',
        autor: books.find(book => book.idbook === newLoan.idbook)?.autor || '',
        editorial: books.find(book => book.idbook === newLoan.idbook)?.editorial || '',
        status: 1,
        descripcion: books.find(book => book.idbook === newLoan.idbook)?.descripcion || '',
        categoria: books.find(book => book.idbook === newLoan.idbook)?.categoria || '',
      }]);
      setSnackbarMessage("Préstamo agregado exitosamente");
      window.location.reload();
      setOpenSnackbar(true);
      handleCloseAddDialog();
    } catch (error) {
      setSnackbarMessage("Error al agregar el préstamo");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
        Tabla de Préstamos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={handleAddClick}
      >
        Agregar Préstamo
      </Button>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>ID Libro</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Nombre del Libro</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Fecha Inicio</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Fecha Fin</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Estado</TableCell>
              <TableCell
                sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan, index) => (
              <TableRow
                key={loan.idprestamo}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#ffffff",
                }}
              >
                <TableCell>{loan.idbook}</TableCell>
                <TableCell>{loan.titulo}</TableCell>
                <TableCell>{loan.fecha_inicio}</TableCell>
                <TableCell>{loan.fecha_fin}</TableCell>
                <TableCell>
                  {loan.status === 1 && "En préstamo"}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Eliminar">
                    <IconButton
                      aria-label="eliminar"
                      color="error"
                      onClick={() => handleDeleteClick(loan)}
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

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Agregar Préstamo</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="select-book-label">Libro</InputLabel>
              <Select
                labelId="select-book-label"
                id="select-book"
                name="idbook"
                value={newLoan.idbook}
                label="Libro"
                onChange={handleFieldChange}
              >
                {books.map((book) => (
                  <MenuItem key={book.idbook} value={book.idbook}>
                    {book.titulo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="select-user-label">Usuario</InputLabel>
              <Select
                labelId="select-user-label"
                id="select-user"
                name="iduser"
                value={newLoan.iduser}
                label="Usuario"
                onChange={handleFieldChange}
              >
                {users.map((user) => (
                  <MenuItem key={user.iduser} value={user.iduser}>
                    {user.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Fecha de Inicio"
              type="date"
              fullWidth
              name="fecha_inicio"
              value={newLoan.fecha_inicio}
              InputLabelProps={{ shrink: true }}
              onChange={handleFieldChange as React.ChangeEventHandler<HTMLInputElement>}
            />
            <TextField
              margin="dense"
              label="Fecha de Fin"
              type="date"
              fullWidth
              name="fecha_fin"
              value={newLoan.fecha_fin}
              InputLabelProps={{ shrink: true }}
              onChange={handleFieldChange as React.ChangeEventHandler<HTMLInputElement>}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmAdd}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar este préstamo?</Typography>
          {loanToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Libro:</strong> {loanToDelete.titulo}</Typography>
              <Typography><strong>Usuario:</strong> {users.find(user => user.iduser === Number(loanToDelete?.iduser))?.nombre}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Page;
