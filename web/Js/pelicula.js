document.addEventListener('DOMContentLoaded', async () => {
    const id = obtenerIdPelicula();
    const portada = document.querySelector('.portada img');
    const titulo = document.querySelector('.info h1');
    const datos = document.querySelector('.info p:first-of-type');
    const descripcion = document.querySelector('.info p:last-of-type');
    const botonContinuar = document.querySelector('.accion .boton');

    let pelicula = obtener('pelicula');

    try {
    pelicula = await pedirJSON(`${API_BASE}/peliculas/${id}`);
    guardar('pelicula', pelicula);
    } catch (error) {
    console.error(error);
    }

    if (!pelicula) return;

    document.title = `Cinemax - ${pelicula.titulo}`;
    portada.src = pelicula.imagen;
    portada.alt = pelicula.titulo;
    titulo.textContent = pelicula.titulo;
    datos.textContent = `${pelicula.genero} • ${pelicula.duracion} • ${pelicula.anio}`;
    descripcion.textContent = pelicula.descripcion;

    const detalles = document.querySelectorAll('.detalles .dato p');
    if (detalles[0]) detalles[0].textContent = pelicula.sala;
    if (detalles[1]) detalles[1].textContent = pelicula.idioma;
    if (detalles[2]) detalles[2].textContent = pelicula.formato;

    const fechas = document.querySelectorAll('.fecha');
    const horas = document.querySelectorAll('.hora');

    function activarGrupo(botones, elegido) {
    botones.forEach((boton) => boton.classList.remove('activa'));
    elegido.classList.add('activa');
    }

    fechas.forEach((boton) => {
    boton.addEventListener('click', () => activarGrupo(fechas, boton));
    });

    horas.forEach((boton) => {
    boton.addEventListener('click', () => activarGrupo(horas, boton));
    });

    botonContinuar.addEventListener('click', (event) => {
    event.preventDefault();

    const fechaActiva = document.querySelector('.fecha.activa')?.innerText.replace(/\n/g, ' ').trim() || 'Hoy 24 May';
    const horaActiva = document.querySelector('.hora.activa')?.innerText.trim() || '9:00 PM';
    const seleccionFuncion = {
        peliculaId: pelicula.id,
        fecha: fechaActiva,
        hora: horaActiva,
        sala: pelicula.sala
    };

    guardar('seleccionFuncion', seleccionFuncion);
    borrar('compraActual');
    window.location.href = `pantalla3.html?id=${pelicula.id}`;
    });
});
