import { useResultsStore } from "@/resultsStore";
import React, { useEffect, useState } from "react";
import TableGame from "./TableGame";
import { Movie, VideoGame } from "@/types";
import MosaicGame from "./MosaicGame";
import TableMovie from "./TableMovie";

function Results() {
  const { filter ,resultsGames, resultsMovies, searchData } = useResultsStore((state) => state);
  const [loading, setLoading] = useState(true);
  const [visibleResults, setVisibleResults] = useState(12);
  const [resultsDisplayMode, setResultsDisplayMode] = useState("table");

  useEffect(() => {
    console.log(resultsGames.length);
    console.log(resultsGames);
    console.log(resultsMovies.length)
    console.log(resultsMovies)
    if (resultsGames.length >= 1 || resultsMovies.length >=1) {
      setLoading(false);
    }
  }, [resultsGames, resultsMovies]);
  return (
    <section className="grid grid-cols-1 relative z-10 px-6 gap-x-4 pt-6  mb-6">
      <div className="grid grid-cols-[minmax(180px,_5fr)_minmax(120px,_4fr)_minmax(120px,_2fr)_minmax(120px,_1fr)_minmax(140px,_1fr)] gap-x-4 h-14  border border-solid rounded mb-4 bg-[#09090B] text-[#D4D4D4] text-lg font-semibold">
        <h1 className="flex justify-start ml-3 items-center">{searchData == "searchMovies"? "Movie": "Game"}</h1>
        <h2 className="flex justify-start ml-3 items-center">{searchData == "searchMovies"? "Popularity": "Platform"}</h2>
        <span className="flex justify-start ml-3 items-center">{searchData == "searchMovies"? "Release": "Year"}</span>
        <span className="flex justify-start ml-3 items-center overflow-hidden">
        {searchData == "searchMovies"? "Genre": "Tag"}
        </span>
        <span className="flex justify-start ml-3 items-center overflow-hidden text-pretty">
        {searchData == "searchMovies"? "Vote Average": "Metacritic"}
        </span>
      </div>
      <div className="flex justify-start items-center gap-x-2 my-3 p-1 rounded bg-slate-300 w-[143px]">
        <p
          className={`${
            resultsDisplayMode === "table" ? "bg-slate-600" : ""
          } px-2 py-1 text-gray-700-500 hover:bg-[#18181A]`}
          onClick={() => setResultsDisplayMode("table")}
        >
          table
        </p>
        <p
          className={`${
            resultsDisplayMode !== "table" ? "bg-slate-600" : ""
          } px-2 py-1 text-gray-700-500 hover:bg-[#18181A]`}
          onClick={() => setResultsDisplayMode("mosaic")}
        >
          mosaico
        </p>
      </div>
      {loading ? (
        <h1>...loading</h1>
      ) : resultsDisplayMode === "table" ? (searchData == "searchMovies"? (
        <div>
          {resultsMovies.slice(0,visibleResults).map((result: Movie)=>(
            <article key={result.imdb_id}>
              <TableMovie movie={result} />
            </article>
          ))}
          {resultsMovies.length > visibleResults && (
            <button
              className=" rounded  mt-2 p-2 w-full bg-slate-500 text-white"
              onClick={() => setVisibleResults(visibleResults + 10)}
            >
              Mostrar Más
            </button>
          )}
        </div>
      ):(
        <div>
          {resultsGames.slice(0, visibleResults).map((result: VideoGame) => (
            <article key={result.id}>
              <TableGame game={result} />
            </article>
          ))}
          {resultsGames.length > visibleResults && (
            <button
              className=" rounded  mt-2 p-2 w-full bg-slate-500 text-white"
              onClick={() => setVisibleResults(visibleResults + 10)}
            >
              Mostrar Más
            </button>
          )}
        </div>
      )) : (
        <div className=" flex flex-wrap gap-3">
          {resultsGames.slice(0, visibleResults).map((result: VideoGame) => (
            <article key={result.id}>
              <MosaicGame game={result}  />
            </article>
          ))}
          {resultsGames.length > visibleResults && (
            <button
              className=" rounded  mt-2 p-2 w-full bg-slate-500 text-white"
              onClick={() => setVisibleResults(visibleResults + 10)}
            >
              Mostrar Más
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default Results;
