import React from 'react';
import { Button } from '@mui/material';
import '../css/SidebarCategorias.css';

const SidebarCategorias = ({
  categorias,
  categoriaSeleccionada,
  onCategoriaSeleccionada,
}) => {
  const handleCategoriaClick = (categoria) => {
    onCategoriaSeleccionada(categoria);
  };

  return (
    <div className="sidebar">
      {categorias.map((categoria, index) => (
        <Button
          key={index}
          variant={categoria === categoriaSeleccionada ? 'contained' : 'outlined'}
          fullWidth
          onClick={() => handleCategoriaClick(categoria)}
          sx={{ mb: 1 }}
        >
          {categoria}
        </Button>
      ))}
    </div>
  );
};

export default SidebarCategorias;