import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AgrupacionesJerarquicas = ({ agrupaciones }) => {
  // Agrupar artículos por Rubro > Subrubro
  const organizarArticulos = (articulos) => {
    const estructura = {};

    articulos.forEach((art) => {
      if (!estructura[art.rubro]) {
        estructura[art.rubro] = {};
      }
      if (!estructura[art.rubro][art.categoria]) {
        estructura[art.rubro][art.categoria] = [];
      }
      estructura[art.rubro][art.categoria].push(art);
    });

    return estructura;
  };

  return (
    <Box>
      {agrupaciones.map((agrupacion, i) => {
        const estructura = organizarArticulos(agrupacion.articulos);
        return (
          <Accordion key={i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{agrupacion.nombre}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(estructura).map(([rubro, subrubros]) => (
                <Accordion key={rubro}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{rubro}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {Object.entries(subrubros).map(([subrubro, articulos]) => (
                      <Accordion key={subrubro}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>{subrubro}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List>
                            {articulos.map((art, idx) => (
                              <ListItem key={idx}>
                                <ListItemText
                                  primary={`${art.nombre}`}
                                  secondary={`Código: ${art.codigo} - $${art.precio}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default AgrupacionesJerarquicas;