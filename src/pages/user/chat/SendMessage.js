import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import config from '../../../router/config'
import axios from 'axios'

const SendMessage = ({ scroll }) => {
   console.log(222222)

   const [message, setMessage] = useState('')

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

   const currentURL = window.location.href
   const parts = currentURL.split('/')
   const toId = parseInt(parts[parts.indexOf('chat') + 1], 10)

   // userto
   const [userTo, setUserTo] = useState({
      id: null,
      name: '',
      avatar: null,
   })
   useEffect(() => {
      // console.log(message.from);
      axios
         .get(config.URL + 'api/user/infor-user/' + toId)
         .then((response) => {
            setUserTo(response.data.user)
            localStorage.setItem('userTo', JSON.stringify(userTo)) // lưu vào localStorage
            console.log(response.data)
         })
         .catch((error) => {
            console.error('Lỗi khi gọi API:', error)
         })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   // userto

   const sendMessage = async (event) => {
      event.preventDefault()
      if (message.trim() === '') {
         alert('Enter valid message')
         return
      }
      // console.log(auth);
      // console.log(auth.currentUser.reloadUserInfo.providerUserInfo[0]);
      await addDoc(collection(db, 'messages'), {
         content: message,
         from: user.id_user,
         to: toId,
         createdAt: serverTimestamp(),
      })
      setMessage('')
      scroll.current.scrollIntoView({ behavior: 'smooth' })
   }
   return (
      <form onSubmit={(event) => sendMessage(event)} className="send-message">
         <label htmlFor="messageInput" hidden>
            Enter Message
         </label>
         <input
            id="messageInput"
            name="messageInput"
            type="text"
            className="form-input__input"
            placeholder="type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
         />
         <button type="submit">Send</button>
      </form>
   )
}

export default SendMessage
