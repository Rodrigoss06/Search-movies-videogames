import { useResultsStore } from '@/resultsStore'
import { Movie } from '@/types'
import React from 'react'
interface Props {
    movie: Movie
}
function TableMovie({movie}:Props) {
    const {resultsMovies} = useResultsStore((state)=>state)
  return (
    <div
      className={`grid grid-cols-[minmax(200px,_5fr)_minmax(120px,_4fr)_minmax(120px,_2fr)_minmax(120px,_1fr)_minmax(120px,_1fr)] gap-x-4 h-14   border-solid border-x border-b ${
        movie === resultsMovies[0] ? "rounded-t-md border-t" : ""
      }  ${
        movie === resultsMovies[resultsMovies.length-1] ? "rounded-b" : ""
      } hover:bg-[#18181A] bg-[#09090B] text-[#D4D4D4]`}
    >
      <h1 className="flex justify-start ml-3 items-center">{movie.title||"-"}</h1>
      <h2 className="flex justify-start ml-3 items-center">{movie.popularity||"-"}</h2>
      
        <span className="flex justify-start ml-3 items-center">
          {typeof movie.release_date == "number"  ? movie.release_date :"-"}
        </span>
    
      {movie.genres[0] && (
        <span className="flex justify-start ml-3 items-center overflow-hidden">
          {movie.genres[0].name ||"-"}
        </span>
      )}
      {movie.vote_average && (
        <span className="flex justify-start ml-3 items-center overflow-hidden text-pretty">
          {movie.vote_average? movie.vote_average : "-"}
        </span>
      )}
    </div>
  )
}

export default TableMovie