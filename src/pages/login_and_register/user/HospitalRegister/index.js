import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './HospitalRegister.module.scss'
import { useEffect, useState } from 'react'
import Map from '~/components/Map'
import { Link, useNavigate } from 'react-router-dom'
import http from '~/utils/http'
import validateForm from '~/helpers/validation'
import { useAppContext } from '~/contexts/AppContext'
import LoadingDot from '~/components/Loading/LoadingDot'
import ErrorBoundary from '~/components/ErrorBoundaryCp'

const cx = classNames.bind(styles)

function HospitalRegisterPage() {
   const { handleToastRegisterSuccessTrue } = useAppContext()
   const navigate = useNavigate()
   const [open, setOpen] = useState(false)
   const [childData, setChildData] = useState('')
   const [provinces, setProvinvces] = useState([])
   const [selectImage, setSelectImage] = useState('/image/default-avatar.png')
   const [errors, setErrors] = useState({})
   const [loadingDot, setLoadingDot] = useState(false)

   const [infrastructure, setInfrastructure] = useState('')
   const [infrastructures, setInfrastructures] = useState([])

   const [hospitalData, setHospitalData] = useState({
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      address: '',
      phone: '',
      avatar: null,
      province_code: '',
      infrastructure: [],
      description: '',
      location: [],
   })

   const rules = {
      name: {
         required: true,
      },
      email: {
         required: true,
         email: true,
      },
      password: {
         password: true,
      },
      password_confirmation: {
         password_confirmation: true,
      },
      address: {
         required: true,
      },
      phone: {
         required: true,
         phone: true,
      },
      province_code: {
         required: true,
      },
      location: {
         location: true,
      },
      username: {
         required: true,
      },
   }
   const handleClickLocation = () => {
      setOpen(!open)
   }

   // Hàm callback để nhận giá trị từ component con
   const handleChildData = (data) => {
      setChildData(data)
   }

   useEffect(() => {
      console.log('child: ' + childData)
      setHospitalData({
         ...hospitalData,
         location: childData,
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [childData])

   const handleChangeAvatar = (e) => {
      const file = e.target.files[0]
      if (file) {
         const reader = new FileReader()
         reader.onload = (e) => setSelectImage(e.target.result)
         reader.readAsDataURL(file)

         setHospitalData({
            ...hospitalData,
            avatar: file,
         })
      }
   }
   const handleInputChange = (e) => {
      const { name, value } = e.target
      setHospitalData({
         ...hospitalData,
         [name]: value,
      })
   }
   const handleInfrastructureChange = (e) => {
      const value = e.target.value
      setInfrastructure(value)
   }
   const handleSubmitInfrastructure = () => {
      setInfrastructures([...infrastructures, infrastructure])
      console.log(infrastructures)
   }
   const handlekeyDownInfrastructure = (e) => {
      if (e.key === 'Enter') {
         setInfrastructures([...infrastructures, infrastructure])
         setInfrastructure('')
         e.preventDefault()
      }
   }
   const handleClickDeleteInfrastructure = (value) => {
      const updatedInfrastructures = [...infrastructures]
      const indexToDelete = updatedInfrastructures.indexOf(value)
      if (indexToDelete !== -1) {
         updatedInfrastructures.splice(indexToDelete, 1)
         setInfrastructures(updatedInfrastructures)
      }
   }
   // const handleChecked = (id) => {
   //    setHospitalData((prevHospitalData) => {
   //       const isCheck = prevHospitalData.infrastructure.includes(id)
   //       if (isCheck) {
   //          return {
   //             ...prevHospitalData,
   //             infrastructure: prevHospitalData.infrastructure.filter(
   //                (item) => item !== id
   //             ),
   //          }
   //       } else {
   //          return {
   //             ...prevHospitalData,
   //             infrastructure: [...prevHospitalData.infrastructure, id],
   //          }
   //       }
   //    })
   // }
   //gọi api lấy provice
   useEffect(() => {
      try {
         http.get('province').then((response) => {
            setProvinvces(response.data.provinces)
         })
      } catch {
         console.error('Lỗi kết nối đến API')
      }
   }, [])

   const handleSubmit = async (e) => {
      e.preventDefault()
      console.log(hospitalData)

      const validationErrors = validateForm(hospitalData, rules)
      if (Object.keys(validationErrors).length === 0) {
         const formDataToSubmit = new FormData()

         for (const key in hospitalData) {
            formDataToSubmit.append(key, hospitalData[key])
         }
         infrastructures.forEach((item, index) => {
            formDataToSubmit.append(`infrastructure[${index}]`, item)
         })
         formDataToSubmit.append(
            'location',
            JSON.stringify(hospitalData.location)
         )
         try {
            setLoadingDot(true)
            const response = await http.post(
               'infor-hospital/register',
               formDataToSubmit,
               {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               }
            )
            handleToastRegisterSuccessTrue()
            navigate('/user-login')
            console.log(response)
            console.log('Đăng ký thành công')
         } catch (error) {
            setErrors({ error: '' })
            if (error.response.data.data) {
               if (error.response.data.errors.email) {
                  setErrors({ ...errors, email: 'Email đã tồn tại' })
               }
               if (error.response.data.errors.username) {
                  setErrors({ ...errors, username: 'Tài khoản đã tồn tại' })
                  console.log(error.response.data.errors.username)
               }
            } else {
               setErrors({ ...errors, username: error.response.data.message })
            }

            console.log(error)
         } finally {
            setLoadingDot(false)
         }
      } else {
         setErrors(validationErrors)
      }
   }

   return (
      <div className={cx('wrapper')}>
         {loadingDot && <LoadingDot />}
         <div className={cx('inner')}>
            <img
               src="/admin/images/image-1.png"
               alt=""
               className={cx('image_1')}
            ></img>
            <form className={cx('form_ds')} onSubmit={handleSubmit}>
               <div className={cx('left')}>
                  <h3 className={cx('title', 'tk')}>Tài khoản</h3>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-regular fa-user"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onChange={handleInputChange}
                        defaultValue={hospitalData.username}
                        type="text"
                        name="username"
                        className={cx('form_control')}
                        placeholder="Tài khoản"
                     ></input>
                     {errors.username && (
                        <p className={cx('error')}>{errors.username}</p>
                     )}
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-regular fa-envelope"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onChange={handleInputChange}
                        defaultValue={hospitalData.email}
                        type="text"
                        name="email"
                        className={cx('form_control')}
                        placeholder="example@gmail.com"
                     ></input>
                     {errors.email && (
                        <p className={cx('error')}>{errors.email}</p>
                     )}
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-regular fa-address-book"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onChange={handleInputChange}
                        defaultValue={hospitalData.phone}
                        type="text"
                        name="phone"
                        className={cx('form_control')}
                        placeholder="Số điện thoại"
                     ></input>
                     {errors.phone && (
                        <p className={cx('error')}>{errors.phone}</p>
                     )}
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-regular fa-address-card"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onChange={handleInputChange}
                        defaultValue={hospitalData.address}
                        type="text"
                        name="address"
                        className={cx('form_control')}
                        placeholder="Địa chỉ"
                     ></input>
                     {errors.address && (
                        <p className={cx('error')}>{errors.address}</p>
                     )}
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-regular fa-hospital"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onChange={handleInputChange}
                        defaultValue={hospitalData.name}
                        type="text"
                        name="name"
                        className={cx('form_control')}
                        placeholder="Tên bệnh viện"
                     ></input>
                     {errors.name && (
                        <p className={cx('error')}>{errors.name}</p>
                     )}
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-regular fa-rectangle-list"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onChange={handleInputChange}
                        defaultValue={hospitalData.description}
                        type="text"
                        name="description"
                        className={cx('form_control')}
                        placeholder="Mô tả bệnh viện"
                     ></input>
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-regular fa-chess-pawn"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onChange={handleInputChange}
                        defaultValue={hospitalData.password}
                        type="password"
                        name="password"
                        className={cx('form_control')}
                        placeholder="Mật khẩu"
                     ></input>
                     {errors.password && (
                        <p className={cx('error')}>{errors.password}</p>
                     )}
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-regular fa-chess-pawn"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onChange={handleInputChange}
                        defaultValue={hospitalData.password_confirmation}
                        type="password"
                        name="password_confirmation"
                        className={cx('form_control')}
                        placeholder="Nhập lại mật khẩu"
                     ></input>
                     {errors.password_confirmation && (
                        <p className={cx('error')}>
                           {errors.password_confirmation}
                        </p>
                     )}
                  </div>
               </div>

               <div className={cx('right')}>
                  <h3 className={cx('title', 'infor')}>Thông tin</h3>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-solid fa-map"
                           className={cx('login_icon')}
                        />
                     </span>
                     <select
                        onChange={handleInputChange}
                        name="province_code"
                        className={cx('form_control', 'select_ds')}
                     >
                        <option value="">Chọn tỉnh/thành</option>
                        {provinces.map((province) => (
                           <option
                              key={province.id}
                              value={province.province_code}
                           >
                              {province.name}
                           </option>
                        ))}
                     </select>
                     {errors.province_code && (
                        <p className={cx('error')}>{errors.province_code}</p>
                     )}
                  </div>
                  <div className={cx('form_holder', 'mb_0')}>
                     <div className={cx('avatar')}>
                        <label htmlFor="avatarId">
                           <img
                              className={cx('default_avatar')}
                              // src="/image/default-avatar.png"
                              src={selectImage}
                              alt="avatar"
                           ></img>
                           <input
                              onChange={handleChangeAvatar}
                              type="file"
                              className={cx('form_control', 'no_boder')}
                              id="avatarId"
                              hidden
                           ></input>
                           <p className={cx('pl_30')}>Ảnh đại diện</p>
                        </label>
                     </div>
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-solid fa-location"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onClick={handleClickLocation}
                        type="button"
                        name="location"
                        className={cx('form_control', 'text_left', 'location')}
                        value={
                           hospitalData.location
                              ? hospitalData.location
                              : 'Chọn vị trí'
                        }
                     ></input>
                     {errors.location && (
                        <p className={cx('error')}>{errors.location}</p>
                     )}
                  </div>
                  <div className={cx('form_holder')}>
                     <span>
                        <FontAwesomeIcon
                           icon="fa-solid fa-suitcase-medical"
                           className={cx('login_icon')}
                        />
                     </span>
                     <input
                        onKeyDown={handlekeyDownInfrastructure}
                        onChange={handleInfrastructureChange}
                        placeholder="Cơ sở vật chất"
                        value={infrastructure}
                        type="text"
                        name="infrastructure"
                        className={cx('form_control', 'text_left', 'tk')}
                     />
                     <button
                        type="button"
                        onClick={handleSubmitInfrastructure}
                        className={cx('btn_add')}
                     >
                        <FontAwesomeIcon icon="fa-solid fa-plus" />
                     </button>
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
                           <ti className="mdi mdi-close-circle" />
                        </button>
                     ))}
                  </div>
                  {/* <div className={cx('form_holder', 'mb_0')}>
                     {infrastructure.map((child) => (
                        <div className={cx('input_check')} key={child.id}>
                           <input
                              className={cx('mr_5')}
                              type="checkbox"
                              value={child.id}
                              id={child.id}
                              checked={hospitalData.infrastructure.includes(
                                 child.id
                              )}
                              onChange={() => handleChecked(child.id)}
                           />
                           <label className={cx('d_block')} htmlFor={child.id}>
                              {child.name}
                           </label>
                        </div>
                     ))}
                  </div> */}

                  <button className={cx('btn_submit')} type="submit">
                     Đăng ký
                  </button>
                  <Link className={cx('back')}>&lt;&lt; Quay lại...</Link>
               </div>
            </form>
            <img
               src="/admin/images/image-2.png"
               alt=""
               className={cx('image_2')}
            ></img>
         </div>
         <div className={cx('gg_map', open && 'show')}>
            <button className={cx('btn_close')}>
               <FontAwesomeIcon
                  onClick={handleClickLocation}
                  icon="fa-regular fa-circle-xmark"
                  className={cx('close_icon')}
               />
            </button>
            <ErrorBoundary>
               <Map onChildData={handleChildData}></Map>
            </ErrorBoundary>
         </div>
      </div>
   )
}

export default HospitalRegisterPage
