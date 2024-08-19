import apiClient from './apiClient';

export const getBooks = async () => {
  try {
    const response = await apiClient.get('https://kqwpa7r6ec.execute-api.us-east-2.amazonaws.com/Prod/all');
    return response.data;
  } catch (error) {
    console.error("Error fetching books: ", error);
    throw error;
  }
};

export const updateBook = async (book) => {
  try {
    const response = await apiClient.put('https://kqwpa7r6ec.execute-api.us-east-2.amazonaws.com/Prod/edi', book);
    return response.data;
  } catch (error) {
    console.error("Error editing book: ", error);
    throw error;
  }
};

export const deleteBook = async (idbook) => {
  try {
    const response = await apiClient.delete(`https://kqwpa7r6ec.execute-api.us-east-2.amazonaws.com/Prod/delete/${idbook}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting book: ", error);
    throw error;
  }
};

export const createBook = async (book) => {
  try {
    const response = await apiClient.post('https://kqwpa7r6ec.execute-api.us-east-2.amazonaws.com/Prod/add', book);
    return response.data;
  } catch (error) {
    console.error("Error creating book: ", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await apiClient.get('https://fwa4x6g5k8.execute-api.us-east-2.amazonaws.com/Prod/all');
    return response.data;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const addUser = async (user) => {
  try {
    const response = await apiClient.post('https://fwa4x6g5k8.execute-api.us-east-2.amazonaws.com/Prod/add', user);
    return response.data;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
};

export const deleteUser = async (username) => {
  console.log(username)
  try {
    const response = await apiClient.post('https://fwa4x6g5k8.execute-api.us-east-2.amazonaws.com/Prod/delete_user', username);
    return response.data;
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw error;
  }
};

export const login = async (login) => {
  try {
    const response = await apiClient.post('https://apfgm8t067.execute-api.us-east-2.amazonaws.com/Prod/login', login);
    return response.data;
  } catch (error) {
    console.error("Error login: ", error);
    throw error;
  }
};

export const changePassword = async (change) => {
  try {
    const response = await apiClient.post('https://apfgm8t067.execute-api.us-east-2.amazonaws.com/Prod/change-password', change);
    return response.data;
  } catch (error) {
    console.error("Error changing password: ", error);
    throw error;
  }
};



export const crearPrestamo = async (prestamo) => {
  try {
    const response = await apiClient.post('https://apfgm8t067.execute-api.us-east-2.amazonaws.com/Prod/create_prestamo', prestamo);
    return response.data;
  } catch (error) {
    console.error("Error create prestamo: ", error);
    throw error;
  }
};


export const recuperarPrestamos = async () => {
  try {
    const response = await apiClient.get('https://eomnbralql.execute-api.us-east-2.amazonaws.com/Prod/prestamos');
    return response.data;
  } catch (error) {
    console.error("Error fetching prestamos: ", error);
    throw error;
  }
};

export const eliminarPrestamo = async (prestamo) => {
  try {
    const response = await apiClient.post('https://eomnbralql.execute-api.us-east-2.amazonaws.com/Prod/low_prestamo', prestamo);
    return response.data;
  } catch (error) {
    console.error("Error deleting prestamo: ", error);
    throw error;
  }
};
