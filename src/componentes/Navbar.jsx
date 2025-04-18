import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import '../css/Navbar.css';
import Buscador from './Buscador';

const Navbar = ({
  setFiltroBusqueda,
  agrupaciones = [],
  setAgrupacionSeleccionada,
  agrupacionSeleccionada
}) => {
  const [busqueda, setBusqueda] = useState('');

  const handleBuscar = (valor) => {
    setBusqueda(valor);
    if (setFiltroBusqueda) {
      setFiltroBusqueda(valor);
    }
    if (setAgrupacionSeleccionada) {
      setAgrupacionSeleccionada(null);  // Limpiar agrupación al buscar
    }
  };

  const handleAgrupacionChange = (event) => {
    const rubro = event.target.value;
  
    if (rubro === '') {
      // Mostrar todos los artículos al seleccionar "Ver todas"
      if (setAgrupacionSeleccionada) setAgrupacionSeleccionada(null);
      if (setFiltroBusqueda) setFiltroBusqueda('');
      setBusqueda('');
    } else {
      const agrupacionSeleccionada = agrupaciones.find(a => a.rubro === rubro) || null;
      if (setAgrupacionSeleccionada) setAgrupacionSeleccionada(agrupacionSeleccionada);
      if (setFiltroBusqueda) {
        setFiltroBusqueda('');
        setBusqueda('');
      }
    }
  };
  

  return (
    <nav className="navbar">
      <div className="logo">LOGO</div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/agrupaciones" className="nav-link">Agrupaciones</Link>
      </div>
      <div className="navbar-actions">
        {/* Buscador ahora en el Navbar */}
        <Buscador value={busqueda} setFiltroBusqueda={handleBuscar} />
        
        <FormControl size="small" sx={{ minWidth: 180, ml: 2 }}>
          <InputLabel>Agrupaciones</InputLabel>
          <Select
            value={agrupacionSeleccionada ? agrupacionSeleccionada.rubro : ''}
            onChange={handleAgrupacionChange}
            label="Agrupaciones"
          >
            {agrupaciones.map((agrupacion, idx) => (
              <MenuItem key={idx} value={agrupacion.rubro}>
                {agrupacion.rubro}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </nav>
  );
};

export default Navbar;
