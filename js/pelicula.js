const parametros = new URLSearchParams(window.location.search);
const id = Number(parametros.get("id"));
const pelicula = peliculasHTML.find(p=>p.id==id);
if(pelicula){
    document.querySelector(".portada img").src = pelicula.imagen;
    document.querySelector(".info h1").textContent=pelicula.titulo;
    
}