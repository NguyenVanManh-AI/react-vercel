/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import { useDispatch } from 'react-redux'
import httpUser from '~/utils/httpUser'
import styles from '~/pages/admin_hospital/Profile/ProfileHospital.module.scss'
import { useEffect, useState } from 'react'
import config from '~/router/config'
import validateForm from '~/helpers/validation'
import { updateAdmin } from '~/redux/adminSlice'
import LoadingDot from '~/components/Loading/LoadingDot'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)
function DoctorProfilePage() {
   const [notify, setNotify] = useState({})
   const [loading, setLoading] = useState(false)
   const [isButtonDisabled, setIsButtonDisabled] = useState(true)
   const [provinces, setProvinces] = useState([])
   const [selectedProvince, setSelectedProvince] = useState('')
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [users, setUsers] = useState({
      email: user.email,
      address: user.address,
      date_of_birth: user.date_of_birth ? user.date_of_birth : '',
      phone: user.phone,
      name: user.name,
      gender: user.gender ? user.gender : 2,
      province_code: user.province_code,
      experience: user.experience,
      username: user.username,
   })
   const dispatch = useDispatch()
   const [selectImage, setSelectImage] = useState(
      '/image/avata-default-doctor.jpg'
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
         required: true,
         date_of_birth: true,
      },
      experience: {
         required: true,
      },
      username: {
         required: true,
      },
   }
   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await httpUser.get('province')
            setProvinces(response.data.provinces)
            setSelectedProvince(user.province_code)
         } catch (error) {
            console.error('Lỗi kết nối đến API', error)
         }
      }

      fetchData()
   }, [])
   useEffect(() => {
      if (user.avatar) {
         setSelectImage(config.URL + user.avatar)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

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
         const reader = new FileReader()
         reader.onload = (e) => setSelectImage(e.target.result)
         reader.readAsDataURL(file)

         setUsers({
            ...users,
            avatar: file,
         })
      }
   }

   const handleUpdateUser = async () => {
      try {
         const response = await httpUser.get('infor-doctor/profile')
         if (response.status === 200) {
            console.log('Get profile thành công')
            const profile = response.data.data
            const updatedAdmin = {
               ...user,
               email: profile.email,
               address: profile.address,
               date_of_birth: profile.date_of_birth,
               phone: profile.phone,
               name: profile.name,
               gender: profile.gender,
               avatar: profile.avatar,
               experience: profile.experience,
               username: profile.username,
            }
            localStorage.setItem('HealthCareUser', JSON.stringify(updatedAdmin))
            dispatch(updateAdmin())
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

      const validationErrors = validateForm(users, rules)
      if (Object.keys(validationErrors).length === 0) {
         const formDataToSubmit = new FormData()

         for (const key in users) {
            formDataToSubmit.append(key, users[key])
         }
         setLoading(true)
         try {
            const response = await httpUser.post(
               'infor-doctor/update',
               formDataToSubmit,
               {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               }
            )

            handleUpdateUser()
            setNotify({
               success:
                  'Cập nhật thành công, vui lòng kiểm tra mail nếu bạn có thay đổi email',
            })
            console.log(response)
            console.log('Cập nhật thành công')
         } catch (error) {
            setNotify({ api: Object.values(error.response.data.errors) })
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
         <div className={cx('card', 'shadow', 'container')}>
            {loading && <LoadingDot />}
            <div className={cx('row')}>
               <div className="col-md-3">
                  <div className="text-center">
                     <img
                        src={selectImage}
                        className={cx('img_circle')}
                        alt="avatar"
                     />

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
                     />
                     <h6>{user.role}</h6>
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
                        <i className="mdi mdi-check-underline"></i>
                        &ensp;{notify.success}
                     </div>
                  )}
                  {notify.api && (
                     <div className="alert alert-danger alert-dismissable">
                        <Link
                           className="panel-close close"
                           data-dismiss="alert"
                        >
                           ×
                        </Link>
                        <i className="mdi mdi-progress-close"></i>
                        &ensp;{notify.api}
                     </div>
                  )}
                  <h3>Thông tin tài khoản</h3>

                  <form className="form-horizontal">
                     <div className="form-group">
                        <div className="row ml_0">
                           <div className={cx('col-4', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Email:
                              </label>
                              <div className="col-lg-12">
                                 <input
                                    onChange={handleChangeInput}
                                    name="email"
                                    className="form-control"
                                    type="text"
                                    defaultValue={user.email}
                                 />
                                 {notify.email && (
                                    <p className={cx('error')}>
                                       {notify.email}
                                    </p>
                                 )}
                              </div>
                           </div>
                           <div className={cx('col-4', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Tên đăng nhập:
                              </label>
                              <div className="col-lg-12">
                                 <input
                                    onChange={handleChangeInput}
                                    name="username"
                                    className="form-control"
                                    type="text"
                                    defaultValue={user.username}
                                 />
                                 {notify.username && (
                                    <p className={cx('error')}>
                                       {notify.username}
                                    </p>
                                 )}
                              </div>
                           </div>
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
                              defaultValue={user.name}
                           />
                           {notify.name && (
                              <p className={cx('error')}>{notify.name}</p>
                           )}
                        </div>
                     </div>
                     <div className="form-group">
                        <div className="row ml_0">
                           <div className={cx('col-4', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Ngày sinh:
                              </label>
                              <div className="col-lg-12">
                                 <input
                                    onChange={handleChangeInput}
                                    name="date_of_birth"
                                    defaultValue={user.date_of_birth}
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
                           <div className={cx('col-4', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Giới tính:
                              </label>
                              <div className="col-lg-12">
                                 <select
                                    onChange={handleChangeInput}
                                    name="gender"
                                    defaultValue={user.gender ? user.gender : 2}
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
                        <div className="row ml_0">
                           <div className={cx('col-4', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Tỉnh thành:
                              </label>
                              <div className="col-lg-12">
                                 {selectedProvince && (
                                    <select
                                       onChange={handleChangeInput}
                                       name="province_code"
                                       defaultValue={selectedProvince}
                                       className="form-control"
                                       type="text"
                                    >
                                       {provinces.map((province) => (
                                          <option
                                             key={province.id}
                                             value={province.province_code}
                                          >
                                             {province.name}
                                          </option>
                                       ))}
                                    </select>
                                 )}
                                 {!selectedProvince && (
                                    <select
                                       className="form-control"
                                       type="text"
                                    >
                                       <option value=""></option>
                                    </select>
                                 )}
                              </div>
                           </div>
                           <div className={cx('col-4', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Địa chỉ cụ thể:
                              </label>
                              <div className="col-lg-12">
                                 <input
                                    onChange={handleChangeInput}
                                    name="address"
                                    defaultValue={user.address}
                                    className="form-control"
                                    type="text"
                                 />
                                 {notify.address && (
                                    <p className={cx('error')}>
                                       {notify.address}
                                    </p>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="form-group">
                        <div className="row ml_0">
                           <div className={cx('col-4', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Số điện thoại:
                              </label>
                              <div className="col-lg-12">
                                 <input
                                    onChange={handleChangeInput}
                                    name="phone"
                                    className="form-control"
                                    type="text"
                                    defaultValue={user.phone}
                                 />
                                 {notify.phone && (
                                    <p className={cx('error')}>
                                       {notify.phone}
                                    </p>
                                 )}
                              </div>
                           </div>
                           <div className={cx('col-4', 'custom_two_colum')}>
                              <label className="col-lg-12 control-label">
                                 Năm kinh nghiệm:
                              </label>
                              <div className="col-lg-12">
                                 <input
                                    onChange={handleChangeInput}
                                    name="experience"
                                    className="form-control"
                                    type="text"
                                    defaultValue={user.experience}
                                 />
                                 {notify.experience && (
                                    <p className={cx('error')}>
                                       {notify.experience}
                                    </p>
                                 )}
                              </div>
                           </div>
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

export default DoctorProfilePage
