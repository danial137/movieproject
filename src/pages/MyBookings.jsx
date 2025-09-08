import React, { useEffect, useState } from 'react'
import { assets, dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import timeFormat from'../lib/timeFormat'
import BlurCircle from '../components/BlurCircle'
const MyBookings = () => {
  const currency = import.meta.env._VITE_CURRENCY



  const [booking, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBooking = () => {
    setBookings(dummyBookingData)
    setIsLoading(false)

  }

  useEffect(() => {
    getMyBooking()
  }, [])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top='100px' left='100px' />
      <div>
        <BlurCircle bottom='0px' left='600px' />
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>


      {
        booking.map((item, index) => (
          <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>

            <div className='flex flex-col md:flex-row'>

              <img src={item.show.movie.poster_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded' />
              <div className='flex flex-col p-4'>
                <p className='text-lg font-semibold'>{item.show.movie.title}</p>
                <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
                <p className='text-gray-400 text-sm mt-auto'>{item.show.showDateTime}</p>
              </div>
            </div>

          </div>
        ))
      }

    </div>
  ) : <Loading />
}

export default MyBookings