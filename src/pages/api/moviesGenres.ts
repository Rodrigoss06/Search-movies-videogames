import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { Genre, Movie } from "@/types";
import { getMovies } from "../../db";
type Data = {
  error?: string;
  genres?: string[]|undefined;
};
export const config = {
  api: {
    responseLimit: "5mb",
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const movies = await getMovies();
  const genres= movies?.map((movie:Movie)=>movie.genres).flat().map((genre:Genre)=>genre.name)
  const uniqueGenres: string[] = Array.from(new Set(genres)).filter((genre)=>genre !== undefined && genre.trim() !== "")
  res.status(200).json({ genres: uniqueGenres });
}

