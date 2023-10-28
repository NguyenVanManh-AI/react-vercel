/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from 'react-router-dom'
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import $ from 'jquery'
import { useEffect, useState, useRef } from 'react'
import ReactPaginate from 'react-paginate'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import config from '~/router/config'
import http from '~/utils/http'
import styles from './AdminManager.module.scss'
import { formatDateTime, pushSearchKeyToUrl } from '~/helpers/utils'
import LoadingTable from '~/components/Loading/LoadingTable'
import validateForm from '~/helpers/validation'
const cx = classNames.bind(styles)
function AdminManager() {
   const adminLocal = JSON.parse(localStorage.getItem('admin'))
   const location = useLocation()
   const [loadingTable, setLoadingTable] = useState(false)
   const [shouldReloadData, setShouldReloadData] = useState(false)
   const [adminAccount, setAdminAccount] = useState([])
   const [errors, setErrors] = useState({})
   const [adminDetail, setAdminDetail] = useState({
      id: '',
      name: '',
   })
   const defaultSearchParams = {
      search: '',
      paginate: 5,
      role: '',
      page: 1,
      sortlatest: true,
      sortname: false,
   }

   const [perPage, setPerPage] = useState(6)
   const [total, setTotal] = useState(0)

   const itemsPerPage = perPage
   const pageCount = Math.ceil(total / itemsPerPage)

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

   const modalDeleteRef = useRef(null)
   const rules = {
      name: {
         required: true,
         name: true,
      },
      email: {
         required: true,
         email: true,
      },
   }
   // paramURL to DOM
   const parseSearchParams = () => {
      const searchParams = new URLSearchParams(location.search)

      if (searchParams.get('paginate') === null) {
         return defaultSearchParams
      }
      return {
         search: searchParams.get('search') || defaultSearchParams.search,
         paginate:
            parseInt(searchParams.get('paginate')) ||
            defaultSearchParams.paginate,
         page: parseInt(searchParams.get('page')) || defaultSearchParams.page,
         sortlatest: searchParams.get('sortlatest') === 'true',
         sortname: searchParams.get('sortname') === 'true',
         role: searchParams.get('role') || defaultSearchParams.role,
      }
   }
   const [search, setSearch] = useState(parseSearchParams())
   useEffect(() => {
      setSearch(parseSearchParams())
   }, [location.search])

   useEffect(() => {
      pushSearchKeyToUrl(search, location)
   }, [search, location])

   const updateSearchParams = (newSearchParams) => {
      setSearch((prevSearch) => ({
         ...prevSearch,
         ...newSearchParams,
      }))
   }

   useEffect(() => {
      const getUser = async () => {
         try {
            setLoadingTable(true)
            const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sortname=${search.sortname}&sortlatest=${search.sortlatest}&role=${search.role}`
            const response = await http.get('admin/all-admin' + queryParams)
            if (response.status === 200) {
               setAdminAccount(response.data.data.data)
               setPerPage(response.data.data.per_page)
               setTotal(response.data.data.total)
               console.log('Gọi API lấy users thành công')
            }
         } catch (error) {
            console.error('Lỗi kết nối đến API:', error)
         } finally {
            setLoadingTable(false)
            console.log(adminAccount)
         }
      }
      console.log(search)
      getUser()
   }, [search, shouldReloadData])

   const handlePageClick = (event) => {
      const selectedPage = event.selected + 1
      updateSearchParams({ page: selectedPage })
   }

   const handleChangeSelectedPaginate = (e) => {
      updateSearchParams({ page: 1, paginate: e.target.value })
   }

   const handleChangeInput = (e) => {
      const newSearchValue = e.target.value
      updateSearchParams({ search: newSearchValue, page: 1 })
      console.log(location)
   }

   const handleChangeSelectedName = (e) => {
      if (e.target.value === 'sortlatest') {
         updateSearchParams({ sortlatest: true, sortname: false })
      } else if (e.target.value === 'un_sortlatest') {
         updateSearchParams({ sortlatest: false })
      } else {
         updateSearchParams({ sortname: true })
      }
   }
   const handleChangeSelectedRole = (e) => {
      updateSearchParams({ role: e.target.value })
   }

   // add category
   const [formData, setFormData] = useState({
      name: '',
      email: '',
   })

   const modalRef = useRef(null)

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData({
         ...formData,
         [name]: value,
      })
   }
   const updateAcount = (acountId, rule) => {
      const updatedAcount = adminAccount.map((admin) => {
         if (admin.id === acountId) {
            return { ...admin, role: rule }
         }
         return admin
      })

      setAdminAccount(updatedAcount)
   }
   const handleChangeRole = async (id, e) => {
      console.log(e.target.value)
      try {
         const data = {
            role: e.target.value,
         }
         const response = await http.patch('admin/' + id, data)
         console.log(response)
         if (e.target.value === 'superadmin') {
            toast.warning(
               ' Thay đổi người dùng ' + id + ' thành SuperAdmin ',
               toastOptions
            )
         } else {
            toast.success(
               'Thay đổi người dùng ' + id + ' thành Admin ',
               toastOptions
            )
         }
         updateAcount(id, e.target.value)
      } catch (error) {
         console.log('Đã có lỗi xảy ra')
      }
   }

   // submit form
   const handleSubmitAddAccount = async (e) => {
      e.preventDefault()
      setErrors({})
      const validationErrors = validateForm(formData, rules)
      if (Object.keys(validationErrors).length === 0) {
         try {
            console.log(formData)
            const response = await http.post('admin/add-admin', formData)
            toast.success('Thêm admin thành công !', toastOptions)
            // clear input
            setFormData({
               name: '',
               email: '',
            })

            $(modalRef.current).modal('hide') // close modal
            console.log(response.data.data)

            setShouldReloadData(!shouldReloadData)
         } catch (error) {
            if (error.response.data.data)
               toast.error(error.response.data.data[0], toastOptions)
            else toast.error(error.response.data.message, toastOptions)
         }
      } else {
         setErrors(validationErrors)
         console.log(errors)
      }
   }
   // submit form
   // add category

   // delete admin
   const handleDeleteSubmit = async (e) => {
      e.preventDefault()
      try {
         await http.delete('admin/' + adminDetail.id)
         toast.success('Xóa tài khoản thành công !', toastOptions)
         $(modalDeleteRef.current).modal('hide')
         setShouldReloadData(!shouldReloadData)
      } catch (error) {
         toast.error('Lỗi khi xóa tài khoản !', toastOptions)
      }
   }
   // delete category

   const handleGetAdmin = (index) => {
      setAdminDetail({
         ...adminAccount[index],
         index: index,
      })
      console.log(adminDetail)
   }

   return (
      <>
         <ToastContainer />
         <TitleAdmin>Quản lý tài khoản Admin</TitleAdmin>
         <div className={cx('card', 'shadow')}>
            <div className={cx('card_header')}>
               <div className={cx('add_box')}>
                  <button
                     data-toggle="modal"
                     data-target="#modalCreateCategory"
                     type="button"
                     className="btn btn-success ml-2"
                  >
                     <i className="fa-solid fa-square-plus"></i>
                  </button>
               </div>
               <div className={cx('search_box')}>
                  <div className={cx('input-group', 'fontz_14')}>
                     <span className="input-group-prepend">
                        <button type="button" className="btn btn-primary">
                           <i className="fa fa-search"></i>
                        </button>
                     </span>
                     <input
                        defaultValue={search.search}
                        onChange={handleChangeInput}
                        type="text"
                        id="example-input1-group2"
                        className="form-control"
                        placeholder="Search"
                     />
                  </div>
               </div>
               <div className={cx('filter_box')}>
                  <select
                     defaultValue={
                        search.role === 'manager'
                           ? 'manager'
                           : search.sortname === 'superadmin'
                           ? 'superadmin'
                           : search.sortname === 'admin'
                           ? 'admin'
                           : ''
                     }
                     onChange={handleChangeSelectedRole}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     {' '}
                     <option value="">Tất cả</option>
                     <option value="manager">Manager</option>
                     <option value="superadmin">SuperAdmin</option>
                     <option value="admin">Admin</option>
                  </select>
               </div>
               <div className={cx('filter_box')}>
                  <select
                     defaultValue={
                        search.sortlatest === false
                           ? 'un_sortlatest'
                           : search.sortname === true
                           ? 'sortname'
                           : 'sortlatest'
                     }
                     onChange={handleChangeSelectedName}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     <option value="sortlatest">Mới nhất</option>
                     <option value="un_sortlatest">Cũ nhất</option>
                     <option value="sortname">Theo tên</option>
                  </select>
               </div>
               <div className={cx('box_left')}>
                  <select
                     defaultValue={search.paginate}
                     onChange={handleChangeSelectedPaginate}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     <option value="5">5</option>
                     <option value="10">10</option>
                     <option value="15">15</option>
                     <option value="20">20</option>
                  </select>
               </div>
            </div>
            <div className={cx('card_body')}>
               {loadingTable ? (
                  <>
                     <table className={cx('table', 'table_bordered')}>
                        <thead>
                           <tr>
                              <th>ID</th>
                              <th>Tên</th>
                              <th>Email</th>
                              <th>Số diện thoại</th>
                              <th>Avatar</th>
                              <th>Địa chỉ</th>
                              <th>Ngày sinh</th>
                              <th>Giới tính</th>
                              <th>Ngày tạo</th>
                              <th>Quyền</th>
                           </tr>
                        </thead>
                     </table>
                     <LoadingTable row={search.paginate} />
                  </>
               ) : (
                  <table className={cx('table', 'table_bordered')}>
                     <thead>
                        <tr>
                           <th>ID</th>
                           <th>Tên</th>
                           <th>Email</th>
                           <th>Số diện thoại</th>
                           <th>Avatar</th>
                           <th>Địa chỉ</th>
                           <th>Ngày sinh</th>
                           <th>Giới tính</th>
                           <th>Ngày tạo</th>
                           <th>Quyền</th>
                        </tr>
                     </thead>

                     <tbody>
                        {adminAccount.map((admin, index) => (
                           <tr key={index}>
                              <td>{admin.id}</td>
                              <td>{admin.name}</td>
                              <td>{admin.email}</td>
                              <td>{admin.phone}</td>
                              <td>
                                 <div className={cx('thumbnail-th')}>
                                    <img
                                       className={cx('thumbnail')}
                                       alt=""
                                       src={
                                          admin.avatar
                                             ? config.URL + admin.avatar
                                             : '/image/avatar_admin_default.png'
                                       }
                                    />
                                 </div>
                              </td>
                              <td>{admin.address}</td>
                              <td>{admin.date_of_birth}</td>
                              <td>
                                 {admin.gender === 1
                                    ? 'Nam'
                                    : admin.gender === 0
                                    ? 'Nữ'
                                    : 'Khác'}
                              </td>
                              <td>
                                 {admin.created_at
                                    ? formatDateTime(admin.created_at)
                                    : 'N/A'}
                              </td>

                              <td>
                                 {admin.role === 'manager' ? (
                                    'Manager'
                                 ) : adminLocal.id === admin.id ? (
                                    <span className={cx('me')}>
                                       {admin.role}
                                    </span>
                                 ) : admin.role === 'superadmin' &&
                                   adminLocal.role === 'superadmin' ? (
                                    'SuperAdmin'
                                 ) : (
                                    <select
                                       onChange={(e) =>
                                          handleChangeRole(admin.id, e)
                                       }
                                       className={cx('custom_select')}
                                       defaultValue={admin.role}
                                    >
                                       <option value={'admin'}>Admin</option>
                                       <option value={'superadmin'}>
                                          SuperAdmin
                                       </option>
                                    </select>
                                 )}
                              </td>
                              <td>
                                 {admin.role === 'manager' ||
                                 (admin.role === 'superadmin' &&
                                    adminLocal.role === 'superadmin') ? (
                                    ''
                                 ) : (
                                    <Tippy content="Xóa">
                                       <button
                                          onClick={() => handleGetAdmin(index)}
                                          data-toggle="modal"
                                          data-target="#modalDelete"
                                          className="btn btn-danger btn-sm mt-1"
                                       >
                                          <i className="ti-trash" />
                                       </button>
                                    </Tippy>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
               <div className={cx('paginate_department')}>
                  <ReactPaginate
                     breakLabel="..."
                     nextLabel="Next >"
                     onPageChange={handlePageClick}
                     pageRangeDisplayed={4}
                     pageCount={pageCount}
                     previousLabel="< Previous"
                     renderOnZeroPageCount={null}
                     forcePage={search.page - 1}
                  />
               </div>
               {/* Modal add Admin */}
               <div
                  ref={modalRef}
                  className={`modal fade ${cx('modal-color-category')}`}
                  id="modalCreateCategory"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
               >
                  <div
                     className={`modal-dialog ${cx('modal-dialog-create')}`}
                     role="document"
                  >
                     <div className="modal-content">
                        <div className="modal-header">
                           <h5 className="modal-title" id="exampleModalLabel">
                              Thêm tài khoản
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
                        <form>
                           <div className="modal-body">
                              <div className="form-group row">
                                 <div className="col-6">
                                    <label
                                       htmlFor="inputName"
                                       className="col-sm-12 col-form-label"
                                    >
                                       Họ tên
                                    </label>
                                    <div className="col-sm-12">
                                       <input
                                          value={formData.name}
                                          onChange={handleInputChange}
                                          name="name"
                                          type="text"
                                          required
                                          className="form-control"
                                          id="inputName"
                                          placeholder="Nguyễn văn A"
                                       />
                                       {errors.name && (
                                          <p className={cx('error')}>
                                             {errors.name}
                                          </p>
                                       )}
                                    </div>
                                 </div>
                                 <div className="col-6">
                                    <label
                                       htmlFor="inputEmail"
                                       className="col-sm-12 col-form-label"
                                    >
                                       Email
                                    </label>
                                    <div className="col-sm-12">
                                       <input
                                          value={formData.email}
                                          onChange={handleInputChange}
                                          name="email"
                                          type="email"
                                          required
                                          className="form-control"
                                          id="inputEmail"
                                          placeholder="example@gmail.com"
                                       />
                                       {errors.email && (
                                          <p className={cx('error')}>
                                             {errors.email}
                                          </p>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="modal-footer">
                              <button
                                 className="btn btn-secondary"
                                 data-dismiss="modal"
                              >
                                 Close
                              </button>
                              <button
                                 onClick={handleSubmitAddAccount}
                                 type="button"
                                 className="btn btn-primary"
                              >
                                 <i className="fa-solid fa-plus"></i> Add
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>

               {/* Modal Delete  */}
               <div
                  ref={modalDeleteRef}
                  className={`modal fade ${cx('modal-color-category')}`}
                  id="modalDelete"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="modalDelete"
                  aria-hidden="true"
               >
                  <div className="modal-dialog" role="document">
                     <div className="modal-content">
                        <div className="modal-header alert-warning modal-title m-0">
                           <h5 id="exampleModalLabel">
                              <i className="fa-solid fa-triangle-exclamation"></i>{' '}
                              Warning !
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
                        <form>
                           <div className="modal-body">
                              Cảnh báo ! Bạn sẽ có chắc chắn là xóa tài khoản{' '}
                              <strong>{adminDetail.name}</strong> khỏi hệ thống
                              !
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
                                 onClick={handleDeleteSubmit}
                                 type="submit"
                                 className="btn btn-danger"
                              >
                                 <i className="fa-solid fa-trash"></i> Delete
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default AdminManager
