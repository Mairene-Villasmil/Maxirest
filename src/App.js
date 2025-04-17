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

  const recargarAgrupaciones = () => {
    const agrupacionesGuardadas = JSON.parse(localStorage.getItem('agrupaciones')) || [];
    setAgrupaciones(agrupacionesGuardadas);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenObtenido = await obtenerToken();
        const articulosObtenidos = await obtenerArticulos(tokenObtenido);
        setArticulos(articulosObtenidos);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    recargarAgrupaciones();
  }, [location]);

  return (
    <>
      <Navbar
        setFiltroBusqueda={setFiltroBusqueda}
        agrupaciones={agrupaciones}
        setAgrupacionSeleccionada={setAgrupacionSeleccionada}
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
              setAgrupacionSeleccionada={setAgrupacionSeleccionada}
            />
          }
        />

        <Route
          path="/agrupaciones"
          element={<Agrupaciones actualizarAgrupaciones={recargarAgrupaciones} />}
        />
        <Route path="/agrupacioneslist" element={<AgrupacionesList />} />
      </Routes>
    </>
  );
};

export default App;