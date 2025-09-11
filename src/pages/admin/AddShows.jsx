import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import { StarIcon, CheckIcon } from 'lucide-react'
import Loading from '../../components/Loading'
import Title from './Title'
import { kConvert } from '../../lib/kConvert'
const AddShows = () => {

  const currency = import.meta.env._VITE_CURRENCY || "$"

  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({})
  const [dateTimeInput, setDateTimeInput] = useState("")
  const [showPrice, setShowPrice] = useState("")


  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData)
  }

  useEffect(() => {
    fetchNowPlayingMovies();
  }, [])

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
      <div className='overflow-x-auto pb-4'>
        <div className='group flex flex-wrap gap-4 mt-4 w-max'>
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative max-w-40 cursor-pointer group-hover:opacity-40 hover:-translate-y-1 transition duration-300"
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img src={movie.poster_path} alt={movie.title} className="w-full object-cover brightness-90" />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </p>
                  <p className="text-gray-300">{kConvert(movie.vote_count)} Votes</p>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <p className='font-medium truncate'>{movie.title}</p>
              <p className='text-gray-400 text-sm'>{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* show price input */}

      <div className='mt-8'>
        <label className='block text-sm font-medium mb-2'>Show Price</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
          <p className='text-gray-400 text-sm'>{currency}</p>
          <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder='Enter show price' className='outline-none' />
        </div>
      </div>

    </>
  ) : <Loading />

}

export default AddShows