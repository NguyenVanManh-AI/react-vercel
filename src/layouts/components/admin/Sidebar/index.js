import Menu from './Menu'
import classNames from 'classnames/bind'

import styles from './Sidebar.module.scss'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import config from '~/router/config'
import { useSelector } from 'react-redux'

const cx = classNames.bind(styles)

function Sidebar() {
   const admin = JSON.parse(localStorage.getItem('admin'))
   const [avatar, setAvatar] = useState('/image/avatar_admin_default.png')
   const isAdminUpdated = useSelector((state) => state.admin.keyAdminUpdated)
   const [name, setName] = useState(admin.name ? admin.name : 'admin')
   useEffect(() => {
      const admin = JSON.parse(localStorage.getItem('admin'))
      if (admin && admin.avatar) {
         setAvatar(config.URL + admin.avatar)
      }
      if (admin && admin.name) {
         setName(admin.name)
      }
   }, [isAdminUpdated])
   return (
      <div className={cx('left_side')}>
         <div className={cx('user_box')}>
            <div className={cx('float_left')}>
               <img src={avatar} alt="" className={cx('rounded_circle')}></img>
            </div>
            <div className={cx('user_infor')}>
               <Link className={cx('user_name')}>{name}</Link>
               <p className={cx('m_0', 'text_muted')}>{admin.role}</p>
            </div>
         </div>

         <Menu></Menu>
      </div>
   )
}

export default Sidebar
