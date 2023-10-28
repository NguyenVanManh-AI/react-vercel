import classNames from 'classnames/bind'

import Header from '../components/admin_hospital/Header'
import Footer from '~/layouts/components/admin/Footer'

import styles from './AdminHospitalLayout.module.scss'
import { Outlet } from 'react-router-dom'

const cx = classNames.bind(styles)
function AdminHospitalLayout() {
   return (
      <div className={cx('body_fix')}>
         <div className={cx('wrapper')}>
            <Header />

            <div className={cx('content_page')}>
               <div className={cx('content')}>
                  <div className={cx('content_fluid')}>
                     <Outlet />
                  </div>
                  <Footer />
               </div>
            </div>
         </div>
      </div>
   )
}

export default AdminHospitalLayout
