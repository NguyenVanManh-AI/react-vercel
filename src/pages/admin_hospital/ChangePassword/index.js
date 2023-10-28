import classNames from 'classnames/bind'

import TitleAdmin from '~/components/TitleAdmin'
import styles from '~/pages/admin/ChangePassword/AdminChangePasswordPage.module.scss'
import { useState } from 'react'
import validateForm from '~/helpers/validation'
import httpUser from '~/utils/httpUser'

import LoadingDot from '~/components/Loading/LoadingDot'
import { Link } from 'react-router-dom'
const cx = classNames.bind(styles)
const AdminChangePasswordPage = () => {
   const [notify, setNotify] = useState({})
   const [loading, setLoading] = useState(false)
   const [password, setPassword] = useState({
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
   })

   const rules = {
      current_password: {
         password: true,
      },
      new_password: {
         password: true,
         new_password: true,
      },
      new_password_confirmation: {
         new_password_confirmation: true,
      },
   }

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setPassword({
         ...password,
         [name]: value,
      })
   }

   const handleSubmitPassWord = async (e) => {
      e.preventDefault()

      const validationErrors = validateForm(password, rules)
      if (Object.keys(validationErrors).length === 0) {
         try {
            setLoading(true)
            await httpUser.post('user/change-password', password)

            console.log('Đổi ok')
            setPassword({
               current_password: '',
               new_password: '',
               new_password_confirmation: '',
            })
            setNotify({ success: 'Đổi thành công' })
         } catch (error) {
            if (error.response.data.message === 'Validation errors') {
               setNotify({
                  new_password: 'Mật khẩu phải giống nhau',
               })
            } else {
               setNotify({
                  current_password: 'Mật khẩu chưa chính xác',
               })
            }
            console.log(notify.current_password, notify.new_password)
         } finally {
            setLoading(false)
         }
      } else {
         setNotify(validationErrors)
      }
   }
   return (
      <>
         <TitleAdmin>Đổi mật khẩu</TitleAdmin>
         <div className={cx('card', 'shadow', 'container')}>
            {loading && <LoadingDot />}
            <div className={cx('card_body')}>
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
               <form className="form-horizontal mt-3">
                  <div className="form-group row">
                     <label
                        htmlFor="inputPassword1"
                        className="col-md-3 control-label"
                     >
                        Mật khẩu hiện tại
                     </label>
                     <div className="col-md-9">
                        <input
                           onChange={handleInputChange}
                           value={password.current_password}
                           name="current_password"
                           type="password"
                           className="form-control"
                           id="inputPassword1"
                           placeholder="Nhập mật khẩu"
                        />
                        {notify.current_password && (
                           <p className={cx('error')}>
                              {notify.current_password}
                           </p>
                        )}
                     </div>
                  </div>
                  <div className="form-group row">
                     <label
                        htmlFor="inputPassword2"
                        className="col-md-3 control-label"
                     >
                        Mật khẩu mới
                     </label>
                     <div className="col-md-9">
                        <input
                           onChange={handleInputChange}
                           value={password.new_password}
                           name="new_password"
                           type="password"
                           className="form-control"
                           id="inputPassword2"
                           placeholder="Nhập mật khẩu mới"
                        />
                        {notify.new_password && (
                           <p className={cx('error')}>{notify.new_password}</p>
                        )}
                     </div>
                  </div>
                  <div className="form-group row">
                     <label
                        htmlFor="inputPassword3"
                        className="col-md-3 control-label"
                     >
                        Xác nhận mật khẩu
                     </label>
                     <div className="col-md-9">
                        <input
                           onChange={handleInputChange}
                           value={password.new_password_confirmation}
                           name="new_password_confirmation"
                           type="password"
                           className="form-control"
                           id="inputPassword3"
                           placeholder="Nhập lại mật khẩu"
                        />
                        {notify.new_password_confirmation && (
                           <p className={cx('error')}>
                              {notify.new_password_confirmation}
                           </p>
                        )}
                     </div>
                  </div>

                  <div className="form-group row justify-content-end mb-0">
                     <div className="col-lg-3 col-md-9">
                        <button
                           onClick={handleSubmitPassWord}
                           className="btn btn-info"
                        >
                           Xác nhận
                        </button>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </>
   )
}
export default AdminChangePasswordPage
