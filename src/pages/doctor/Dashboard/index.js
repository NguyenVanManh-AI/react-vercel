import classNames from 'classnames/bind'

import styles from '~/pages/admin/Dashboard/Dasboard.module.scss'
import TitleAdmin from '~/components/TitleAdmin'
import { useEffect, useState } from 'react'
import httpUser from '~/utils/httpUser'

const cx = classNames.bind(styles)
function DoctorDasboardPage() {
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [statisticals, setStatisticals] = useState([])

   const fetchStaticticalAdmin = async () => {
      try {
         httpUser
            .get('statistical/doctor/' + user.id_doctor)
            .then((response) => {
               setStatisticals(response.data.data)
            })
      } catch {
         console.error('Lỗi kết nối đến API')
      }
   }
   useEffect(() => {
      fetchStaticticalAdmin()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
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
                           {statisticals && statisticals.totalWorkSchedule}
                        </b>
                     </h2>
                     <span>Tất cả lượt tư vấn</span>
                  </div>
                  <div className={cx('block_card', 'boder_right')}>
                     <h2>
                        <i
                           className={cx('color_tim', 'mdi mdi-airplay mr-2')}
                        ></i>
                        <b className={cx('space_icon')}>
                           {statisticals && statisticals.totalWorkSchedule28Day}
                        </b>
                     </h2>
                     <span>Lượt tư vấn 28 ngày qua</span>
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
                           {statisticals && statisticals.totalWorkSchedule7Day}
                        </b>
                     </h2>
                     <span>Lượt tư vấn 7 ngày qua</span>
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
                           {statisticals && statisticals.totalWorkSchedule1Day}
                        </b>
                     </h2>
                     <span>Lượt tư vấn hôm nay</span>
                  </div>
               </div>
            </div>
         </div>
         <div className={cx('row_ds')}>
            <div className={cx('col_ds_12')}></div>
         </div>
      </>
   )
}

export default DoctorDasboardPage
