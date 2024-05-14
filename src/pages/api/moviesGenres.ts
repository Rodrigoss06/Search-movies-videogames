import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { Genre, Movie } from "@/types";
type Data = {
  error?: string;
  genres?: string[]|undefined;
};
export const config = {
  api: {
    responseLimit: "100mb",
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const movies = await getMovies();
  const genres= movies?.map((movie:Movie)=>movie.genres).flat().map((genre:Genre)=>genre.name)
  console.log(genres)
  const uniqueGenres: string[] = Array.from(new Set(genres)).filter((genre)=>genre !== undefined && genre.trim() !== "")
  console.log(uniqueGenres)
  res.status(200).json({ genres: uniqueGenres });
}

async function getMovies(): Promise<Movie[] | undefined> {
  try {
    const fileStream = await fs.open(
      "src/movies_dataset/movies_metadata.csv",
      "r"
    );
    const movies: Movie[] = [];
    let isFirstElement = true;

    let lineCount = 1;
    for await (const line of fileStream.readLines()) {
      if (isFirstElement) {
        isFirstElement = false;
        continue;
      }
      const parts = line.match(
        /(".*?"|[^",]+|(?<=,)\s*(?=,|$)|(?<=".*?[^\\])"(?=.*?[^\\]))/g
      );

      const attributes = parts!.map((part) =>
        part.replace(/^"|"$/g, "").trim()
      );
      let encontradoNumeroDespuesIndice9 = false;

      const resultado = attributes.reduce(
        (
          acumulador: string[],
          currentValue: string,
          currentIndex: number,
          array: string[]
        ) => {
          if (currentIndex >= 10 && currentIndex < array.length - 1) {
            if (!encontradoNumeroDespuesIndice9 && esNumero(currentValue)) {
              encontradoNumeroDespuesIndice9 = true;
            }
          }
          if (encontradoNumeroDespuesIndice9) {
            acumulador.push(currentValue);
          } else {
            if (currentIndex >= 10 && currentIndex < array.length - 1) {
              if (acumulador.length === 0) {
                acumulador.push(currentValue);
              } else {
                acumulador[acumulador.length - 1] += " " + currentValue;
              }
            } else {
              acumulador.push(currentValue);
            }
          }
          return acumulador;
        },
        []
      );
      const movie: any = {
        adult: resultado[0]||"",
        belongs_to_collection: resultado[1]||"",
        budget: resultado[2]||"",
        genres: resultado[3]||"",
        homepage: resultado[4]||"",
        id: resultado[5]||"",
        imdb_id: resultado[6]||"",
        original_language: resultado[7]||"",
        original_title: resultado[8]||"",
        overview: resultado[9]||"",
        popularity: resultado[10]||"",
        poster_path: resultado[11]||"",
        production_companies: resultado[12]||"",
        production_countries: resultado[13]||"",
        release_date: resultado[14]||"",
        revenue: resultado[15]||"",
        runtime: resultado[16]||"",
        spoken_languages: resultado[17]||"",
        status: resultado[18]||"",
        tagline: resultado[19]||"",
        title: resultado[20]||"",
        video: resultado[21]||"",
        vote_average: resultado[22]||"",
        vote_count: resultado[23]||"",
      };

      const movieProcessed: any = {};
      for (const key in movie) {
        if (movie.hasOwnProperty(key)) {
          movieProcessed[key] = convertirTipoDato(movie[key]);
        }
      }
      if (lineCount == 45000) {
        break;
      }
      lineCount++;
      if (
        Number.isFinite(parseFloat(movieProcessed.vote_average)) &&
        typeof movieProcessed.title == "string"
      ) {
        // console.log(movieProcessed)
        movies.push(movieProcessed);
      } else {
        // console.log("pelicula fallida");
        // console.log(movie);
      }
    }
    await fileStream.close();
    return movies;
  } catch (err) {
    console.error("Error al leer el archivo CSV:", err);
  }
}

function esNumero(str: string): boolean {
  const numero = parseFloat(str);

  return !isNaN(numero);
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
          // console.log(error);
          // console.log(objeto)
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