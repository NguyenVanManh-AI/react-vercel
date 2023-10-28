import classNames from 'classnames/bind'

import styles from './Dasboard.module.scss'
import TitleAdmin from '~/components/TitleAdmin'
import { useEffect, useState } from 'react'
import httpUser from '~/utils/httpUser'
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Filler,
   Tooltip,
   Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

const cx = classNames.bind(styles)
function AdminDashboardPage() {
   const [statisticals, setStatisticals] = useState([])
   const [error, setError] = useState([])
   const [totalUserAccount, setTotalUserAccount] = useState([])
   const [totalDoctorAccount, setTotalDoctorAccount] = useState([])
   const [totalHospitalAccount, setTotalHospitalAccount] = useState([])

   const getDefaultStartDate = () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7) // Trừ đi 7 ngày
      return startDate
   }
   // Định dạng ngày thành chuỗi yyyy-MM-dd
   const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
   }
   const [day, setDay] = useState({
      startDay: formatDate(getDefaultStartDate()),
      endDay: formatDate(new Date()),
   })

   const handleChangeDay = (e) => {
      const { name, value } = e.target
      setDay({
         ...day,
         [name]: value,
      })
   }
   const fetchStaticticalAdminByDay = async () => {
      try {
         httpUser
            .post('statistical/admin-by-day', {
               startDay: day.startDay,
               endDay: day.endDay,
            })
            .then((response) => {
               setTotalUserAccount(response.data.data.totalUserAccount)
               setTotalDoctorAccount(response.data.data.totalDoctorAccount)
               setTotalHospitalAccount(response.data.data.totalHospitalAccount)
            })
      } catch {
         console.error('error')
      }
   }
   useEffect(() => {
      const startDate = new Date(day.startDay)
      const endDate = new Date(day.endDay)
      const timeDifference = endDate - startDate
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24)
      console.log(daysDifference)
      if (daysDifference < 7) {
         setError('Ngày không hợp lệ, chênh lệnh ít nhất 7 ngày')
      } else if (daysDifference > 365) {
         setError('Ngày không hợp lệ, chênh lệnh không quá 1 năm')
      } else {
         fetchStaticticalAdminByDay()
         setError('')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [day])

   const fetchStaticticalAdmin = async () => {
      try {
         httpUser.get('statistical/admin').then((response) => {
            setStatisticals(response.data.data)
         })
      } catch {
         console.error('Lỗi kết nối đến API')
      }
   }
   useEffect(() => {
      fetchStaticticalAdmin()
   }, [])

   ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Filler,
      Tooltip,
      Legend
   )

   const data = {
      labels: [],
      datasets: [
         {
            // fill: true,
            label: 'User account',
            backgroundColor: '#b4e6c3',
            borderColor: '#8ad6a1',
            borderWidth: 2,
            hoverBackgroundColor: '#699f79',
            hoverBorderColor: '#4e865e',
            data: totalUserAccount,
         },
         {
            // fill: true,
            label: 'Doctor account',
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(75,192,192,0.4)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: totalDoctorAccount,
         },
         {
            // fill: true,
            label: 'Hospital account',
            backgroundColor: '#ef7d87',
            borderColor: '#dc6670',
            borderWidth: 2,
            hoverBackgroundColor: '#c76770',
            hoverBorderColor: '#8d3b43',
            data: totalHospitalAccount,
         },
      ],
   }

   return (
      <>
         <TitleAdmin>WellCome To Dashboard !</TitleAdmin>
         <div className={cx('row_ds')}>
            <div className={cx('col_ds_12')}>
               <div className={cx('card_box')}>
                  <div className={cx('block_card', 'boder_right')}>
                     <h2>
                        <i
                           className={cx(
                              'color_blue',
                              'mdi mdi-access-point-network mr-2'
                           )}
                        ></i>
                        <b className={cx('space_icon')}>
                           {statisticals && statisticals.totalAccount}
                        </b>
                     </h2>
                     <span>Tổng tài khoản</span>
                  </div>
                  <div className={cx('block_card', 'boder_right')}>
                     <h2>
                        <i
                           className={cx('color_tim', 'mdi mdi-airplay mr-2')}
                        ></i>
                        <b className={cx('space_icon')}>
                           {statisticals && statisticals.totalHospitalAccount}
                        </b>
                     </h2>
                     <span>Tài khoản Bệnh viện</span>
                  </div>
                  <div className={cx('block_card', 'boder_right')}>
                     <h2>
                        <i
                           className={cx(
                              'color_green',
                              'mdi mdi-black-mesa mr-2'
                           )}
                        ></i>
                        <b className={cx('space_icon')}>
                           {statisticals && statisticals.totalDoctorAccount}
                        </b>
                     </h2>
                     <span>Tài khoản Bác sĩ</span>
                  </div>
                  <div className={cx('block_card')}>
                     <h2>
                        <i
                           className={cx(
                              'color_blue',
                              'mdi mdi-cellphone-link mr-2'
                           )}
                        ></i>
                        <b className={cx('space_icon')}>
                           {statisticals && statisticals.totalUserAccount}
                        </b>
                     </h2>
                     <span>Tài khoản Người dùng</span>
                  </div>
               </div>
            </div>
         </div>
         <div className={cx('row_ds')}>
            <div className={cx('col_ds_12')}>
               <h4 className={cx('header_title')}>
                  Biểu đồ hiển thị lượng người dùng đăng ký
               </h4>
               <div className={cx('filter_box_input')}>
                  <input
                     onChange={handleChangeDay}
                     name="endDay"
                     type="date"
                     className="form-control fontz_14"
                     placeholder="Date of birth"
                     value={day.endDay}
                  />
               </div>
               <div className={cx('filter_box_input')}>
                  <input
                     onChange={handleChangeDay}
                     name="startDay"
                     type="date"
                     className="form-control fontz_14"
                     placeholder="Date of birth"
                     value={day.startDay}
                  />
               </div>
               <span className={cx('error')}>{error || ''}</span>
               <Line data={data} />
            </div>
         </div>
      </>
   )
}

export default AdminDashboardPage
