import classNames from 'classnames/bind'

import Header from '~/layouts/components/admin/Header'
import Slidebar from '~/layouts/components/admin/Sidebar'
import Footer from '~/layouts/components/admin/Footer'

import styles from './AdminLayout.module.scss'
import { Outlet } from 'react-router-dom'

const cx = classNames.bind(styles)
function AdminLayout() {
   return (
      <div className={cx('body_fix')}>
         <div className={cx('wrapper')}>
            <Header />
            <Slidebar />
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

export default AdminLayout
