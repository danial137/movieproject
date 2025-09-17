import React, { useEffect, useState } from 'react'
import { StarIcon, CheckIcon, DeleteIcon } from 'lucide-react'
import Loading from '../../components/Loading'
import Title from './Title'
import { kConvert } from '../../lib/kConvert'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext()
  const currency = import.meta.env._VITE_CURRENCY || "$"

  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [dateTimeSelection, setDateTimeSelection] = useState({})
  const [dateTimeInput, setDateTimeInput] = useState("")
  const [showPrice, setShowPrice] = useState("")
  const [addingShow, setAddingShow] = useState(false)

  // Fetch now playing movies
  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) setNowPlayingMovies(data.movies)
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast.error('Failed to fetch movies')
    }
  }

  useEffect(() => {
    if (user) fetchNowPlayingMovies()
  }, [user])

  // Add date-time
  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return
    const [date, time] = dateTimeInput.split('T')
    if (!date || !time) return

    setDateTimeSelection((prev) => {
      const times = prev[date] || []
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] }
      }
      return prev
    })
    setDateTimeInput("")
  }

  // Remove selected time
  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTime = prev[date].filter((t) => t !== time)
      if (filteredTime.length === 0) {
        const { [date]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [date]: filteredTime }
    })
  }

  // Submit show
  const handleSubmit = async () => {
    setAddingShow(true)
    if (!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
      toast('Missing required fields')
      setAddingShow(false)
      return
    }

    try {
      // Flatten date-time selection
      const showsInput = Object.entries(dateTimeSelection).flatMap(([date, times]) =>
        times.map(time => ({ date, time }))
      )

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice)
      }

      const { data } = await axios.post('/api/show/add', payload, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success(data.message)
        setSelectedMovie(null)
        setDateTimeSelection({})
        setShowPrice("")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error('Try again')
    }

    setAddingShow(false)
  }

  if (!nowPlayingMovies.length) return <Loading />

  return (
    <div className="p-4">
      <Title text1="Add" text2="Shows" />

      {/* Movies */}
      <p className='mt-6 text-lg font-medium'>Now Playing Movies</p>
      <div className='overflow-x-auto py-4'>
        <div className='flex flex-wrap gap-4'>
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative cursor-pointer transition-transform duration-300 hover:-translate-y-1 flex-shrink-0 w-[140px] sm:w-[180px] md:w-[200px]`}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className='relative rounded-lg overflow-hidden'>
                <img
                  src={image_base_url + movie.poster_path}
                  alt={movie.title}
                  className='w-full h-[220px] sm:h-[250px] object-cover brightness-90'
                />
                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                  <p className='flex items-center gap-1 text-gray-400'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary' />
                    {movie.vote_average?.toFixed(1) || "N/A"}
                  </p>
                  <p className='text-gray-300'>{kConvert(movie.vote_count)} Votes</p>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                  <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                </div>
              )}
              <p className='font-medium truncate mt-1'>{movie.title}</p>
              <p className='text-gray-400 text-sm'>{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Show Price */}
      <div className='mt-6 w-full sm:w-1/2'>
        <label className='block text-sm font-medium mb-2'>Show Price</label>
        <div className='flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md w-full'>
          <span className='text-gray-400 text-sm'>{currency}</span>
          <input
            type='number'
            min={0}
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder='Enter show price'
            className='outline-none w-full'
          />
        </div>
      </div>

      {/* Date-Time */}
      <div className='mt-6 w-full sm:w-1/2'>
        <label className='block text-sm font-medium mb-2'>Select Date and Time</label>
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 border border-gray-600 p-2 rounded-lg'>
          <input
            type='datetime-local'
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className='outline-none rounded-md w-full sm:w-auto'
          />
          <button
            onClick={handleDateTimeAdd}
            className='bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary transition-colors'
          >
            Add Time
          </button>
        </div>
      </div>

      {/* Display Selected Date-Time */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className='mt-6'>
          <h2 className='mb-2 font-medium'>Selected DATE-TIME</h2>
          <ul className='space-y-3'>
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className='font-medium'>{date}</div>
                <div className='flex flex-wrap gap-2 mt-1 text-sm'>
                  {times.map((time) => (
                    <div key={time} className='border border-primary px-2 py-1 flex items-center rounded'>
                      <span>{time}</span>
                      <DeleteIcon
                        onClick={() => handleRemoveTime(date, time)}
                        width={15}
                        className='ml-2 text-red-500 hover:text-red-700 cursor-pointer'
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 w-full sm:w-auto transition-all'
      >
        {addingShow ? "Adding..." : "Add Show"}
      </button>
    </div>
  )
}

export default AddShows
