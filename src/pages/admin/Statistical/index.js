import classNames from 'classnames/bind'
import TitleAdmin from '~/components/TitleAdmin'

import styles from './Statistical.module.scss'

const cx = classNames.bind(styles)
function AdminStatistical() {
   return (
      <>
         <TitleAdmin>Thống kê </TitleAdmin>
         <div className={cx('card', 'shadow')}>
            <div className={cx('card_body')}>Custom special here</div>
         </div>
      </>
   )
}

export default AdminStatistical
