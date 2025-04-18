import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import TablaArticulos from './componentes/TablaArticulos';
import Agrupaciones from './componentes/Agrupaciones';
import AgrupacionesList from './componentes/AgrupacionesList';
import { obtenerToken, obtenerArticulos } from './servicios/apiService';

const App = () => {
  const location = useLocation();
  const [articulos, setArticulos] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [agrupacionSeleccionada, setAgrupacionSeleccionada] = useState(null);
  const [agrupaciones, setAgrupaciones] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Función para recargar las agrupaciones desde localStorage
  const recargarAgrupaciones = () => {
    const agrupacionesGuardadas = JSON.parse(localStorage.getItem('agrupaciones')) || [];
    setAgrupaciones(agrupacionesGuardadas);
  };

  // Llamada a la API para obtener artículos
  const fetchArticulos = async () => {
    try {
      const tokenObtenido = await obtenerToken();
      const articulosObtenidos = await obtenerArticulos(tokenObtenido, fechaInicio, fechaFin);
      setArticulos(articulosObtenidos);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  // Efecto para obtener artículos cuando cambia la fecha
  useEffect(() => {
    fetchArticulos();
  }, [fechaInicio, fechaFin]);

  // Efecto para recargar agrupaciones cuando la ubicación cambia
  useEffect(() => {
    recargarAgrupaciones();
  }, [location]);

  // Efecto para obtener artículos al inicio
  useEffect(() => {
    fetchArticulos();
  }, []);

  return (
    <>
      <Navbar
        setFiltroBusqueda={setFiltroBusqueda}
        agrupaciones={agrupaciones}
        setAgrupacionSeleccionada={setAgrupacionSeleccionada}
        agrupacionSeleccionada={agrupacionSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />

      <Routes>
        <Route
          path="/"
          element={
            <TablaArticulos
              articulos={articulos}
              filtroBusqueda={filtroBusqueda}
              setFiltroBusqueda={setFiltroBusqueda}
              agrupacionSeleccionada={agrupacionSeleccionada}
              categoriaSeleccionada={categoriaSeleccionada}
              setFechaInicio={setFechaInicio}
              setFechaFin={setFechaFin}
            />
          }
        />

        <Route
          path="/agrupaciones"
          element={<Agrupaciones actualizarAgrupaciones={recargarAgrupaciones} />}
        />

        <Route
          path="/agrupacioneslist"
          element={<AgrupacionesList agrupaciones={agrupaciones} />}
        />
      </Routes>
    </>
  );
};

export default App;