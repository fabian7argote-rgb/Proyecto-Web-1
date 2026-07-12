document.addEventListener('DOMContentLoaded', () => {
    const compra = obtener('compraActual');

    if (!compra) {
    alert('Primero debes seleccionar tus asientos.');
    window.location.href = 'asientos.html';
    return;
    }

    const pelicula = compra.pelicula;
    const funcion = compra.funcion;
    const img = document.querySelector('.tarjeta-pelicula img');
    const titulo = document.querySelector('.info-pelicula h3');
    const fechaHora = document.querySelector('.info-pelicula p:first-of-type');
    const sala = document.querySelector('.info-pelicula .sala');
    const entradasTexto = document.querySelector('.item-compra p');
    const entradasPrecio = document.querySelector('.item-compra span');
    const listaAsientos = document.querySelector('.lista-asientos');
    const filasCosto = document.querySelectorAll('.fila-costo span:last-child');
    const total = document.querySelector('.total-compra span');
    const botonPagar = document.querySelector('.btn-pagar');
    const volver = document.querySelector('.encabezado .volver');

    img.src = pelicula.imagen;
    img.alt = pelicula.titulo;
    titulo.textContent = pelicula.titulo;
    fechaHora.textContent = `${funcion.fecha} • ${funcion.hora}`;
    sala.textContent = funcion.sala;
    entradasTexto.textContent = `${compra.cantidad} entrada${compra.cantidad > 1 ? 's' : ''}`;
    entradasPrecio.textContent = formatearBs(compra.subtotal);

    listaAsientos.innerHTML = '';
    compra.asientos.forEach((asiento) => {
    const span = document.createElement('span');
    span.textContent = asiento;
    listaAsientos.appendChild(span);
    });

    if (filasCosto[0]) filasCosto[0].textContent = formatearBs(compra.subtotal);
    if (filasCosto[1]) filasCosto[1].textContent = formatearBs(compra.cargoServicio);
    total.textContent = formatearBs(compra.total);
    botonPagar.textContent = `PAGAR ${formatearBs(compra.total)}`;
    volver.href = `asientos.html?id=${pelicula.id}`;

    botonPagar.addEventListener('click', (event) => {
    event.preventDefault();
    const metodoPago = document.querySelector('input[name="pago"]:checked')?.value || 'Tarjeta de Crédito';
    compra.metodoPago = metodoPago;
    guardar('compraActual', compra);
    window.location.href = 'verificacion.html';
    });
});
