import classNames from 'classnames/bind'
import styles from './LoadingTable.module.scss' // Tạo một file CSS để tùy chỉnh hiệu ứng loading

const cx = classNames.bind(styles)
function LoadingTable(data) {
   const row = data.row
   var loading_row = []
   for (var i = 0; i < row; i++) {
      loading_row.push(
         <tr key={i}>
            <td className={cx('td_1')}>
               <span></span>
            </td>

            <td className={cx('td_3')}>
               <span></span>
            </td>
            <td className={cx('td_3')}>
               <span></span>
            </td>
            <td className={cx('td_3')}>
               <span></span>
            </td>
            <td className={cx('td_3')}>
               <span></span>
            </td>

            <td className={cx('td_5')}>
               <span></span>
            </td>
         </tr>
      )
   }
   return (
      <table className={cx('loading_table')}>
         <tbody>{loading_row}</tbody>
      </table>
   )
}

export default LoadingTable
