import React, { useState } from 'react';

const Buscador = ({ articulos, setFiltroBusqueda }) => {
  const [inputValue, setInputValue] = useState('');
  const [sugerencias, setSugerencias] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setFiltroBusqueda(value); // Actualiza el filtro de búsqueda principal

    if (value.length > 0) {
      const sugerenciasFiltradas = articulos.filter(articulo =>
        articulo.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSugerencias(sugerenciasFiltradas);
    } else {
      setSugerencias([]);
    }
  };

  const seleccionarSugerencia = (nombre) => {
    setInputValue(nombre);
    setFiltroBusqueda(nombre);
    setSugerencias([]);
  };

  return (
    <div className="buscador">
      <input
        type="text"
        placeholder="Buscar artículo..."
        value={inputValue}
        onChange={handleChange}
      />
      {sugerencias.length > 0 && (
        <ul className="sugerencias">
          {sugerencias.map((articulo) => (
            <li
              key={articulo.nombre}
              onClick={() => seleccionarSugerencia(articulo.nombre)}
            >
              {articulo.nombre}
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .buscador {
          position: relative;
        }
        .sugerencias {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: white;
          border: 1px solid #ccc;
          list-style: none;
          padding: 0;
          margin: 0;
          z-index: 1;
        }
        .sugerencias li {
          padding: 8px;
          cursor: pointer;
        }
        .sugerencias li:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Buscador;