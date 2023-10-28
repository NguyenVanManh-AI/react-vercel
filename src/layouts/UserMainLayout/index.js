import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbars from '~/components/Nav/Navbar'
import { useEffect, useState } from 'react'
import './user.css'
import UserFooter from '~/components/Footer/user'

const UserMainLayout = () => {

    const [avatar, setAvatar] = useState('/image/avatar_admin_default.png')
    // useEffect(() => {
    //   if (user.avatar) {
    //      setAvatar(config.URL + user.avatar)
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])
   // const navigate = useNavigate()

   // Hàm xử lý đăng xuất
   // const logoutUser = () => {
   //    localStorage.removeItem('user')
   //    navigate('/user-login')
   // }

   return (
      <div>
         <div className='custom-navbar'>
            <Navbars/>
         </div>
         <div>
            <Outlet />
         </div>
         <div>
            <UserFooter/>
         </div>
      </div>
   )
}

export default UserMainLayout
