/* eslint-disable no-unused-vars */
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { useLocation } from 'react-router-dom'
import $ from 'jquery'
import { useEffect, useState, useRef } from 'react'
import httpUser from '~/utils/httpUser'
import ReactPaginate from 'react-paginate'
import LoadingTable from '~/components/Loading/LoadingTable'
import { formatDateTime, pushSearchKeyToUrl } from '~/helpers/utils'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from '~/pages/admin/HealthInsurance/HealthInsurance.module.scss'
import Editor from '~/components/EditorWithUseQuill'

const cx = classNames.bind(styles)
function HospitalServicePage() {
   const location = useLocation()
   const modalRef = useRef(null)
   const modalEditRef = useRef(null)
   const modalDeleteRef = useRef(null)
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [loadingTable, setLoadingTable] = useState(false)
   const [shouldReloadData, setShouldReloadData] = useState(false)
   const [services, setServices] = useState([])
   const [departments, setDepartments] = useState([])
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
      sortlatest: true,
      sortname: true,
   }
   const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
   })
   const [formData, setFormData] = useState({
      id_hospital_department: '',
      name: '',
      time_advise: '',
      price: '',
      infor: {
         about_service: '',
         prepare_process: '',
         service_details: '',
         location: user.location,
      },
   })

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

   const handleChangeSelectedPaginate = (e) => {
      updateSearchParams({ page: 1, paginate: e.target.value })
   }

   const handleChangeInput = (e) => {
      const newSearchValue = e.target.value
      updateSearchParams({ search: newSearchValue, page: 1 })
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
   const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData({
         ...formData,
         [name]: value,
      })
   }

   const clearFormData = () => {
      setFormData({
         id_hospital_department: '',
         name: '',
         time_advise: '',
         price: '',
         infor: {
            about_service: '',
            prepare_process: '',
            service_details: '',
            location: user.location,
         },
      })
   }
   // const createFormdata = () => {
   //    const formDataToSubmit = new FormData()
   //    formDataToSubmit.append(
   //       'id_hospital_department',
   //       formData.id_hospital_department
   //    )
   //    formDataToSubmit.append('name', formData.name)
   //    formDataToSubmit.append('time_advise', formData.time_advise)
   //    formDataToSubmit.append('price', formData.price)
   //    formDataToSubmit.append(
   //       'infor[about_service]',
   //       formData.infor.about_service
   //    )
   //    formDataToSubmit.append(
   //       'infor[prepare_process]',
   //       formData.infor.prepare_process
   //    )
   //    formDataToSubmit.append(
   //       'infor[service_details]',
   //       formData.infor.service_details
   //    )
   //    formDataToSubmit.append('infor[location]', formData.infor.location)
   // }

   // submit form

   const handleSubmit = async (e) => {
      e.preventDefault()

      try {
         await httpUser.post('/hospital-service/add', formData)
         toast.success('Thêm dịch vụ thành công !', toastOptions)
         // clear input
         clearFormData()
         $(modalRef.current).modal('hide') // close modal
         setClearContent(clearContent + 1)
         setShouldReloadData(!shouldReloadData)
      } catch (error) {
         if (error.response.data.data)
            toast.error(error.response.data.data[0], toastOptions)
         else toast.error(error.response.data.message, toastOptions)
      }
   }
   // submit form
   // add healthInsurace

   // delete healthInsurace
   const handleDeleteSubmit = async (e) => {
      e.preventDefault()

      try {
         const response = await httpUser.delete(
            'hospital-service/' + serviceDetail.id
         )
         toast.success('Xóa Dịch vụ thành công !', toastOptions)
         $(modalDeleteRef.current).modal('hide')
         setShouldReloadData(!shouldReloadData)
      } catch (error) {
         toast.error('Lỗi khi xóa Bảo hiểm !', toastOptions)
      }
   }
   // delete healthInsurace
   const [serviceDetail, setServiceDetail] = useState({
      id_hospital_departments: '',
      name: '',
      time_advise: '',
      price: '',
      infor: {
         about_service: '',
         prepare_process: '',
         service_details: '',
         location: user.location,
      },
   })
   const handleGetHealthInsurace = (index) => {
      console.log(
         { formdata: formData },
         { de: departments },
         { services: services },
         { serviceDetail: serviceDetail }
      )
      setServiceDetail({
         index: index,
         id: services[index].id_hospital_service,
         id_hospital_departments: services[index].id_hospital_departments,
         name: services[index].name,
         time_advise: services[index].time_advise_hospital_service,
         price: services[index].price_hospital_service,
         infor: {
            about_service: services[index].infor.about_service,
            prepare_process: services[index].infor.prepare_process,
            service_details: services[index].infor.service_details,
            location: user.location,
         },
      })
   }
   const handleInputEditChange = (e) => {
      const { name, value } = e.target
      setServiceDetail({
         ...serviceDetail,
         [name]: value,
      })
   }

   const handleEditSubmit = async (e) => {
      e.preventDefault()
      try {
         const response = await httpUser.post(
            '/hospital-service/update/' + serviceDetail.id,
            serviceDetail
         )

         // const updatedHealthInsuraces = [...services]
         // updatedHealthInsuraces[serviceDetail.index] = response.data.data
         // setServices(updatedHealthInsuraces)
         setShouldReloadData(!shouldReloadData)
         toast.success('Chỉnh sửa Dịch vụ thành công !', toastOptions)
         $(modalEditRef.current).modal('hide')
      } catch (error) {
         if (error.response.data.data)
            toast.error(error.response.data.data[0], toastOptions)
         else toast.error(error.response.data.message, toastOptions)
      }
   }

   // richtext editor add

   const handleAboutServiceChange = (newContent) => {
      const updatedFormData = { ...formData }
      updatedFormData.infor.about_service = newContent
      setFormData(updatedFormData)
   }
   const handlePrepareProcessChange = (newContent) => {
      const updatedFormData = { ...formData }
      updatedFormData.infor.prepare_process = newContent
      setFormData(updatedFormData)
   }
   const handleServiceDetailsChange = (newContent) => {
      const updatedFormData = { ...formData }
      updatedFormData.infor.service_details = newContent
      setFormData(updatedFormData)
   }

   const [clearContent, setClearContent] = useState(true)

   useEffect(() => {
      setSearch(parseSearchParams())
   }, [location.search])

   useEffect(() => {
      pushSearchKeyToUrl(search, location)
   }, [search, location])
   useEffect(() => {
      const fetchDepartmentHospital = async () => {
         try {
            setLoadingTable(true)
            const response = await httpUser.get(
               'hospital-department/hospital/' + user.id_hospital
            )
            setDepartments(response.data.data)
         } catch (error) {
            console.error('Lỗi kết nối đến API', error)
         } finally {
            setLoadingTable(false)
         }
      }

      fetchDepartmentHospital()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [shouldReloadData])
   useEffect(() => {
      const getService = async () => {
         try {
            setLoadingTable(true)
            const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sortname=${search.sortname}&sortlatest=${search.sortlatest}`
            const response = await httpUser.get(
               'hospital-service/hospital/' + user.id_hospital + queryParams
            )
            setServices(response.data.data.data)
            setPerPage(response.data.data.per_page)
            setTotal(response.data.data.total)
         } catch (error) {
            toast.error('Lỗi kết nối đến API !', toastOptions)
         } finally {
            setLoadingTable(false)
         }
      }
      getService()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [search, shouldReloadData])
   return (
      <>
         <ToastContainer />
         <TitleAdmin>Dịch vụ </TitleAdmin>
         <div className={cx('card', 'shadow')}>
            <div className={cx('card_header')}>
               <div className={cx('add_box')}>
                  <button
                     data-toggle="modal"
                     data-target="#modalCreate"
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
                              <th>Tên dịch vụ</th>
                              <th>Thời gian</th>
                              <th>Giá</th>
                              <th>Ngày tạo</th>
                              <th>Ngày cập nhật</th>
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
                           <th>Tên dịch vụ</th>
                           <th>Thời gian</th>
                           <th>Giá</th>
                           <th>Ngày tạo</th>
                           <th>Ngày cập nhật</th>
                           <th>Thao tác</th>
                        </tr>
                     </thead>

                     <tbody>
                        {services.map((service, index) => (
                           <tr key={index}>
                              <td>{service.id_hospital_service}</td>
                              <td>{service.name}</td>
                              <td>
                                 {service.time_advise_hospital_service + 'p'}
                              </td>
                              <td>
                                 {formatter.format(
                                    service.price_hospital_service
                                 )}
                              </td>
                              {/* <td className={`${cx('content_html')}`}>
											<div dangerouslySetInnerHTML={{ __html: healthInsurace.description }} />
										</td> */}
                              <td className="p-4">
                                 {service.created_at
                                    ? formatDateTime(service.created_at)
                                    : 'N/A'}
                              </td>
                              <td>
                                 {service.updated_at
                                    ? formatDateTime(service.updated_at)
                                    : 'N/A'}
                              </td>
                              <td>
                                 <Tippy content="Chỉnh sửa">
                                    <button
                                       onClick={() =>
                                          handleGetHealthInsurace(index)
                                       }
                                       className="btn btn-info btn-sm "
                                       data-toggle="modal"
                                       data-target="#modalEdit"
                                    >
                                       <i className="ti-pencil-alt" />
                                    </button>
                                 </Tippy>

                                 <Tippy content="Xóa">
                                    <button
                                       onClick={() =>
                                          handleGetHealthInsurace(index)
                                       }
                                       data-toggle="modal"
                                       data-target="#modalDelete"
                                       className="btn btn-danger btn-sm ml-2"
                                    >
                                       <i className="ti-trash" />
                                    </button>
                                 </Tippy>
                                 <Tippy content="Xem">
                                    <button
                                       onClick={() =>
                                          handleGetHealthInsurace(index)
                                       }
                                       className="btn btn-info btn-sm ml-2"
                                       data-toggle="modal"
                                       data-target="#modalView"
                                    >
                                       <i className="mdi mdi-eye" />
                                    </button>
                                 </Tippy>
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
            {/* Modal add  */}
            <div
               ref={modalRef}
               className={`modal fade ${cx('modal-color-healthinsurance')}`}
               id="modalCreate"
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
                           Thêm dịch vụ
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
                     <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                           <div className="form-group row">
                              <div className="col-12">
                                 <label
                                    htmlFor="department"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Chuyên khoa
                                 </label>
                                 <div className="col-sm-12">
                                    <select
                                       onChange={handleInputChange}
                                       name="id_hospital_department"
                                       type="text"
                                       className="form-control"
                                       id="department"
                                    >
                                       <option>Chọn chuyên khoa</option>
                                       {departments.map((department) => (
                                          <option
                                             key={department.id}
                                             value={
                                                department.id_hospital_departments
                                             }
                                          >
                                             {department.name}
                                          </option>
                                       ))}
                                    </select>
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row mb-0">
                              <div className="col-12">
                                 <label
                                    htmlFor="name_service"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Tên dịch vụ
                                 </label>
                                 <div className="col-sm-12">
                                    <input
                                       value={formData.name}
                                       onChange={handleInputChange}
                                       name="name"
                                       type="text"
                                       required
                                       className="form-control"
                                       id="name_service"
                                       placeholder="Tên dịch vụ"
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row">
                              <div className="col-6">
                                 <label
                                    htmlFor="time_advise"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Thời gian khám
                                 </label>
                                 <div className="col-sm-12">
                                    <input
                                       value={formData.time_advise}
                                       onChange={handleInputChange}
                                       name="time_advise"
                                       type="text"
                                       required
                                       className="form-control"
                                       id="time_advise"
                                       placeholder="30"
                                    />
                                 </div>
                              </div>
                              <div className="col-6">
                                 <label
                                    htmlFor="price"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Giá
                                 </label>
                                 <div className="col-sm-12">
                                    <input
                                       value={formData.price}
                                       onChange={handleInputChange}
                                       name="price"
                                       type="text"
                                       required
                                       className="form-control"
                                       id="price"
                                       placeholder="150000"
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row mt-0">
                              <div className="col-12">
                                 <label
                                    htmlFor="inputPassword"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Thông tin dịch vụ
                                 </label>
                                 <div className="col-sm-12">
                                    <Editor
                                       onContentChange={
                                          handleAboutServiceChange
                                       }
                                       clearContent={clearContent}
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row mt-0">
                              <div className="col-12">
                                 <label
                                    htmlFor="inputPassword"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Quá trình chuẩn bị
                                 </label>
                                 <div className="col-sm-12">
                                    <Editor
                                       onContentChange={
                                          handlePrepareProcessChange
                                       }
                                       clearContent={clearContent}
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row mt-0">
                              <div className="col-12">
                                 <label
                                    htmlFor="inputPassword"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Chi tiết dịch vụ
                                 </label>
                                 <div className="col-sm-12">
                                    <Editor
                                       onContentChange={
                                          handleServiceDetailsChange
                                       }
                                       clearContent={clearContent}
                                    />
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
                           <button type="submit" className="btn btn-primary">
                              <i className="fa-solid fa-plus"></i> Thêm
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>

            {/* Modal Delete  */}
            <div
               ref={modalDeleteRef}
               className={`modal fade ${cx('modal-color-healthinsurance')}`}
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
                     <form onSubmit={handleDeleteSubmit}>
                        <div className="modal-body">
                           Cảnh báo ! Bạn sẽ có chắc chắn là xóa Dịch vụ{' '}
                           <strong>{serviceDetail.name}</strong> khỏi bệnh viện
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
                           <button type="submit" className="btn btn-danger">
                              <i className="fa-solid fa-trash"></i> Delete
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>

            {/* Modal edit HealthInsurance */}
            <div
               ref={modalEditRef}
               className={`modal fade ${cx('modal-color-healthinsurance')}`}
               id="modalEdit"
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
                           Chỉnh sửa dịch vụ
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
                     <form onSubmit={handleEditSubmit}>
                        <div className="modal-body">
                           <div className="form-group row">
                              <div className="col-12">
                                 <label
                                    htmlFor="department"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Chuyên khoa
                                 </label>
                                 <div className="col-sm-12">
                                    <select
                                       onChange={handleInputEditChange}
                                       // defaultValue={2}
                                       name="id_hospital_departments"
                                       type="text"
                                       className="form-control"
                                       id="department"
                                    >
                                       {departments.map((department) => (
                                          <option
                                             key={
                                                department.id_hospital_departments
                                             }
                                             value={
                                                department.id_hospital_departments
                                             }
                                          >
                                             {department.name}
                                          </option>
                                       ))}
                                    </select>
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row mb-0">
                              <div className="col-12">
                                 <label
                                    htmlFor="name_service"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Tên dịch vụ
                                 </label>
                                 <div className="col-sm-12">
                                    <input
                                       defaultValue={serviceDetail.name}
                                       onChange={handleInputEditChange}
                                       name="name"
                                       type="text"
                                       required
                                       className="form-control"
                                       id="name_service"
                                       placeholder="Tên dịch vụ"
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row">
                              <div className="col-6">
                                 <label
                                    htmlFor="time_advise"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Thời gian khám
                                 </label>
                                 <div className="col-sm-12">
                                    <input
                                       defaultValue={serviceDetail.time_advise}
                                       onChange={handleInputEditChange}
                                       name="time_advise"
                                       type="text"
                                       required
                                       className="form-control"
                                       id="time_advise"
                                       placeholder="30"
                                    />
                                 </div>
                              </div>
                              <div className="col-6">
                                 <label
                                    htmlFor="price"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Giá
                                 </label>
                                 <div className="col-sm-12">
                                    <input
                                       defaultValue={serviceDetail.price}
                                       onChange={handleInputEditChange}
                                       name="price"
                                       type="text"
                                       required
                                       className="form-control"
                                       id="price"
                                       placeholder="150000"
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row mt-0">
                              <div className="col-12">
                                 <label
                                    htmlFor="inputPassword"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Thông tin dịch vụ
                                 </label>
                                 <div className="col-sm-12">
                                    <Editor
                                       onContentChangeEdit={
                                          handleAboutServiceChange
                                       }
                                       description={
                                          serviceDetail.infor.about_service
                                       }
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row mt-0">
                              <div className="col-12">
                                 <label
                                    htmlFor="inputPassword"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Quá trình chuẩn bị
                                 </label>
                                 <div className="col-sm-12">
                                    <Editor
                                       onContentChangeEdit={
                                          handlePrepareProcessChange
                                       }
                                       description={
                                          serviceDetail.infor.prepare_process
                                       }
                                    />
                                 </div>
                              </div>
                           </div>
                           <div className="form-group row mt-0">
                              <div className="col-12">
                                 <label
                                    htmlFor="inputPassword"
                                    className="col-sm-12 col-form-label"
                                 >
                                    Chi tiết dịch vụ
                                 </label>
                                 <div className="col-sm-12">
                                    <Editor
                                       onContentChangeEdit={
                                          handleServiceDetailsChange
                                       }
                                       description={
                                          serviceDetail.infor.service_details
                                       }
                                    />
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
                           <button type="submit" className="btn btn-primary">
                              <i className="ti-pencil-alt"></i> Sửa
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
            {/*Modal view*/}
            <div
               className={`modal fade ${cx('modal-color-category')}`}
               id="modalView"
               tabIndex="-1"
               role="dialog"
               aria-labelledby="exampleModalLabel"
               aria-hidden="true"
            >
               <div
                  className={`modal-dialog ${cx('modal-dialog-create')}`}
                  role="document"
               >
                  <div className={cx('modal-content', 'up_width')}>
                     <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                           Thông tin dịch vụ
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
                        <div>
                           <p className={cx('title_i')}>{serviceDetail.name}</p>
                        </div>
                        <strong className={cx('title_n')}>Về dịch vụ</strong>
                        <div
                           dangerouslySetInnerHTML={{
                              __html: serviceDetail.infor.about_service,
                           }}
                        />
                        <strong className={cx('title_n')}>
                           Quá trình chuẩn bị
                        </strong>
                        <div
                           dangerouslySetInnerHTML={{
                              __html: serviceDetail.infor.prepare_process,
                           }}
                        />
                        <strong className={cx('title_n')}>
                           Chi tiết dịch vụ
                        </strong>
                        <div
                           dangerouslySetInnerHTML={{
                              __html: serviceDetail.infor.service_details,
                           }}
                        />
                        <strong className={cx('title_n')}>
                           Giá: {formatter.format(serviceDetail.price)}
                        </strong>
                        <br />
                        <strong className={cx('title_n')}>
                           Thời gian: {serviceDetail.time_advise + 'p'}
                        </strong>
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

export default HospitalServicePage
