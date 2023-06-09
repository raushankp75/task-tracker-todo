import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/ApiServices'
import { format } from 'date-fns'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'



const TaskDetails = () => {

    const { id } = useParams()
    const { token } = useContext(AuthContext)
    // console.log(id)

    const [task, setTask] = React.useState([])
    const [comment, setComment] = useState([])
    const [commentText, setCommentText] = useState('')
    const [reload, setReload] = useState(false)

    // console.log(comment, "all comments by task id")

    // console.log(task)

    useEffect(() => {
        api.get(`tasks/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
            .then((res) => {
                setTask(res.data)
                console.log(res.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    useEffect(() => {
        api.get(`tasks/${id}/comments`,
               {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
               )
            .then((res) => {
                setComment(res.data)
                console.log(res.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [reload])

    const handleComment = (e) => {
        setCommentText(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        api.post(`tasks/${id}/comments`, { comment: commentText },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
            .then((res) => {
                // console.log(res, "create task response");
                if (res.status === 200) {
                    setCommentText('')
                    setReload(!reload)
                }
            })
    }

    return (
        <div className='md:h-[70vh] md:w-[40%] w-[90%]'>
            <div className='flex flex-col gap-y-3'>
                <div className='flex flex-row gap-x-2'>
                    <h1 className='text-blue-900 font-bold text-2xl'>{task.title}</h1>
                    <button className='text-xs px-2 py-1 border-2 text-green-600 font-semibold'>{task.status}</button>
                </div>
                {task.createdBy && <p className='text-gray-500 text-sm'>Created by {task.createdBy} on {task.createdAt && format(new Date(task.createdAt), 'dd MMM yyyy HH:mm')}</p>}

                <p className='font-semibold'>{task.description}</p>
            </div>

            {/* add comment */}
            <div className='flex flex-col gap-4 py-6'>
                <form onSubmit={handleSubmit}>
                    <textarea className='w-full h-9 px-2 py-1 border-b-2 border-b-gray-500 outline-none' type='text' placeholder='Write a comment...' value={commentText} onChange={handleComment} />

                    <div className='flex justify-end'>
                        <button className='bg-blue-500 inline-block text-white rounded-md px-5 py-1' type='submit'>Post Comment</button>
                    </div>
                </form>
            </div>

            <div className='my-5'>
                <h1 className='text-gray-700 font-bold text-xl'>Comments</h1>

                <div className='h-60 overflow-y-auto scrollbar my-2'>
                    {comment.map((com) => (
                        <div className='flex flex-col justify-center gap-2 border-b-2 border-b-gray-300 my-2 shadow-md'>
                            <div className='flex flex-row gap-2 items-center'>
                                <img className='w-8 h-8 rounded-full' src={com.user?.profileImg} alt="" />
                                <h1 className='text-blue-500 text-xl font-semibold'> {com.user?.name}</h1>
                                <p className='text-gray-500 text-sm'>{com?.createdAt && format(new Date(com?.createdAt), 'dd MMM yyyy hh:mm')}</p>
                            </div>

                            <p className='pl-3 py-1'>{com.comment}</p>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    )
}

export default TaskDetails
