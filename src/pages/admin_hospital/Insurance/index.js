import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import httpUser from '~/utils/httpUser'
import styles from './Insurance.module.scss'
import { useEffect, useState } from 'react'
import LoadingTable from '~/components/Loading/LoadingTable'
import Tippy from '@tippyjs/react'
import { ToastContainer, toast } from 'react-toastify'
import Map from '~/components/MapForHospital'
const cx = classNames.bind(styles)
function HospitalInsurancePage() {
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))

   const [loadingTable, setLoadingTable] = useState(false)
   const [shouldReloadData, setShouldReloadData] = useState(false)
   const [allInsurance, setAllInsurance] = useState([])
   const [insuranceHospital, setInsuranceHospital] = useState([])
   const [insuranceDetail, setInsuranceDetail] = useState({
      name: '',
      description: '',
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

   function checkInsuranceExistence(id) {
      return insuranceHospital.some(
         (insurance) => insurance.id_health_insurance === id
      )
   }

   const handleDelete = async (value) => {
      try {
         await httpUser.delete('health-insurace-hospital/' + value)
         toast.warning('Đã hủy bỏ bảo hiểm !', toastOptions)
         // Cập nhật danh sách bảo hiểm sau khi xóa
         setInsuranceHospital((prevInsurance) =>
            prevInsurance.filter(
               (insurance) => insurance.id_health_insurance_hospital !== value
            )
         )
      } catch (error) {
         console.error('Lỗi kết nối đến API', error)
      }
   }
   const handleAdd = async (id) => {
      try {
         await httpUser.post('health-insurace-hospital/add', {
            id_health_insurance: id,
         })
         toast.success('Chấp nhận bảo hiểm thành công ! !', toastOptions)
         setShouldReloadData(!shouldReloadData)
      } catch (error) {
         console.error('Lỗi kết nối đến API', error)
      }
   }
   const handleView = async (id) => {
      try {
         const response = await httpUser.get('health-insurace/detail/' + id)
         setInsuranceDetail(response.data.data)
      } catch (error) {
         console.error('Lỗi kết nối đến API', error)
      }
   }
   useEffect(() => {
      const fetchInsurance = async () => {
         try {
            setLoadingTable(true)
            const response = await httpUser.get('health-insurace')
            setAllInsurance(response.data.data)
         } catch (error) {
            console.error('Lỗi kết nối đến API', error)
         } finally {
            setLoadingTable(false)
         }
      }

      fetchInsurance()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   useEffect(() => {
      const fetchInsuranceHospital = async () => {
         try {
            setLoadingTable(true)
            const response = await httpUser.get(
               'health-insurace-hospital/hospital/' + user.id_hospital,
               { sortname: true }
            )
            setInsuranceHospital(response.data.data)
         } catch (error) {
            console.error('Lỗi kết nối đến API', error)
         } finally {
            setLoadingTable(false)
         }
      }

      fetchInsuranceHospital()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [shouldReloadData])

   return (
      <>
         <ToastContainer />
         <TitleAdmin>Bảo hiểm</TitleAdmin>
         <div className={cx('card', 'shadow', 'left')}>
            <div className={cx('card_header')}>
               <span className={cx('title')}>
                  Bảo hiểm bệnh viện đã chấp thuận
               </span>
            </div>
            <div className={cx('card_body')}>
               {loadingTable ? (
                  <>
                     <table className={cx('table', 'table_bordered')}>
                        <thead>
                           <tr>
                              <th>Số thứ tự</th>
                              <th>Tên bảo hiểm</th>
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
                           <th>Tên bảo hiểm</th>
                           <th>Thao tác</th>
                        </tr>
                     </thead>

                     <tbody>
                        {insuranceHospital.map((insurance, index) => (
                           <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{insurance.name}</td>
                              <td>
                                 <Tippy content="Xem">
                                    <button
                                       onClick={() =>
                                          handleView(
                                             insurance.id_health_insurance
                                          )
                                       }
                                       className="btn btn-info btn-sm sua"
                                       data-toggle="modal"
                                       data-target="#modalView"
                                    >
                                       <i className="mdi mdi-eye" />
                                    </button>
                                 </Tippy>

                                 <Tippy content="Xóa">
                                    <button
                                       onClick={() =>
                                          handleDelete(
                                             insurance.id_health_insurance_hospital,
                                             index
                                          )
                                       }
                                       className="btn btn-danger btn-sm ml-2"
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
         </div>

         <div className={cx('card', 'shadow', 'right')}>
            <div className={cx('card_header')}>
               <span className={cx('title')}>Tất cả bảo hiểm</span>
            </div>
            <div className={cx('card_body')}>
               {loadingTable ? (
                  <>
                     <table className={cx('table', 'table_bordered')}>
                        <thead>
                           <tr>
                              <th>Số thứ tự</th>
                              <th>Tên bảo hiểm</th>
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
                           <th>Tên bảo hiểm</th>
                           <th>Thao tác</th>
                        </tr>
                     </thead>

                     <tbody>
                        {allInsurance.map((insurance, index) => (
                           <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{insurance.name}</td>
                              <td>
                                 <Tippy content="Xem">
                                    <button
                                       onClick={() => handleView(insurance.id)}
                                       className="btn btn-info btn-sm sua"
                                       data-toggle="modal"
                                       data-target="#modalView"
                                    >
                                       <i className="mdi mdi-eye" />
                                    </button>
                                 </Tippy>
                                 {!checkInsuranceExistence(insurance.id) && (
                                    <Tippy content="Thêm">
                                       <button
                                          onClick={() =>
                                             handleAdd(insurance.id)
                                          }
                                          className="btn btn-success btn-sm ml-2"
                                       >
                                          <i className="mdi mdi-plus-circle" />
                                       </button>
                                    </Tippy>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
            {/* Modal view  */}
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
                           Thông tin bảo hiểm
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
                           <p className={cx('title_i')}>
                              {insuranceDetail.name}
                           </p>
                        </div>
                        <div
                           dangerouslySetInnerHTML={{
                              __html: insuranceDetail.description,
                           }}
                        />
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

export default HospitalInsurancePage
