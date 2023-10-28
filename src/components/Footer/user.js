import React from 'react'
import { Navbar, Container, NavDropdown, Collapse, Nav } from 'react-bootstrap'
import logo from '~/Assets/logo.png'
import { useSelector } from 'react-redux'
import config from '~/router/config'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import http from '~/utils/httpUser'
import './footer.css'


const UserFooter = () => {

    const [categories, setCategories] = useState([]);
    // get categories
   useEffect(() => {
    const getCategory = async () => {
       try {
          const queryParams = `?page=1&paginate=6`
          const response = await http.get('category' + queryParams)
          setCategories(response.data.data.data)
       } catch (error) {
          console.log('Lỗi kết nối đến API !', error)
       }
    }
    getCategory()
 }, [])

    return (
        <>
            <footer className='footer'>
                <Container className='main-footer'>
                    <div className='inner'>
                        <Link><img src={logo}/></Link>
                        <div className='columns'>
                            <div className='newsletter'>
                                <p>Mong muốn trở thành nền tảng thông tin y khoa hàng đầu tại Việt Nam, 
                                    giúp bạn đưa ra những quyết định đúng đắn liên quan về chăm sóc sức khỏe
                                    và hỗ trợ bạn cải thiện chất lượng cuộc sống.</p>
                            </div>
                            <div className='column-2'>
                                <div className='list-item-col'>
                                    <Link>Chuyên đề về sức khỏe</Link>
                                    <Link>Bệnh viện</Link>
                                    <Link>Trang cá nhân</Link>
                                </div>
                            </div>
                            <div className='column-3'>
                                <p>Danh mục sức khỏe</p>
                                {categories.map((category, index) => (
                                    <Link>{category.name}</Link>
                                ))}
                            </div>
                            <div className='column-3'>
                                <p>Mạng xã hội</p>
                                <Link>Facebook</Link>
                                <Link>Instagram</Link>
                                <Link>Google</Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </footer>
        </>
    )
}
export default UserFooter;