import classNames from 'classnames/bind'
import { Link } from 'react-router-dom'

import styles from './Footer.module.scss'

const cx = classNames.bind(styles)

function Footer() {
   return (
      <footer className={cx('footer')}>
         <div className={cx('container_fluid')}>
            2023 - Today © Design by &nbsp;
            <Link>Nhóm Mạnh Đức Đạt</Link>
         </div>
      </footer>
   )
}

export default Footer
