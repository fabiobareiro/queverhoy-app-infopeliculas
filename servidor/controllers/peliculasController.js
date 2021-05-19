const connectionbd = require("../lib/conexionbd");
const util = require("util");

async function buscarPeliculas(req, res) {
  const anio = req.query.anio;
  const titulo = req.query.titulo;
  const genero = req.query.genero;
  const columna_orden = req.query.columna_orden;
  const tipo_orden = req.query.tipo_orden;
  let pagina = req.query.pagina;
  let cantidad = req.query.cantidad;
  let pedidoSQL = "SELECT * FROM pelicula";

  if (anio || titulo || genero) {
    pedidoSQL += ` WHERE`;

    if (anio) pedidoSQL += ` anio = ${anio}`;

    if (titulo) {
      if (anio) pedidoSQL += " AND";
      pedidoSQL += ` titulo LIKE "${titulo}%"`;
    }

    if (genero) {
      if (anio || titulo) pedidoSQL += " AND";
      pedidoSQL += ` genero_id = ${genero}`;
    }
  }

  if (columna_orden && tipo_orden)
    pedidoSQL += ` ORDER BY ${columna_orden} ${tipo_orden}`;

  // //Async con await//
  // try {
  //    const query = util.promisify(connectionbd.query).bind(connectionbd)
  //    const query1 = await query(pedidoSQL)

  //    const query2 = await query(pedidoSQL)

  //     const objResp = {
  //         'pelicula': query2,
  //         'total': query1.length
  //     }
  //     res.send(JSON.stringify(objRespuesta))

  // }

  // catch(err)  {
  //     console.log(`Ocurrio un error al buscar el recurso solicitado ${err.message}`)
  //     res.status(404).send(err)
  // }

  // //Async con await//
  const query = util.promisify(connectionbd.query).bind(connectionbd);

  const objRespuesta = {};

  query(pedidoSQL)
    .then((peliculas) => {
      objRespuesta.total = peliculas.length;
      pedidoSQL += ` LIMIT ${(pagina - 1) * cantidad}, ${cantidad}`;
      return query(pedidoSQL);
    })
    .then((peliculas) => {
      objRespuesta.peliculas = peliculas;
      console.log(objRespuesta);
      res.send(JSON.stringify(objRespuesta));
    })
    .catch((err) => {
      console.log(
        `Ocurrio un error al buscar el recurso solicitado ${err.message}`
      );
      res.status(404).send(err);
    });
}

function buscarGeneros(req, res) {
  const pedidoSQL = "SELECT id_genero, nombre_genero FROM genero";
  connectionbd.query(pedidoSQL, function (err, result) {
    if (err) {
      console.log(`Ocurrio un error al buscar los parametros solicitados 
            ${err.message}`);
      return res.status(404).send(err);
    }

    const objRespuesta = {
      generos: result,
    };

    res.send(JSON.stringify(objRespuesta));
  });
}

function buscarInformacionPorId(req, res) {
  const id = req.params.id;
  const pedidoSQL = `select *, GROUP_CONCAT(actor.nombre_actor
                    SEPARATOR ', ') AS actores from pelicula 
                    JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
                    JOIN actor on actor.id_actor = actor_pelicula.actor_id 
                    JOIN genero on genero.id_genero = pelicula.genero_id 
                    WHERE pelicula.id = ${id}`;

  connectionbd.query(pedidoSQL, (err, result) => {
    if (err) {
      console.log(
        `Ocurrio un error al buscar los parametros solicitados ${err.message}`
      );
      return res.send(err);
    }

    if (result.length == 0) {
      console.log(`No se encontraron resultados con el id ${id}`);
      return res
        .status(404)
        .send(`No se encontro una pelicula con el id ${id}`);
    } else {
      const actores = result[0].actores.split(",");

      const objRespuesta = {
        pelicula: result[0],
        actores: actores,
      };

      res.send(JSON.stringify(objRespuesta));
    }
  });
}

function buscarPeliculasrecomendadas(req, res) {
  const genero = req.query.genero;
  const anio_inicio = req.query.anio_inicio;
  const anio_fin = req.query.anio_fin;
  const puntuacion = req.query.puntuacion;
  let pedidoSQL = `SELECT * FROM pelicula`;

  if (genero || anio_inicio || anio_fin || puntuacion) {
    if (genero)
      pedidoSQL += ` JOIN genero ON id_genero = pelicula.genero_id WHERE genero.nombre_genero = "${genero}"`;
    else pedidoSQL += ` WHERE`;

    if (anio_inicio && anio_fin) {
      if (genero) pedidoSQL += ` AND`;
      pedidoSQL += ` anio BETWEEN ${anio_inicio} AND ${anio_fin}`;
    }
    if (puntuacion) {
      if (genero || (anio_inicio && anio_fin)) pedidoSQL += ` AND`;
      pedidoSQL += ` puntuacion >= ${puntuacion}`;
    }
  }

  connectionbd.query(pedidoSQL, (err, result) => {
    if (err) {
      console.log(`Ocurrio un error al buscar los parametros solicitados 
            ${err.message}`);
      return res.status(404).send(err);
    }
    if (result.length == 0) {
      console.log(
        `No se encontraron resultados con los parametros solicitados`
      );
      return res
        .status(404)
        .send(
          `No se encontro una pelicula con los parametros indicados por el cliente`
        );
    } else {
      const objRespuesta = {
        peliculas: result,
      };

      return res.send(JSON.stringify(objRespuesta));
    }
  });
}

module.exports = {
  buscarPeliculas: buscarPeliculas,
  buscarGeneros: buscarGeneros,
  buscarInformacionPorId: buscarInformacionPorId,
  buscarPeliculasrecomendadas: buscarPeliculasrecomendadas,
};
