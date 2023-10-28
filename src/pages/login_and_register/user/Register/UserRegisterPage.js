import React, { useState } from 'react'
import './UserRegisterPage.css'
import axios from 'axios'
import config from '~/router/config'

import { Link, useNavigate } from 'react-router-dom'
import { NavLink } from 'reactstrap'

// notify
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function RegisterPage() {
   const navigate = useNavigate()
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      date_of_birth: '',
      gender: '0',
   })
   const [selectedImage, setSelectedImage] = useState(null)

   // submit form
   const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData({
         ...formData,
         [name]: value,
      })
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      const formDataToSubmit = new FormData() //  vuejs hay react cũng vậy , muốn upload ảnh thì dùng FormData
      for (const key in formData) {
         formDataToSubmit.append(key, formData[key])
      }
      formDataToSubmit.append('avatar', selectedImage) // nếu muốn submit lên nhiều ảnh thì lưu key là một mảng
      try {
         const response = await axios.post(
            config.URL + 'api/infor-user/register',
            formDataToSubmit,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         )
            console.log(response)
            toast.success('Đăng ký thành công', {
               position: 'top-right',
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: 'colored',
            })
            console.log('Đăng ký thành công')
            setTimeout(() => {
               navigate('/user-login')
            }, 1500)
      } catch (error) {
         console.log(error)
         console.error('Lỗi kết nối đến API', error)
      }
   }
   // submit form

   // preview images
   // eslint-disable-next-line no-unused-vars
   const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (file) {
         const reader = new FileReader()
         reader.onload = (e) => setSelectedImage(e.target.result)
         reader.readAsDataURL(file)

         setFormData({
            ...formData,
            avatar: file,
         })
      }
   }

   // const handleImageChange = (e) => {
   //   const file = e.target.files[0];
   //   if (file) {
   //     const reader = new FileReader();
   //     reader.onload = (e) => {
   //       setSelectedImage(e.target.result);
   //       // Cập nhật giá trị của avatar trong formData
   //       setFormData({
   //         ...formData,
   //         avatar: e.target.result,
   //       });
   //     };
   //     reader.readAsDataURL(file);
   //   }
   // };

   // const handleImageChange = (e) => {
   //   const file = e.target.files[0];
   //   if (file) {
   //     // Không cần đọc tệp thành mã base64
   //     // Chỉ cần cập nhật giá trị của avatar trong formData với tệp đó
   //     setFormData({
   //       ...formData,
   //       avatar: file,
   //     });
   //   }
   // };

   // eslint-disable-next-line no-unused-vars
   const handleCancelClick = () => {
      setSelectedImage(null)
   }
   // preview images

   return (
      <div id="big_register">
         <ToastContainer />
         <div className="container-fluid">
            <div className="row">
               <div className="col-lg-10 col-xl-9 m-auto">
                  <div className="shadow bg-white row my-4 border-0 rounded-3 body-register overflow-hidden">
                     <div className=" pt-4 pb-4 pl-5 pr-5 col-md-7 col-lg-7">
                        <div className="d-flex justify-content-center">
                           <NavLink
                              className="nav-link-icon d-flex mb-4"
                              to="/home"
                              tag={Link}
                           >
                              <img
                                 alt=""
                                 src="/blog/image/logo.png"
                                 className="m-auto w-75"
                              />
                           </NavLink>
                        </div>
                        <h3 className="card-title text-center mb-4 fw-light fs-5">
                           Đăng ký tài khoản
                        </h3>
                        {/* <form method="POST" action="/api/user/register" encType="multipart/form-data" onSubmit={handleSubmit}> */}
                        <form onSubmit={handleSubmit}>
                           <label className='d-flex' for="fullname">
                              Họ và tên: (<span className="text-danger">*</span>
                              )
                           </label>
                           <div className=" mb-2 ">
                              <input
                                 id="fullname"
                                 onChange={handleInputChange}
                                 defaultValue={formData.name}
                                 name="name"
                                 type="text"
                                 className="register-input"
                                 placeholder="Full Name"
                                 required
                              />
                           </div>
                           {/* 
                  <div className=" mb-2 ">
                    <input
                      onChange={handleInputChange}
                      defaultValue={formData.username}
                      name="username"
                      type="text"
                      className="register-input"
                      id="floatingInputUsername"
                      placeholder="Username"
                      required
                    />
                  </div> */}
                           <label className='d-flex' for="floatingInputEmail">
                              Email: (<span className="text-danger">*</span>)
                           </label>
                           <div className=" mb-2 ">
                              <input
                                 onChange={handleInputChange}
                                 defaultValue={formData.email}
                                 name="email"
                                 type="email"
                                 className="register-input"
                                 id="floatingInputEmail"
                                 placeholder="Email@example.com"
                                 required
                              />
                           </div>

                           <div className=" mb-2 ">
                              <div className="row">
                                 <div className="col-6 mr-0 pr-1">
                                    <label className='d-flex' for="password">
                                       Mật khẩu: (
                                       <span className="text-danger">*</span>)
                                    </label>
                                    <input
                                       onChange={handleInputChange}
                                       defaultValue={formData.password}
                                       name="password"
                                       type="password"
                                       id="password"
                                       className="register-input"
                                       placeholder="Password"
                                       required
                                    />
                                 </div>
                                 <div className="col-6 ml-0 pl-0">
                                    <label className='d-flex' for="password-confirmation">
                                       Xác nhận mật khẩu: (
                                       <span className="text-danger">*</span>)
                                    </label>
                                    <input
                                       onChange={handleInputChange}
                                       defaultValue={
                                          formData.password_confirmation
                                       }
                                       name="password_confirmation"
                                       type="password"
                                       id="password-confirmation"
                                       className="register-input"
                                       placeholder="Cofirm Password"
                                       required
                                    />
                                 </div>
                              </div>
                           </div>

                           {/* <div className=" mb-2 ">
                    <div className="row">
                      <div className="col-6 mr-0 pr-1">
                        <input
                          onChange={handleInputChange}
                          defaultValue={formData.address}
                          name="address"
                          type="text"
                          className="register-input"
                          placeholder="Address"
                          required
                        />
                      </div>
                      <div className="col-6 ml-0 pl-0">
                        <input
                          onChange={handleInputChange}
                          defaultValue={formData.phone}
                          name="phone"
                          type="text"
                          className="register-input"
                          placeholder="Phone"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" mb-2 ">
                        <input
                          onChange={handleInputChange}
                          defaultValue={formData.date_of_birth}
                          name="date_of_birth"
                          type="date"
                          className="form-control"
                          placeholder="Date of birth"
                          required
                        />
                  </div> */}

                           <div className="col-sm-12 pt-2 mb-2">
                              <div className="row">
                                 <div className="col-lg-6 col-md-6 ml-0 pl-0">
                                    <label className='d-flex' for="">
                                       Giới tính: (
                                       <span className="text-danger">*</span>)
                                    </label>
                                    <div className="form-check">
                                       <input
                                          onChange={handleInputChange}
                                          name="gender"
                                          className="form-check-input"
                                          type="radio"
                                          id="gridRadios1"
                                          defaultValue="0"
                                          defaultChecked
                                          required
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="gridRadios1"
                                       >
                                          Men
                                       </label>
                                    </div>
                                    <div className="form-check">
                                       <input
                                          onChange={handleInputChange}
                                          name="gender"
                                          className="form-check-input"
                                          type="radio"
                                          id="gridRadios2"
                                          defaultValue="1"
                                          required
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="gridRadios2"
                                       >
                                          Women
                                       </label>
                                    </div>
                                    <div className="form-check">
                                       <input
                                          onChange={handleInputChange}
                                          name="gender"
                                          className="form-check-input"
                                          type="radio"
                                          id="gridRadios3"
                                          defaultValue="2"
                                          required
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="gridRadios2"
                                       >
                                          Other
                                       </label>
                                    </div>
                                 </div>
                                 <div className="col-lg-6 ml-0 pl-0 col-md-6">
                                    <div className=" mb-2 ">
                                       <label className='d-flex' for="">
                                          Ngày sinh: (
                                          <span className="text-danger">*</span>
                                          )
                                       </label>
                                       <input
                                          onChange={handleInputChange}
                                          defaultValue={formData.date_of_birth}
                                          name="date_of_birth"
                                          type="date"
                                          className="form-control"
                                          placeholder="Date of birth"
                                          required
                                       />
                                    </div>
                                 </div>
                                 {/* preview file */}
                                 {/* <div className="col-8 pb-2 d-flex justify-content-end">
                        <div id="dropbox">
                          {selectedImage ? (
                            <div>
                              <img
                                id="cancel-btn"
                                src="/blog/image/icon/error.png"
                                alt="Cancel"
                                onClick={handleCancelClick}
                              />
                              <img
                                id="image-preview"
                                src={selectedImage}
                                alt="Preview"
                              />
                            </div>
                          ) : (
                            <>
                              <input
                                type="file"
                                name="avatar"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                              />
                              <p>
                                <img
                                  id="upload_img"
                                  src="/blog/image/icon/upload-file.png"
                                  alt="Upload"
                                />
                              </p>
                            </>
                          )}
                        </div>
                      </div> */}
                                 {/* preview file */}
                              </div>
                           </div>
                           <div className="d-grid mb-2">
                              <button
                                 className="col-12 btn btn-lg btn-primary mt-2 btn-login fw-bold text-uppercase"
                                 type="submit"
                              >
                                 Đăng ký
                              </button>
                           </div>
                           <NavLink
                              className="nav-link-icon d-block text-center mt-2 small"
                              to="/user-login"
                              tag={Link}
                           >
                              Bạn đã có tài khoản? Hãy đăng nhập
                           </NavLink>
                        </form>
                     </div>
                     <div className="card-img-left d-none m-auto d-md-block col-lg-5 col-md-5">
                        <img
                           alt=""
                           src="/user/image/register-photo.png"
                           className="w-100 "
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default RegisterPage
