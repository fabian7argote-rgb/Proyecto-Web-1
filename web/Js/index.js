const peliculasHTML = document.querySelectorAll (".pelicula");
peliculasHTML.forEach((pelicula,index)=>{
    pelicula.addEventListener("click",()=>{
        guardar("pelicula", peliculas[index]);
        window.location.href = "pantalla2.html?id="+pelicula[index].id;
    });
});