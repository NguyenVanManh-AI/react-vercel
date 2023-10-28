import { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'
import { ToastContainer, toast } from 'react-toastify'

import httpUser from '~/utils/httpUser'
import styles from './HospitalCalendar.module.scss'
import LoadingDot from '~/components/Loading/LoadingDot'

const cx = classNames.bind(styles)
function HospitalCalendarPage() {
   const data = {
      friday: {
         night: {
            time: [],
            enable: true,
         },
         enable: true,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      monday: {
         night: {
            time: [],
            enable: true,
         },
         enable: true,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      sunday: {
         night: {
            time: [],
            enable: true,
         },
         enable: true,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      tuesday: {
         night: {
            time: [],
            enable: true,
         },
         enable: true,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      saturday: {
         night: {
            time: [],
            enable: true,
         },
         enable: true,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      thursday: {
         night: {
            time: [],
            enable: true,
         },
         enable: true,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      wednesday: {
         night: {
            time: [],
            enable: true,
         },
         enable: true,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
   }
   const [scheduleData, setScheduleData] = useState(data)
   const [loadingDot, setLoadingDot] = useState(false)
   const [errors, setErrors] = useState({})
   const daysOfWeek = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
   ]

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

   const forrmatTime = (time) => {
      if (time) {
         const parts = time.split(':') // Tách giờ và phút
         const hour = parts[0].padStart(2, '0') // Đảm bảo có 2 chữ số cho giờ
         const minute = parts[1].padStart(2, '0') // Đảm bảo có 2 chữ số cho phút
         return `${hour}:${minute}`
      }
   }
   const formatDay = (day) => {
      switch (day) {
         case 'monday':
            return 'Thứ 2'
         case 'tuesday':
            return 'Thứ 3'
         case 'wednesday':
            return 'Thứ 4'
         case 'thursday':
            return 'Thứ 5'
         case 'friday':
            return 'Thứ 6'
         case 'saturday':
            return 'Thứ 7'
         case 'sunday':
            return 'Chủ Nhật'

         default:
            return ''
      }
   }
   const setErrorTime = (selectedTime, startTime, endTime, day, partOfDay) => {
      if (selectedTime < startTime || selectedTime > endTime) {
         setErrors((prevErrors) => ({
            ...prevErrors,
            [day]: {
               ...prevErrors[day],
               [partOfDay]: 'Thời gian không đúng',
            },
         }))
      } else {
         setErrors((prevErrors) => ({
            ...prevErrors,
            [day]: {
               ...prevErrors[day],
               [partOfDay]: '', // Đặt lại trạng thái lỗi
            },
         }))
      }
   }
   const handleTimeChange = (day, partOfDay, timeIndex, newValue) => {
      const updatedSchedule = { ...scheduleData }

      updatedSchedule[day][partOfDay].time[timeIndex] = newValue
      setScheduleData(updatedSchedule)

      const selectedTime = newValue

      const startTimeMorning = '00:00'
      const endTimeMorning = '12:00'
      const endTimeAfterNoon = '18:00'
      const endTimeNight = '24:00'
      if (partOfDay === 'morning') {
         setErrorTime(
            selectedTime,
            startTimeMorning,
            endTimeMorning,
            day,
            partOfDay
         )
      } else if (partOfDay === 'afternoon') {
         setErrorTime(
            selectedTime,
            endTimeMorning,
            endTimeAfterNoon,
            day,
            partOfDay
         )
         console.log(selectedTime)
      } else if (partOfDay === 'night') {
         setErrorTime(
            selectedTime,
            endTimeAfterNoon,
            endTimeNight,
            day,
            partOfDay
         )
      }
   }

   const handleDayCheckboxChange = (day, newValue) => {
      console.log(scheduleData)
      const updatedSchedule = { ...scheduleData }

      updatedSchedule[day].enable = newValue

      updatedSchedule[day].morning.enable = newValue
      updatedSchedule[day].afternoon.enable = newValue
      updatedSchedule[day].night.enable = newValue

      setScheduleData(updatedSchedule)
   }

   const handlePartOfDayCheckboxChange = (day, partOfDay, newValue) => {
      console.log(scheduleData)
      const updatedSchedule = { ...scheduleData }
      updatedSchedule[day][partOfDay].enable = newValue
      setScheduleData(updatedSchedule)
   }

   const fetchTimeWork = async () => {
      try {
         const response = await httpUser.get('/time-work/detail')
         setScheduleData(response.data.data.times)
         console.log(response.data.data.times)
      } catch (error) {
         console.error('Lấy timework thất bại', error)
      }
   }

   const handleSubmitUpdate = async () => {
      try {
         setLoadingDot(true)
         await httpUser.post('/time-work/update', {
            enable: true,
            note: 'Ngày nghỉ',
            times: scheduleData,
         })
         toast.success('Cập nhật lịch thành công !', toastOptions)
      } catch (error) {
         toast.error('Bạn đã cập nhật giờ không hợp lệ', toastOptions)
      } finally {
         setLoadingDot(false)
      }
   }
   useEffect(() => {
      fetchTimeWork()
   }, [])
   return (
      <>
         <ToastContainer />
         <TitleAdmin>Lịch hoạt động bệnh viện </TitleAdmin>
         <div className={cx('card', 'shadow')}>
            {loadingDot && <LoadingDot />}
            <div className={cx('card_header')}>
               <span className={cx('title')}>
                  Điều chỉnh phù hợp với bệnh viện của bạn
               </span>
            </div>
            <div className={cx('card_body', 'center')}>
               <div>
                  <p className={cx('float-right', 'note')}>
                     **Lưu ý buổi sáng bắt đầu từ 00:00 - 12:00, buổi chiều từ
                     12:00 - 18:00 và buổi tối 18:00-00:00
                  </p>
               </div>

               <table>
                  <thead></thead>
                  <tbody>
                     {daysOfWeek.map((day) => (
                        <tr key={day} className={cx('up_width')}>
                           <td className={cx('day')}>
                              <div className={cx('dayp')}>
                                 <span className={cx('pr_13')}>
                                    {formatDay(day)}
                                 </span>
                              </div>

                              <input
                                 type="checkbox"
                                 checked={scheduleData[day].enable || false}
                                 onChange={(e) =>
                                    handleDayCheckboxChange(
                                       day,
                                       e.target.checked
                                    )
                                 }
                              />
                           </td>
                           <td>
                              <span className={cx('park')}>Sáng</span>
                              <div className={cx('width_lock')}>
                                 <input
                                    type="time"
                                    value={forrmatTime(
                                       scheduleData[day].morning.time[0] || ''
                                    )}
                                    onChange={(e) =>
                                       handleTimeChange(
                                          day,
                                          'morning',
                                          0,
                                          e.target.value
                                       )
                                    }
                                 />
                                 {' - '}
                                 <input
                                    type="time"
                                    value={forrmatTime(
                                       scheduleData[day].morning.time[1] || ''
                                    )}
                                    onChange={(e) =>
                                       handleTimeChange(
                                          day,
                                          'morning',
                                          1,
                                          e.target.value
                                       )
                                    }
                                 />
                              </div>
                              <input
                                 type="checkbox"
                                 checked={
                                    scheduleData[day].morning.enable || false
                                 }
                                 onChange={(e) =>
                                    handlePartOfDayCheckboxChange(
                                       day,
                                       'morning',
                                       e.target.checked
                                    )
                                 }
                              />
                              {errors[day] && errors[day]['morning'] && (
                                 <span className={cx('error')}>
                                    {errors[day]['morning']}
                                 </span>
                              )}
                           </td>
                           <td>
                              <span className={cx('park')}>Chiều</span>
                              <div className={cx('width_lock')}>
                                 <input
                                    type="time"
                                    value={
                                       scheduleData[day].afternoon.time[0] || ''
                                    }
                                    onChange={(e) =>
                                       handleTimeChange(
                                          day,
                                          'afternoon',
                                          0,
                                          e.target.value
                                       )
                                    }
                                 />
                                 {' - '}
                                 <input
                                    type="time"
                                    value={
                                       scheduleData[day].afternoon.time[1] || ''
                                    }
                                    onChange={(e) =>
                                       handleTimeChange(
                                          day,
                                          'afternoon',
                                          1,
                                          e.target.value
                                       )
                                    }
                                 />
                              </div>

                              <input
                                 type="checkbox"
                                 checked={
                                    scheduleData[day].afternoon.enable || false
                                 }
                                 onChange={(e) =>
                                    handlePartOfDayCheckboxChange(
                                       day,
                                       'afternoon',
                                       e.target.checked
                                    )
                                 }
                              />
                              {errors[day] && errors[day]['afternoon'] && (
                                 <span className={cx('error')}>
                                    {errors[day]['afternoon']}
                                 </span>
                              )}
                           </td>
                           <td>
                              <span className={cx('park')}>Tối</span>
                              <div className={cx('width_lock')}>
                                 <input
                                    type="time"
                                    value={forrmatTime(
                                       scheduleData[day].night.time[0] || ''
                                    )}
                                    onChange={(e) =>
                                       handleTimeChange(
                                          day,
                                          'night',
                                          0,
                                          e.target.value
                                       )
                                    }
                                 />
                                 {' - '}
                                 <input
                                    type="time"
                                    value={forrmatTime(
                                       scheduleData[day].night.time[1] || ''
                                    )}
                                    onChange={(e) =>
                                       handleTimeChange(
                                          day,
                                          'night',
                                          1,
                                          e.target.value
                                       )
                                    }
                                 />
                              </div>

                              <input
                                 type="checkbox"
                                 checked={
                                    scheduleData[day].night.enable || false
                                 }
                                 onChange={(e) =>
                                    handlePartOfDayCheckboxChange(
                                       day,
                                       'night',
                                       e.target.checked
                                    )
                                 }
                              />
                              {errors[day] && errors[day]['night'] && (
                                 <span className={cx('error')}>
                                    {errors[day]['night']}
                                 </span>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>

               <button
                  className={cx('btn btn-info', 'mt-2', 'fl_right')}
                  onClick={handleSubmitUpdate}
               >
                  Cập nhật
               </button>
            </div>
         </div>
      </>
   )
}

export default HospitalCalendarPage
