import React, { useState } from 'react'
import { dummyBookingData } from '../../assets/assets';

const ListBooking = () => {

  const currency = import.meta.env._VITE_CURRENCY || "$"

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    setBookings(dummyBookingData)
    setIsLoading(false)
  };



  return (
    <div>ListBooking</div>
  )
}

export default ListBooking