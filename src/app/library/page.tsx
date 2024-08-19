"use client";

import React, { useState, useEffect, FormEvent } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  Fab,
  Alert,
  CircularProgress,
  TablePagination,
  Box,
  Snackbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../services/api";
import { useRouter } from 'next/navigation';

interface Book {
  idbook: number;
  titulo: string;
  autor: string;
  fecha_publicacion: string;
  editorial: string;
  categoria: string;
  descripcion: string;
  status: String;
}

export default function BookTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState<Book>({
    idbook: 0,
    titulo: "",
    autor: "",
    fecha_publicacion: "",
    editorial: "",
    categoria: "",
    descripcion: "",
    status: "0",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const router = useRouter(); 

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.push('/');
      return;
    }
    const fetchBooks = async () => {
      try {
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (err) {
        setError("Error al recuperar los libros");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddBookChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: keyof Book
  ) => {
    const value = event.target.value;
    setNewBook((prevBook) => ({
      ...prevBook,
      [field]: value,
    }));
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBook(null);
  };

  const handleEditBookChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    field: keyof Book
  ) => {
    const value = event.target.value;
    setSelectedBook((prevBook) =>
      prevBook ? { ...prevBook, [field]: value } : prevBook
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedBook) {
      try {
        const updatedBook = { ...selectedBook, status: "0" };
        const result = await updateBook(updatedBook);
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.idbook === result.idbook ? result : book
          )
        );
        handleCloseModal();
        setSnackbarMessage("Libro actualizado con éxito");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        setError("Error al actualizar el libro");
      }
    }
  };

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete.idbook);
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.idbook !== bookToDelete.idbook)
        );
        handleCloseDeleteDialog();
        setSnackbarMessage("Libro eliminado con éxito");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        setError("Error al eliminar el libro");
        setSnackbarMessage("Error al eliminar el libro");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedBooks = books.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddBookSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Forzar el estado a 0 (disponible)
      const bookToAdd = { ...newBook, status: "0" };
      const addedBook = await createBook(bookToAdd);
      setBooks((prevBooks) => [...prevBooks, addedBook]);
      handleCloseAddModal();
      setSnackbarMessage("Libro agregado con éxito");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setError("Error al agregar el libro");
      setSnackbarMessage("Error al agregar el libro");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ mb: 4, textAlign: "center" }}
          >
            Biblioteca
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              px: 2,
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Título
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Autor
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Fecha de Publicación
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Editorial
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Categoría
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Descripción
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                      Estado
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBooks.map((book, index) => (
                    <TableRow key={book.idbook}>
                      <TableCell>{book.idbook}</TableCell>
                      <TableCell>{book.titulo}</TableCell>
                      <TableCell>{book.autor}</TableCell>
                      <TableCell>{book.fecha_publicacion}</TableCell>
                      <TableCell>{book.editorial}</TableCell>
                      <TableCell>{book.categoria}</TableCell>
                      <TableCell>{book.descripcion}</TableCell>
                      <TableCell>
                        {book.status === "0" ? "Disponible" : "No disponible"}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(book)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(book)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={books.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Box>
        </>
      )}

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Editar Libro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Actualiza la información del libro seleccionado.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Título"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedBook?.titulo || ""}
              onChange={(event) => handleEditBookChange(event, "titulo")}
            />
            <TextField
              margin="dense"
              label="Autor"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedBook?.autor || ""}
              onChange={(event) => handleEditBookChange(event, "autor")}
            />
            <TextField
              margin="dense"
              label="Fecha de Publicación"
              type="date"
              fullWidth
              variant="outlined"
              value={selectedBook?.fecha_publicacion || ""}
              onChange={(event) =>
                handleEditBookChange(event, "fecha_publicacion")
              }
            />
            <TextField
              margin="dense"
              label="Editorial"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedBook?.editorial || ""}
              onChange={(event) => handleEditBookChange(event, "editorial")}
            />
            <TextField
              margin="dense"
              label="Categoría"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedBook?.categoria || ""}
              onChange={(event) => handleEditBookChange(event, "categoria")}
            />
            <TextField
              margin="dense"
              label="Descripción"
              type="text"
              fullWidth
              multiline
              variant="outlined"
              value={selectedBook?.descripcion || ""}
              onChange={(event) => handleEditBookChange(event, "descripcion")}
            />
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Guardar
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Eliminar Libro</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que quieres eliminar este libro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleOpenAddModal}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Agregar Nuevo Libro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Completa el siguiente formulario para agregar un nuevo libro.
          </DialogContentText>
          <form onSubmit={handleAddBookSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Título"
              type="text"
              fullWidth
              variant="outlined"
              value={newBook.titulo}
              onChange={(event) => handleAddBookChange(event, "titulo")}
            />
            <TextField
              margin="dense"
              label="Autor"
              type="text"
              fullWidth
              variant="outlined"
              value={newBook.autor}
              onChange={(event) => handleAddBookChange(event, "autor")}
            />
            <TextField
              margin="dense"
              label="Fecha de Publicación"
              type="date"
              fullWidth
              variant="outlined"
              value={newBook.fecha_publicacion}
              onChange={(event) =>
                handleAddBookChange(event, "fecha_publicacion")
              }
            />
            <TextField
              margin="dense"
              label="Editorial"
              type="text"
              fullWidth
              variant="outlined"
              value={newBook.editorial}
              onChange={(event) => handleAddBookChange(event, "editorial")}
            />
            <TextField
              margin="dense"
              label="Categoría"
              type="text"
              fullWidth
              variant="outlined"
              value={newBook.categoria}
              onChange={(event) => handleAddBookChange(event, "categoria")}
            />
            <TextField
              margin="dense"
              label="Descripción"
              type="text"
              fullWidth
              multiline
              variant="outlined"
              value={newBook.descripcion}
              onChange={(event) => handleAddBookChange(event, "descripcion")}
            />
            <DialogActions>
              <Button onClick={handleCloseAddModal} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Agregar
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
