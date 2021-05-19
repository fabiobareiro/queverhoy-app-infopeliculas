//paquetes necesarios para el proyecto
var express = require("express");
var cors = require("cors");

const peliculasController = require("./controllers/peliculasController");

var app = express();

app.use(cors());

app.use(express.urlencoded());

app.use(express.json());

// Rutas de consulta:
app.get("/peliculas?", peliculasController.buscarPeliculas);
app.get(
  "/peliculas/recomendacion?",
  peliculasController.buscarPeliculasrecomendadas
);
app.get("/generos", peliculasController.buscarGeneros);
app.get("/peliculas/:id", peliculasController.buscarInformacionPorId);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = "8080";

app.listen(puerto, function () {
  console.log("Escuchando en el puerto " + puerto);
});
