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
    setFilter
  } = useResultsStore((state) => state);
  const [genres, setGenres] = useState<string[] | undefined>([]);
  const [orderValue, setOrderValue] = useState("");
  const [letter, setLetter] = useState("")
  const [genreSelect, setGenreSelect] = useState("")
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10);
  const [startDate, setStartDate] = useState("1874-12-08");
  const [endDate, setEndDate] = useState(`${new Date().getFullYear()}-${new Date().getMonth()<10?"0"+new Date().getMonth():new Date().getMonth()}-${new Date().getDate()<10 ? "0"+new Date().getDate():new Date().getDate()}`);

  useEffect(() => {
    const getGenres = async () => {
      const response = await axios.get("/api/moviesGenres");
      setGenres(response.data.genres);
    };
    getGenres();
  }, []);

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
  
  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value;
    const [year,month,day]=newStartDate.split("-").map((d)=>Number(d))
    const [endYear,endMonth,endDay]=endDate.split("-").map((d)=>Number(d))
    console.log(endYear)
    console.log(year)
    if (year <= endYear  && year>=1 && month>0 && day>0) {
      setStartDate(newStartDate);
    }
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    const [year,month,day]=newEndDate.split("-").map((d)=>Number(d))
    const [startYear,startMonth,startDay]=startDate.split("-").map((d)=>Number(d))

    console.log(newEndDate)
    if (year >= startYear  && year<2025 && month>0 && day>0) {
      setEndDate(newEndDate);
    }
  };

  const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setFilter(
      {
        orderValue,
        letter,
        genreSelect,
        min,
        max,
        startDate,
        endDate
      }
    )
    console.log(1232131231)
  }

  return (
    <form className="text-white mx-1 border rounded p-2" onSubmit={handleSubmit}>
      <label>
        Search Data:
        <div className="border border-white  flex rounded">
          <p
            className="py-3 mx-auto "
            onClick={() => {
              setSearchData("searchMovies");
              console.log(1000);
            }}
          >
            Movies
          </p>
          <p className="py-3 mx-auto" onClick={() => setSearchData("searchVideogames")}>
            Games
          </p>
        </div>
      </label>
      {searchData == "searchMovies" && (
        <label className="flex flex-col mx-2 gap-1">
          Order By:
          <label className="ml-2">
            <input
              type="checkbox"
              name="Order_by"
              onChange={(event)=>setOrderValue(event.target.value)}
              checked={orderValue === "alphabetically"}
              value="alphabetically"
            />
            Alphabetically
          </label>
          <label className="ml-2">
            <input
              type="checkbox"
              name="Order_by"
              onChange={(event)=>setOrderValue(event.target.value)}
              checked={orderValue === "vote_average"}
              value="vote_average"
            />
            Vote Average
          </label>
          <label className="ml-2">
            <input
              type="checkbox"
              name="Order_by"
              onChange={(event)=>setOrderValue(event.target.value)}
              checked={orderValue === "popularity"}
              value="popularity"
            />
            Popularity
          </label>
        </label>
      )}
      {searchData === "searchMovies" && (
        <label className="flex flex-col gap-2">
          Filter By:
          <label className="ml-2 mt-1">
            Letter:
            <select name="letter" onChange={(e)=>setLetter(e.target.value)} className="text-black rounded ml-2">
              <option value=""></option>
              {Array.from({ length: 26 }, (_, i) =>
                String.fromCharCode(65 + i)
              ).map((letter) => (
                <option value={letter}>{letter.toUpperCase()}</option>
              ))}
            </select>
          </label>
          <label className="ml-2 mt-1">
            Genre:
            <select name="genre" onChange={(e)=>setGenreSelect(e.target.value)} className="text-black rounded ml-2">
              <option value=""></option>
              {genres?.map((genre) => (
                <option value={genre}>{genre}</option>
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
      )}
      {searchData=="searchMovies" && (
        <button type="submit" className="px-2 py-1 w-full mx-1 mt-4 border border-white border-solid">Filter</button>
      )}
    </form>
  );
}

export default Filters;
