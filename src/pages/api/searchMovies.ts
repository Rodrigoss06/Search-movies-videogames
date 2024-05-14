import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { Filter, Genre, Movie } from "@/types";
import pgPromise from "pg-promise";

type Data = {
  error?: string;
  movies?: Movie[];
};
type Params = {
  searchData?: string;
  filterString?: string;
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
  const { searchData, filterString }: Params = req.query;
  const filter: Filter = JSON.parse(filterString!);
  if (typeof searchData !== "string" || typeof filter === "undefined") {
    res.status(400).json({ error: "Parámetros de consulta inválidos" });
    return;
  }
  const movies = await getMovies();
  
  console.log("import date completed!!");
  const moviesFilter = movies?.filter((movie) => {
    const titleVerified =
      typeof movie.title === "string" &&
      movie.title.toLowerCase().includes(searchData.toLowerCase());
    const overviewVerified =
      typeof movie.overview === "string" &&
      movie.overview.toLowerCase().includes(searchData.toLowerCase());

    return titleVerified || overviewVerified;
  });

  let returnMovies;
  if (filter.orderValue === "alphabetically") {
    returnMovies = moviesFilter?.sort((a, b) => {
      if (a.original_title < b.original_title) {
        return -1;
      }
      if (a.original_title > b.original_title) {
        return 1;
      }
      return 0;
    });
    console.log(1);
  } else if (filter.orderValue === "vote_average") {
    returnMovies = moviesFilter?.sort((a, b) => b.vote_average - a.vote_average);
    console.log(2);
  } else if (filter.orderValue === "popularity") {
    returnMovies = moviesFilter?.sort((a, b) => b.popularity - a.popularity);
    console.log(3);
  } else {
    // Si no se especifica un tipo de orden, se devuelve el arreglo sin ordenar
    returnMovies = moviesFilter;
  }
  if (filter.letter != "") {
    console.log(4);
    returnMovies = returnMovies?.filter(
      (movie: Movie) =>
        movie.original_title[0]?.toLowerCase() == filter.letter.toLowerCase()
    );
    console.log(filter.letter);
  }
  if (filter.genreSelect != "") {
    returnMovies = returnMovies?.filter((movie: Movie) => {
      if (
        typeof movie.genres != "undefined" &&
        typeof movie.genres != "string" &&
        movie.genres?.length > 0
      ) {
        return movie.genres?.some(
          (genre: Genre) => genre.name === filter.genreSelect
        );
      }
      return false;
    });
    console.log(filter.genreSelect);
  }

  if (filter.startDate != "" && filter.endDate != "") {
    returnMovies = returnMovies?.filter((movie: Movie) => {
      const [startYear, startMounth, startDay] = filter.startDate.split("-");
      const [endYear, endMounth, endDay] = filter.endDate.split("-");
      if (
        typeof movie.release_date != undefined &&
        movie.release_date.toString() != "" &&
        movie.release_date >= Number(startYear) &&
        movie.release_date <= Number(endYear)
      ) {
        return true;
      }
      return false;
    });
  }
  if (filter.min && filter.max) {
    returnMovies = returnMovies?.filter((movie: Movie) => {
      if (
        movie.vote_average &&
        typeof movie.vote_average == "number" &&
        movie.vote_average <= filter.max &&
        movie.vote_average >= filter.min
      ) {
        return true;
      }
      return false;
    });
  }
  // console.log(returnMovies);
  res.status(200).json({ movies: returnMovies });
}

export async function getMovies(): Promise<Movie[] | undefined> {
  const pgp = pgPromise();
  const db = pgp(process.env.DATABASE_URL!);
  
  try {
    const data = await db.any("SELECT * FROM movies")
    const convertedData = data.map(movie => {
      // Iterar sobre cada atributo del objeto movie y aplicar convertirTipoDato
      for (let key in movie) {
        if (movie.hasOwnProperty(key)) {
          movie[key] = convertirTipoDato(movie[key]);
        }
      }
      return movie;
    });
    console.log(convertedData)
    return convertedData;
  } catch (error) {
    console.error("Error al seleccionar datos de la tabla movies:", error);
    return undefined
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
