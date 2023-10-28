import { useLocation } from 'react-router-dom'
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import styles from './UserManager.module.scss'
import { useEffect, useState } from 'react'
import http from '~/utils/http'
import config from '~/router/config'
import ReactPaginate from 'react-paginate'
import LoadingTable from '~/components/Loading/LoadingTable'
import {
   formatDateTime,
   pushSearchKeyToUrl,
   formatGender,
} from '~/helpers/utils'
import { ToastContainer, toast } from 'react-toastify'
import { data } from 'jquery'
import MapForHospital from '~/components/MapForHospital'
const cx = classNames.bind(styles)
const AdminAllUserPage = () => {
   const location = useLocation()
   const [loadingTable, setLoadingTable] = useState(false)
   const [loadingData, setLoadingData] = useState(true)
   const [role, setRole] = useState('user')
   const [users, setUsers] = useState([])
   const [userDetail, setUserDetail] = useState({
      id: '',
      email: '',
      username: '',
      name: '',
      phone: '',
      address: '',
      avatar: '',
      is_accept: '',
      role: '',
      email_verified_at: '',
      created_at: '',
      updated_at: '',
      id_user: '',
      date_of_birth: '',
      google_id: '',
      gender: '',
   })
   const [hospitalDetail, setHospitalDetail] = useState({
      id: '',
      email: '',
      username: '',
      name: '',
      phone: '',
      address: '',
      avatar: '',
      is_accept: '',
      role: '',
      email_verified_at: '',
      created_at: '',
      updated_at: '',
      id_hospital: '',
      province_code: '',
      infrastructure: '[]',
      description: '',
      location: '[]',
      search_number: '',
   })
   const [doctorDetail, setDoctorDetail] = useState({
      id: '',
      email: '',
      username: '',
      name: '',
      phone: '',
      address: '',
      avatar: '',
      is_accept: '',
      role: '',
      email_verified_at: '',
      created_at: '',
      updated_at: '',
      id_doctor: '',
      id_department: '',
      id_hospital: '',
      is_confirm: '',
      province_code: '',
      date_of_birth: '',
      experience: '',
      gender: '',
      search_number: '',
   })

   const defaultSearchParams = {
      search: '',
      paginate: 5,
      page: 1,
      role: '',
      is_accept: 'both',
      sortlatest: true,
      sortname: false,
   }

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
         role: searchParams.get('role') || defaultSearchParams.role,
         is_accept:
            searchParams.get('is_accept') || defaultSearchParams.is_accept,
         sortlatest: searchParams.get('sortlatest') === 'true',
         sortname: searchParams.get('sortname') === 'true',
      }
   }
   const convertStringToArray = (string) => {
      return JSON.parse(string)
   }
   const checkAvatar = (avatar, role) => {
      if (!avatar) {
         if (role === 'hospital') {
            return '/image/default-hospital-search.jpg'
         } else if (role === 'doctor') {
            return '/image/avata-default-doctor.jpg'
         } else {
            return '/image/avatar_admin_default.png'
         }
      }
      return config.URL + avatar
   }
   const [search, setSearch] = useState(parseSearchParams())

   // Sử dụng useEffect để cập nhật search khi location.search thay đổi
   useEffect(() => {
      setSearch(parseSearchParams())
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [location.search])

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
   // const updateSearchParams = (newSearchParams) => {
   //    setSearch({
   //       ...search,
   //       ...newSearchParams,
   //    })

   //    pushSearchKeyToUrl(search, location)
   // }
   // Hàm ở cmt trên sẽ cập nhật trễ 1 nhịp do bất đồng bộ của useStage(thường cập nhật stage sau khi render),
   // nên là sử dụng useEffect để khi nào search được cập nhật rồi pushSearchkeyToUrl
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
            const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&role=${search.role}&sortname=${search.sortname}&sortlatest=${search.sortlatest}&is_accept=${search.is_accept}`
            const response = await http.get('admin/all-user' + queryParams)

            setUsers(response.data.data.data)
            setPerPage(response.data.data.per_page)
            setTotal(response.data.data.total)
            console.log('Gọi API lấy users thành công')
         } catch (error) {
            console.error('Lỗi kết nối đến API:', error)
         } finally {
            setLoadingTable(false)
         }
      }
      getUser()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [search])

   const handlePageClick = (event) => {
      const selectedPage = event.selected + 1
      updateSearchParams({ page: selectedPage })
   }

   const handleChangeInput = (e) => {
      const newSearchValue = e.target.value
      updateSearchParams({ search: newSearchValue, page: 1 })
   }

   const handleChangeSelectedRole = (e) => {
      if (e.target.value === '') {
         updateSearchParams({ role: '' })
      } else {
         updateSearchParams({ role: e.target.value })
      }
   }

   const handleChangeSelectedAccpect = (e) => {
      updateSearchParams({ is_accept: e.target.value })
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

   const handleChangeSelectedPaginate = (e) => {
      updateSearchParams({ page: 1, paginate: e.target.value })
   }
   const updateUser = (userId, acceptValue) => {
      const updatedUsers = users.map((user) => {
         if (user.id === userId) {
            return { ...user, is_accept: acceptValue }
         }
         return user
      })

      setUsers(updatedUsers)
   }
   const handleChangeRole = async (id, value, status) => {
      try {
         const data = { is_accept: value }
         await http.post('admin/change-accept/' + id, data)
         console.log('Gọi API thành công')
         if (status === 2) {
            toast.warning(' Đã khóa tài khoản có id ' + id, toastOptions)
         } else if (status === 1) {
            toast.success('Duyệt tài khoản id ' + id, toastOptions)
         } else {
            toast.success('Mở khóa tài khoản id ' + id, toastOptions)
         }
         updateUser(id, value)
         console.log(setUsers)
      } catch (error) {
         console.log('Đã có lỗi xảy ra')
      }
   }
   const getUser = async (id, role) => {
      try {
         const response = await http.get('user/infor-user/' + id)
         if (role === 'user') {
            setUserDetail(response.data.data)
         } else if (role === 'hospital') {
            console.log(typeof response.data.data.infrastructure)
            setHospitalDetail(response.data.data)
         } else {
            setDoctorDetail(response.data.data)
         }
      } catch (error) {
         console.log('Đã có lỗi xảy ra, quá trình get infor user', error)
      } finally {
         setLoadingData(true)
      }
   }
   const handleClickViewInfor = (id, role) => {
      setLoadingData(false)
      if (role === 'user') {
         setRole('user')
      } else if (role === 'hospital') {
         setRole('hospital')
      } else {
         setRole('doctor')
      }
      getUser(id, role)
   }
   return (
      <>
         <ToastContainer />
         <TitleAdmin>Tài khoản người dùng</TitleAdmin>
         <div className={cx('card', 'shadow')}>
            <div className={cx('card_header')}>
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
                     defaultValue={search.is_accept}
                     onChange={handleChangeSelectedAccpect}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     <option value="both">Trạng thái</option>
                     <option value="0">Chưa duyệt</option>
                     <option value="1">Đã duyệt</option>
                     <option value="2">Đã khóa</option>
                  </select>
               </div>
               <div className={cx('filter_box')}>
                  <select
                     defaultValue={search.role}
                     onChange={handleChangeSelectedRole}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     <option value="">Mặc định</option>
                     <option value="hospital">Bệnh viện</option>
                     <option value="doctor">Bác sĩ</option>
                     <option value="user">Người dùng</option>
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
                              <th>Email</th>
                              <th>Tài khoản</th>
                              <th>Tên</th>
                              <th>Số điện thoại</th>
                              <th>Địa chỉ</th>
                              <th>Avatar</th>
                              <th>Phân loại</th>
                              <th>Xác nhận Email</th>
                              <th>Thời gian đăng ký</th>
                              <th>Thao tác</th>
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
                           <th>Email</th>
                           <th>Tài khoản</th>
                           <th>Tên</th>
                           <th>Số điện thoại</th>
                           <th>Địa chỉ</th>
                           <th>Avatar</th>
                           <th>Phân loại</th>
                           <th>Xác nhận Email</th>
                           <th>Thời gian đăng ký</th>
                           <th>Thao tác</th>
                        </tr>
                     </thead>

                     <tbody>
                        {users.map((user, index) => (
                           <tr key={index}>
                              <td>{user.id}</td>
                              <td>{user.email}</td>
                              <td>{user.username}</td>
                              <td>{user.name}</td>
                              <td>{user.phone}</td>

                              <td>{user.address}</td>
                              <td>
                                 <img
                                    className={cx('avatar')}
                                    alt=""
                                    src={checkAvatar(user.avatar, user.role)}
                                 />
                              </td>
                              <td>
                                 {user.role === 'hospital'
                                    ? 'Bệnh viện'
                                    : user.role === 'doctor'
                                    ? 'Bác sĩ'
                                    : 'Người dùng'}
                              </td>
                              <td>
                                 {user.email_verified_at
                                    ? 'Đã xác nhận'
                                    : 'Chưa xác nhận'}
                              </td>
                              <td>
                                 {user.created_at
                                    ? formatDateTime(user.created_at)
                                    : 'N/A'}
                              </td>
                              <td>
                                 {user.is_accept === 0 ? (
                                    <>
                                       <Tippy content="Duyệt">
                                          <button
                                             onClick={() =>
                                                handleChangeRole(user.id, 1, 1)
                                             }
                                             className="btn btn-info btn-sm sua"
                                             data-toggle="modal"
                                             data-target="#updateModal"
                                          >
                                             <i className="ti-check-box" />
                                          </button>
                                       </Tippy>
                                       <Tippy content="Xem">
                                          <button
                                             onClick={() =>
                                                handleClickViewInfor(
                                                   user.id,
                                                   user.role
                                                )
                                             }
                                             className="btn btn-success btn-sm mt-1"
                                             data-toggle="modal"
                                             data-target="#modalView"
                                          >
                                             <i className="mdi mdi-eye" />
                                          </button>
                                       </Tippy>
                                    </>
                                 ) : user.is_accept === 1 ? (
                                    <>
                                       <Tippy content="Khóa">
                                          <button
                                             onClick={() =>
                                                handleChangeRole(user.id, 2, 2)
                                             }
                                             className="btn btn-danger btn-sm mt-1"
                                          >
                                             <i className="ti-lock" />
                                          </button>
                                       </Tippy>
                                       <Tippy content="Xem">
                                          <button
                                             onClick={() =>
                                                handleClickViewInfor(
                                                   user.id,
                                                   user.role
                                                )
                                             }
                                             className="btn btn-success btn-sm mt-1"
                                             data-toggle="modal"
                                             data-target="#modalView"
                                          >
                                             <i className="mdi mdi-eye" />
                                          </button>
                                       </Tippy>
                                    </>
                                 ) : (
                                    <>
                                       <Tippy content="Mở khóa">
                                          <button
                                             onClick={() =>
                                                handleChangeRole(user.id, 1, 3)
                                             }
                                             className="btn btn-secondary btn-sm mt-1"
                                          >
                                             <i className="ti-unlock" />
                                          </button>
                                       </Tippy>
                                       <Tippy content="Xem">
                                          <button
                                             onClick={() =>
                                                handleClickViewInfor(
                                                   user.id,
                                                   user.role
                                                )
                                             }
                                             className="btn btn-success btn-sm mt-1"
                                             data-toggle="modal"
                                             data-target="#modalView"
                                          >
                                             <i className="mdi mdi-eye" />
                                          </button>
                                       </Tippy>
                                    </>
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
            </div>
            <div
               className={`modal fade ${cx('modal-color-category')}`}
               id="modalView"
               tabIndex="-1"
               role="dialog"
               aria-labelledby="exampleModalLabel"
               aria-hidden="true"
            >
               <div
                  className={`modal-dialog ${cx(
                     'modal-dialog-create',
                     'up_width'
                  )}`}
                  role="document"
               >
                  <div className={cx('modal-content', 'up_width')}>
                     <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                           Thông tin người dùng
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

                     <div className={cx('modal-body')}>
                        <div className={cx('container mt-5 up_width')}>
                           <div className="row">
                              <div className="col-md-3">
                                 <div className="card">
                                    <img
                                       src={
                                          role === 'user' && userDetail
                                             ? checkAvatar(
                                                  userDetail.avatar,
                                                  'user'
                                               )
                                             : role === 'hospital' &&
                                               hospitalDetail
                                             ? checkAvatar(
                                                  hospitalDetail.avatar,
                                                  'hospital'
                                               )
                                             : role === 'doctor' && doctorDetail
                                             ? checkAvatar(
                                                  doctorDetail.avatar,
                                                  'doctor'
                                               )
                                             : '/image/default_avatar.png'
                                       }
                                       className="card-img-top"
                                       alt="User Avatar"
                                    />
                                    <div className="card-body">
                                       <h5
                                          className={cx(
                                             'card-title',
                                             'text_center'
                                          )}
                                       >
                                          {role === 'user'
                                             ? 'Người dùng'
                                             : role === 'hospital'
                                             ? 'Bệnh viện'
                                             : 'Bác sĩ'}
                                       </h5>
                                    </div>
                                 </div>
                              </div>
                              <div className="col-md-9">
                                 <div className="card">
                                    <div className="card-body">
                                       <div className="row">
                                          <div className="col-md-6">
                                             <ul className="list-group list-group-flush">
                                                <li className="list-group-item">
                                                   <strong>ID:</strong>&ensp;
                                                   {role === 'user' &&
                                                   userDetail
                                                      ? userDetail.id
                                                      : role === 'hospital' &&
                                                        hospitalDetail
                                                      ? hospitalDetail.id
                                                      : role === 'doctor' &&
                                                        doctorDetail
                                                      ? doctorDetail.id
                                                      : ''}
                                                </li>
                                                <li className="list-group-item">
                                                   <strong>Email:</strong>{' '}
                                                   {role === 'user' &&
                                                   userDetail
                                                      ? userDetail.email
                                                      : role === 'hospital' &&
                                                        hospitalDetail
                                                      ? hospitalDetail.email
                                                      : role === 'doctor' &&
                                                        doctorDetail
                                                      ? doctorDetail.email
                                                      : ''}
                                                </li>
                                                <li className="list-group-item">
                                                   <strong>Username:</strong>{' '}
                                                   {role === 'user' &&
                                                   userDetail
                                                      ? userDetail.username
                                                      : role === 'hospital' &&
                                                        hospitalDetail
                                                      ? hospitalDetail.username
                                                      : role === 'doctor' &&
                                                        doctorDetail
                                                      ? doctorDetail.username
                                                      : ''}
                                                </li>
                                                <li className="list-group-item">
                                                   <strong>Tên:</strong>&ensp;
                                                   {role === 'user' &&
                                                   userDetail
                                                      ? userDetail.name
                                                      : role === 'hospital' &&
                                                        hospitalDetail
                                                      ? hospitalDetail.name
                                                      : role === 'doctor' &&
                                                        doctorDetail
                                                      ? doctorDetail.name
                                                      : ''}
                                                </li>
                                                <li className="list-group-item">
                                                   <strong>Phone:</strong>{' '}
                                                   {role === 'user' &&
                                                   userDetail
                                                      ? userDetail.phone
                                                      : role === 'hospital' &&
                                                        hospitalDetail
                                                      ? hospitalDetail.phone
                                                      : role === 'doctor' &&
                                                        doctorDetail
                                                      ? doctorDetail.phone
                                                      : ''}
                                                </li>

                                                {role === 'user' &&
                                                userDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>Ngày tạo:</strong>{' '}
                                                      {formatDateTime(
                                                         userDetail.created_at
                                                      )}
                                                   </li>
                                                ) : role === 'doctor' &&
                                                  doctorDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>Ngày tạo:</strong>{' '}
                                                      {formatDateTime(
                                                         doctorDetail.created_at
                                                      )}
                                                   </li>
                                                ) : (
                                                   ''
                                                )}

                                                {role === 'hospital' &&
                                                hospitalDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>
                                                         Lượt tìm kiếm:
                                                      </strong>{' '}
                                                      {
                                                         hospitalDetail.search_number
                                                      }
                                                   </li>
                                                ) : role === 'doctor' &&
                                                  doctorDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>
                                                         Lượt tìm kiếm:
                                                      </strong>{' '}
                                                      {
                                                         doctorDetail.search_number
                                                      }
                                                   </li>
                                                ) : (
                                                   ''
                                                )}
                                             </ul>
                                          </div>
                                          <div className="col-md-6">
                                             <ul className="list-group list-group-flush">
                                                <li className="list-group-item">
                                                   <strong>Address:</strong>{' '}
                                                   {role === 'user' &&
                                                   userDetail
                                                      ? userDetail.address
                                                      : role === 'hospital' &&
                                                        hospitalDetail
                                                      ? hospitalDetail.address
                                                      : role === 'doctor' &&
                                                        doctorDetail
                                                      ? doctorDetail.address
                                                      : ''}
                                                </li>
                                                <li className="list-group-item">
                                                   <strong>Quyền:</strong>{' '}
                                                   {role === 'user'
                                                      ? 'Người dùng'
                                                      : role === 'hospital'
                                                      ? 'Bệnh viện'
                                                      : 'Bác sĩ'}
                                                </li>

                                                {role === 'user' &&
                                                userDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>
                                                         Giới tính:
                                                      </strong>{' '}
                                                      {formatGender(
                                                         userDetail.gender
                                                      )}
                                                   </li>
                                                ) : role === 'doctor' &&
                                                  doctorDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>
                                                         Giới tính:
                                                      </strong>{' '}
                                                      {formatGender(
                                                         doctorDetail.gender
                                                      )}
                                                   </li>
                                                ) : (
                                                   ''
                                                )}

                                                {role === 'user' &&
                                                userDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>
                                                         Ngày sinh:
                                                      </strong>{' '}
                                                      {formatGender(
                                                         userDetail.date_of_birth
                                                      )}
                                                   </li>
                                                ) : role === 'doctor' &&
                                                  doctorDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>
                                                         Ngày sinh:
                                                      </strong>{' '}
                                                      {formatGender(
                                                         doctorDetail.date_of_birth
                                                      )}
                                                   </li>
                                                ) : (
                                                   ''
                                                )}

                                                <li className="list-group-item">
                                                   <strong>
                                                      Email Verified At:
                                                   </strong>{' '}
                                                   {role === 'user' &&
                                                   userDetail
                                                      ? formatDateTime(
                                                           userDetail.email_verified_at
                                                        )
                                                      : role === 'hospital' &&
                                                        hospitalDetail
                                                      ? formatDateTime(
                                                           hospitalDetail.email_verified_at
                                                        )
                                                      : role === 'doctor' &&
                                                        doctorDetail
                                                      ? formatDateTime(
                                                           doctorDetail.email_verified_at
                                                        )
                                                      : ''}
                                                </li>
                                                {role === 'hospital' &&
                                                hospitalDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>Ngày tạo:</strong>{' '}
                                                      {formatDateTime(
                                                         hospitalDetail.created_at
                                                      )}
                                                   </li>
                                                ) : (
                                                   ''
                                                )}
                                                <li className="list-group-item">
                                                   <strong>Cập nhật:</strong>{' '}
                                                   {role === 'user' &&
                                                   userDetail
                                                      ? formatDateTime(
                                                           userDetail.updated_at
                                                        )
                                                      : role === 'hospital' &&
                                                        hospitalDetail
                                                      ? formatDateTime(
                                                           hospitalDetail.updated_at
                                                        )
                                                      : role === 'doctor' &&
                                                        doctorDetail
                                                      ? formatDateTime(
                                                           doctorDetail.updated_at
                                                        )
                                                      : ''}
                                                </li>
                                                {role === 'doctor' &&
                                                doctorDetail ? (
                                                   <li className="list-group-item">
                                                      <strong>
                                                         Kinh nghiệm:
                                                      </strong>{' '}
                                                      {doctorDetail.experience +
                                                         ' Năm'}
                                                   </li>
                                                ) : (
                                                   ''
                                                )}
                                             </ul>
                                          </div>
                                       </div>
                                       <div className="row">
                                          <div className="col-md-12">
                                             {role === 'hospital' ? (
                                                <ul className="list-group list-group-flush">
                                                   <li className="list-group-item">
                                                      <strong>Mô tả:</strong>{' '}
                                                      {
                                                         hospitalDetail.description
                                                      }
                                                   </li>
                                                   <li className="list-group-item">
                                                      <strong>
                                                         Cơ sở vật chất:
                                                      </strong>{' '}
                                                      {Object.values(
                                                         hospitalDetail.infrastructure
                                                      ).map(
                                                         (value, index) =>
                                                            value + ', '
                                                      )}
                                                   </li>
                                                   <li className="list-group-item">
                                                      <strong>Vị trí:</strong>{' '}
                                                      <div
                                                         className={cx('map')}
                                                      >
                                                         {loadingData && (
                                                            <MapForHospital
                                                               latT={
                                                                  convertStringToArray(
                                                                     hospitalDetail.location
                                                                  )[0]
                                                               }
                                                               lngT={
                                                                  convertStringToArray(
                                                                     hospitalDetail.location
                                                                  )[1]
                                                               }
                                                               hospital_name={
                                                                  hospitalDetail.name
                                                               }
                                                            />
                                                         )}
                                                      </div>
                                                      {hospitalDetail.location}
                                                   </li>
                                                </ul>
                                             ) : (
                                                ''
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="modal-footer">
                        <button
                           type="button"
                           className="btn btn-secondary"
                           data-dismiss="modal"
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default AdminAllUserPage
