import React from 'react';

const CategoriaFiltro = ({ categorias, onCategoriaSeleccionada }) => {
  const handleFiltrar = (categoria) => {
    if (onCategoriaSeleccionada) {
      onCategoriaSeleccionada(categoria);
    }
  };

  return (
    <div className="categoria-filtro">
      <button onClick={() => handleFiltrar('')}>Todas</button>
      {categorias.map((categoria, index) => (
        <button key={index} onClick={() => handleFiltrar(categoria)}>
          {categoria}
        </button>
      ))}
    </div>
  );
};

export default CategoriaFiltro;