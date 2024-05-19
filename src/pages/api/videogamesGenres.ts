import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { GenreGame } from "@/types";
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
    console.log(process.env.API_KEY_RAWG)
    const response = await axios.get("https://api.rawg.io/api/genres", {
      params: {
        key: process.env.API_KEY_RAWG,
      },
    });
    console.log(response.data.results)
    const genres = response.data.results.map((genre:GenreGame)=>genre.name)
  res.status(200).json({ genres: genres });
}

