const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'web')));

function leerBD() {
const contenido = fs.readFileSync(DB_PATH, 'utf8');
return JSON.parse(contenido);
}

function guardarBD(data) {
fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function idFuncion(peliculaId, fecha, hora) {
return `${peliculaId}-${fecha}-${hora}`.replace(/\s+/g, '_');
}

function obtenerOCrearFuncion(data, peliculaId, fecha, hora) {
const id = idFuncion(peliculaId, fecha, hora);
let funcion = data.funciones.find((f) => f.id === id);

if (!funcion) {
    funcion = {
    id,
    peliculaId: Number(peliculaId),
    fecha,
    hora,
    ocupados: ['A2', 'A3', 'B3']
    };
    data.funciones.push(funcion);
    guardarBD(data);
}

return funcion;
}

app.get('/api/peliculas', (req, res) => {
const data = leerBD();
res.json(data.peliculas);
});

app.get('/api/peliculas/:id', (req, res) => {
const data = leerBD();
const pelicula = data.peliculas.find((p) => p.id === Number(req.params.id));

if (!pelicula) {
    return res.status(404).json({ mensaje: 'Película no encontrada' });
}

res.json(pelicula);
});

app.get('/api/funciones/:peliculaId', (req, res) => {
const { peliculaId } = req.params;
const { fecha = '24 May', hora = '9:00 PM' } = req.query;
const data = leerBD();
const funcion = obtenerOCrearFuncion(data, peliculaId, fecha, hora);

res.json(funcion);
});

app.post('/api/reservas', (req, res) => {
const { peliculaId, fecha, hora, sala, asientos, cliente, metodoPago, total } = req.body;

if (!peliculaId || !fecha || !hora || !Array.isArray(asientos) || asientos.length === 0) {
    return res.status(400).json({ mensaje: 'Faltan datos de la reserva.' });
}

const data = leerBD();
const pelicula = data.peliculas.find((p) => p.id === Number(peliculaId));

if (!pelicula) {
    return res.status(404).json({ mensaje: 'Película no encontrada.' });
}

const funcion = obtenerOCrearFuncion(data, peliculaId, fecha, hora);
const repetidos = asientos.filter((asiento) => funcion.ocupados.includes(asiento));

if (repetidos.length > 0) {
    return res.status(409).json({
    mensaje: `Los asientos ${repetidos.join(', ')} ya están ocupados. Elige otros asientos.`
    });
}

funcion.ocupados.push(...asientos);

const codigo = `CMX-${new Date().getFullYear()}-${String(data.reservas.length + 1).padStart(6, '0')}`;
const reserva = {
    codigo,
    peliculaId: Number(peliculaId),
    peliculaTitulo: pelicula.titulo,
    imagen: pelicula.imagen,
    fecha,
    hora,
    sala: sala || pelicula.sala,
    asientos,
    cliente,
    metodoPago,
    total,
    fechaCompra: new Date().toISOString()
};

data.reservas.push(reserva);
guardarBD(data);

res.status(201).json({ mensaje: 'Reserva creada correctamente', reserva });
});

app.get('/api/reservas/:codigo', (req, res) => {
const data = leerBD();
const reserva = data.reservas.find((r) => r.codigo === req.params.codigo);

if (!reserva) {
    return res.status(404).json({ mensaje: 'Reserva no encontrada' });
}

res.json(reserva);
});

app.listen(PORT, () => {
console.log(`Servidor Cinemax funcionando en http://localhost:${PORT}`);
});
