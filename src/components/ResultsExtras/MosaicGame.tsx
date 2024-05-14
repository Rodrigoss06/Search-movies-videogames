import React from "react";
import { Genre, type VideoGame } from "@/types";
import Badge from "@components/Badge";
interface Props {
  game: VideoGame;
}
function MosaicGame({ game }: Props) {
  return (
    <div className="px-2 py-2  rounded w-[240px] h-auto  border border-solid hover:bg-[#18181A] bg-[#09090B]  text-[#D4D4D4]">
      <img
        className="object-cover w-[240px] h-[140px] rounded"
        src={game.background_image}
        alt="image game"
      />
      <div className="flex flex-col gap-y-2">
        <span className="overflow-x-hidden w-[240px] ">{game.name}</span>
        <span className="overflow-x-hidden gap-x-1 flex">
          {game.genres.map((genre: Genre,index) => (
            <Badge key={index}>{genre.name}</Badge>
          ))}
        </span>
      </div>
    </div>
  );
}

export default MosaicGame;
