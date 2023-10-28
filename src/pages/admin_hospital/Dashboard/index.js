import classNames from 'classnames/bind'

import styles from '~/pages/admin/Dashboard/Dasboard.module.scss'
import TitleAdmin from '~/components/TitleAdmin'
import { useEffect, useState } from 'react'
import httpUser from '~/utils/httpUser'
import {
   Chart as ChartJS,
   ArcElement,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Filler,
   Tooltip,
   Legend,
} from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'

const cx = classNames.bind(styles)
function HospitalDashboardPage() {
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [statisticals, setStatisticals] = useState([])
   const [statisticalDoctor, setStatisticalDoctor] = useState([])
   const [statisticalService, setStatisticalService] = useState({})
   const [error, setError] = useState([])
   const getDefaultStartDate = () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 28) // Trừ đi 30 ngày
      return startDate
   }
   // Định dạng ngày thành chuỗi yyyy-MM-dd
   const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
   }
   const [dayDoctor, setDayDoctor] = useState({
      startDay: formatDate(getDefaultStartDate()),
      endDay: formatDate(new Date()),
   })
   const [dayService, setDayService] = useState({
      startDay: formatDate(getDefaultStartDate()),
      endDay: formatDate(new Date()),
   })

   const handleChangeDayDoctor = (e) => {
      const { name, value } = e.target
      setDayDoctor({
         ...dayDoctor,
         [name]: value,
      })
   }
   const handleChangeDayService = (e) => {
      const { name, value } = e.target
      setDayService({
         ...dayService,
         [name]: value,
      })
   }
   const fetchStaticticalAdmin = async () => {
      try {
         httpUser
            .get('statistical/hospital/' + user.id_hospital)
            .then((response) => {
               setStatisticals(response.data.data)
            })
      } catch {
         console.error('Lỗi kết nối đến API')
      }
   }
   const fetchStaticticalAdminByDay = async () => {
      try {
         httpUser
            .post('statistical/hospital-doctor-by-day', {
               startDay: dayDoctor.startDay,
               endDay: dayDoctor.endDay,
               hospital_id: user.id_hospital,
            })
            .then((response) => {
               setStatisticalDoctor(response.data.data.totalWorkSchedule)
               console.log(response.data.data.totalWorkSchedule)
            })
      } catch {
         console.error('error')
      }
   }
   const fetchStaticticalServiceByDay = async () => {
      try {
         httpUser
            .post('statistical/hospital-service-by-day', {
               startDay: dayService.startDay,
               endDay: dayService.endDay,
               hospital_id: user.id_hospital,
            })
            .then((response) => {
               setStatisticalService(response.data.data.totalWorkSchedule)
               console.log(response.data.data.totalWorkSchedule)
            })
      } catch {
         console.error('error')
      }
   }
   useEffect(() => {
      const startDate = new Date(dayDoctor.startDay)
      const endDate = new Date(dayDoctor.endDay)
      const timeDifference = endDate - startDate
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24)
      console.log(daysDifference)
      if (daysDifference < 0) {
         setError({ one: 'Ngày không hợp lệ' })
      } else {
         fetchStaticticalAdminByDay()
         setError('')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dayDoctor])
   useEffect(() => {
      const startDate = new Date(dayService.startDay)
      const endDate = new Date(dayService.endDay)
      const timeDifference = endDate - startDate
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24)
      console.log(daysDifference)
      if (daysDifference < 0) {
         setError({ two: 'Ngày không hợp lệ' })
      } else {
         fetchStaticticalServiceByDay()
         setError('')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dayService])
   useEffect(() => {
      fetchStaticticalAdmin()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   ChartJS.register(
      ArcElement,
      Tooltip,
      Legend,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Filler
   )
   const labels = statisticalDoctor.map((item) => item.doctor_name)
   const dataCounts = statisticalDoctor.map((item) => item.count)
   const data = {
      labels: labels,
      datasets: [
         {
            label: 'Tổng đặt lịch',
            data: dataCounts,
            backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
               'rgba(153, 102, 255, 0.2)',
               'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
         },
      ],
   }
   const labelLine = Object.keys(statisticalService)

   const arrDataOne = []
   const arrDataTwo = []
   for (const date in statisticalService) {
      if (statisticalService.hasOwnProperty(date)) {
         arrDataOne.push(statisticalService[date][0])
      }
   }
   for (const date in statisticalService) {
      if (statisticalService.hasOwnProperty(date)) {
         arrDataTwo.push(statisticalService[date][1])
      }
   }

   const dataLine = {
      labels: labelLine,
      datasets: [
         {
            label: 'Tư vấn/khám dịch vụ',
            data: arrDataTwo,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
         },
         {
            label: 'Tư vấn/khám chuyên khoa',
            data: arrDataOne,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
                           {statisticals && statisticals.totalDoctorAccount}
                        </b>
                     </h2>
                     <span>SỐ lượng bác sĩ</span>
                  </div>
                  <div className={cx('block_card', 'boder_right')}>
                     <h2>
                        <i
                           className={cx('color_tim', 'mdi mdi-airplay mr-2')}
                        ></i>
                        <b className={cx('space_icon')}>
                           {statisticals && statisticals.totalWorkSchedule}
                        </b>
                     </h2>
                     <span>Lượt nhận tư vấn khám</span>
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
                           {statisticals &&
                              statisticals.totalHospitalDepartment}
                        </b>
                     </h2>
                     <span>Số lượng chuyên khoa</span>
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
                           {statisticals && statisticals.totalHospitalService}
                        </b>
                     </h2>
                     <span>Số lượng dịch vụ</span>
                  </div>
               </div>
            </div>
         </div>
         <div className={cx('row_ds')}>
            <div className={cx('col_ds_12')}>
               <div className={cx('card-box-left')}>
                  <h4 className={cx('header_title')}>
                     Biểu đồ hiển thị lượng đặt lịch
                  </h4>
                  <div className={cx('filter_box_input')}>
                     <input
                        onChange={handleChangeDayService}
                        name="endDay"
                        type="date"
                        className="form-control fontz_12"
                        placeholder="Date of birth"
                        value={dayService.endDay}
                     />
                  </div>
                  <div className={cx('filter_box_input')}>
                     <input
                        onChange={handleChangeDayService}
                        name="startDay"
                        type="date"
                        className="form-control fontz_12"
                        placeholder="Date of birth"
                        value={dayService.startDay}
                     />
                  </div>
                  <span className={cx('error-two')}>{error.two || ''}</span>
                  <Line data={dataLine} />
               </div>
               <div className={cx('card-box-right')}>
                  <h4 className={cx('header_title')}>
                     Biểu đồ hiển thị lịch đặt của bác sĩ
                  </h4>
                  <div className={cx('filter_box_input')}>
                     <input
                        onChange={handleChangeDayDoctor}
                        name="endDay"
                        type="date"
                        className="form-control fontz_12"
                        placeholder="Date of birth"
                        value={dayDoctor.endDay}
                     />
                  </div>
                  <div className={cx('filter_box_input')}>
                     <input
                        onChange={handleChangeDayDoctor}
                        name="startDay"
                        type="date"
                        className="form-control fontz_12"
                        placeholder="Date of birth"
                        value={dayDoctor.startDay}
                     />
                  </div>
                  <span className={cx('error-one')}>{error.one || ''}</span>
                  <Pie data={data} />
               </div>
            </div>
         </div>
      </>
   )
}

export default HospitalDashboardPage
