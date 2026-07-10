document.addEventListener('DOMContentLoaded', () => {
    const compra = obtener('compraActual');
    const form = document.querySelector('form');
    const volver = document.querySelector('header .volver');

    if (!compra) {
    alert('Primero debes completar la compra.');
    window.location.href = 'pago.html';
    return;
    }

    if (volver) volver.href = 'pago.html';

    form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cliente = {
        nombre: document.querySelector('#nombre').value.trim(),
        telefono: document.querySelector('#telefono').value.trim(),
        correo: document.querySelector('#correo').value.trim(),
        promociones: document.querySelector('#exclusivo').checked
    };

    const reserva = {
        peliculaId: compra.pelicula.id,
        fecha: compra.funcion.fecha,
        hora: compra.funcion.hora,
        sala: compra.funcion.sala,
        asientos: compra.asientos,
        cliente,
        metodoPago: compra.metodoPago,
        total: compra.total
    };

    try {
        const respuesta = await pedirJSON(`${API_BASE}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
        });

        guardar('reservaFinal', respuesta.reserva);
        borrar('compraActual');
        window.location.href = `final.html?codigo=${respuesta.reserva.codigo}`;
    } catch (error) {
        alert(error.message);
        window.location.href = `asientos.html?id=${compra.pelicula.id}`;
    }
    });
});
