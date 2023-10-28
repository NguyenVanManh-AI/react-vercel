import classNames from 'classnames/bind'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from './HeaderAdminHospital.module.scss'
import config from '~/router/config'

const cx = classNames.bind(styles)
function Header() {
   const location = useLocation()

   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [navActive, setNavActive] = useState('')
   const [linkActive, setLinkActive] = useState('')
   const [avatar, setAvatar] = useState(
      user.role === 'doctor'
         ? '/image/avata-default-doctor.jpg'
         : '/image/default-hospital-search.jpg'
   )
   const [name, setName] = useState(user.name ? user.name : 'You')
   const isAdminUpdated = useSelector((state) => state.admin.keyAdminUpdated)
   useEffect(() => {
      switch (location.pathname) {
         case '/hospital/dashboard':
            setNavActive('dashboard')
            break
         case '/hospital/doctor-dashboard':
            setNavActive('doctor-dashboard')
            break
         case '/hospital/doctor-schedule':
            setNavActive('doctor-schedule')
            break
         case '/hospital/doctor-article':
            setNavActive('doctor-article')
            break
         case '/hospital/doctor':
            setNavActive('hospital')
            setLinkActive('doctor')
            break
         case '/hospital/article':
            setNavActive('hospital')
            setLinkActive('article')
            break
         case '/hospital/service':
            setNavActive('category')
            setLinkActive('service')
            break
         case '/hospital/insurance':
            setNavActive('category')
            setLinkActive('insurance')
            break
         case '/hospital/department':
            setNavActive('category')
            setLinkActive('department')
            break
         case '/hospital/calendar':
            setNavActive('calendar')
            setLinkActive('calendar')
            break
         case '/hospital/calendar-doctor':
            setNavActive('calendar')
            setLinkActive('calendar-doctor')
            break
         default:
            setNavActive('')
            break
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [location.pathname])
   useEffect(() => {
      const admin = JSON.parse(localStorage.getItem('HealthCareUser'))
      if (admin && admin.avatar) {
         setAvatar(config.URL + admin.avatar)
      }
      if (admin && admin.name) {
         setName(admin.name)
      }
   }, [isAdminUpdated])

   const handleLogout = () => {
      localStorage.removeItem('HealthCareUser')
   }
   return (
      <header id={cx('topnav')}>
         <div className={cx('nav_custom')}>
            <div className={cx('container-fluid')}>
               {/* proflie */}
               <ul
                  className={cx(
                     'list-unstyled',
                     'topnav-menu',
                     'float-right',
                     'mb-0'
                  )}
               >
                  <li className="dropdown notification-list">
                     <Link
                        className={cx('nav-link', 'nav-user mr-0')}
                        data-toggle="dropdown"
                        role="button"
                        aria-haspopup="false"
                        aria-expanded="false"
                     >
                        <img
                           src={avatar}
                           alt={'avatar'}
                           className={cx('rounded-circle', 'avatar')}
                        />
                        <span className="pro-user-name d-none d-xl-inline-block ml-2">
                           {name} <i className="mdi mdi-chevron-down"></i>
                        </span>
                     </Link>
                     <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                        <div className="dropdown-header noti-title">
                           <h6 className="text-overflow m-0">Welcome !</h6>
                        </div>

                        <Link to="/" className="dropdown-item notify-item">
                           <i className="mdi mdi-home-import-outline"></i>
                           &ensp;&nbsp;
                           <span>Trang chủ</span>
                        </Link>

                        <Link
                           to={
                              user.role === 'hospital'
                                 ? 'profile'
                                 : 'doctor-profile'
                           }
                           className="dropdown-item notify-item"
                        >
                           <i className="mdi mdi-account-outline"></i>
                           &ensp;&nbsp;
                           <span>Profile</span>
                        </Link>

                        <Link
                           to="change-password"
                           className="dropdown-item notify-item"
                        >
                           <i className="mdi mdi-lock-outline"></i>&ensp;&nbsp;
                           <span>Đổi mật khẩu</span>
                        </Link>

                        <div className="dropdown-divider"></div>

                        <Link
                           to="/user-login"
                           onClick={handleLogout}
                           className="dropdown-item notify-item"
                        >
                           <i className="mdi mdi-logout-variant"></i>
                           &ensp;&nbsp;
                           <span>Logout</span>
                        </Link>
                     </div>
                  </li>
               </ul>
               {/* logo */}
               <div className={cx('logo-box')}>
                  <Link to="/" className={cx('logo')}>
                     <img src="/image/logo_admin.png" alt="logo" />
                  </Link>
               </div>
               {/* mennu */}
               {user.role === 'hospital' ? (
                  <ul className={cx('navigation-menu')}>
                     <li className={cx('has-submenu')}>
                        <Link
                           to="dashboard"
                           className={cx(
                              navActive === 'dashboard' && 'nav_active'
                           )}
                        >
                           <i className="ti-home"></i>&ensp;&nbsp;Dashboard
                        </Link>
                     </li>

                     <li className={cx('has-submenu')}>
                        <Link
                           className={cx(
                              navActive === 'hospital' && 'nav_active'
                           )}
                        >
                           <i className="mdi mdi-hospital-building"></i>
                           &ensp;&nbsp;Bệnh viện
                        </Link>
                        <ul className={cx('submenu')}>
                           <li>
                              <Link
                                 to="doctor"
                                 className={cx(
                                    linkActive === 'doctor' && 'link_active'
                                 )}
                              >
                                 <i className="mdi mdi-doctor"></i>&ensp; Bác sĩ
                              </Link>
                           </li>
                           <li>
                              <Link
                                 to="article"
                                 className={cx(
                                    linkActive === 'article' && 'link_active'
                                 )}
                              >
                                 <i className="mdi mdi-post-outline"></i>
                                 &ensp; Bài viết
                              </Link>
                           </li>
                        </ul>
                     </li>
                     <li className={cx('has-submenu')}>
                        <Link
                           className={cx(
                              navActive === 'category' && 'nav_active'
                           )}
                        >
                           <i className="ti-menu-alt"></i>&ensp;&nbsp; Danh mục
                        </Link>
                        <ul className={cx('submenu')}>
                           <li>
                              <Link
                                 to="service"
                                 className={cx(
                                    linkActive === 'service' && 'link_active'
                                 )}
                              >
                                 <i className="mdi mdi-database"></i>&ensp; Dịch
                                 vụ
                              </Link>
                           </li>
                           <li>
                              <Link
                                 to="insurance"
                                 className={cx(
                                    linkActive === 'insurance' && 'link_active'
                                 )}
                              >
                                 <i className="mdi mdi-credit-card-plus-outline"></i>
                                 &ensp; Bảo hiểm
                              </Link>
                           </li>
                           <li>
                              <Link
                                 to="department"
                                 className={cx(
                                    linkActive === 'department' && 'link_active'
                                 )}
                              >
                                 <i className="mdi mdi-progress-alert"></i>
                                 &ensp; Chuyên khoa
                              </Link>
                           </li>
                        </ul>
                     </li>
                     <li className={cx('has-submenu')}>
                        <Link
                           className={cx(
                              navActive === 'calendar' && 'nav_active'
                           )}
                        >
                           <i className="mdi mdi-calendar-month"></i>
                           &ensp;&nbsp;Lịch làm việc
                        </Link>
                        <ul className={cx('submenu')}>
                           <li>
                              <Link
                                 to="calendar"
                                 className={cx(
                                    linkActive === 'calendar' && 'link_active'
                                 )}
                              >
                                 <i className="mdi mdi-database"></i>&ensp; Lịch
                                 bệnh viện
                              </Link>
                           </li>
                           <li>
                              <Link
                                 to="calendar-doctor"
                                 className={cx(
                                    linkActive === 'calendar-doctor' &&
                                       'link_active'
                                 )}
                              >
                                 <i className="mdi mdi-credit-card-plus-outline"></i>
                                 &ensp; Lịch bác sĩ
                              </Link>
                           </li>
                        </ul>
                     </li>
                  </ul>
               ) : (
                  <ul className={cx('navigation-menu')}>
                     <li className={cx('has-submenu')}>
                        <Link
                           to="doctor-dashboard"
                           className={cx(
                              navActive === 'doctor-dashboard' && 'nav_active'
                           )}
                        >
                           <i className="ti-home"></i>&ensp;&nbsp;Dashboard
                        </Link>
                     </li>

                     <li className={cx('has-submenu')}>
                        <Link
                           to="doctor-schedule"
                           className={cx(
                              navActive === 'doctor-schedule' && 'nav_active'
                           )}
                        >
                           <i className="ti-calendar"></i>
                           &ensp;&nbsp;Lịch trình
                        </Link>
                     </li>
                     <li className={cx('has-submenu')}>
                        <Link
                           to="doctor-article"
                           className={cx(
                              navActive === 'doctor-article' && 'nav_active'
                           )}
                        >
                           <i className="ti-write"></i>&ensp;&nbsp; Bài viết
                        </Link>
                     </li>
                  </ul>
               )}
            </div>
         </div>
      </header>
   )
}

export default Header
