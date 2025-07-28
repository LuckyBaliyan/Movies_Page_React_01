import React from "react";
import '/src/index.css'

const Search = ({search,setSearch})=>{
    return(
        <div className="text-white text-3xl">
            <div className="search">
                <img src="search.svg" alt="search" />

                <input type="text"
                placeholder="Search through 10000+ movies"
                value={search}
                onChange={(e)=>setSearch(e.target.value)} 
                />
            </div>
        </div>
    )
}

export default Search;