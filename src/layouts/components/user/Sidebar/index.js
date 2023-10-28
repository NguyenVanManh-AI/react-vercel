import React, { useState, useEffect } from 'react'

import './SiderBar.css'
import { Link, useNavigate } from 'react-router-dom'
import { NavLink } from 'reactstrap'

const SiderBar = () => {
   const navigate = useNavigate()
   const userLogout = () => {
      localStorage.removeItem('HealthCareUser')
      navigate('/user-login')
   }

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
         <ul className="nav-links" id="accordion">
            <div id="logo">
               <img id="img_logo" src="/blog/image/laravel.png" alt="" />
               <span id="text_logo">User</span>
               <span id="show_sidebar">
                  <i className="fa-solid fa-bars bx bx-menu"></i>
               </span>
            </div>
            <li>
               <NavLink className="nav-link-icon" to="/home" tag={Link}>
                  <i className="fa-solid fa-house"></i>
                  <span className="link_name">Home</span>
               </NavLink>
            </li>
            <li>
               <div>
                  <Link
                     style={{ fontWeight: 500 }}
                     href="#"
                     className="link_arrow"
                     data-toggle="collapse"
                     data-target="#collapseUser"
                     aria-expanded="true"
                     aria-controls="collapseOne"
                  >
                     <i className="fa-solid fa-user-gear"></i>
                     <span className="link_name">Information Settings</span>
                     <i className="bx bxs-chevron-down arrow"></i>
                  </Link>
                  <div
                     id="collapseUser"
                     className="collapse"
                     aria-labelledby="headingOne"
                     data-parent="#accordion"
                  >
                     <div className="card-body2 list_card">
                        <NavLink
                           className="nav-link-icon"
                           to="/user/view-infor"
                           tag={Link}
                        >
                           <i className="fa-solid fa-address-card"></i>
                           <span className="link_name">Update Information</span>
                        </NavLink>
                        <NavLink
                           className="nav-link-icon"
                           to="/user/change-password"
                           tag={Link}
                        >
                           <i className="fa-solid fa-key"></i>
                           <span className="link_name">Change Password</span>
                        </NavLink>
                     </div>
                  </div>
               </div>
            </li>
            <li>
               <div>
                  <Link
                     href="#"
                     className="link_arrow"
                     data-toggle="collapse"
                     data-target="#collapseArticle"
                     aria-expanded="true"
                     aria-controls="collapseOne"
                  >
                     <i className="fa-brands fa-blogger-b"></i>
                     <span className="link_name">Articles</span>
                     <i className="bx bxs-chevron-down arrow"></i>
                  </Link>
                  <div
                     id="collapseArticle"
                     className="collapse"
                     aria-labelledby="headingOne"
                     data-parent="#accordion"
                  >
                     <div className="card-body2 list_card">
                        <Link>
                           <i className="fa-solid fa-list"></i>
                           <span className="link_name">All Article</span>
                        </Link>
                        <Link>
                           <i className="fa-solid fa-heart"></i>
                           <span className="link_name">My Article</span>
                        </Link>
                        <Link href="">
                           <i className="fa-solid fa-square-plus"></i>
                           <span className="link_name">Add Article</span>
                        </Link>
                     </div>
                  </div>
               </div>
            </li>
            <li>
               <Link>
                  <i className="fa-solid fa-circle-user"></i>
                  <span className="link_name">Personal interface</span>
               </Link>
            </li>
            <li>
               <Link>
                  <i className="fa-brands fa-facebook-messenger"></i>
                  <span className="link_name">Chat</span>
               </Link>
            </li>
            <li>
               <Link>
                  <i className="fa-solid fa-circle-question"></i>
                  <span className="link_name">Help</span>
               </Link>
            </li>
            <li>
               <Link>
                  <i className="fa-solid fa-circle-info"></i>
                  <span className="link_name">Comment</span>
               </Link>
            </li>
            <li>
               <div className="profile-details">
                  <div className="name-job">
                     <div className="profile_name">{user.name}</div>
                     <div className="job">{user.role}</div>
                  </div>
                  <Link onClick={userLogout} id="logout">
                     <i className="fa-solid fa-right-from-bracket bx bx-log-out"></i>
                  </Link>
               </div>
            </li>
         </ul>
      </div>
   )
}

export default SiderBar
