import React from "react";
import { type VideoGame } from "@/types";
import { useResultsStore } from "@/resultsStore";
interface Props {
  game: VideoGame;
}
function TableItemGame({ game }: Props) {
  const { resultsGames } = useResultsStore((state) => state);

  return (
    <div
      className={`grid grid-cols-[minmax(200px,_5fr)_minmax(120px,_4fr)_minmax(120px,_2fr)_minmax(120px,_1fr)_minmax(120px,_1fr)] gap-x-4 h-14   border-solid border-x border-b ${
        game === resultsGames[0] ? "rounded-t-md border-t" : ""
      }  ${
        game === resultsGames[resultsGames.length-1] ? "rounded-b" : ""
      } hover:bg-[#18181A] bg-[#09090B] text-[#D4D4D4]`}
    >
      <h1 className="flex justify-start ml-3 items-center">{game.name}</h1>
      <h2 className="flex justify-start ml-3 items-center">{game.platforms && game.platforms[0].platform.name}</h2>
      {game.released && (
        <span className="flex justify-start ml-3 items-center">
          {game.released.split("-")[0]}
        </span>
      )}
      {game.tags[0] && (
        <span className="flex justify-start ml-3 items-center overflow-hidden">
          {game.tags[0].name}
        </span>
      )}
      
        <span className="flex justify-start ml-3 items-center overflow-hidden text-pretty">
          {game.rating? game.rating : "-"}
        </span>
     
    </div>
  );
}

export default TableItemGame;
