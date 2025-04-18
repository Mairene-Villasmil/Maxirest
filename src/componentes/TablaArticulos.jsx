// import React, { useState, useEffect, useMemo } from 'react';
// import { Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
// import SidebarCategorias from './SidebarCategorias';
// import '../css/TablaArticulos.css';

// const TablaArticulos = ({
//   articulos,
//   filtroBusqueda,
//   agrupacionSeleccionada,
//   setAgrupacionSeleccionada,
//   setFiltroBusqueda,
// }) => {
//   const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
//   const [articulosFiltrados, setArticulosFiltrados] = useState([]);
//   const [incrementos, setIncrementos] = useState({});
// console.log(articulosFiltrados);

//   // Revisa que agrupaciones y categorías se obtienen correctamente del localStorage
//   const agrupaciones = JSON.parse(localStorage.getItem('agrupaciones')) || [];

//   // Se asegura de que las categorías estén bien formateadas
//   const categorias = agrupacionSeleccionada && agrupacionSeleccionada.articulos
//     ? [...new Set(agrupacionSeleccionada.articulos.map(a => a.rubro))]
//     : ['Todos', ...new Set(articulos.map(rubro => rubro.nombre))];

//   useEffect(() => {
//     const buscarFiltrados = () => {
//       if (agrupacionSeleccionada) {
//         // Filtramos por agrupación
//         const articulosFiltrados = agrupacionSeleccionada.subrubros?.flatMap(subrubro => 
//           subrubro.articulos.filter(articulo => articulo.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()))
//         );
//         setArticulosFiltrados(articulosFiltrados || []);
//       } else {
//         // Filtramos por artículos directamente
//         const resultado = articulos.filter(articulo =>
//           articulo.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
//         );
//         setArticulosFiltrados(resultado);
//       }
//     };

//     buscarFiltrados();
//   }, [agrupacionSeleccionada, filtroBusqueda, articulos]);

//   const jerarquia = useMemo(() => {
//     if (agrupacionSeleccionada) {
//       return construirJerarquiaDesdeAgrupacion(articulosFiltrados);
//     }
//     return [];
//   }, [articulosFiltrados, agrupacionSeleccionada]);

//   function construirJerarquiaDesdeAgrupacion(articulosAgrupacion) {
//     const jerarquia = [];
  
//     articulosAgrupacion.forEach(articulo => {
//       const rubroNombre = articulo.rubro || 'Sin Rubro';
//       const subrubroNombre = articulo.subrubro || 'Sin Subrubro';
  
//       let rubro = jerarquia.find(r => r.nombre === rubroNombre);
//       if (!rubro) {
//         rubro = { nombre: rubroNombre, subrubros: [] };
//         jerarquia.push(rubro);
//       }
  
//       let subrubro = rubro.subrubros.find(s => s.nombre === subrubroNombre);
//       if (!subrubro) {
//         subrubro = { nombre: subrubroNombre, articulos: [] };
//         rubro.subrubros.push(subrubro);
//       }
  
//       subrubro.articulos.push(articulo);
//     });
  
//     return jerarquia;
//   }

//   const handleCategoriaSeleccionada = (categoria) => {
//     if (categoria.startsWith('agrupacion:')) {
//       const nombreAgrupacion = categoria.replace('agrupacion:', '');
//       const agrupacionesGuardadas = JSON.parse(localStorage.getItem('agrupaciones')) || [];
//       const agrupacion = agrupacionesGuardadas.find(a => a.nombre === nombreAgrupacion);
//       setAgrupacionSeleccionada(agrupacion);
//       setCategoriaSeleccionada(''); // se resetea el rubro
//     } else {
//       setCategoriaSeleccionada(categoria); // es rubro
//     }
//     setFiltroBusqueda('');
//   };

//   const handleIncrementoChange = (articuloId, value) => {
//     // Actualiza el incremento para un artículo específico
//     setIncrementos(prev => ({
//       ...prev,
//       [articuloId]: value,
//     }));
//   };

//   return (
//     <div className="tabla-articulos-container">
//       <SidebarCategorias
//         categorias={categorias}
//         agrupaciones={agrupaciones}
//         agrupacionSeleccionada={agrupacionSeleccionada}
//         categoriaSeleccionada={categoriaSeleccionada}
//         onCategoriaSeleccionada={handleCategoriaSeleccionada}
//       />

//       <div className="tabla-content">
//         <h1>Gestión de Artículos</h1>

