import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, TextField, Checkbox, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { obtenerToken, obtenerArticulos } from '../servicios/apiService';
import AgrupacionesList from "./AgrupacionesList";

const Agrupaciones = () => {
    const [rubro, setRubro] = useState(""); // Nombre del rubro
    const [todosArticulos, setTodosArticulos] = useState([]);
    const [articulosSeleccionados, setArticulosSeleccionados] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [agrupaciones, setAgrupaciones] = useState([]);
    const [agrupacionSeleccionada, setAgrupacionSeleccionada] = useState(null);
    const [openModal, setOpenModal] = useState(false);


    // Actualiza las agrupaciones guardadas en localStorage
    const actualizarAgrupaciones = () => {
        const agrupacionesGuardadas = JSON.parse(localStorage.getItem("agrupaciones")) || [];
        setAgrupaciones(agrupacionesGuardadas);
    };

    useEffect(() => {
        const agrupacionesGuardadas = JSON.parse(localStorage.getItem("agrupaciones")) || [];
        setAgrupaciones(agrupacionesGuardadas);

        const fetchData = async () => {
            try {
                const token = await obtenerToken();
                const articulos = await obtenerArticulos(token);
                setTodosArticulos(articulos);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar los artículos:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const elementosOcupados = new Set(
        agrupaciones.flatMap(ag => [
            ...(Array.isArray(ag.categorias) ? ag.categorias : []),
            ...(Array.isArray(ag.articulos) ? ag.articulos.map(art => art.nombre) : [])
        ])
    );

    // Maneja la selección de categorías
    const handleSelectCategoria = (categoria, articulos) => {
        setCategoriasSeleccionadas((prevState) =>
            prevState.includes(categoria)
                ? prevState.filter((item) => item !== categoria)
                : [...prevState, categoria]
        );
        setArticulosSeleccionados((prevState) =>
            prevState.some(art => articulos.includes(art))
                ? prevState.filter(art => !articulos.includes(art))
                : [...prevState, ...articulos]
        );
    };

    // Maneja la selección de artículos
    const handleSelectArticulo = (articulo, categoria) => {
        setArticulosSeleccionados((prevState) =>
            prevState.includes(articulo)
                ? prevState.filter((item) => item !== articulo)
                : [...prevState, articulo]
        );
    };

    // Crea una nueva agrupación
    const crearAgrupacion = () => {
        const agrupacionesExistentes = JSON.parse(localStorage.getItem("agrupaciones")) || [];

        const idsUsados = new Set();
        agrupacionesExistentes.forEach((agr) => {
            agr.articulos?.forEach((art) => idsUsados.add(art.id));
        });

        const articulosConCategoria = articulosSeleccionados.map((art) => {
            return {
                ...art,
                categoria: obtenerCategoriaDeArticulo(art)
            };
        });

        const articulosFiltrados = articulosConCategoria.filter(
            (art) => !idsUsados.has(art.id)
        );

        if (articulosFiltrados.length === 0) {
            alert("Todos los artículos seleccionados ya están agrupados");
            return;
        }

        const agrupacionFinal = {
            rubro,
            categorias: categoriasSeleccionadas,
            articulos: articulosFiltrados
        };

        localStorage.setItem(
            "agrupaciones",
            JSON.stringify([...agrupacionesExistentes, agrupacionFinal])
        );
        actualizarAgrupaciones();
        setArticulosSeleccionados([]);
        setCategoriasSeleccionadas([]);
        setRubro("");
        setModalOpen(false);
    };

    // Obtiene la categoría de un artículo
    const obtenerCategoriaDeArticulo = (articulo) => {
        for (const categoria of categoriasSeleccionadas) {
            const rubroMatch = todosArticulos
                .flatMap(rubro => rubro.subrubros)
                .find(sub => sub.articulos.some(a => a.id === articulo.id));

            if (rubroMatch && rubroMatch.nombre === categoria) {
                return categoria;
            }
        }
        return "Sin categoría";
    };
    console.log(todosArticulos);
    // Filtra artículos por búsqueda
    const filterArticulos = (articulos) => {
        if (!searchQuery) return articulos;
        return articulos.filter(articulo =>
            articulo.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Agrupa los artículos por subrubro
    const agruparPorSubrubro = (data) => {
        const agrupado = {};

        data.forEach(rubro => {
            rubro.subrubros.forEach(subrubro => {
                const subrubroNombre = subrubro.nombre;

                if (!agrupado[subrubroNombre]) {
                    agrupado[subrubroNombre] = [];
                }

                agrupado[subrubroNombre].push({
                    nombre: rubro.nombre, // rubro como hijo
                    articulos: subrubro.articulos
                });
            });
        });

        return Object.entries(agrupado).map(([nombre, rubros]) => ({
            nombre,
            rubros
        }));
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Crear Agrupación</h2>
            <TextField
                label="Nombre del Rubro"
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                fullWidth
                className="mb-4"
            />

            <Button onClick={() => setModalOpen(true)} variant="contained" color="primary" className="mt-4">
                Buscar
            </Button>

            <Button onClick={crearAgrupacion} variant="contained" color="success" className="mt-4">
                Guardar
            </Button>

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
                        Selecciona Categorías y Artículos
                    </Typography>

                    {loading ? (
                        <Typography>Cargando artículos...</Typography>
                    ) : (
                        <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
                            {agruparPorSubrubro(todosArticulos).map((subrubro, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography fontWeight="bold">{subrubro.nombre}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {subrubro.rubros.map((rubro, idx) => (
                                            <Accordion key={idx} sx={{ mb: 1 }}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Checkbox
                                                        checked={categoriasSeleccionadas.includes(rubro.nombre)}
                                                        onChange={() => handleSelectCategoria(rubro.nombre, rubro.articulos)}
                                                        disabled={elementosOcupados.has(rubro.nombre)}
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <Typography>{rubro.nombre}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {filterArticulos(rubro.articulos).map((articulo) => (
                                                        <Box key={articulo.id} display="flex" alignItems="center" sx={{ pl: 2 }}>
                                                            <Checkbox
                                                                checked={articulosSeleccionados.includes(articulo)}
                                                                onChange={() => handleSelectArticulo(articulo, rubro.nombre)}
                                                                disabled={elementosOcupados.has(articulo.nombre)}
                                                                sx={{ mr: 1 }}
                                                            />
                                                            <Typography>{articulo.nombre}</Typography>
                                                        </Box>
                                                    ))}
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    )}

                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button onClick={() => setModalOpen(false)} variant="contained" color="secondary">
                            Crear
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <AgrupacionesList
                agrupaciones={agrupaciones}
                onEliminar={(index) => {
                    const nuevas = [...agrupaciones];
                    nuevas.splice(index, 1);
                    setAgrupaciones(nuevas);
                }}
                onAgregarArticulos={(index) => {
                    setAgrupacionSeleccionada(index);
                    setOpenModal(true);
                }}
                onEliminarArticulo={(indexAgrupacion, articuloId) => {
                    const nuevas = [...agrupaciones];
                    nuevas[indexAgrupacion].articulos = nuevas[indexAgrupacion].articulos.filter(a => a.id !== articuloId);
                    setAgrupaciones(nuevas);
                }}
            />


        </div>
    );
};

export default Agrupaciones