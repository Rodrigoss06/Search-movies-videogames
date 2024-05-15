import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { Filter, Genre, Movie } from "@/types";
import pgPromise from "pg-promise";
import { getMovies } from "../../db";
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
  } else if (filter.orderValue === "vote_average") {
    returnMovies = moviesFilter?.sort(
      (a, b) => b.vote_average - a.vote_average
    );
  } else if (filter.orderValue === "popularity") {
    returnMovies = moviesFilter?.sort((a, b) => b.popularity - a.popularity);
  } else {
    // Si no se especifica un tipo de orden, se devuelve el arreglo sin ordenar
    returnMovies = moviesFilter;
  }
  if (filter.letter != "") {
    returnMovies = returnMovies?.filter(
      (movie: Movie) =>
        movie.original_title[0]?.toLowerCase() == filter.letter.toLowerCase()
    );
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
  res.status(200).json({ movies: returnMovies });
}
