import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import '../css/Navbar.css';
import ThemeToggle from './ThemeToggle';
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
    const agrupacionSeleccionada = agrupaciones.find(a => a.rubro === rubro) || null;
    if (setAgrupacionSeleccionada) {
      setAgrupacionSeleccionada(agrupacionSeleccionada);
    }

    // Limpiar búsqueda al seleccionar agrupación
    if (setFiltroBusqueda) {
      setFiltroBusqueda('');
      setBusqueda('');
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
        <Buscador value={busqueda} setFiltroBusqueda={handleBuscar} />
        <FormControl size="small" sx={{ minWidth: 180, ml: 2 }}>
          <InputLabel>Agrupaciones</InputLabel>
          <Select
            value={agrupacionSeleccionada ? agrupacionSeleccionada.rubro : ''}
            onChange={handleAgrupacionChange}
            label="Agrupaciones"
          >
            <MenuItem value="">Ver todas</MenuItem>
            {agrupaciones.map((agrupacion, idx) => (
              <MenuItem key={idx} value={agrupacion.rubro}>
                {agrupacion.rubro}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ThemeToggle />
      </div>
    </nav>
  );
};


export default Navbar;