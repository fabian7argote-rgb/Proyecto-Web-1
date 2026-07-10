const API_BASE = window.location.protocol === 'file:'
? 'http://localhost:3000/api'
: '/api';

const PRECIO_ENTRADA = 75;
const CARGO_SERVICIO = 15;

function guardar(clave, valor) {
localStorage.setItem(clave, JSON.stringify(valor));
}

function obtener(clave) {
const valor = localStorage.getItem(clave);
return valor ? JSON.parse(valor) : null;
}

function borrar(clave) {
localStorage.removeItem(clave);
}

function formatearBs(valor) {
return `Bs ${Number(valor).toFixed(2)}`;
}

async function pedirJSON(url, opciones = {}) {
const respuesta = await fetch(url, opciones);
const data = await respuesta.json().catch(() => ({}));

if (!respuesta.ok) {
    throw new Error(data.mensaje || 'Ocurrió un error en el servidor');
}

return data;
}

function obtenerIdPelicula() {
const params = new URLSearchParams(window.location.search);
const idURL = Number(params.get('id'));
const peliculaGuardada = obtener('pelicula');
return idURL || peliculaGuardada?.id || 1;
}

function asientoId(fila, numero) {
return `${fila}${numero}`;
}

function calcularCompra(asientos) {
  const subtotal = asientos.length * PRECIO_ENTRADA;
const total = subtotal + CARGO_SERVICIO;

return {
    cantidad: asientos.length,
    subtotal,
    cargoServicio: CARGO_SERVICIO,
    total
};
}
