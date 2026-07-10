document.addEventListener('DOMContentLoaded', async () => {
const params = new URLSearchParams(window.location.search);
const codigo = params.get('codigo');
let reserva = obtener('reservaFinal');

if (codigo) {
    try {
    reserva = await pedirJSON(`${API_BASE}/reservas/${codigo}`);
    guardar('reservaFinal', reserva);
    } catch (error) {
    console.error(error);
    }
}

if (!reserva) return;

const entradaImg = document.querySelector('.entrada img');
const detalle = document.querySelector('.detalle-entrada');
const codigoReserva = document.querySelector('.codigo-qr strong');

entradaImg.src = reserva.imagen;
entradaImg.alt = reserva.peliculaTitulo;
detalle.innerHTML = `
    <h3>${reserva.peliculaTitulo}</h3>
    <p>${reserva.fecha}</p>
    <p>${reserva.hora}</p>
    <p>${reserva.sala}</p>
    <p>Asientos: ${reserva.asientos.join(' - ')}</p>
`;
codigoReserva.textContent = reserva.codigo;

const volverInicio = document.querySelector('.btn-principal');
volverInicio.addEventListener('click', () => {
    borrar('reservaFinal');
    borrar('seleccionFuncion');
});
});
