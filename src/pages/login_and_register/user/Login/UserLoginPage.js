import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { NavLink } from 'reactstrap'
import { auth } from '../../../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
   GoogleAuthProvider,
   FacebookAuthProvider,
   signInWithPopup,
} from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify'
import { useAppContext } from '~/contexts/AppContext'

import config from '~/router/config'
import './UserLogin.css'
import 'react-toastify/dist/ReactToastify.css'
import http from '~/utils/http'

const UserLoginPage = () => {
   const { toastRegisterSuccess, handleToastRegisterSuccessFalse } =
      useAppContext()
   const navigate = useNavigate()
   const [email, setEmail] = useState('');
   
   const handleEmailChange = (e) => {
      console.log(e.target.value);
      setEmail(e.target.value)
   }

   const handleSendmail = async () => {
      try {
         await http.post('user/forgot-pw-sendcode', { email })
      } catch (error) {
         console.error('Gửi mật khẩu thất bại! Hãy kiểm tra lại email', toastOptions)
      } finally {
         toast.success('Mật khẩu đã gửi về email bạn thành công! Hãy kiểm tra email.', toastOptions)
      }
   }

   useEffect(() => {
      const userLoggined = JSON.parse(localStorage.getItem('HealthCareUser'))
      if (userLoggined) {
         if (userLoggined.role == 'user') {
            navigate('/')
         } else {
            navigate('/hospital/dashboard')
         }
      }
   }, [navigate])

   const [userLogin, setUserLogin] = useState({
      email: '',
      password: '',
   })

   const toastOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
   }
   // login google
   const googleSignIn = async () => {
      const googleProvider = new GoogleAuthProvider()
      try {
         await signInWithPopup(auth, googleProvider)
         const user = auth.currentUser
         const response = await axios
            .post(config.URL + 'api/infor-user/login-google', {
               id: user.providerData[0].uid,
               email: user.providerData[0].email,
               name: user.providerData[0].displayName,
               avatar: user.providerData[0].photoURL,
            })
            .then(function (response) {
               const updatedUser = response.data.data
               setUser(updatedUser) // Cập nhật giá trị của user bằng setUser
               localStorage.setItem(
                  'HealthCareUser',
                  JSON.stringify(updatedUser)
               )
               toast.success(' Đăng nhập thành công !', toastOptions)
               navigate('/')
            })
      } catch (error) {
         console.error('Đăng nhập bằng Google thất bại:', error)
      }
   }

   // Login facebook
   const facebookSignIn = async () => {
      const facebookProvider = new FacebookAuthProvider()
      try {
         await signInWithPopup(auth, facebookProvider)
         const user = auth.currentUser
         console.log(user.providerData[0])
      } catch (error) {
         console.error('Đăng nhập bằng Facebook thất bại:', error)
      }
   }

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setUserLogin({
         ...userLogin,
         [name]: value,
      })
   }

   // eslint-disable-next-line no-unused-vars
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
      have_password: true,
      remember_token: null,
      created_at: null,
      updated_at: null,
      email_verified_at: null,
   })

   const handleLogin = async (e) => {
      e.preventDefault()
      try {
         const response = await axios.post(
            config.URL + 'api/user/login',
            userLogin
         )
         const updatedUser = response.data.data
         setUser(updatedUser) // Cập nhật giá trị của user bằng setUser
         localStorage.setItem('HealthCareUser', JSON.stringify(updatedUser)) // lưu vào localStorage
         toast.success('Đăng nhập thành công !', toastOptions)
         if (
            response.data.data.role == 'hospital' ||
            response.data.data.role == 'doctor'
         ) {
            navigate('/hospital/dashboard')
         } else {
            navigate('/')
         }
      } catch (error) {
         if (error.response.data.data)
            toast.error(error.response.data.data[0], toastOptions)
         else toast.error(error.response.data.message, toastOptions)
         console.error('Lỗi kết nối đến API', error)
      }
   }
   useEffect(() => {
      if (toastRegisterSuccess) {
         toast.success('Đăng ký thành công, vui lòng kiểm tra email', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
         })
         handleToastRegisterSuccessFalse()
      }
   }, [toastRegisterSuccess])

   return (
      <div>
         <ToastContainer />
         <div className="login d-flex">
            <div className="container m-auto ps-md-0">
               <div className="row g-0 pt-3 pb-3 body-login">
                  <div className="d-none d-md-block col-md-5 col-lg-6">
                     <img
                        src="/user/image/doctor-main.png"
                        className="w-100 h-auto"
                     />
                  </div>
                  <div className="col-md-7 col-lg-6">
                     <div className="d-flex align-items-center">
                        <div className="container">
                           <div className="row">
                              <div className="col-md-10 mx-auto">
                                 <NavLink
                                    className="nav-link-icon d-flex"
                                    to="/"
                                    tag={Link}
                                 >
                                    <img
                                       src="/user/image/logo.png"
                                       className="m-auto w-50"
                                    />
                                 </NavLink>
                                 <h3 className="login-heading mb-4 mt-4 text-center">
                                    <b>Đăng nhập</b>
                                 </h3>
                                 <form
                                    encType="multipart/form-data"
                                    onSubmit={handleLogin}
                                 >
                                    <div className="form-group">
                                       <label htmlFor="email">Email:</label>
                                       <input
                                          name="email"
                                          onChange={handleInputChange}
                                          defaultValue={userLogin.name}
                                          type="email"
                                          id="email"
                                          className="login-input"
                                          aria-describedby="emailHelp"
                                          placeholder="Email@example.com"
                                       />
                                    </div>

                                    <div className="form-group">
                                       <label htmlFor="email">Mật khẩu:</label>
                                       <input
                                          name="password"
                                          onChange={handleInputChange}
                                          defaultValue={userLogin.password}
                                          type="password"
                                          className="login-input"
                                          aria-describedby="emailHelp"
                                          placeholder="Password"
                                       />
                                    </div>
                                    <div className="mb-3 float-left">
                                       <input
                                          name="check-box"
                                          onChange={handleInputChange}
                                          defaultValue={userLogin.password}
                                          type="checkbox"
                                          aria-describedby="emailHelp"
                                          placeholder="Password"
                                       />{' '}
                                       Nhớ mật khẩu
                                    </div>
                                    <div className="mb-3">
                                       <div className="float-right">
                                          <Link
                                             className="small"
                                             data-toggle="modal"
                                             data-target="#modalForGotPassword"
                                             href="#"
                                          >
                                             Forgot password?
                                          </Link>
                                       </div>
                                    </div>
                                    {/* 
                      <div className="row mb-3">
                        <div className="col-7 p-0">
                          <div className="ml-3 g-recaptcha" data-sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_KEY}></div>
                          {errors.has('g-recaptcha-response') && (
                            <span className="text-danger ml-3">{errors.first('g-recaptcha-response')}</span>
                          )}
                        </div>
                      </div> */}

                                    <div className="d-grid mt-5">
                                       <button
                                          className="col-12 btn btn-lg btn-login text-uppercase fw-bold mb-2"
                                          type="submit"
                                       >
                                          Đăng nhập
                                       </button>
                                       <div className="text-center mt-2">
                                          <NavLink
                                             className="nav-link-icon small ml-2 mr-2"
                                             to="/user-register"
                                             tag={Link}
                                          >
                                             Bạn chưa có tài khoản? Đăng ký tại
                                             đây
                                          </NavLink>
                                       </div>
                                    </div>

                                    <p className="mt-2 text-center">Hoặc</p>
                                    <div className="row">
                                       <div className="col-lg-12 col-md-12 pr-1 pl-1">
                                          <div className="social google ">
                                             <Link onClick={googleSignIn}>
                                                <img
                                                   src="/user/image/google.png"
                                                   alt=""
                                                />{' '}
                                                <div className="text-login">
                                                   Đăng nhập với <br />
                                                   <span>Google</span>
                                                </div>
                                             </Link>
                                          </div>
                                       </div>
                                       {/* <div className="col-lg-6 col-md-6 pr-1 pl-1">
                                          <div className="social facebook">
                                             <Link to={'/github'}>
                                                <img
                                                   src="/user/image/facebook.png"
                                                   alt=""
                                                />{' '}
                                                <div className="text-login">
                                                   Đăng nhập với <br />
                                                   <span>Facebook</span>
                                                </div>
                                             </Link>
                                          </div>
                                       </div> */}
                                       <div className="col-lg-12 p-1">
                                          <Link
                                             className="btn btn-primary w-100"
                                             to={'/hospital-register'}
                                          >
                                             <b>Đăng ký bệnh viện</b>
                                          </Link>
                                       </div>
                                    </div>
                                 </form>
                                 {/* Modal */}
                                 <div
                                    className="modal fade"
                                    id="modalForGotPassword"
                                    tabIndex="-1"
                                    role="dialog"
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                 >
                                    <div
                                       className="modal-dialog"
                                       role="document"
                                    >
                                       <div className="modal-content">
                                          <div className="modal-header">
                                             <h5
                                                className="modal-title"
                                                id="exampleModalLabel"
                                             >
                                                Forgot Password
                                             </h5>
                                             <button
                                                style={{ outline: 'none' }}
                                                type="button"
                                                className="close"
                                                data-dismiss="modal"
                                                aria-label="Close"
                                             >
                                                <span aria-hidden="true">
                                                   &times;
                                                </span>
                                             </button>
                                          </div>
                                          <div className="modal-body">
                                             <form
                                                method="POST"
                                                encType="multipart/form-data"
                                             >
                                                <div className="form-group row">
                                                   <label
                                                      htmlFor="staticEmail"
                                                      className="col-sm-2 col-form-label"
                                                   >
                                                      Email
                                                   </label>
                                                   <div className="col-sm-10">
                                                      <input
                                                         name="email"
                                                         type="email"
                                                         onChange={handleEmailChange}
                                                         className="form-control"
                                                         id="staticEmail"
                                                         placeholder="email@example.com"
                                                         defaultValue=""
                                                      />
                                                   </div>
                                                </div>
                                             </form>
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
                                                type="submit"
                                                className="btn btn-primary"
                                                onClick={handleSendmail}
                                             >
                                                Submit
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default UserLoginPage
