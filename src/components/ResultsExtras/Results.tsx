import { useResultsStore } from "@/resultsStore";
import React, { useEffect, useState } from "react";
import TableItemGame from "./TableItemGame";
import { Movie, VideoGame } from "@/types";
import MosaicGame from "./MosaicGame";
import TableItemMovie from "./TableItemMovie";

function Results() {
  const { resultsGames, resultsMovies, searchData } = useResultsStore((state) => state);
  const [loading, setLoading] = useState(true);
  const [visibleResults, setVisibleResults] = useState(12);
  const [resultsDisplayMode, setResultsDisplayMode] = useState("table");

  useEffect(() => {
    if (resultsGames.length >= 1 || resultsMovies.length >=1) {
      setLoading(false);
    }
  }, [resultsGames, resultsMovies]);
  return (
    <section className="flex flex-col relative z-10 px-6 gap-x-4 mb-6">
      <div className="grid grid-cols-[minmax(180px,_5fr)_minmax(120px,_4fr)_minmax(120px,_2fr)_minmax(120px,_1fr)_minmax(140px,_1fr)] gap-x-4 h-14  border border-solid rounded mb-4 bg-[#09090B] text-[#D4D4D4] text-lg font-semibold">
        <h1 className="flex justify-start ml-3 items-center">{searchData == "searchMovies"? "Movie": "Game"}</h1>
        <h2 className="flex justify-start ml-3 items-center">{searchData == "searchMovies"? "Popularity": "Platform"}</h2>
        <span className="flex justify-start ml-3 items-center">{searchData == "searchMovies"? "Release": "Year"}</span>
        <span className="flex justify-start ml-3 items-center overflow-hidden">
        {searchData == "searchMovies"? "Genre": "Tag"}
        </span>
        <span className="flex justify-start ml-3 items-center overflow-hidden text-pretty">
        {searchData == "searchMovies"? "Vote Average": "Rating"}
        </span>
      </div>
      {searchData ==="searchVideogames" && <div className="flex justify-start items-center gap-x-2 my-3 p-1 rounded bg-slate-300 w-[143px]">
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
      </div>}
      {loading ? (
        <h1>...loading</h1>
      ) : resultsDisplayMode === "table" ? (searchData == "searchMovies"? (
        <div>
          {resultsMovies.slice(0,visibleResults).map((result: Movie)=>(
            <article key={result.imdb_id}>
              <TableItemMovie movie={result} />
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
              <TableItemGame game={result} />
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
