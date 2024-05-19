import { useResultsStore } from "@/resultsStore";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

function Filters() {
  const {
    searchData,
    setSearchData,
    resultsMovies,
    setResultsGames,
    setResultsMovies,
    setFilter,
  } = useResultsStore((state) => state);
  //filter for movies
  const [genres, setGenres] = useState<string[] | undefined>([]);
  const [orderValue, setOrderValue] = useState("popularity");
  const [letter, setLetter] = useState("");
  const [genreSelect, setGenreSelect] = useState("");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10);
  const [startDate, setStartDate] = useState("1874-12-08");
  const [endDate, setEndDate] = useState(
    `${new Date().getFullYear()}-${
      new Date().getMonth() < 10
        ? "0" + new Date().getMonth()
        : new Date().getMonth()
    }-${
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate()
    }`
  );

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(event.target.value);
    if (!isNaN(newMin) && newMin >= 0 && newMin < max) {
      setMin(newMin);
    }
  };
  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(event.target.value);
    if (!isNaN(newMax) && newMax >= 0 && newMax > min && newMax < 11) {
      setMax(newMax);
    }
  };
  
  //filter for videogames
  const [genresVideogame, setGenresVideogame] = useState<string[] | undefined>([]);
  const [platforms, setPlatforms] = useState<string[] | undefined>([]);
  const [orderValueVideogame, setOrderValueVideogame] = useState("rating");
  const [platformSelect, setPlatformSelect] = useState("");
  const [genreVideogameSelect, setGenreVideogameSelect] = useState("");
  const [startDateGame, setStartDateGame] = useState("1874-12-08");
  const [endDateGame, setEndDateGame] = useState(
    `${new Date().getFullYear()}-${
      new Date().getMonth() < 10
      ? "0" + new Date().getMonth()
      : new Date().getMonth()
    }-${
      new Date().getDate() < 10
      ? "0" + new Date().getDate()
      : new Date().getDate()
    }`
  );

  useEffect(() => {
    const getGenres = async () => {
      const response = await axios.get("/api/moviesGenres");
      setGenres(response.data.genres);
    };
    const getPlatformsGames = async () => {
      const response = await axios.get("api/videogamesPlatforms");
      console.log(response.data.platforms)
      setPlatforms(response.data.platforms);
    };
    const getGenresVideogames = async () => {
      const response = await axios.get("api/videogamesGenres");
      console.log(response.data.genres)
      setGenresVideogame(response.data.genres);
    };
    getGenres();
    getPlatformsGames();
    getGenresVideogames();
  }, []);

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value;
    const [year, month, day] = newStartDate.split("-").map((d) => Number(d));
    const [endYear, endMonth, endDay] = endDate
      .split("-")
      .map((d) => Number(d));
    if (year <= endYear && year >= 1 && month > 0 && day > 0) {
      searchData === "searchMovies"? setStartDate(newStartDate): setStartDateGame(newStartDate)
    }
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    const [year, month, day] = newEndDate.split("-").map((d) => Number(d));
    const [startYear, startMonth, startDay] = startDate
      .split("-")
      .map((d) => Number(d));

    if (year >= startYear && year < 2025 && month > 0 && day > 0) {
      searchData === "searchMovies"? setEndDate(newEndDate) : setEndDateGame(newEndDate)
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchData ==="searchMovies") {
      setFilter({
        orderValue,
        letter,
        genreSelect,
        min,
        max,
        startDate,
        endDate,
      });
    } else {
      setFilter({
        orderValueVideogame,
        platformSelect,
        genreVideogameSelect,
        startDateGame,
        endDateGame,
      });
    }
  };

  return (
    <div>
      <form
      className="text-white mx-1 border rounded p-2"
      onSubmit={handleSubmit}
    >
      <label>
        Search Data:
        <div className="border border-white  flex rounded">
          <p
            className="py-3 mx-auto "
            onClick={() => {
              setFilter({
                orderValue,
                letter,
                genreSelect,
                min,
                max,
                startDate,
                endDate,
              });
              setSearchData("searchMovies");
            }}
          >
            Movies
          </p>
          <p
            className="py-3 mx-auto"
            onClick={() => {
              setFilter({
                orderValueVideogame,
                platformSelect,
                genreVideogameSelect,
                startDateGame,
                endDateGame,
              });
              setSearchData("searchVideogames")
            }}
          >
            Games
          </p>
        </div>
      </label>
      {searchData == "searchMovies" ? (
        <label className="flex flex-col mx-2 gap-1">
          Order By:
          <label className="ml-2">
            <input
              type="radio"
              name="Order_by"
              onChange={(event) => setOrderValue(event.target.value)}
              checked={orderValue === "alphabetically"}
              value="alphabetically"
            />
            Alphabetically
          </label>
          <label className="ml-2">
            <input
              type="radio"
              name="Order_by"
              onChange={(event) => setOrderValue(event.target.value)}
              checked={orderValue === "vote_average"}
              value="vote_average"
            />
            Vote Average
          </label>
          <label className="ml-2">
            <input
              type="radio"
              name="Order_by"
              onChange={(event) => setOrderValue(event.target.value)}
              checked={orderValue === "popularity"}
              value="popularity"
            />
            Popularity
          </label>
        </label>
      ):( <label className="flex flex-col mx-2 gap-1">
      Order By:
      <label className="ml-2">
        <input
          type="radio"
          name="Order_by"
          onChange={(event) => setOrderValueVideogame(event.target.value)}
          checked={orderValueVideogame === "alphabetically"}
          value="alphabetically"
        />
        Alphabetically
      </label>
      <label className="ml-2">
        <input
          type="radio"
          name="Order_by"
          onChange={(event) => setOrderValueVideogame(event.target.value)}
          checked={orderValueVideogame === "rating"}
          value="rating"
        />
        Rating 
      </label>
      <label className="ml-2">
        <input
          type="radio"
          name="Order_by"
          onChange={(event) => setOrderValueVideogame(event.target.value)}
          checked={orderValueVideogame === "number_reviews"}
          value="number_reviews"
        />
        Number of Reviews
      </label>
    </label>)}
      {searchData === "searchMovies" ? (
        <label className="flex flex-col gap-2">
          Filter By:
          <label className="ml-2 mt-1">
            Letter:
            <select
              name="letter"
              onChange={(e) => setLetter(e.target.value)}
              className="text-black rounded ml-2"
            >
              <option value=""></option>
              {Array.from({ length: 26 }, (_, i) =>
                String.fromCharCode(65 + i)
              ).map((letter, index) => (
                <option value={letter} key={index}>
                  {letter.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="ml-2 mt-1">
            Genre:
            <select
              name="genre"
              onChange={(e) => setGenreSelect(e.target.value)}
              className="text-black rounded ml-2"
            >
              <option value=""></option>
              {genres?.map((genre, index) => (
                <option value={genre} key={index}>
                  {genre}
                </option>
              ))}
            </select>
          </label>
          <label className="ml-2 mt-1 flex flex-col ">
            Release:
            <label className=" ml-2">
              <input
                value={startDate}
                onChange={handleStartDateChange}
                type="date"
                className="text-black pl-1 text-center rounded mx-2"
              />
              to
              <input
                value={endDate}
                onChange={handleEndDateChange}
                type="date"
                className="text-black pl-1 text-center rounded mx-2"
              />
            </label>
          </label>
          <label className=" flex flex-col">
            Vote Average:
            <label className="ml-2">
              Min
              <input
                type="number"
                value={min}
                onChange={handleMinChange}
                className="text-black w-20 text-center rounded mx-2"
              />
              Max
              <input
                type="number"
                value={max}
                onChange={handleMaxChange}
                className="text-black w-20 text-center rounded mx-2 "
              />
            </label>
          </label>
        </label>
      ): (<label className="flex flex-col gap-2">
      Filter By:
      <label className="ml-2 mt-1">
        Platform:
        <select
          name="platform"
          onChange={(e) => setPlatformSelect(e.target.value)}
          className="text-black rounded ml-2"
        >
          <option value=""></option>
          {platforms && platforms.map((platform, index) => (
            <option value={platform} key={index}>
              {platform}
            </option>
          ))}
        </select>
      </label>
      <label className="ml-2 mt-1">
        Genre:
        <select
          name="genreVideogame"
          onChange={(e) => setGenreVideogameSelect(e.target.value)}
          className="text-black rounded ml-2"
        >
          <option value=""></option>
          {genresVideogame?.map((genre, index) => (
            <option value={genre} key={index}>
              {genre}
            </option>
          ))}
        </select>
      </label>
      <label className="ml-2 mt-1 flex flex-col ">
        Release:
        <label className=" ml-2">
          <input
            value={startDateGame}
            onChange={handleStartDateChange}
            type="date"
            className="text-black pl-1 text-center rounded mx-2"
          />
          to
          <input
            value={endDateGame}
            onChange={handleEndDateChange}
            type="date"
            className="text-black pl-1 text-center rounded mx-2"
          />
        </label>
      </label>
    </label>)}
        <button
          type="submit"
          className="px-2 py-1 w-full mr-1 mt-4 border border-white border-solid"
        >
          Filter
        </button>
    </form>
    </div>
  );
}

export default Filters;
