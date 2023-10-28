import classNames from 'classnames/bind'
import styles from './LoadingDot.module.scss' // Tạo một file CSS để tùy chỉnh hiệu ứng loading

const cx = classNames.bind(styles)
function LoadingDot() {
   return (
      <div className={cx('container')}>
         <div className={cx('dots_1')}></div>
      </div>
   )
}

export default LoadingDot
