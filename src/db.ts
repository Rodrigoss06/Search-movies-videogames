import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
import { Movie } from './types';

// Carga las variables de entorno
dotenv.config();

const pgp = pgPromise();

const db = pgp({
  connectionString: process.env.RENDER_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
// Función para verificar la conexión
export async function verifyConnection() {
  try {
    await db.connect();
    console.log('Conectado a la base de datos de Render');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}


// Función para obtener todas las películas
export async function getMovies() {
    try {
        const data = await db.any("SELECT * FROM movies");
        const convertedData = data.map((movie) => {
          // Iterar sobre cada atributo del objeto movie y aplicar convertirTipoDato
          for (let key in movie) {
            if (movie.hasOwnProperty(key)) {
              movie[key] = convertirTipoDato(movie[key]);
            }
          }
          return movie;
        });
        return convertedData;
      } catch (error) {
        console.error("Error al seleccionar datos de la tabla movies:", error);
        return [];
      }
}
function convertirTipoDato(value: any) {
    if (value === "True" || value === "False") {
      return value === "True";
    } else if (!isNaN(parseFloat(value))) {
      return parseFloat(value);
    } else if (
      typeof value === "string" &&
      value.startsWith("[") &&
      value.endsWith("]")
    ) {
      try {
        const array = [];
        interface Acumulador {
          claves: string[];
          valores: any[];
        }
        const objetosConComillasCorregidas = value.replace(/'([^']*)'/g, '"$1"');
  
        const objetosSeparados = objetosConComillasCorregidas
          .slice(1, -1)
          .match(/\{[^{}]+\}/g);
        const resultado = objetosSeparados!.map((objeto: string) => {
          try {
            const objetoParseado: { [key: string]: any } = JSON.parse(objeto);
            const objetoConClavesYValores: any = objetoParseado;
            return objetoConClavesYValores;
          } catch (error) {
            console.log(error);
            return value;
          }
        });
        return resultado;
      } catch (error) {
        return value;
      }
    } else {
      return value;
    }
  }
export default db;
