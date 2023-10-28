import React from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from '~/layouts/components/admin/Sidebar'

const AdminDashboardPage = () => {
   // const navigate = useNavigate()

   // Hàm xử lý đăng xuất
   // const logoutUser = () => {
   //    localStorage.removeItem('user')
   //    navigate('/user-login')
   // }

   return (
      <div>
         <div className="sidebar" style={{ opacity: '1' }}>
            <Sidebar></Sidebar>
         </div>
         <div className="home-main">
            <Outlet />
         </div>
      </div>
   )
}

export default AdminDashboardPage
