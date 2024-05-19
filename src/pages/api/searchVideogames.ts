import type { NextApiRequest, NextApiResponse } from "next";

import { GenreGame, ParentPlatform, Platform, VideoGame, type FilterGames, type VideoGames } from "@/types";
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
  const filter: FilterGames = JSON.parse(filterString!);
  if (typeof searchData !== "string" || typeof filter === "undefined") {
    res.status(400).json({ error: "Parámetros de consulta inválidos" });
    return;
  }
  console.log(filter)
  const gamesPage_1 = await getGames(searchData);
  const gamesPage_2 = await getNextGames(gamesPage_1.next);
  const gamesPage_3 = await getNextGames(gamesPage_2.next);
  const gamesPage_4 = await getNextGames(gamesPage_3.next);
  const gamesPage_5 = await getNextGames(gamesPage_4.next);
  const gamesPage_6 = await getNextGames(gamesPage_5.next);

  const games = [
    ...gamesPage_1.results,
    ...gamesPage_2.results,
    ...gamesPage_3.results,
    ...gamesPage_4.results,
    ...gamesPage_5.results,
    ...gamesPage_6.results,
  ];
  const sortGames =sort(games, filter.orderValueVideogame);
  let returnGames = sortGames;
  if (filter.genreVideogameSelect !== "") {
    console.log(1)
    returnGames = returnGames.filter((game:VideoGame)=> game.genres?.some(
      (genre: GenreGame) => genre.name === filter.genreVideogameSelect
    ))
    console.log(returnGames)
  }
  if (filter.platformSelect !=="") {
    returnGames = returnGames.filter((game:VideoGame)=> {
      
      if (typeof game.parent_platforms !== "undefined" && game.parent_platforms.length !==0) {
        return game.parent_platforms.some(
          (platform:ParentPlatform)=> platform.platform.name === filter.platformSelect
        )
      }
    })
  }
  if (filter.startDateGame !=="" && filter.endDateGame !== "") {
    returnGames = returnGames.filter((game: VideoGame) => {
      if (!game.released) {
        return false;
      }
      const [startYear, startMounth, startDay] = filter.startDateGame.split("-");
      const [endYear, endMounth, endDay] = filter.endDateGame.split("-");
      const [YearGame, MounthGame, DayGame] = game.released.split("-");
      if (
        Number(YearGame) >= Number(startYear) &&
        Number(YearGame) <= Number(endYear)
      ) {
        return true;
      }
      return false;
    });
  }
  console.log(returnGames)
  res.status(200).json({ games: returnGames });
}

async function getGames(searchData: string) {
  try {
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: process.env.API_KEY_RAWG,
        search: searchData,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
async function getNextGames(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function sort(arr: VideoGames, orderSetting: string) {
  let sortGames;
  console.log(orderSetting)
  if (orderSetting === "alphabetically") {
    sortGames = arr.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  } else if (orderSetting === "rating") {
    sortGames = arr.sort((a,b)=> b.rating - a.rating)
  } else {
    sortGames = arr.sort((a,b)=>b.ratings_count - a.ratings_count)
  }
  console.log(sortGames)
  return sortGames
}
