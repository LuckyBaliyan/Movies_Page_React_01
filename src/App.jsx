import { useState,useEffect } from 'react';
import { useDebounce } from 'react-use';
import './index.css';
import Search from './components/Search';
import Spinner from './components/Spinner';
import Card from './components/Card';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import MovieModel from './components/MovieModel';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const API_OPTIONS = {
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

function App() {
  const [search, setSearch] = useState('');

  const [errorMessage,setErrorMessage] = useState('');

  const [moviesList,setMoviesList] = useState([]);

  const [isLoading,setIsloading] = useState(false);

  const [debouncesearchTerm,setdebouncesearchTerm] = useState('');

  const [trendingMovies,setTrendingMovies] = useState([]);

  const [selectMovie, setSelectMovie] = useState(null);

  //It deboubce the search input for making too many request instead the request only process when user break the flow
  //of typing saving api calls for every letter in a running user input text..

  useDebounce(()=>setdebouncesearchTerm(search),500,[search]);

  const fetchMovies = async (query = '') =>{
    setIsloading(true);
    setErrorMessage('');
    try{
       const endPoint = query?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
       :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
       const response  = await  fetch(endPoint,API_OPTIONS);
       const data = await response.json();
       console.log(data);
       if(data.response == 'False'){
        setErrorMessage(data.Error ||'There is a problem while fetching the package.');
        setMoviesList([]);
        return;
       }
       setMoviesList(data.results || []);
       if(query && data.results.length > 0){
        await updateSearchCount(query,data.results[0]);
       }
    }catch(error){
      setErrorMessage('There is a problem while fetching the package.')
    }finally{
      setIsloading(false);
    }
  }

  const loadTrendingMovies = async()=>{
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    }catch(error){
      console.log("Error Fetching Trending Movies");
    }
  }

  useEffect(()=>{
    fetchMovies(debouncesearchTerm);
  },[debouncesearchTerm])


  useEffect(()=>{
    loadTrendingMovies();
  },[]);

  return (
   <main>
     <div className="pattern" />
     <div className="wrapper">
      <header>
        <img src="/hero.png" alt="image for hero" />
        <h1>Find <span className="text-gradient">Movies</span>
        You'll Enjoy Without the Hassle
        </h1>
         <Search search={search} setSearch={setSearch}/>
      </header>
      {trendingMovies.length > 0 && (
        <section className='trending'>
          <h2>Trending Movies</h2>
          
          <ul>
            {trendingMovies.map((movie,index)=>(
               <li key={movie.$id} onClick={()=>setSelectMovie(movie)}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title} />
               </li>
            ))}
          </ul>
        </section>
      )}
      <section className='all-movies'>
        <h1 className='text-2xl'>All Movies</h1>


        {isLoading?(
          <Spinner />
        ):errorMessage?(
          <p className="text-red-500">{errorMessage}</p>
        ):(
          <ul>
            {
            moviesList.map((movie)=>(
              <Card key={movie.id} movie={movie}
              onClick={()=>setSelectMovie(movie)}
              /> 
            ))
            }
          </ul>
        )
       }
     </section>
     {selectMovie &&(
      <MovieModel movie ={selectMovie}
      onClose={()=>setSelectMovie(null)}
      />
     )}
     </div>
   </main>
  )
}

export default App;
