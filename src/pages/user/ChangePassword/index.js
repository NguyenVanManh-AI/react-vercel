import React from 'react'

import './UserChangePasswordPage.css'

const UserChangePasswordPage = () => {
   return (
      <div className="col-12" id="content-main">
         <form
            id="form_changepassword"
            className="mt-4 col-8 mx-auto"
            encType="multipart/form-data"
         >
            <p id="title_update_infor" className="text-center">
               <i className="fa-solid fa-bolt"></i> Change Password
            </p>
            <div className="col-12 mx-auto mt-3">
               <div className="row mb-2">
                  <label
                     forhtml="inputPassword"
                     className="col-sm-5 col-form-label"
                  >
                     <i className="fa-solid fa-key mr-1"></i>Old Password
                  </label>
                  <div className="col-sm-7">
                     <input
                        minLength="6"
                        defaultValue=""
                        name="old_password"
                        type="password"
                        className="form-control"
                        id="floatingInputName"
                        placeholder="Old Password"
                        required
                        autoFocus
                     />
                  </div>
               </div>
               <div className="row mb-2">
                  <label
                     forhtml="inputPassword"
                     className="col-sm-5 col-form-label"
                  >
                     <i className="fa-solid fa-key mr-1"></i>Confirm New
                     Password
                  </label>
                  <div className="col-sm-7">
                     <input
                        minLength="6"
                        defaultValue=""
                        name="confirm_new_password"
                        type="password"
                        className="form-control"
                        id="floatingInputName"
                        placeholder="Confirm New Password"
                        required
                        autoFocus
                     />
                  </div>
               </div>
               <div className="row mb-2">
                  <label
                     forhtml="inputPassword"
                     className="col-sm-5 col-form-label"
                  >
                     <i className="fa-solid fa-key mr-1"></i>New Password
                  </label>
                  <div className="col-sm-7">
                     <input
                        minLength="6"
                        defaultValue=""
                        name="new_password"
                        type="password"
                        className="form-control"
                        id="floatingInputName"
                        placeholder="New Password"
                        required
                        autoFocus
                     />
                  </div>
               </div>
            </div>
            <br />
            <div className="row">
               <div className="col-2 mx-auto">
                  <button
                     className="col-12 mx-auto btn btn-outline-success text-uppercase"
                     type="submit"
                  >
                     <i className="fa-solid fa-floppy-disk mr-2"></i> SAVE
                  </button>
               </div>
            </div>
         </form>
      </div>
   )
}
export default UserChangePasswordPage
