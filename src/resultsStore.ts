import { create } from "zustand"; //El estado se puede leer desde un archivo .jsx, .svelte, etc
import {Filter, FilterGames, type Movie, type VideoGames } from '@/types';


interface Store {
    resultsGames: VideoGames,
    resultsMovies: Movie[],
    searchData:string,
    filter:Filter|FilterGames,
    setResultsGames:(results:VideoGames)=>void,
    setResultsMovies:(results:Movie[])=>void,
    setSearchData:(search:string)=>void
    setFilter:(filter:Filter|FilterGames)=>void

}
export const useResultsStore= create<Store>((set) =>({
    resultsGames: [],
    resultsMovies: [],
    searchData: "searchMovies",
    filter:{
        orderValue: "popularity",
        letter: "",
        genreSelect: "",
        min: 0,
        max: 10,
        startDate: "1874-12-08",
        endDate: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
      },
    setResultsGames: (resultsGames:VideoGames) => set({resultsGames}),
    setResultsMovies: (resultsMovies:Movie[]) => set({resultsMovies}),
    setSearchData:(searchData:string)=>set({searchData}),
    setFilter:(filter:Filter|FilterGames)=>set({filter})
}))

