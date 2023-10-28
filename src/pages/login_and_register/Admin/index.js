import classNames from 'classnames/bind'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './AdminLogin.module.scss'
import validateForm from '~/helpers/validation'
import Loading from '~/components/Loading/LoadingPage'
import http from '~/utils/http'
const cx = classNames.bind(styles)

function AdminLoginPage() {
   const navigate = useNavigate()
   const [loading, setLoading] = useState(false)
   const [email, setEmail] = useState('')
   const [errors, setErrors] = useState({})

   useEffect(() => {
      const isAdminLoggedIn = localStorage.getItem('admin')
      if (isAdminLoggedIn) {
         navigate('/admin/dashboard')
      }
   }, [navigate])

   const rules = {
      email: {
         required: true,
         email: true,
      },
      password: {
         password: true,
      },
   }

   const [adminLogin, setadminLogin] = useState({
      email: '',
      password: '',
   })

   // // eslint-disable-next-line no-unused-vars
   // const [admin, setAdmin] = useState({
   //    id: null,
   //    role: null,
   //    name: '',
   //    email: '',
   //    phone: '',
   //    date_of_birth: null,
   //    avatar: null,
   //    gender: null,
   //    address: '',
   //    access_token: '',
   //    remember_token: null,
   //    created_at: null,
   //    updated_at: null,
   //    email_verified_at: null,
   // })

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setadminLogin({
         ...adminLogin,
         [name]: value,
      })
   }

   const handleEmailChange = (e) => {
      setEmail(e.target.value)
   }

   const handleSendmail = async () => {
      console.log({ email })
      try {
         setLoading(true)
         await http.post('admin/forgot-pw-sendcode', { email })

         setErrors({
            errors,
            sendMailOk:
               'Email đã được gửi thành công! Vui lòng kiểm tra hộp thư đến của bạn !.',
         })
      } catch (error) {
         console.error(error)
         setErrors({
            errors,
            sendMail: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
         })
      } finally {
         setLoading(false)
      }
   }

   const handleLogin = async (e) => {
      e.preventDefault()

      const validationErrors = validateForm(adminLogin, rules)
      if (Object.keys(validationErrors).length === 0) {
         try {
            setLoading(true)
            const response = await http.post('admin/login', adminLogin)

            console.log(response.data.data)
            const updatedAdmin = response.data.data
            // setAdmin(updatedAdmin) // Cập nhật giá trị của admin bằng setAdmin
            localStorage.setItem('admin', JSON.stringify(updatedAdmin)) // lưu vào localStorage
            navigate('/admin/dashboard')
            console.log(updatedAdmin)
            console.log('Đăng nhập thành công')
         } catch (error) {
            console.log(error)
            setErrors({
               errors,
               api: 'Tài khoản hoặc mật khẩu chưa đúng',
            })
         } finally {
            setLoading(false)
         }
      } else {
         setErrors(validationErrors)
      }
   }

   return (
      <div className={cx('container')}>
         {loading && <Loading />}
         <div className={cx('screen')}>
            <div className={cx('screen_content')}>
               <div className={cx('title')}>Hello Admin!</div>
               <form
                  className={cx('login')}
                  encType="multipart/form-data"
                  onSubmit={handleLogin}
               >
                  <div className={cx('login_field')}>
                     <FontAwesomeIcon
                        icon="fa-solid fa-user"
                        className={cx('login_icon')}
                     />
                     <input
                        onChange={handleInputChange}
                        defaultValue={adminLogin.name}
                        type="email"
                        name="email"
                        className={cx('login_input')}
                        placeholder="User name / Email"
                     ></input>
                     {errors.email && (
                        <p className={cx('error')}>{errors.email}</p>
                     )}
                     {errors.api && <p className={cx('error')}>{errors.api}</p>}
                  </div>
                  <div className={cx('login_field')}>
                     <FontAwesomeIcon
                        icon="fa-solid fa-lock"
                        className={cx('login_icon')}
                     />
                     <input
                        onChange={handleInputChange}
                        defaultValue={adminLogin.password}
                        type="password"
                        name="password"
                        className={cx('login_input')}
                        placeholder="Password"
                     ></input>
                     {errors.password && (
                        <p className={cx('error')}>{errors.password}</p>
                     )}
                  </div>
                  <button
                     type="submit"
                     className={cx('button', 'login_submit')}
                  >
                     <span className={cx('button_text')}>Đăng nhập</span>
                     <FontAwesomeIcon
                        icon="fa-solid fa-chevron-right"
                        className={cx('button_icon')}
                     />
                  </button>
               </form>
               <div className={cx('social_login')}>
                  <div className={cx('social_icons')}>
                     <Link to={'/'}>
                        <FontAwesomeIcon
                           icon="fa-solid fa-house"
                           className={cx('social_login_icon')}
                        />
                     </Link>
                     <Link to={'/'}>
                        <FontAwesomeIcon
                           icon="fa-regular fa-hospital"
                           className={cx('social_login_icon')}
                        />
                     </Link>
                  </div>
                  <Link
                     className={cx('back')}
                     data-toggle="modal"
                     data-target="#exampleModal"
                  >
                     Quên mật khẩu &gt;&gt;
                  </Link>
               </div>
            </div>

            <div className={cx('screen_background')}>
               <span
                  className={cx(
                     'screen_background_shape',
                     'screen_background_shape4'
                  )}
               ></span>
               <span
                  className={cx(
                     'screen_background_shape',
                     'screen_background_shape3'
                  )}
               ></span>
               <span
                  className={cx(
                     'screen_background_shape',
                     'screen_background_shape2'
                  )}
               ></span>
               <span
                  className={cx(
                     'screen_background_shape',
                     'screen_background_shape1'
                  )}
               ></span>
            </div>
            <div
               className="modal fade"
               id="exampleModal"
               tabIndex="-1"
               role="dialog"
               aria-labelledby="exampleModalLabel"
               aria-hidden="true"
            >
               <div className="modal-dialog" role="document">
                  <div className="modal-content">
                     <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                           Quên mật khẩu
                        </h5>
                        <button
                           type="button"
                           className="close"
                           data-dismiss="modal"
                           aria-label="Close"
                        >
                           <span aria-hidden="true">&times;</span>
                        </button>
                     </div>
                     <div className="modal-body">
                        <div className="form-group">
                           <label
                              htmlFor="email_forgot_pass"
                              className="col-form-label"
                           >
                              Email:
                           </label>
                           <input
                              type="email"
                              className="form-control"
                              id="email_forgot_pass"
                              value={email}
                              onChange={handleEmailChange}
                           />
                           {errors.sendMail && (
                              <p className={cx('error')}>{errors.sendMail}</p>
                           )}
                           {errors.sendMailOk && (
                              <p className={cx('success')}>
                                 {errors.sendMailOk}
                              </p>
                           )}
                        </div>
                     </div>
                     <div className="modal-footer">
                        <button
                           type="button"
                           className="btn btn-secondary"
                           data-dismiss="modal"
                        >
                           Close
                        </button>
                        <button
                           type="button"
                           className="btn btn-primary"
                           onClick={handleSendmail}
                        >
                           Xác nhận
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AdminLoginPage
