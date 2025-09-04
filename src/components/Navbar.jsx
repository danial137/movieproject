import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuIcon, SearchIcon, TicketPlus, X, XIcon } from 'lucide-react'
import { assets } from '../assets/assets.js'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)

    const { user } = useUser()
    const { openSignIn } = useClerk()

    const navigate = useNavigate()

    return (
        <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
            <Link to='/' className='max-md:flex-1'>
                <img src={assets.logo} className='w-36 h-auto' />
            </Link>

            <div className={`max-md:fixed max-md:top-0 max-md:left-0 z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 px-8 py-3 max-md:h-screen max-md:w-full md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 transition-all duration-300 ${isOpen ? '' : 'max-md:hidden'}`}>

                <XIcon onClick={() => setIsOpen(!isOpen)} className='md:hidden absolute top-6 right-6 w-6 h-6 curs ' />

                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Home</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/movies">Movies</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Threats</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Releses</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/favorite">Favorits</Link>

            </div>

            <div className='flex items-center gap-8'>
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
                {
                    !user ? (
                        <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
                    ) : (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action label='My Booking' labelIcon={<TicketPlus width={15} />} onClick={() => navigate('/my-booking')} />
                            </UserButton.MenuItems>
                        </UserButton>
                    )
                }


            </div>

            <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />

        </div>
    )
}

export default Navbar