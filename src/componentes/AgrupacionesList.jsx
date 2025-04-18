import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Button, Modal, Checkbox, TextField, Box, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { obtenerArticulos } from '../servicios/apiService';

const AgrupacionesList = ({ agrupaciones, onEliminar, onEliminarArticulo, onAgregarArticulos }) => {
  const [todosArticulos, setTodosArticulos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [articulosSeleccionados, setArticulosSeleccionados] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [agrupacionSeleccionada, setAgrupacionSeleccionada] = useState(null);

  // Cargar artículos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const articulos = await obtenerArticulos();
        setTodosArticulos(articulos);
      } catch (error) {
        console.error('Error al cargar los artículos:', error);
      }
    };
    fetchData();
  }, []);

  // Función para abrir el modal de agregar artículos
  const handleAgregarArticulos = (agrupacion) => {
    setAgrupacionSeleccionada(agrupacion);
    setModalOpen(true);
  };

  // Maneja la selección de artículos
  const handleSelectArticulo = (articulo) => {
    setArticulosSeleccionados((prevState) =>
      prevState.includes(articulo)
        ? prevState.filter((item) => item !== articulo)
        : [...prevState, articulo]
    );
  };

  // Filtra los artículos según la búsqueda
  const filterArticulos = (articulos) => {
    if (!searchQuery) return articulos;
    return articulos.filter(articulo =>
      articulo.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Agrega los artículos seleccionados a la agrupación
  const agregarArticulosAGrupacion = () => {
    const agrupacionesActualizadas = [...agrupaciones];
    const agrupacion = agrupacionesActualizadas.find(
      (agrup) => agrup.id === agrupacionSeleccionada.id
    );

    agrupacion.articulos = [
      ...agrupacion.articulos,
      ...articulosSeleccionados
    ];

    localStorage.setItem("agrupaciones", JSON.stringify(agrupacionesActualizadas));
    setArticulosSeleccionados([]);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Agrupaciones Creadas</h1>
      {agrupaciones.map((agrupacion) => (
        <Accordion key={agrupacion.id} sx={{ mb: 2, borderRadius: '8px', boxShadow: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{agrupacion.rubro}</Typography>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => onEliminar(agrupacion.id)}
              sx={{ ml: 2 }}
            >
              <DeleteIcon />
            </IconButton>
          </AccordionSummary>

          <AccordionDetails>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleAgregarArticulos(agrupacion)}
                sx={{ backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#303f9f' } }}
              >
                Agregar Artículos
              </Button>
            </Box>
            
            {/* Lista de artículos de la agrupación */}
            {agrupacion.articulos && agrupacion.articulos.length > 0 ? (
              agrupacion.articulos.map((articulo) => (
                <Box key={articulo.id} display="flex" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>{articulo.nombre}</Typography>
                  <IconButton 
                    color="error" 
                    onClick={() => onEliminarArticulo(agrupacion.id, articulo.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">No hay artículos en esta agrupación</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Modal para agregar artículos */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            overflowY: 'auto',
            maxHeight: '80vh',
            width: '90%',
            maxWidth: 700,
            margin: '50px auto',
            padding: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Agregar Artículos a Agrupación: {agrupacionSeleccionada?.rubro}
          </Typography>

          <TextField
            label="Buscar Artículos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Lista filtrada de artículos */}
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1, mb: 2 }}>
            {filterArticulos(todosArticulos).map((articulo) => {
              // No mostrar los artículos ya agregados a la agrupación
              if (agrupacionSeleccionada.articulos.some(a => a.id === articulo.id)) {
                return null;
              }

              return (
                <Box key={articulo.id} display="flex" alignItems="center" sx={{ pl: 2, mb: 1 }}>
                  <Checkbox
                    checked={articulosSeleccionados.includes(articulo)}
                    onChange={() => handleSelectArticulo(articulo)}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>{articulo.nombre}</Typography>
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Botón para agregar los artículos seleccionados */}
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button 
              onClick={agregarArticulosAGrupacion} 
              variant="contained" 
              color="success" 
              sx={{ padding: '8px 20px', backgroundColor: '#388e3c', '&:hover': { backgroundColor: '#2c6e2e' } }}
            >
              Agregar Artículos
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AgrupacionesList;
