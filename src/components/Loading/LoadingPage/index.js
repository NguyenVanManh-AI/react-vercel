import classNames from 'classnames/bind'
import styles from './LoadingPage.module.scss' // Tạo một file CSS để tùy chỉnh hiệu ứng loading

const cx = classNames.bind(styles)
function Loading() {
   return (
      <div className={cx('loading-container')}>
         <div className={cx('loading-spinner')}></div>
      </div>
   )
}

export default Loading
