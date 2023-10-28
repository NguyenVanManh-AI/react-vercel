import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

import styles from '~/pages/admin/Category/Category.module.scss'
import $ from 'jquery'
import { useEffect, useState, useRef } from 'react'
import httpUser from '~/utils/httpUser'
import config from '~/router/config'

import LoadingTable from '~/components/Loading/LoadingTable'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const cx = classNames.bind(styles)
function HospitalDepartmentPage() {
   const modalAddDepartmentRef = useRef(null)
   const modalEditDepartmentRef = useRef(null)
   const modalDeleteDepartmentRef = useRef(null)

   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [loadingTable, setLoadingTable] = useState(false)
   const [departments, setDepartments] = useState([])
   const [allDepartment, setAllDepartment] = useState([])
   const [shouldReloadData, setShouldReloadData] = useState(false)
   const [departmentDetail, setDepartmentDetail] = useState({
      id: '',
      name: '',
      id_department: '',
      time_advise: '',
      price: '',
      index: '',
   })
   const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
   })
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
   const [formDepartment, setFormDepartment] = useState({
      id_department: '',
      time_advise: '',
      price: '',
   })
   const handleChangeFormDepartment = (e) => {
      const { name, value } = e.target
      setFormDepartment({
         ...formDepartment,
         [name]: value,
      })
      console.log(formDepartment)
   }
   const handleGetDepartment = (index) => {
      setDepartmentDetail({
         ...departments[index],
         index: index,
      })
   }
   const handleChangeDepartmentDetail = (e) => {
      const { name, value } = e.target
      setDepartmentDetail({
         ...departmentDetail,
         [name]: value,
      })
   }
   const handleAddDepartmentSubmit = async (e) => {
      e.preventDefault()
      try {
         await httpUser.post('hospital-department/add', formDepartment)
         toast.success('Thêm chuyên khoa thành công !', toastOptions)
         // clear input
         setFormDepartment({
            department: '',
            time_advise: '',
            price: '',
         })

         $(modalAddDepartmentRef.current).modal('hide') // close modal
         // const newData = response.data.data;
         setShouldReloadData(!shouldReloadData)
      } catch (error) {
         if (error.response.data.data)
            toast.error(error.response.data.data[0], toastOptions)
         else toast.error(error.response.data.message, toastOptions)
      }
   }
   const handleEditDepartmentSubmit = async (e) => {
      e.preventDefault()
      try {
         await httpUser.post(
            'hospital-department/update/' +
               departmentDetail.id_hospital_departments,
            {
               price: departmentDetail.price,
               time_advise: departmentDetail.time_advise,
            }
         )
         toast.success('Thêm chuyên khoa thành công !', toastOptions)
         // clear input
         setFormDepartment({
            department: '',
            time_advise: '',
            price: '',
         })

         $(modalEditDepartmentRef.current).modal('hide') // close modal
         // const newData = response.data.data;
         setShouldReloadData(!shouldReloadData)
      } catch (error) {
         if (error.response.data.data)
            toast.error(error.response.data.data[0], toastOptions)
         else toast.error(error.response.data.message, toastOptions)
      }
   }
   const handleSubmitDeleteDepartment = async (e) => {
      e.preventDefault()
      try {
         await httpUser.delete(
            'hospital-department/' + departmentDetail.id_hospital_departments
         )
         toast.success('Xóa danh mục thành công !', toastOptions)
         $(modalDeleteDepartmentRef.current).modal('hide')
         setShouldReloadData(!shouldReloadData)
      } catch (error) {
         if (error.response.data.data)
            toast.error(error.response.data.data[0], toastOptions)
         else toast.error(error.response.data.message, toastOptions)
      }
   }
   useEffect(() => {
      const fetchDepartment = async () => {
         try {
            setLoadingTable(true)
            const response = await httpUser.get('department', {
               paginate: false,
               sortname: true,
            })
            setAllDepartment(response.data.data)
         } catch (error) {
            console.error('Lỗi kết nối đến API', error)
         } finally {
            setLoadingTable(false)
         }
      }

      fetchDepartment()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
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
   return (
      <>
         <ToastContainer />
         <TitleAdmin>Chuyên khoa</TitleAdmin>
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
            </div>
            <div className={cx('card_body')}>
               {loadingTable ? (
                  <>
                     <table className={cx('table', 'table_bordered')}>
                        <thead>
                           <tr>
                              <th>Số thứ tự</th>
                              <th>Tên chuyên khoa</th>
                              <th>Mô tả</th>
                              <th>Thumbnail</th>
                              <th>Lượt tìm kiếm</th>
                              <th>Thời gian tư vấn</th>
                              <th>Giá</th>
                              <th>Thao tác</th>
                           </tr>
                        </thead>
                     </table>
                     <LoadingTable row={5} />
                  </>
               ) : (
                  <table className={cx('table', 'table_bordered')}>
                     <thead>
                        <tr>
                           <th>Số thứ tự</th>
                           <th>Tên chuyên khoa</th>
                           <th>Mô tả</th>
                           <th>Thumbnail</th>
                           <th>Lượt tìm kiếm</th>
                           <th>Thời gian tư vấn</th>
                           <th>Giá</th>
                           <th>Thao tác</th>
                        </tr>
                     </thead>

                     <tbody>
                        {departments.map((department, index) => (
                           <tr key={index}>
                              <td>{index}</td>
                              <td>{department.name}</td>
                              <td>{department.description}</td>
                              <td>
                                 <div className={cx('thumbnail-th')}>
                                    <img
                                       className={cx('thumbnail')}
                                       alt=""
                                       src={
                                          department.thumbnail &&
                                          config.URL + department.thumbnail
                                       }
                                    />
                                 </div>
                              </td>
                              <td colSpan={1}>{department.search_number}</td>
                              <td>{department.time_advise + 'p'}</td>
                              <td>{formatter.format(department.price)}</td>
                              <td>
                                 <Tippy content="Chỉnh sửa">
                                    <button
                                       onClick={() =>
                                          handleGetDepartment(index)
                                       }
                                       className="btn btn-info btn-sm sua"
                                       data-toggle="modal"
                                       data-target="#modalEditDepartment"
                                    >
                                       <i className="ti-pencil-alt" />
                                    </button>
                                 </Tippy>
                                 <br />
                                 <Tippy content="Xóa">
                                    <button
                                       onClick={() =>
                                          handleGetDepartment(index)
                                       }
                                       data-toggle="modal"
                                       data-target="#modalDelete"
                                       className="btn btn-danger btn-sm mt-1"
                                    >
                                       <i className="ti-trash" />
                                    </button>
                                 </Tippy>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
            {/* Modal add Department */}
            <div
               ref={modalAddDepartmentRef}
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
                           Thêm chuyên khoa cho bệnh viện của bạn
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
                     <form onSubmit={handleAddDepartmentSubmit}>
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
                                       onChange={handleChangeFormDepartment}
                                       name="id_department"
                                       type="text"
                                       className="form-control"
                                       id="department"
                                    >
                                       {allDepartment.map((department) => (
                                          <option
                                             key={department.id}
                                             value={department.id}
                                          >
                                             {department.name}
                                          </option>
                                       ))}
                                    </select>
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
                                       value={formDepartment.time_advise}
                                       onChange={handleChangeFormDepartment}
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
                                       value={formDepartment.price}
                                       onChange={handleChangeFormDepartment}
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
                              <i className="fa-solid fa-plus"></i> Add
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
            {/* Modal edit Department */}
            <div
               ref={modalEditDepartmentRef}
               className={`modal fade ${cx('modal-color-category')}`}
               id="modalEditDepartment"
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
                           Sửa thông tin
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
                     <form onSubmit={handleEditDepartmentSubmit}>
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
                                       value={departmentDetail.id_department}
                                       className="form-control"
                                       disabled
                                    >
                                       <option
                                          value={departmentDetail.id_department}
                                       >
                                          {departmentDetail.name}
                                       </option>
                                    </select>
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
                                       value={departmentDetail.time_advise}
                                       onChange={handleChangeDepartmentDetail}
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
                                       value={departmentDetail.price}
                                       onChange={handleChangeDepartmentDetail}
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
                        </div>
                        <div className="modal-footer">
                           <button
                              type="button"
                              className="btn btn-secondary"
                              data-dismiss="modal"
                           >
                              Close
                           </button>
                           <button type="submit" className="btn btn-success">
                              <i className="fa-solid fa-floppy-disk"></i> Save
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
            {/* Modal Delete  */}
            <div
               ref={modalDeleteDepartmentRef}
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
                     <form onSubmit={handleSubmitDeleteDepartment}>
                        <div className="modal-body">
                           Cảnh báo ! Bạn sẽ có chắc chắn là xóa chuyên khoa{' '}
                           <strong>{departmentDetail.name}</strong> khỏi bệnh
                           viện !
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
         </div>
      </>
   )
}

export default HospitalDepartmentPage
