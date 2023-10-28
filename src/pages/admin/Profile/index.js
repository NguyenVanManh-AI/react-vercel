import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import { useDispatch } from 'react-redux'

import http from '~/utils/http'
import styles from './Profile.module.scss'
import { useEffect, useState } from 'react'
import config from '~/router/config'
import validateForm from '~/helpers/validation'
import { updateAdmin } from '~/redux/adminSlice'
import LoadingDot from '~/components/Loading/LoadingDot'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)
function AdminProfilePage() {
   const [notify, setNotify] = useState({})
   const [loading, setLoading] = useState(false)

   const [isButtonDisabled, setIsButtonDisabled] = useState(true)
   const admin = JSON.parse(localStorage.getItem('admin'))
   const [users, setUsers] = useState({
      id: admin.id,
      email: admin.email,
      address: admin.address,
      date_of_birth: admin.date_of_birth,
      phone: admin.phone,
      name: admin.name,
      gender: admin.gender,
   })
   const dispatch = useDispatch()
   const [selectImage, setSelectImage] = useState(
      '/image/avatar_admin_default.png'
   )
   const rules = {
      name: {
         required: true,
      },
      email: {
         required: true,
         email: true,
      },
      address: {
         required: true,
      },
      phone: {
         required: true,
         phone: true,
      },
      date_of_birth: {
         date_of_birth: true,
      },
   }
   useEffect(() => {
      if (admin.avatar) {
         setSelectImage(config.URL + admin.avatar)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   useEffect(() => {
      console.log(users)
   }, [users])

   const handleChangeInput = (e) => {
      if (isButtonDisabled === true) {
         setIsButtonDisabled(false)
      }
      const { name, value } = e.target
      setUsers({
         ...users,
         [name]: value,
      })
   }
   const handleChangeAvatar = (e) => {
      if (isButtonDisabled === true) {
         setIsButtonDisabled(false)
      }
      const file = e.target.files[0]

      if (file) {
         const fileName = file.name
         const fileExtension = fileName.split('.').pop().toLowerCase()

         if (
            fileExtension === 'jpg' ||
            fileExtension === 'jpeg' ||
            fileExtension === 'png' ||
            fileExtension === 'gif'
         ) {
            // Đây là một tệp hình ảnh hợp lệ
            const reader = new FileReader()
            reader.onload = (e) => setSelectImage(e.target.result)
            reader.readAsDataURL(file)

            setUsers({
               ...users,
               avatar: file,
            })
         } else {
            // Đây không phải tệp hình ảnh hợp lệ, bạn có thể thông báo lỗi hoặc thực hiện xử lý khác.
            setNotify({
               image: 'Chỉ cho phép tải lên các tệp hình ảnh (jpg, jpeg, png, gif).',
            })
         }
      }
   }

   const handleUpdateUser = async () => {
      try {
         const response = await http.get('admin/profile')
         if (response.status === 200) {
            console.log('Get profile thành công')
            const profile = response.data.data
            const updatedAdmin = {
               ...admin,
               id: profile.id,
               email: profile.email,
               address: profile.address,
               date_of_birth: profile.date_of_birth,
               phone: profile.phone,
               name: profile.name,
               gender: profile.gender,
               avatar: profile.avatar,
            }
            localStorage.setItem('admin', JSON.stringify(updatedAdmin))
            dispatch(updateAdmin())
            // window.location.reload()
         } else {
            console.log(notify)
         }
      } catch (error) {
         console.log(error)
         console.error('Lỗi kết nối đến API', error)
      }
   }
   const handleClickUpdateProfile = async (e) => {
      e.preventDefault()
      console.log(users)

      const validationErrors = validateForm(users, rules)
      if (Object.keys(validationErrors).length === 0) {
         const formDataToSubmit = new FormData()

         for (const key in users) {
            formDataToSubmit.append(key, users[key])
         }
         setLoading(true)
         try {
            const response = await http.post('admin/update', formDataToSubmit, {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            })

            console.log(response)
            handleUpdateUser()
            setNotify({ success: response.data.message })

            console.log('Cập nhật thành công')
         } catch (error) {
            console.log(error)
            if (error.response.data.data)
               setNotify({ error: error.response.data.data[0] })
            else setNotify({ error: error.response.data.message })
            console.error('Lỗi kết nối đến API', error)
         } finally {
            setIsButtonDisabled(true)
            setLoading(false)
         }
      } else {
         setNotify(validationErrors)
         console.log(notify)
      }
   }

   return (
      <>
         <TitleAdmin>Profile</TitleAdmin>
         <div className="container bootstrap snippets bootdey">
            {loading && <LoadingDot />}
            <div className={cx('row')}>
               <div className="col-md-3">
                  <div className="text-center">
                     <img
                        src={selectImage}
                        className={cx('img_circle')}
                        alt="avatar"
                     />

                     {/* <h6>Upload a different photo...</h6> */}
                     <label
                        htmlFor="actual-btn"
                        className={cx('label_choosefile')}
                     >
                        <i className="mdi mdi-upload-outline"></i> &ensp; Thay
                        đổi ảnh
                     </label>
                     <input
                        onChange={handleChangeAvatar}
                        type="file"
                        id="actual-btn"
                        hidden
                        accept="image/*"
                     />
                     <h6>{admin.role}</h6>
                     {notify.image && (
                        <p className={cx('error')}>{notify.image}</p>
                     )}
                  </div>
               </div>

               <div className="col-md-9 personal-info">
                  {notify.success && (
                     <div className="alert alert-info alert-dismissable">
                        <Link
                           className="panel-close close"
                           onClick={() => {
                              setNotify({})
                           }}
                        >
                           ×
                        </Link>
                        <i className=" mdi mdi-check-underline"></i> &nbsp;
                        {notify.success}
                     </div>
                  )}
                  {notify.error && (
                     <div className="alert alert-warning alert-dismissable">
                        <Link
                           className="panel-close close"
                           onClick={() => {
                              setNotify({})
                           }}
                        >
                           ×
                        </Link>
                        <i className=" mdi mdi-check-underline"></i> &nbsp;
                        {notify.error}
                     </div>
                  )}
                  <h3>Thông tin tài khoản</h3>

                  <form className="form-horizontal">
                     <div className="form-group">
                        <label className="col-lg-3 control-label">Email:</label>
                        <div className="col-lg-8">
                           <input
                              onChange={handleChangeInput}
                              name="email"
                              className="form-control"
                              type="text"
                              defaultValue={admin.email}
                           />
                           {notify.email && (
                              <p className={cx('error')}>{notify.email}</p>
                           )}
                        </div>
                     </div>
                     <div className="form-group">
                        <label className="col-lg-3 control-label">
                           Họ tên:
                        </label>
                        <div className="col-lg-8">
                           <input
                              onChange={handleChangeInput}
                              name="name"
                              className="form-control"
                              type="text"
                              defaultValue={admin.name}
                           />
                           {notify.name && (
                              <p className={cx('error')}>{notify.name}</p>
                           )}
                        </div>
                     </div>
                     <div className="form-group">
                        <div className="row ml_0">
                           <div className={cx('col-3', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Ngày sinh:
                              </label>
                              <div className="col-lg-12">
                                 <input
                                    onChange={handleChangeInput}
                                    name="date_of_birth"
                                    defaultValue={admin.date_of_birth}
                                    className="form-control"
                                    type="date"
                                 />
                                 {notify.date_of_birth && (
                                    <p className={cx('error')}>
                                       {notify.date_of_birth}
                                    </p>
                                 )}
                              </div>
                           </div>
                           <div className={cx('col-3', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Giới tính:
                              </label>
                              <div className="col-lg-12">
                                 <select
                                    onChange={handleChangeInput}
                                    name="gender"
                                    defaultValue={admin.gender}
                                    className="form-control"
                                    type="text"
                                 >
                                    <option value={1}>Nam</option>
                                    <option value={0}>Nữ</option>
                                    <option value={2}>Khác</option>
                                 </select>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="form-group">
                        <label className="col-lg-3 control-label">
                           Địa chỉ:
                        </label>
                        <div className="col-lg-8">
                           <input
                              onChange={handleChangeInput}
                              name="address"
                              className="form-control"
                              type="text"
                              defaultValue={admin.address}
                           />
                           {notify.address && (
                              <p className={cx('error')}>{notify.address}</p>
                           )}
                        </div>
                     </div>
                     <div className="form-group">
                        <label className="col-lg-3 control-label">
                           Số điện thoại:
                        </label>
                        <div className="col-lg-8">
                           <input
                              onChange={handleChangeInput}
                              name="phone"
                              className="form-control"
                              type="text"
                              defaultValue={admin.phone}
                           />
                           {notify.phone && (
                              <p className={cx('error')}>{notify.phone}</p>
                           )}
                        </div>
                     </div>
                     <button
                        onClick={handleClickUpdateProfile}
                        hidden={isButtonDisabled}
                        className="btn btn-info"
                        type="submit"
                     >
                        Cập nhật
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </>
   )
}

export default AdminProfilePage
