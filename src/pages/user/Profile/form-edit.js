import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import config from "~/router/config";
import http from '~/utils/http'
import { AiFillEdit } from "react-icons/ai";
import validateForm from '~/helpers/validation'
import { BsCameraFill } from "react-icons/bs";
import { FormControl } from "react-bootstrap";
import { updateUser } from '~/redux/userSlice'
import axios from 'axios';
import { useSelector } from 'react-redux';
import LoadingDot from '~/components/Loading/LoadingDot'

const FormEditProfile = () => {
  const user = JSON.parse(localStorage.getItem("HealthCareUser"));
  const [loading, setLoading] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [avatar, setAvatar] = useState("/image/avatar_admin_default.png");
  const [errors, setErrors] = useState({});

  const [name, setName] = useState(user.name ? user.name : 'User')

  const isUserUpdated = useSelector((state) => state.user.keyUserUpdated)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('HealthCareUser'))
    if (user && user.name) {
       setName(user.name)
    }
   }, [isUserUpdated])

   const toastOptions = {
		position: "top-right",
		autoClose: 4000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	};

  const rules = {
    name: {
       required: true,
    },
    email: {
       required: true,
       email: true,
    },
    gender: {
      require: true,
    },
    date_of_birth: {
      require: true,
       date_of_birth: true,
    },
 }
  const [users, setUsers] = useState({
    email: user.email,
    address: user.address,
    username:user.username,
    date_of_birth: user.date_of_birth,
    phone: user.phone,
    name: user.name,
    gender: user.gender,
 })
  const dispatch = useDispatch()
  useEffect(() => {
   if (user && user.avatar) {
      var https_regex = /^(https)/;
      if(https_regex.test(String(user.avatar).toLowerCase()) == true) {
        setAvatar(user.avatar);
      } 
      else {
        setAvatar(config.URL + user.avatar)
      }
    }
  }, []);
//   useEffect(() => {
//       const validationErrors = validateForm(users, rules);
//       setErrors(validationErrors);
//   })
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
       reader.onload = (e) => setAvatar(e.target.result)
       reader.readAsDataURL(file)

       setUsers({
          ...users,
          avatar: file,
       })
    }
 }

 const handleUpdateUser = async () => {
  try {
     const response = await http.get('infor-user/profile')
        console.log('Get profile thành công')
        const profile = response.data.data
        const updatedUser = {
           ...user,
           id: profile.id,
           email: profile.email,
           address: profile.address,
           date_of_birth: profile.date_of_birth,
           phone: profile.phone,
           name: profile.name,
           gender: profile.gender,
           avatar: profile.avatar,
        }
        localStorage.setItem('HealthCareUser', JSON.stringify(updatedUser))
        dispatch(updateUser())
  } catch (error) {
     console.log(error)
     console.error('Lỗi kết nối đến API', error)
  }
}
const handleClickUpdateProfile = async (e) => {
  e.preventDefault()

  const validationErrors = validateForm(users, rules)
  if (Object.keys(validationErrors).length === 0) {
      setErrors(validationErrors);
     const formDataToSubmit = new FormData()

     for (const key in users) {
        formDataToSubmit.append(key, users[key])
     }
     setLoading(true)
     try {
        const response = await http.post(
           'infor-user/update',
           formDataToSubmit,
           {
              headers: {
                 'Content-Type': 'multipart/form-data',
              },
           }
        )
         handleUpdateUser()
         toast.success(' Cập nhật thành công!', toastOptions)
     } catch (error) {
        toast.error(' Cập nhật thất bại!', toastOptions)
        console.error('Lỗi kết nối đến API', error)
     } finally {
        setIsButtonDisabled(true)
        setLoading(false)
     }
  } else {
     setIsButtonDisabled(true)
     setErrors(validationErrors)
     toast.error(' Cập nhật thất bại!', toastOptions)
     console.log(errors)
  }
}

  return (
   <>
      <ToastContainer />
    <div className="col-md-10 col-lg-10">
      {loading && <LoadingDot />}
      <div className="title">
        <h3>Hồ sơ</h3>
      </div>
      <div className="info mt-5">
        <label className="edit-image" htmlFor="image">
          <img className="avatar" src={avatar}  alt="user pic" />
          <span className="icon-change">
            <BsCameraFill />
          </span>
        </label>
        <input id="image" onChange={handleChangeAvatar} type="file" className="d-none" />
        <div className="my-auto name ml-4">
          {user.name} <br/>
          <span className="email">{user.email}</span>
        </div>
      </div>
      <form>
      <div className="
      main-form mt-3 mb-5">
        <div className="item-form">
          <label htmlFor="name" className="item-title">
            Họ và tên:
          </label>
          <FormControl
            onChange={handleChangeInput}
            type="text"
            id="name"
            name="name"
            placeholder="Full name"
            defaultValue={user.name}
            className={errors.name && ( "border-danger" )}
          />
         {errors.name && (
            <p className="text-danger">{errors.name}</p>
         )}
        </div>
        <div className="item-form">
          <label htmlFor="email" className="item-title">
            Email:
          </label>
          <FormControl
            onChange={handleChangeInput}
            type="email"
            id="email"
            name="email"
            placeholder="Your email"
            defaultValue={user.email}
            className={errors.email && ( "border-danger" )}
            />
           {errors.email && (
              <p className="text-danger">{errors.email}</p>
           )}
        </div>
        <div className="item-form">
          <label htmlFor="username" className="item-title">
            Tên người dùng:
          </label>
          <FormControl
            onChange={handleChangeInput}
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            defaultValue={user.username}
          />
        </div>
        <div className="item-form">
          <label htmlFor="birth" className="item-title">
            Ngày sinh:
          </label>
          <p className="item-content">
            <FormControl
              onChange={handleChangeInput}
              type="date"
              id="birth"
              name="date_of_birth"
              placeholder="Your Birthday"
              defaultValue={user.date_of_birth}
              className={errors.date_of_birth && ( "border-danger" )}
              />
             {errors.date_of_birth && (
                <p className="text-danger">{errors.date_of_birth}</p>
             )}
          </p>
        </div>
        <div className="item-form">
          <span className="item-title">Giới tính</span>
            <div className="pl-0 col-lg-3 col-md-3">
               <select
                  onChange={handleChangeInput}
                     name="gender"
                     defaultValue={user.gender}
                     className="form-control"
                     type="text"
               >
                  <option value={1}>Nam</option>
                  <option value={0}>Nữ</option>
                  <option value={2}>Khác</option>
               </select>
            </div>
        </div>
        <div className="item-form">
          <span htmlFor="address" className="item-title">Quê quán:</span>
          <FormControl
                        onChange={handleChangeInput}
                        name="address"
                        id="address"
                        className="form-control"
                        placeholder="Quê quán"
                        defaultValue={user.address}
                     />
                     
        </div>
        <div className="item-form">
          <label className="item-title" htmlFor="phone">Số điện thoại:</label>
          <FormControl
            onChange={handleChangeInput}
            type="tel"
            id="phone"
            name="phone"
            placeholder="Your Phone Number"
            defaultValue={user.phone}
          />
        </div>
        <div className="item-form">
          <Link className="btn btn-outline-primary mr-2" to={'/user/profile'}>Hủy </Link>
          <button 
            onClick={handleClickUpdateProfile}
            disabled={isButtonDisabled} className="btn btn-primary">Lưu thay đổi</button>
        </div>
      </div>
      </form>
    </div>
    </>
  );
};
export default FormEditProfile;
