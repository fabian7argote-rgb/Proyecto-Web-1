document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.querySelector('.cartelera-img');
    if (!contenedor) return;

    try {
    const peliculas = await pedirJSON(`${API_BASE}/peliculas`);
    contenedor.innerHTML = '';

    peliculas.forEach((pelicula) => {
        const article = document.createElement('article');
        article.className = 'pelicula';
        article.tabIndex = 0;
        article.innerHTML = `
        <img src="${pelicula.imagen}" alt="${pelicula.titulo}">
        <h3>${pelicula.titulo}</h3>
        <p>${pelicula.genero}</p>
        `;

        article.addEventListener('click', () => {
        guardar('pelicula', pelicula);
        borrar('seleccionFuncion');
        borrar('compraActual');
        window.location.href = `pelicula.html?id=${pelicula.id}`;
        });

        article.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') article.click();
        });

        contenedor.appendChild(article);
    });
    } catch (error) {
    contenedor.innerHTML = `<p class="mensaje-error">No se pudo cargar la cartelera. Revisa que el servidor esté encendido.</p>`;
    console.error(error);
    }
});