//         {agrupacionSeleccionada ? (
//           jerarquia.length === 0 ? (
//             <p>No hay artículos en esta agrupación.</p>
//           ) : (
//             jerarquia.map(rubro => (
//               <Accordion key={rubro.nombre}>
//                 <AccordionSummary>
//                   {rubro.nombre}
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   {rubro.subrubros.map(subrubro => (
//                     <Accordion key={subrubro.nombre}>
//                       <AccordionSummary>
//                         {subrubro.nombre}
//                       </AccordionSummary>
//                       <AccordionDetails>
//                         <table className="tabla-articulos">
//                           <thead>
//                             <tr>
//                               <th>Código</th>
//                               <th>Nombre</th>
//                               <th>Precio ($)</th>
//                               <th>Incremento (%)</th>
//                               <th>Precio Final ($)</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {subrubro.articulos.map(articulo => {
//                               const incremento = incrementos[articulo.id] || 0;
//                               const precioConIncremento = articulo.precio * (1 + incremento / 100);
//                               return (
//                                 <tr key={articulo.id}>
//                                   <td>{articulo.codigo}</td>
//                                   <td>{articulo.nombre}</td>
//                                   <td>{articulo.precio}</td>
//                                   <td>
//                                     <TextField
//                                       type="number"
//                                       value={incremento}
//                                       onChange={(e) => handleIncrementoChange(articulo.id, e.target.value)}
//                                       InputProps={{ inputProps: { min: 0 } }}
//                                       variant="outlined"
//                                       size="small"
//                                     />
//                                   </td>
//                                   <td>{precioConIncremento.toFixed(2)}</td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </AccordionDetails>
//                     </Accordion>
//                   ))}
//                 </AccordionDetails>
//               </Accordion>
//             ))
//           )
//         ) : (
//           <table className="tabla-articulos">
//             <thead>
//               <tr>
//                 <th>Código</th>
//                 <th>Nombre</th>
//                 <th>Precio ($)</th>
//                 <th>Incremento (%)</th>
//                 <th>Precio Final ($)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {articulosFiltrados.map(articulo => {
//                 const incremento = incrementos[articulo.id] || 0;
//                 const precioConIncremento = articulo.precio * (1 + incremento / 100);
//                 return (
//                   <tr key={articulo.id}>
//                     <td>{articulo.codigo}</td>
//                     <td>{articulo.nombre}</td>
//                     <td>{articulo.precio}</td>
//                     <td>
//                       <TextField
//                         type="number"
//                         value={incremento}
//                         onChange={(e) => handleIncrementoChange(articulo.id, e.target.value)}
//                         InputProps={{ inputProps: { min: 0 } }}
//                         variant="outlined"
//                         size="small"
//                       />
//                     </td>
//                     <td>{precioConIncremento.toFixed(2)}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TablaArticulos;
import React, { useState, useEffect } from 'react';
import { obtenerToken, obtenerArticulos, obtenerVentasPorArticulo } from '../servicios/apiService';
import SidebarCategorias from './SidebarCategorias';
import '../css/TablaArticulos.css';

const TablaArticulos = ({ filtroBusqueda, agrupacionSeleccionada }) => {
  const [articulos, setArticulos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [ventasPorArticulo, setVentasPorArticulo] = useState({});
  const [objetivos, setObjetivos] = useState({});
  const [manuales, setManuales] = useState({});
  const [fechaDesde, setFechaDesde] = useState('2025-01-01');
  const [fechaHasta, setFechaHasta] = useState('2025-04-01');

// Cargar los datos iniciales
useEffect(() => {
  const cargarDatos = async () => {
    try {
      const token = await obtenerToken();
      const articulosData = await obtenerArticulos(token, fechaDesde, fechaHasta);
      setArticulos(articulosData);

      const categoriasData = articulosData.map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        subrubros: categoria.subrubros,
      }));
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  cargarDatos();
}, [fechaDesde, fechaHasta]);


  // Cargar ventas por artículo
  const cargarVentas = async () => {
    try {
      const token = await obtenerToken();
      const ventas = await obtenerVentasPorArticulo(token, fechaDesde, fechaHasta);
      setVentasPorArticulo(ventas);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, [fechaDesde, fechaHasta]);

  // Filtrar artículos según selección
  let articulosAMostrar = [];

  if (categoriaSeleccionada) {
    articulosAMostrar = categoriaSeleccionada.subrubros.flatMap((subrubro) => subrubro.articulos);
  } else if (agrupacionSeleccionada) {
    articulosAMostrar = agrupacionSeleccionada.articulos || [];
  } else {
    articulosAMostrar = categorias.flatMap((categoria) =>
      categoria.subrubros.flatMap((subrubro) => subrubro.articulos)
    );
  }

  // Filtrar por búsqueda
  const articulosFiltrados = filtroBusqueda
    ? articulosAMostrar.filter((articulo) =>
        articulo.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
      )
    : articulosAMostrar;

  // Calcular el costo en porcentaje, sugerido, y objetivos
  const calcularCostoPorcentaje = (articulo) => {
    return articulo.precio > 0 ? ((articulo.costo / articulo.precio) * 100).toFixed(2) : 0;
  };

  const calcularSugerido = (articulo) => {
    const objetivo = objetivos[articulo.id] || 0;
    return articulo.costo * (100 / (100 - objetivo));
  };

  const calcularVentaUnidades = (articulo) => ventasPorArticulo[articulo.id] || 0;

  const handleObjetivoChange = (id, value) => {
    setObjetivos({ ...objetivos, [id]: value });
  };

  const handleManualChange = (id, value) => {
    setManuales({ ...manuales, [id]: value });
  };

  return (
    <div className="tabla-articulos-container">
      <SidebarCategorias
        categorias={categorias}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />
      <div className="tabla-content">
        <h1>Gestión de Artículos</h1>

        <div className="filtros-fechas">
          <label>Desde:</label>
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
          <label>Hasta:</label>
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
          <button onClick={cargarVentas}>Actualizar Ventas</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Costo ($)</th>
              <th>Costo (%)</th>
              <th>Objetivo (%)</th>
              <th>Sugerido ($)</th>
              <th>Manual ($)</th>
              <th>Ventas (u)</th>
            </tr>
          </thead>
          <tbody>
            {articulosFiltrados.length > 0 ? (
              articulosFiltrados.map((articulo) => (
                <tr key={articulo.id}>
                  <td>{articulo.id}</td>
                  <td>{articulo.nombre}</td>
                  <td>${articulo.precio}</td>
                  <td>${articulo.costo}</td>
                  <td>{calcularCostoPorcentaje(articulo)}%</td>
                  <td>
                    <input
                      type="number"
                      value={objetivos[articulo.id] || ''}
                      onChange={(e) => handleObjetivoChange(articulo.id, e.target.value)}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>${calcularSugerido(articulo).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={manuales[articulo.id] || ''}
                      onChange={(e) => handleManualChange(articulo.id, e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>{calcularVentaUnidades(articulo)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No hay artículos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaArticulos;
