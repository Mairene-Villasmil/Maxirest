import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Divider, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AgrupacionesList = ({ agrupaciones, onEliminar, onAgregarArticulos }) => {
  // Procesar los artículos para asegurar que tengan una categoría
  console.log(agrupaciones); // Para revisar la estructura

  const procesarArticulos = (articulos) => {
    return articulos.map((articulo) => {
      if (!articulo.categoria || articulo.categoria === "") {
        articulo.categoria = "Sin categoría"; // Asignar "Sin categoría" si no tiene categoría
      }
      return articulo;
    });
  };

  // Agrupar los artículos por categoría
  const agrupados = (articulos) => {
    const agrupados = {};
    articulos.forEach((articulo) => {
      if (!agrupados[articulo.categoria]) {
        agrupados[articulo.categoria] = [];
      }
      agrupados[articulo.categoria].push(articulo);
    });
    console.log(articulos);
    return agrupados;
  };

  return (
    <div>
      <h3>Agrupaciones Existentes</h3>
      {agrupaciones.length === 0 ? (
        <Typography>No hay agrupaciones creadas.</Typography>
      ) : (
        agrupaciones.map((agrupacion, index) => {
          // Procesamos los artículos antes de agrupar
          const articulosProcesados = procesarArticulos(agrupacion.articulos);
          const agrupadosPorCategoria = agrupados(articulosProcesados);

          return (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{agrupacion.rubro}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {Object.keys(agrupadosPorCategoria).map((categoria, catIndex) => {
                  if (categoria === "Sin categoría") {
                    // Solo mostrar un acordeón de "Sin categoría"
                    return (
                      <Accordion key={catIndex}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1">Sin Categoría</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                          {agrupadosPorCategoria["Sin categoría"].map((articulo) => (
                            <div key={articulo.id} style={{ padding: '8px 0' }}>
                              <Typography variant="body2">
                                {articulo.nombre} - ${articulo.precio}
                              </Typography>
                              <Divider />
                            </div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    );
                  } else {
                    // Mostrar solo las categorías que no sean "Sin categoría"
                    return (
                      <Accordion key={catIndex}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1">{categoria}</Typography>
                        </AccordionSummary>

                        <AccordionDetails>                    
                          {agrupadosPorCategoria[categoria].map((articulo) => (
                            <div key={articulo.id} style={{ padding: '8px 0' }}>
                              <Typography variant="body2">
                                {articulo.nombre} - ${articulo.precio}
                              </Typography>
                                <Divider />
                            </div>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    );
                  }
                })}
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </div>
  );
};

export default AgrupacionesList;
