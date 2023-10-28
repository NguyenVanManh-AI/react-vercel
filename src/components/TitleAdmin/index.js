import classNames from 'classnames/bind'
import styles from './TitleAdmin.module.scss'

const cx = classNames.bind(styles)

function TitleAdmin({ children }) {
   return (
      <div className={cx('row_ds')}>
         <div className={cx('col_ds_12')}>
            <h4 className={cx('header_title')}>{children}</h4>
         </div>
      </div>
   )
}

export default TitleAdmin
