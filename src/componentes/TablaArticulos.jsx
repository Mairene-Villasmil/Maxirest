import React, { useState, useEffect, useMemo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import SidebarCategorias from './SidebarCategorias';
import '../css/TablaArticulos.css';

const TablaArticulos = ({
  articulos,
  filtroBusqueda,
  agrupacionSeleccionada,
  setAgrupacionSeleccionada,
  setFiltroBusqueda,
}) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [articulosFiltrados, setArticulosFiltrados] = useState([]);

  const [incrementos, setIncrementos] = useState({}); // Para almacenar el incremento por artículo

  const agrupaciones = JSON.parse(localStorage.getItem('agrupaciones')) || [];

  const categorias =
    agrupacionSeleccionada && agrupacionSeleccionada.articulos
      ? [...new Set(agrupacionSeleccionada.articulos.map(a => a.rubro))]
      : ['Todos', ...new Set(articulos.map(rubro => rubro.nombre))];

  useEffect(() => {
    const buscarFiltrados = () => {
      if (agrupacionSeleccionada) {
        const articulosFiltrados = agrupacionSeleccionada.articulos.filter(articulo =>
          articulo.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
        );

        setArticulosFiltrados(articulosFiltrados);
      } else {
        const resultado = articulos.filter(articulo =>
          articulo.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
        );
        setArticulosFiltrados(resultado);
      }
    };

    buscarFiltrados();
  }, [agrupacionSeleccionada, filtroBusqueda, articulos]);

  const jerarquia = useMemo(() => {
    if (agrupacionSeleccionada) {
      return construirJerarquiaDesdeAgrupacion(articulosFiltrados);
    }
    return [];
  }, [articulosFiltrados, agrupacionSeleccionada]);

  function construirJerarquiaDesdeAgrupacion(articulosAgrupacion) {
    const jerarquia = [];
  
    articulosAgrupacion.forEach(articulo => {
      const rubroNombre = articulo.rubro || 'Sin Rubro';
      const subrubroNombre = articulo.subrubro || 'Sin Subrubro';
  
      let rubro = jerarquia.find(r => r.nombre === rubroNombre);
      if (!rubro) {
        rubro = { nombre: rubroNombre, subrubros: [] };
        jerarquia.push(rubro);
      }
  
      let subrubro = rubro.subrubros.find(s => s.nombre === subrubroNombre);
      if (!subrubro) {
        subrubro = { nombre: subrubroNombre, articulos: [] };
        rubro.subrubros.push(subrubro);
      }
  
      subrubro.articulos.push(articulo);
    });
  
    return jerarquia;
  }

  const handleCategoriaSeleccionada = (categoria) => {
    if (categoria.startsWith('agrupacion:')) {
      const nombreAgrupacion = categoria.replace('agrupacion:', '');
      const agrupacionesGuardadas = JSON.parse(localStorage.getItem('agrupaciones')) || [];
      const agrupacion = agrupacionesGuardadas.find(a => a.nombre === nombreAgrupacion);
      setAgrupacionSeleccionada(agrupacion);
      setCategoriaSeleccionada(''); // se resetea el rubro
    } else {
      setCategoriaSeleccionada(categoria); // es rubro
    }
    setFiltroBusqueda('');
  };

  const handleIncrementoChange = (articuloId, value) => {
    // Actualiza el incremento para un artículo específico
    setIncrementos(prev => ({
      ...prev,
      [articuloId]: value,
    }));
  };

  return (
    <div className="tabla-articulos-container">
      <SidebarCategorias
        categorias={categorias}
        agrupaciones={agrupaciones}
        agrupacionSeleccionada={agrupacionSeleccionada}
        categoriaSeleccionada={categoriaSeleccionada}
        onCategoriaSeleccionada={handleCategoriaSeleccionada}
      />

      <div className="tabla-content">
        <h1>Gestión de Artículos</h1>

        {agrupacionSeleccionada ? (
          jerarquia.length === 0 ? (
            <p>No hay artículos en esta agrupación.</p>
          ) : (
            jerarquia.map(rubro => (
              <Accordion key={rubro.nombre}>
                <AccordionSummary>
                  {rubro.nombre}
                </AccordionSummary>
                <AccordionDetails>
                  {rubro.subrubros.map(subrubro => (
                    <Accordion key={subrubro.nombre}>
                      <AccordionSummary>
                        {subrubro.nombre}
                      </AccordionSummary>
                      <AccordionDetails>
                        <table className="tabla-articulos">
                          <thead>
                            <tr>
                              <th>Código</th>
                              <th>Nombre</th>
                              <th>Precio ($)</th>
                              <th>Incremento (%)</th>
                              <th>Precio Final ($)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subrubro.articulos.map(articulo => {
                              const incremento = incrementos[articulo.id] || 0;
                              const precioConIncremento = articulo.precio * (1 + incremento / 100);
                              return (
                                <tr key={articulo.id}>
                                  <td>{articulo.codigo}</td>
                                  <td>{articulo.nombre}</td>
                                  <td>{articulo.precio}</td>
                                  <td>
                                    <TextField
                                      type="number"
                                      value={incremento}
                                      onChange={(e) => handleIncrementoChange(articulo.id, e.target.value)}
                                      InputProps={{ inputProps: { min: 0 } }}
                                      variant="outlined"
                                      size="small"
                                    />
                                  </td>
                                  <td>{precioConIncremento.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))
          )
        ) : (
          // ✅ Tabla normal si no hay agrupación
          <table className="tabla-articulos">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio ($)</th>
                <th>Incremento (%)</th>
                <th>Precio Final ($)</th>
              </tr>
            </thead>
            <tbody>
              {articulosFiltrados.map(articulo => {
                const incremento = incrementos[articulo.id] || 0;
                const precioConIncremento = articulo.precio * (1 + incremento / 100);
                return (
                  <tr key={articulo.id}>
                    <td>{articulo.codigo}</td>
                    <td>{articulo.nombre}</td>
                    <td>{articulo.precio}</td>
                    <td>
                      <TextField
                        type="number"
                        value={incremento}
                        onChange={(e) => handleIncrementoChange(articulo.id, e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                        variant="outlined"
                        size="small"
                      />
                    </td>
                    <td>{precioConIncremento.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TablaArticulos;

