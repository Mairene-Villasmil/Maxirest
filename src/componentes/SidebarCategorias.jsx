import React from 'react';
import { FaListAlt } from 'react-icons/fa';
import '../css/SidebarCategorias.css';

const SidebarCategorias = ({ categorias, setCategoriaSeleccionada }) => {
  return (
    <div className="sidebar">
      <h2>Categorías</h2>
      <ul>
        <li onClick={() => setCategoriaSeleccionada(null)}>
          <FaListAlt className="icono" /> Ver todas
        </li>
        {categorias.map((categoria) => (
          <li
            key={categoria.id}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            <FaListAlt className="icono" /> {categoria.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarCategorias;

