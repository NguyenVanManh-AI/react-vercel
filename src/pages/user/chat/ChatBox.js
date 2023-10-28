/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import {
   query,
   collection,
   orderBy,
   onSnapshot,
   limit,
   and,
   or,
   where,
} from 'firebase/firestore'
import { auth, db } from '../../../firebase'
import Message from './Message'
import SendMessage from './SendMessage'
import './ChatBox.css'
import config from '../../../router/config'
import axios from 'axios'

const ChatBox = () => {
   // console.log(auth.currentUser.reloadUserInfo.providerUserInfo[0]);

   // userTo
   const currentURL = window.location.href
   const parts = currentURL.split('/')
   const toId = parseInt(parts[parts.indexOf('chat') + 1], 10)

   const [userTo, setUserTo] = useState({
      id: null,
      name: '',
      avatar: null,
   })

   useEffect(() => {
      axios
         .get(config.URL + 'api/user/infor-user/' + toId)
         .then((response) => {
            setUserTo(response.data.user)
            console.log(response.data)
         })
         .catch((error) => {
            console.error('Lỗi khi gọi API:', error)
         })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   // userTo

   const [messages, setMessages] = useState([])
   const scroll = useRef()

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

   useEffect(() => {
      // const q = query(
      //     collection(db, "messages"), and(
      //         where('from', '==', user.id_user),
      //         where('to', '==', userTo.id),
      //         or(
      //             where('to', '==', user.id_user),
      //             where('from', '==', userTo.id),
      //         ),
      //     orderBy("createdAt", "desc"),
      //     limit(50)
      // ));

      const q = query(
         collection(db, 'messages'),
         (orderBy('createdAt', 'desc'), limit(50))
      )

      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
         const fetchedMessages = []
         QuerySnapshot.forEach((doc) => {
            fetchedMessages.push({ ...doc.data(), id: doc.id })
         })
         const sortedMessages = fetchedMessages.sort(
            (a, b) => a.createdAt - b.createdAt
         )
         setMessages(sortedMessages)
      })
      return () => unsubscribe
   }, [])

   // const [listUser, setlistUser] = useState([]);
   // useEffect(() => {
   //     axios.get(config.URL + 'api/admin/all-user')
   //         .then(response => {
   //             setlistUser(response.data.users.data);
   //         })
   //         .catch(error => {
   //             console.error('Lỗi khi gọi API:', error);
   //         });
   // }, []);

   return (
      <main className="chat-box">
         <div className="messages-wrapper">
            {messages?.map((message) => (
               <Message key={message.id} message={message} userTo={userTo} />
            ))}
         </div>
         {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
         <span ref={scroll}></span>
         <SendMessage scroll={scroll} />
      </main>
   )
}

export default ChatBox
