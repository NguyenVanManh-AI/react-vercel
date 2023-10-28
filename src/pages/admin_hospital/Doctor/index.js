import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import { useLocation } from 'react-router-dom'

import { useEffect, useRef, useState } from 'react'
import LoadingTable from '~/components/Loading/LoadingTable'
import httpUser from '~/utils/httpUser'
import { formatDateTime, pushSearchKeyToUrl } from '~/helpers/utils'

import $ from 'jquery'
import styles from '~/pages/admin/UserManager/UserManager.module.scss'
import config from '~/router/config'
import Tippy from '@tippyjs/react'
import ReactPaginate from 'react-paginate'
import validateForm from '~/helpers/validation'
import { ToastContainer, toast } from 'react-toastify'
const cx = classNames.bind(styles)
function HospitalDoctorPage() {
   const location = useLocation()
   const modalRef = useRef(null)
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [loadingTable, setLoadingTable] = useState(false)
   const [shouldReloadData, setShouldReloadData] = useState(false)
   const [doctors, setDoctors] = useState([])
   const [provinces, setProvinvces] = useState([])
   const [departments, setDepartments] = useState([])
   const [errors, setErrors] = useState({})
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      id_department: '',
      province_code: '',
   })
   const rules = {
      name: {
         required: true,
         name: true,
      },
      email: {
         required: true,
         email: true,
      },
      province_code: {
         required: true,
      },
      id_department: {
         required: true,
      },
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
   const defaultSearchParams = {
      search: '',
      paginate: 5,
      page: 1,
      is_confirm: 'both',
      is_accept: 'both',
      sortlatest: true,
      sortname: true,
      name_department: '',
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
         is_accept:
            searchParams.get('is_accept') || defaultSearchParams.is_accept,
         sortlatest: searchParams.get('sortlatest') === 'true',
         sortname: searchParams.get('sortname') === 'true',
         name_departmentpage:
            searchParams.get('name_departmentpage') ||
            defaultSearchParams.name_departmentpage,
         is_confirm:
            searchParams.get('is_confirm') || defaultSearchParams.is_confirm,
      }
   }
   const [search, setSearch] = useState(parseSearchParams())
   const updateSearchParams = (newSearchParams) => {
      setSearch((prevSearch) => ({
         ...prevSearch,
         ...newSearchParams,
      }))
   }
   const handlePageClick = (event) => {
      const selectedPage = event.selected + 1
      updateSearchParams({ page: selectedPage })
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
   const handleChangeNameDepartment = (e) => {
      updateSearchParams({ name_department: e.target.value })
   }
   const handleChangeSelectedAccpect = (e) => {
      updateSearchParams({ is_confirm: e.target.value })
   }
   const handleChangeSearchKey = (e) => {
      const newSearchValue = e.target.value
      updateSearchParams({ search: newSearchValue, page: 1 })
   }
   const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData({
         ...formData,
         [name]: value,
      })
   }

   const updateDoctor = (id, rule) => {
      const updatedDoctor = doctors.map((doctor) => {
         if (doctor.id_doctor === id) {
            return { ...doctor, is_confirm: rule }
         }
         return doctor
      })

      setDoctors(updatedDoctor)
   }
   const fetchDepartment = async () => {
      try {
         setLoadingTable(true)
         const response = await httpUser.get(
            'hospital-department/hospital/' + user.id_hospital
         )
         setDepartments(response.data.data)
      } catch (error) {
         console.error('Lỗi kết nối đến API', error)
      }
   }
   const fetchProvince = async () => {
      try {
         httpUser.get('province').then((response) => {
            setProvinvces(response.data.provinces)
         })
      } catch {
         console.error('Lỗi kết nối đến API')
      }
   }
   const uniqueDoctorIds = []
   const handleSubmitAddDoctor = async (e) => {
      e.preventDefault()
      setErrors({})
      const validationErrors = validateForm(formData, rules)
      if (Object.keys(validationErrors).length === 0) {
         try {
            console.log(formData)
            const response = await httpUser.post(
               'infor-hospital/add-doctor',
               formData
            )
            toast.success('Thêm bác sĩ thành công !', toastOptions)
            // clear input
            setFormData({
               name: '',
               email: '',
               id_department: '',
               province_code: '',
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

   const handleChangeActive = async (id, value) => {
      try {
         await httpUser.post('infor-hospital/change-confirm/' + id, {
            is_confirm: value,
         })

         if (value === 0) {
            toast.warning(' Đã khóa tài khoản ' + id, toastOptions)
         } else {
            toast.success('Đã mở khóa tài khoản ' + id, toastOptions)
         }
         updateDoctor(id, value)
      } catch (error) {
         console.log('Đã có lỗi xảy ra')
      }
   }

   useEffect(() => {
      setSearch(parseSearchParams())
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [location.search])
   useEffect(() => {
      pushSearchKeyToUrl(search, location)
   }, [search, location])
   useEffect(() => {
      const getUser = async () => {
         try {
            setLoadingTable(true)
            const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sortname=${search.sortname}&sortlatest=${search.sortlatest}&is_accept=${search.is_accept}&name_department=${search.name_department}&is_confirm=${search.is_confirm}`
            const response = await httpUser.get(
               'infor-hospital/all-doctor' + queryParams
            )
            setDoctors(response.data.data.data)
            setPerPage(response.data.data.per_page)
            setTotal(response.data.data.total)
            console.log('Gọi API lấy doctors thành công')
         } catch (error) {
            console.error('Lỗi kết nối đến API:', error)
         } finally {
            setLoadingTable(false)
         }
      }
      getUser()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [search, shouldReloadData])

   useEffect(() => {
      fetchDepartment()
      fetchProvince()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   return (
      <>
         <ToastContainer />
         <TitleAdmin>Bác sĩ</TitleAdmin>
         <div className={cx('card', 'shadow')}>
            <div className={cx('card_header')}>
               <div className={cx('add_box')}>
                  <button
                     data-toggle="modal"
                     data-target="#modalAdd"
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
                        onChange={handleChangeSearchKey}
                        type="text"
                        id="example-input1-group2"
                        className="form-control"
                        placeholder="Search"
                     />
                  </div>
               </div>
               <div className={cx('filter_box')}>
                  <select
                     defaultValue={search.is_confirm}
                     onChange={handleChangeSelectedAccpect}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     <option value="both">Trạng thái</option>
                     <option value="0">Đã khóa</option>
                     <option value="1">Bình thường</option>
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
               <div className={cx('filter_box')}>
                  <select
                     defaultValue={search.name_department}
                     onChange={handleChangeNameDepartment}
                     className={cx('custom-select', 'fontz_14')}
                  >
                     <option value="">Chuyên khoa</option>
                     {departments.map((department) => (
                        <option key={department.id} value={department.name}>
                           {department.name}
                        </option>
                     ))}
                  </select>
               </div>
               <div className={cx('box_left')}>
                  <select
                     defaultValue={search.paginate}
                     // onChange={handleChangeSelectedPaginate}
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
                           <th>Tên bác sĩ</th>
                           <th>Chuyên khoa</th>
                           <th>Email</th>
                           <th>Số điện thoại</th>
                           <th>Địa chỉ</th>
                           <th>Avatar</th>
                           <th>Ngày tạo</th>
                           <th>Thao tác</th>
                        </tr>
                     </thead>

                     <tbody>
                        {doctors.map((doctor, index) => {
                           if (!uniqueDoctorIds.includes(doctor.id_doctor)) {
                              uniqueDoctorIds.push(doctor.id_doctor)

                              return (
                                 <tr key={index}>
                                    <td>{doctor.id_doctor}</td>
                                    <td>{doctor.name_doctor}</td>
                                    <td>{doctor.name_department}</td>
                                    <td>{doctor.email}</td>
                                    <td>{doctor.phone}</td>
                                    <td>{doctor.address}</td>
                                    <td>
                                       <img
                                          className={cx('avatar')}
                                          alt=""
                                          src={
                                             doctor.avatar
                                                ? config.URL + doctor.avatar
                                                : '/image/avata-default-doctor.jpg'
                                          }
                                       />
                                    </td>
                                    <td>
                                       {doctor.created_at
                                          ? formatDateTime(doctor.created_at)
                                          : 'N/A'}
                                    </td>
                                    <td>
                                       {doctor.is_confirm === 1 ? (
                                          <>
                                             <Tippy content="Khóa">
                                                <button
                                                   onClick={() =>
                                                      handleChangeActive(
                                                         doctor.id_doctor,
                                                         0
                                                      )
                                                   }
                                                   className="btn btn-danger btn-sm mt-1"
                                                >
                                                   <i className="ti-lock" />
                                                </button>
                                             </Tippy>
                                          </>
                                       ) : (
                                          <Tippy content="Mở khóa">
                                             <button
                                                onClick={() =>
                                                   handleChangeActive(
                                                      doctor.id_doctor,
                                                      1
                                                   )
                                                }
                                                className="btn btn-secondary btn-sm sua"
                                                data-toggle="modal"
                                                data-target="#updateModal"
                                             >
                                                <i className="ti-unlock" />
                                             </button>
                                          </Tippy>
                                       )}
                                    </td>
                                 </tr>
                              )
                           }
                           return null
                        })}
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
            {/* Modal add Admin */}
            <div
               ref={modalRef}
               className={`modal fade ${cx('modal-color-category')}`}
               id="modalAdd"
               tabIndex="-1"
               role="dialog"
               aria-labelledby="exampleModalLabel"
               aria-hidden="true"
            >
               <div
                  className={`modal-dialog ${cx(
                     'modal-dialog-create',
                     'max_width_700'
                  )}`}
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
                                    Tên bác sĩ
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
                                       placeholder="nguyenvana@gmail.com"
                                    />
                                    {errors.email && (
                                       <p className={cx('error')}>
                                          {errors.email}
                                       </p>
                                    )}
                                 </div>
                              </div>
                           </div>

                           <div className="form-group row">
                              <div className="col-6">
                                 <label
                                    htmlFor="department"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Chuyên khoa
                                 </label>
                                 <div className="col-sm-12">
                                    <select
                                       onChange={handleInputChange}
                                       defaultValue={''}
                                       name="id_department"
                                       type="text"
                                       className="form-control"
                                       id="department"
                                    >
                                       <option value="">
                                          Chọn chuyên khoa
                                       </option>
                                       {departments.map((department) => (
                                          <option
                                             key={department.id}
                                             value={department.id_department}
                                          >
                                             {department.name}
                                          </option>
                                       ))}
                                    </select>
                                    {errors.id_department && (
                                       <p className={cx('error')}>
                                          {errors.id_department}
                                       </p>
                                    )}
                                 </div>
                              </div>
                              <div className="col-6">
                                 <label
                                    htmlFor="department"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Tỉnh thành
                                 </label>
                                 <div className="col-sm-12">
                                    <select
                                       onChange={handleInputChange}
                                       defaultValue={''}
                                       name="province_code"
                                       type="text"
                                       className="form-control"
                                       id="department"
                                    >
                                       <option value="">Chọn tỉnh thành</option>
                                       {provinces.map((province) => (
                                          <option
                                             key={province.id}
                                             value={province.id}
                                          >
                                             {province.name}
                                          </option>
                                       ))}
                                    </select>
                                    {errors.province_code && (
                                       <p className={cx('error')}>
                                          {errors.province_code}
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
                              onClick={handleSubmitAddDoctor}
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
         </div>
      </>
   )
}

export default HospitalDoctorPage
