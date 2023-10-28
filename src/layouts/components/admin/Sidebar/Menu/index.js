import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'

import styles from './Menu.module.scss'
import { Link, useLocation } from 'react-router-dom'

const cx = classNames.bind(styles)

function Menu({ children }) {
   const location = useLocation()

   const [selected, setSelected] = useState('')
   const [ulSeclect, setUlSelected] = useState('')
   const [isOpenUl, setisOpenUl] = useState('')
   const admin = JSON.parse(localStorage.getItem('admin'))
   useEffect(() => {
      switch (location.pathname) {
         case '/admin/dashboard':
            setSelected('Dashboard')
            break
         case '/admin/admin-manager':
            setSelected('Tài khoản')
            setUlSelected('Admin')
            setisOpenUl('Tài khoản')
            break
         case '/admin/user-manager':
            setSelected('Tài khoản')
            setUlSelected('Người dùng')
            setisOpenUl('Tài khoản')
            break
         case '/admin/category':
            setSelected('Quản lý')
            setUlSelected('Danh mục')
            setisOpenUl('Quản lý')
            break
         case '/admin/article':
            setSelected('Quản lý')
            setUlSelected('Bài viết')
            setisOpenUl('Quản lý')
            break
         case '/admin/department':
            setSelected('Quản lý')
            setUlSelected('Chuyên khoa')
            setisOpenUl('Quản lý')
            break
         case '/admin/health-insurance':
            setSelected('Quản lý')
            setUlSelected('Bảo hiểm')
            setisOpenUl('Quản lý')
            break

         case '/admin/service':
            setSelected('Quản lý')
            setUlSelected('Dịch vụ')
            setisOpenUl('Quản lý')
            break

         case '/admin/statistical':
            setSelected('Thống kê')
            setUlSelected('Thống kê')
            setisOpenUl('Thống kê')
            break

         default:
            setSelected('')
            setUlSelected('')
            setisOpenUl('')
            break
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [location.pathname])

   const handleClickSelect = (value) => {
      if (selected === value) {
         setSelected('')
         setUlSelected('')
         setisOpenUl('')
      } else {
         setSelected(value)
         setUlSelected('')
         setisOpenUl(value)
      }
   }
   const handleClickSelectUl = (value) => {
      setUlSelected(value)
   }

   return (
      <div className={cx('sidebar_menu')}>
         {children}
         <ul className="p_0">
            <li className={cx('menu_title')}>Navigation</li>
            <li className="">
               <Link
                  to="dashboard"
                  onClick={() => handleClickSelect('Dashboard')}
                  className={cx(selected === 'Dashboard' && 'active')}
               >
                  <i className="ti-home"></i>
                  <span className={cx('space_icon')}>Dashboard</span>
               </Link>
            </li>
            <li className="">
               <Link
                  onClick={() => handleClickSelect('Tài khoản')}
                  className={cx(selected === 'Tài khoản' && 'active')}
               >
                  <i className="ti-id-badge"></i>
                  <span className={cx('space_icon')}>Tài khoản</span>
                  <span
                     className={cx(
                        'icon_right',
                        'ti-angle-right',
                        isOpenUl === 'Tài khoản' && 'routate_90'
                     )}
                  ></span>
               </Link>
               <ul
                  className={cx('ul_close', isOpenUl === 'Tài khoản' && 'open')}
               >
                  {admin.role === 'admin' ? (
                     ''
                  ) : (
                     <li>
                        <Link
                           to="admin-manager"
                           onClick={() => handleClickSelectUl('Admin')}
                           className={cx(ulSeclect === 'Admin' && 'active')}
                        >
                           Admin
                        </Link>
                     </li>
                  )}

                  <li>
                     <Link
                        to="user-manager"
                        onClick={() => handleClickSelectUl('Người dùng')}
                        className={cx(ulSeclect === 'Người dùng' && 'active')}
                     >
                        Người dùng
                     </Link>
                  </li>
               </ul>
            </li>
            <li className="">
               <Link
                  onClick={() => handleClickSelect('Quản lý')}
                  className={cx(selected === 'Quản lý' && 'active')}
               >
                  <i className="ti-menu-alt"></i>
                  <span className={cx('space_icon')}>Quản lý</span>
                  <span
                     className={cx(
                        'icon_right',
                        'ti-angle-right',
                        isOpenUl === 'Quản lý' && 'routate_90'
                     )}
                  ></span>
               </Link>
               <ul className={cx('ul_close', isOpenUl === 'Quản lý' && 'open')}>
                  <li>
                     <Link
                        to="category"
                        onClick={() => handleClickSelectUl('Danh mục')}
                        className={cx(ulSeclect === 'Danh mục' && 'active')}
                     >
                        Danh mục
                     </Link>
                  </li>
                  <li>
                     <Link
                        to="article"
                        onClick={() => handleClickSelectUl('Bài viết')}
                        className={cx(ulSeclect === 'Bài viết' && 'active')}
                     >
                        Bài viết
                     </Link>
                  </li>
                  <li>
                     <Link
                        to="department"
                        onClick={() => handleClickSelectUl('Chuyên khoa')}
                        className={cx(ulSeclect === 'Chuyên khoa' && 'active')}
                     >
                        Chuyên khoa
                     </Link>
                  </li>
                  <li>
                     <Link
                        to="health-insurance"
                        onClick={() => handleClickSelectUl('Bảo hiểm')}
                        className={cx(ulSeclect === 'Bảo hiểm' && 'active')}
                     >
                        Bảo hiểm
                     </Link>
                  </li>
                  {/* <li>
                     <Link
                        to="service"
                        onClick={() => handleClickSelectUl('Dịch vụ')}
                        className={cx(ulSeclect === 'Dịch vụ' && 'active')}
                     >
                        Dịch vụ
                     </Link>
                  </li> */}
               </ul>
            </li>
            {/* <li className="">
               <Link
                  onClick={() => handleClickSelect('Thống kê')}
                  className={cx(selected === 'Thống kê' && 'active')}
               >
                  <i className="ti-pie-chart"></i>
                  <span className={cx('space_icon')}>Thống kê</span>
                  <span
                     className={cx(
                        'icon_right',
                        'ti-angle-right',
                        isOpenUl === 'Thống kê' && 'routate_90'
                     )}
                  ></span>
               </Link>

               <ul
                  className={cx('ul_close', isOpenUl === 'Thống kê' && 'open')}
               >
                  <li>
                     <Link
                        to="statistical"
                        onClick={() => handleClickSelectUl('Thống kê')}
                        className={cx(ulSeclect === 'Thống kê' && 'active')}
                     >
                        Thống kê
                     </Link>
                  </li>
               </ul>
            </li> */}
         </ul>
      </div>
   )
}

export default Menu
