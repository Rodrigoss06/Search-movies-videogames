import React, { FormEvent, useState } from 'react'
import axios from "axios";
import { useResultsStore } from "@/resultsStore";
import Filters from './Filters';
import {VideoGames, type Movie } from '@/types';

function Search() {
  const [searchInput,setSearchInput]= useState("")

  const {filter,searchData,resultsMovies ,setResultsGames, setResultsMovies} = useResultsStore((state)=>state)
  const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try {
      const response = await axios.get(`/api/${searchData}`,{
        params:{
          searchData:searchInput,
          filterString: JSON.stringify(filter)
        }
      })
      console.log(response)
      if (searchData =="searchMovies") {
        response.data.movies.forEach((movie:Movie) => {
          setResultsMovies([...resultsMovies, movie])
        });
        setResultsMovies(response.data.movies)
      } else {
        setResultsGames(response.data.games)
      }
    } catch (error) {
      console.log("Error: ",error)
    }
    
  }
  return (
    <section className="flex justify-center items-center">
  <form onSubmit={handleSubmit} className="flex items-center border rounded-lg overflow-hidden shadow-md">
    <input
      onChange={(e) => setSearchInput(e.target.value)}
      type="text"
      required
      placeholder="Buscar..."
      className="px-4 py-3 focus:outline-none w-64 bg-white text-gray-800"
    />
    <button type="submit" className="px-4 py-3 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out">
      Buscar
    </button>
  </form>
</section>
  )
}

export default Search