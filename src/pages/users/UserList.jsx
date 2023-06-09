import React, { useEffect, useState } from 'react'

import CreateUser from './CreateUser'
import axios from 'axios'

import { BsListTask } from 'react-icons/bs'
import { FcProcess } from 'react-icons/fc'
import { BiTask } from 'react-icons/bi'
import api from '../../utils/ApiServices'



const UserList = () => {

  const [popup, setPopup] = useState(false)
  const [users, setUsers] = useState([])
  const [reload, setReload] = useState(false)

  const [stat, setStat] = useState([])

  // console.log(users)

  // popup the create user form
  const handlePopup = () => {
    setPopup(true)
  }

  useEffect(() => {
    api.get('users',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
      .then((res) => {
        setUsers(res.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [reload])


  // http://192.168.0.169:9000/api/status
  useEffect(() => {
    api.get('status', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        setStat(res.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])






  return (
    <div className='flex flex-col h-[85vh] w-full gap-10 '>

      {popup && <CreateUser reload={reload} setReload={setReload} popup={setPopup} />}
      <div className='flex flex-row justify-between gap-5 md:px-16 px-5 py-8'>
        <div>
          <input type="text" placeholder='Search...' className='outline outline-slate-400 rounded-md px-3 py-2  focus:outline-2 focus:outline-blue-500' />
        </div>

        <button type='button' onClick={handlePopup} className=' w-fit md:px-6 px-3 md:py-2 py-1 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer text-gray-100 font-bold md:text-xl text-base hover:duration-500 hover:scale-95'>Create User</button>
      </div>

      {/* userlist */}
      <div className='2xl:grid-cols-4 lg:grid-cols-3 grid md:grid-cols-2 sm:grid-cols-1 gap-10 place-items-center overflow-y-auto overflow-x-hidden py-2 md:px-16 px-5 scrollbar'>
        {users.map((user) => (
          <div className='flex flex-col gap-6 bg-gray-300 shadow-2xl p-5 rounded-lg gap-y-5 min-w-[320px] max-w-[350px]' key={user._id}>
            <div className='flex flex-row gap-x-5'>
              <img src={user.profileImg} alt="User Image" className='w-20 h-20 rounded-full border-2' />
              <div className='flex flex-col gap-y-2'>
                <h1 className='text-xl font-bold text-blue-900'>{user.name}</h1>
                <p>{user.email}</p>
                <p>{user.mobile}</p>
              </div>
            </div>

            <div className='flex'>

              {stat.filter((st) => st.user === user.name).map((filteredStat) => (
                <div className='flex flex-row gap-y-3 gap-x-5 w-1/2' key={filteredStat.id}>
                  <div className='flex flex-col justify-between items-center gap-y-2'>
                    <BsListTask className='text-red-600' /> <span>{filteredStat.todoCount}</span>
                  </div>
                  <div className='flex flex-col justify-between items-center gap-y-2'>
                    <FcProcess className='text-green-600' /> <span>{filteredStat.inprogressCount}</span>
                  </div>
                  <div className='flex flex-col justify-between items-center gap-y-2'>
                    <BiTask className='text-blue-600' /> <span>{filteredStat.doneCount}</span>
                  </div>
                </div>
              ))}

              <div>
                {user.role === 'ADMIN' && <button type='button' className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-100 font-bold py-2 px-4 rounded-md hover:duration-500 hover:scale-95'>{user.role}</button>}
              </div>
            </div>
            {/*  : <button type='button' className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-100 font-bold py-2 rounded-md hover:duration-500 hover:scale-95'>View</button> */}
          </div>
        ))}

      </div>
    </div>
  )
}

export default UserList