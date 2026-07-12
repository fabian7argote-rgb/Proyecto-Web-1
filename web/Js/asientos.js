document.addEventListener('DOMContentLoaded', async () => {
const pelicula = obtener('pelicula');
const funcion = obtener('seleccionFuncion') || {
    peliculaId: pelicula?.id || obtenerIdPelicula(),
    fecha: 'Hoy 24 May',
    hora: '9:00 PM',
    sala: pelicula?.sala || 'IMAX 3D'
};

const contenedorAsientos = document.querySelector('.asientos');
const resumenImg = document.querySelector('.resumen-asientos img');
const resumenTitulo = document.querySelector('.info-resumen h3');
const resumenFecha = document.querySelector('.info-resumen .fecha');
const listaElegidos = document.querySelector('.asientos-elegidos');
const totalResumen = document.querySelector('.precio h2');
const botonContinuar = document.querySelector('.btn-continuar');
const volver = document.querySelector('.encabezado .volver');

if (!contenedorAsientos) return;

if (pelicula) {
    resumenImg.src = pelicula.imagen;
    resumenImg.alt = pelicula.titulo;
    resumenTitulo.textContent = pelicula.titulo;
    if (volver) volver.href = `pelicula.html?id=${pelicula.id}`;
}

resumenFecha.textContent = `${funcion.fecha} • ${funcion.hora} • ${funcion.sala}`;

let ocupados = [];
let seleccionados = [];

try {
    const dataFuncion = await pedirJSON(
    `${API_BASE}/funciones/${funcion.peliculaId}?fecha=${encodeURIComponent(funcion.fecha)}&hora=${encodeURIComponent(funcion.hora)}`
    );
    ocupados = dataFuncion.ocupados || [];
} catch (error) {
    alert('No se pudo conectar con el servidor. Revisa que esté encendido.');
    console.error(error);
}

function actualizarResumen() {
    listaElegidos.innerHTML = '';

    if (seleccionados.length === 0) {
    listaElegidos.innerHTML = '<small>Ninguno</small>';
    totalResumen.textContent = formatearBs(0);
    botonContinuar.classList.add('deshabilitado');
    return;
    }

    seleccionados.forEach((asiento) => {
    const span = document.createElement('span');
    span.textContent = asiento;
    listaElegidos.appendChild(span);
    });

    const compra = calcularCompra(seleccionados);
    totalResumen.textContent = formatearBs(compra.subtotal);
    botonContinuar.classList.remove('deshabilitado');
}

function renderizarAsientos() {
    contenedorAsientos.innerHTML = '';
    const filas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    filas.forEach((fila) => {
    for (let numero = 1; numero <= 8; numero++) {
        const idAsiento = asientoId(fila, numero);
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.textContent = idAsiento;
        boton.dataset.asiento = idAsiento;
        boton.className = 'asiento';

        if (ocupados.includes(idAsiento)) {
        boton.classList.add('ocupado');
        boton.disabled = true;
        } else {
        boton.classList.add('libre');
        }

        boton.addEventListener('click', () => {
        if (boton.classList.contains('ocupado')) return;

        if (seleccionados.includes(idAsiento)) {
            seleccionados = seleccionados.filter((asiento) => asiento !== idAsiento);
            boton.classList.remove('seleccionado');
            boton.classList.add('libre');
        } else {
            seleccionados.push(idAsiento);
            boton.classList.remove('libre');
            boton.classList.add('seleccionado');
        }

        actualizarResumen();
        });

        contenedorAsientos.appendChild(boton);
    }
    });
}

botonContinuar.addEventListener('click', (event) => {
    event.preventDefault();

    if (seleccionados.length === 0) {
    alert('Selecciona al menos un asiento para continuar.');
    return;
    }

    const calculo = calcularCompra(seleccionados);
    guardar('compraActual', {
    pelicula,
    funcion,
    asientos: seleccionados,
    ...calculo
    });

    window.location.href = 'pago.html';
});

renderizarAsientos();
actualizarResumen();
});
