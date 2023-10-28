import React, { useState, useEffect } from 'react'

import config from '../../../router/config'

const Message = ({ message, userTo }) => {
   const [user, setUser] = useState({
      id: null,
      id_user: null,
      is_accept: null,
      role: null,
      name: '',
      username: '',
      email: '',
      phone: '',
      google_id: null,
      date_of_birth: null,
      avatar: null,
      gender: null,
      address: '',
      status: null,
      access_token: '',
      remember_token: null,
      created_at: null,
      updated_at: null,
      email_verified_at: null,
   })

   useEffect(() => {
      setUser(JSON.parse(localStorage.getItem('HealthCareUser')))
   }, [])

   return (
      <div>
         {message.from === user.id_user && message.to === userTo.id ? (
            <div className="chat-bubble right">
               <img
                  className="chat-bubble__left"
                  src={config.URL + user.avatar}
                  alt="user avatar"
               />
               <div className="chat-bubble__right">
                  <p className="user-name">{user.name}</p>
                  <p className="user-message">{message.content}</p>
               </div>
            </div>
         ) : (
            ''
         )}
         {message.to === user.id_user && message.from === userTo.id ? (
            <div className="chat-bubble">
               <img
                  className="chat-bubble__left"
                  src={config.URL + userTo.avatar}
                  alt="user avatar"
               />
               <div className="chat-bubble__right">
                  <p className="user-name">{userTo.name}</p>
                  <p className="user-message">{message.content}</p>
               </div>
            </div>
         ) : (
            ''
         )}
      </div>
   )
}

export default Message
