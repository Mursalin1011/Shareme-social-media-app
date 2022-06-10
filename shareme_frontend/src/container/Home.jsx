import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { SideBar, UserProfile } from '../components';
import { userQuery } from '../utils/data';
import Pins from './Pins';
import { client } from '../client';
import logo from '../assets/logo.png';
import { fetchUser } from '../utils/fetchUser';
// import UserProfile from '../components/UserProfile';


const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const userInfo = fetchUser();

  // const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  
  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0,0);
  }, [])

  return (
    <div className='flex flex-col h-screen duration-75 ease-out bg-gray-50 md:flex-row transaction-height'>   
      <div className='flex-initial hidden h-screen md:flex'>
        <SideBar user={user && user} />
      </div>
      <div className='flex flex-row md:hidden'>
        <div className='flex flex-row items-center justify-between w-full p-2 shadow-md'>
        <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
        <Link to="/" >
          <img src={logo} alt="logo" className='w-28'/>
        </Link>
        <Link to={`user-profile/${user?._id}`} >
          <img src={user?.image} alt="logo" className='w-28'/>
        </Link>
        </div>
          {toggleSidebar && (
          <div className='fixed z-10 w-4/5 h-screen overflow-y-auto bg-white shadow-md animate-slide-in'>
            <div className='absolute flex items-center justify-end w-full p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)}/>
            </div>
            <SideBar user={user && user} closeToggle={setToggleSidebar}/>
          </div>
        )}
      </div>
      
      <div className='flex-1 h-screen pb-2 overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile/>}/>
          <Route path='/*' element={<Pins user={user && user}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Home;