import classNames from 'classnames/bind'
import styles from './PageNotFoundPage.module.scss'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)
const PageNotFoundPage = () => {
   return (
      <div>
         <div id={cx('page_not_found')}>
            <h1>PAGE NOT FOUND !</h1>
            <img src="/user/image/404.jpg" alt="404" />
            <Link to="/">
               <button className="btn btn-outline-dark">HOME</button>
            </Link>
         </div>
      </div>
   )
}
export default PageNotFoundPage
