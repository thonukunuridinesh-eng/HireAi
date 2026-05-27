import React, { useState } from 'react'
import axios from 'axios'

const Chatbot = () => {

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {

    if (!message.trim()) return

    const userMessage = {
      sender: 'user',
      text: message
    }

    setChat(prev => [...prev, userMessage])

    setLoading(true)

    try {

      const response = await axios.post(
        'http://127.0.0.1:8000/api/interview/chat/',
        {
          message: message
        }
      )

      const botMessage = {
        sender: 'bot',
        text: response.data.reply
      }

      setChat(prev => [...prev, botMessage])

    } catch (error) {

      setChat(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Server error occurred.'
        }
      ])

    }

    setLoading(false)

    setMessage('')
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>

      <div className='bg-black text-white p-4 text-2xl font-bold'>
        HireAI Assistant
      </div>

      <div className='flex-1 overflow-y-auto p-5'>

        {chat.map((msg, index) => (

          <div
            key={index}
            className={
              msg.sender === 'user'
              ? 'text-right mb-4'
              : 'text-left mb-4'
            }
          >

            <div
              className={
                msg.sender === 'user'
                ? 'bg-black text-white inline-block p-3 rounded-xl max-w-[70%]'
                : 'bg-white shadow inline-block p-3 rounded-xl max-w-[70%]'
              }
            >
              {msg.text}
            </div>

          </div>

        ))}

        {loading && (
          <div className='text-left'>
            <div className='bg-white p-3 rounded-xl inline-block shadow'>
              Thinking...
            </div>
          </div>
        )}

      </div>

      <div className='p-4 bg-white flex gap-3'>

        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Ask interview or coding questions...'
          className='flex-1 border p-3 rounded-xl outline-none'
        />

        <button
          onClick={sendMessage}
          className='bg-black text-white px-6 rounded-xl'
        >
          Send
        </button>

      </div>

    </div>
  )
}

export default Chatbot