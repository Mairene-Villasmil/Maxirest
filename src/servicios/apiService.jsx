import axios from 'axios';

const API_BASE_URL = 'https://api-mconn.maxisistemas.com.ar';

export const obtenerToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email: 'diegosebastianalbo@gmail.com',
      pass: 'Mantenimiento2022',
      cod_cli: '14536',
    });
    return response.data.content.tokenAccess;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
};

export const obtenerArticulos = async (token, fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menuweb/menuextendido`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        fechaInicio,
        fechaFin
      }
    });
    return response.data.content;
  } catch (error) {
    console.error('Error al obtener los artículos:', error);
    throw error;
  }
};

export const obtenerVentasPorArticulo = async (token, desde, hasta) => {
  const response = await axios.get('/api/ventasPorArticulo', {
    headers: { Authorization: `Bearer ${token}` },
    params: { desde, hasta }
  });
  return response.data;
};

