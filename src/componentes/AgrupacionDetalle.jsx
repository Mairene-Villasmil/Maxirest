import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AgrupacionDetalle = ({ agrupacionSeleccionada, articulosPorAgrupacion }) => {
  if (!agrupacionSeleccionada || !articulosPorAgrupacion) return null;

  const agrupacionNombre = agrupacionSeleccionada.nombre;
  const agrupacionData = articulosPorAgrupacion[agrupacionNombre];

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Agrupación: {agrupacionNombre}
      </Typography>

      {Object.entries(agrupacionData).map(([rubroNombre, subrubros]) => (
        <Accordion key={rubroNombre} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{rubroNombre}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(subrubros).map(([subrubroNombre, articulos]) => (
              articulos.length > 0 && (
                <Accordion key={subrubroNombre} sx={{ ml: 2 }} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">{subrubroNombre}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {articulos.map((articulo) => (
                      <Typography key={articulo.id} variant="body2" sx={{ ml: 2 }}>
                        - {articulo.nombre}
                      </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              )
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AgrupacionDetalle;
