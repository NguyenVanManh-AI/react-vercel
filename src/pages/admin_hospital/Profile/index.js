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
import Map from '~/components/Map'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const cx = classNames.bind(styles)
function DoctorProfilePage() {
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [notify, setNotify] = useState({})
   const [loading, setLoading] = useState(false)
   const [isButtonDisabled, setIsButtonDisabled] = useState(true)
   const [openLocation, setOpenLocation] = useState(false)
   const [provinces, setProvinces] = useState([])
   const [selectedProvince, setSelectedProvince] = useState('')
   const [infrastructure, setInfrastructure] = useState('')
   const [infrastructures, setInfrastructures] = useState(user.infrastructure)
   const [users, setUsers] = useState({
      email: user.email,
      address: user.address,
      phone: user.phone,
      name: user.name,
      province_code: user.province_code,
      username: user.username,
      location: user.location,
      description: user.description,
   })
   const dispatch = useDispatch()
   const [selectImage, setSelectImage] = useState(
      '/image/default-hospital-search.jpg'
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
      username: {
         required: true,
      },
      description: {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
   const handleClickOpenLocation = () => {
      setOpenLocation(!openLocation)
   }
   const handleChildData = (data) => {
      setUsers({ ...users, location: data })
   }
   const handleClickDeleteInfrastructure = (value) => {
      const updatedInfrastructures = [...infrastructures]
      const indexToDelete = updatedInfrastructures.indexOf(value)
      if (indexToDelete !== -1) {
         updatedInfrastructures.splice(indexToDelete, 1)
         setInfrastructures(updatedInfrastructures)
      }
      if (isButtonDisabled === true) {
         setIsButtonDisabled(false)
      }
   }
   const handlekeyDownInfrastructure = (e) => {
      if (e.key === 'Enter') {
         setInfrastructures([...infrastructures, infrastructure])
         e.preventDefault()
         if (isButtonDisabled === true) {
            setIsButtonDisabled(false)
         }
         setInfrastructure('')
      }
   }
   const handleInfrastructureChange = (e) => {
      const value = e.target.value
      console.log(value)
      setInfrastructure(value)
   }
   const handleUpdateUser = async () => {
      try {
         const response = await httpUser.get('infor-hospital/profile')
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
               description: profile.description,
               infrastructure: profile.infrastructure,
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
         infrastructures.forEach((item, index) => {
            formDataToSubmit.append(`infrastructure[${index}]`, item)
         })
         setLoading(true)
         try {
            const response = await httpUser.post(
               'infor-hospital/update',
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
         <div className={cx('card', 'shadow', 'container_h')}>
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
                     {notify.image && (
                        <p className={cx('error')}>{notify.image}</p>
                     )}
                  </div>
               </div>

               <div className="col-md-9 personal-info">
                  {notify.success && (
                     <div className="alert alert-info alert-dismissable">
                        <Link
                           onClick={() => {
                              setNotify({})
                           }}
                           className="panel-close close"
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
                  <h3>Thông tin bệnh viện</h3>

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
                           Tên bệnh viện:
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
                        <label className="col-lg-3 control-label">Mô tả:</label>
                        <div className="col-lg-8">
                           <textarea
                              onChange={handleChangeInput}
                              name="description"
                              className="form-control"
                              type="text"
                              defaultValue={user.description}
                           />
                           {notify.description && (
                              <p className={cx('error')}>
                                 {notify.description}
                              </p>
                           )}
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
                                 Tọa độ:
                              </label>
                              <div className="col-lg-12">
                                 <input
                                    onClick={handleClickOpenLocation}
                                    name="location"
                                    className="form-control"
                                    type="button"
                                    defaultValue={users.location}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="form-group">
                        <label className="col-lg-3 control-label">
                           Cơ sở vật chất:
                        </label>
                        <div className="col-lg-8">
                           <input
                              onKeyDown={handlekeyDownInfrastructure}
                              onChange={handleInfrastructureChange}
                              value={infrastructure}
                              type="text"
                              name="infrastructure"
                              className={cx('form-control')}
                           />
                           {notify.name && (
                              <p className={cx('error')}>{notify.name}</p>
                           )}
                        </div>
                     </div>
                     <div className={cx('infrastructures', 'mb_0')}>
                        {infrastructures.map((value, index) => (
                           <button
                              type="button"
                              onClick={() =>
                                 handleClickDeleteInfrastructure(value)
                              }
                              className={cx('infrastructures_item')}
                              key={index}
                           >
                              {value}&nbsp;
                              <i className="mdi mdi-close-circle" />
                           </button>
                        ))}
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
            <div className={cx('gg_map', openLocation && 'show')}>
               <button className={cx('btn_close')}>
                  <FontAwesomeIcon
                     onClick={handleClickOpenLocation}
                     icon="fa-regular fa-circle-xmark"
                     className={cx('close_icon')}
                  />
               </button>
               <Map onChildData={handleChildData}></Map>
            </div>
         </div>
      </>
   )
}

export default DoctorProfilePage
