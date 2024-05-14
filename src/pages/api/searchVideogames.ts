import type { NextApiRequest, NextApiResponse } from "next";

import {Filter, type VideoGames } from "@/types";
import axios from "axios";
type Data = {
  error?: string;
  games?: VideoGames;
};
type Params = {
  searchData?: string;
  filterString?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { searchData, filterString }: Params = req.query;
  const filter: Filter = JSON.parse(filterString!);
  console.log(filter)
  if (typeof searchData !== "string" || typeof filter === "undefined") {
    res.status(400).json({ error: "Parámetros de consulta inválidos" });
    return;
  }
  console.log("ccc")
  const gamesPage_1 = await getGames(process.env.API_KEY_RAWG!, searchData);
  console.log("page_1")
  const gamesPage_2 = await getNextGames(gamesPage_1.next);
  console.log("page_2")
  const games = gamesPage_1.results.concat(gamesPage_2.results);
  sort(games);

  res.status(200).json({ games: games });
}

async function getGames(key: string, searchData: string) {
  try {
    console.log(key);
    console.log(searchData);
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: process.env.API_KEY_RAWG,
        search: searchData,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
async function getNextGames(url: string) {
  try {
    const response = await axios.get(url);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function sort(arr: VideoGames) {
  let swapped = false;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let k = 0; k < arr.length - i - 1; k++) {
      const metacritic = arr[k].metacritic ? arr[k].metacritic : 0;
      const metacritic2 = arr[k + 1].metacritic ? arr[k + 1].metacritic : -1;

      if (metacritic < metacritic2) {
        const temp = arr[k];
        arr[k] = arr[k + 1];
        arr[k + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) {
      console.log(arr);
      return;
    }
  }
  console.log(arr);
}
