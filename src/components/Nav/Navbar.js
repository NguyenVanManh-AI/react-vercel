import React from 'react'
import { Navbar, Container, NavDropdown, Collapse, Nav } from 'react-bootstrap'
import logo from '~/Assets/logo.png'
import './Navbar.css'
import { useSelector } from 'react-redux'
import config from '~/router/config'
import { Link, useNavigate } from 'react-router-dom'
import { BsFillSaveFill, BsChevronDown } from 'react-icons/bs'
import { BiSolidHelpCircle } from 'react-icons/bi'
import { IoShareSocialSharp } from 'react-icons/io5'
import {
   AiOutlineHistory,
   AiOutlineLogout,
   AiFillSetting,
} from 'react-icons/ai'
import { GiHealthNormal } from 'react-icons/gi'
import { useEffect, useState } from 'react'
import http from '~/utils/http'

const Navbars = () => {
   const user = JSON.parse(localStorage.getItem('HealthCareUser'))
   const [avatar, setAvatar] = useState('/image/avatar_admin_default.png')
   const [name, setName] = useState(user && user.name ? user.name : 'User')
   const [categories, setCategories] = useState([])
   const [departments, setDepartments] = useState([])
   const [hospitals, setHospitals] = useState([])
   const isUserUpdated = useSelector((state) => state.user.keyUserUpdated)
   const [articles, setArticles] = useState([])
   const navigate = useNavigate()
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

   useEffect(() => {
      const getArticle = async () => {
         try {
            const queryParams = `?&page=1&paginate=3&sort_search_number=true`
            const response = await http.get('/article' + queryParams)
            setArticles(response.data.data.data)
         } catch (error) {
            console.log('Lỗi kết nối đến API !', error)
         }
      }
      getArticle()
   }, [])

   // Get Department
   useEffect(() => {
      const getDepartments = async () => {
         try {
            const queryParams = `?page=1&paginate=6`
            const response = await http.get('department' + queryParams)
            setDepartments(response.data.data.data)
         } catch (error) {
            console.log('Lỗi kết nối đến API !', error)
         }
      }
      getDepartments()
   }, [])
   // Get Hospitals
   useEffect(() => {
      const getHospitals = async () => {
         try {
            const queryParams = `?page=1&paginate=3&sort_search_number=true`
            const response = await http.get(
               'infor-hospital/all-hospital' + queryParams
            )
            setHospitals(response.data.data.data)
         } catch (error) {
            console.log('Lỗi kết nối đến API !', error)
         }
      }
      getHospitals()
   }, [])
   // set avatar User
   useEffect(() => {
      const user = JSON.parse(localStorage.getItem('HealthCareUser'))
      if (user && user.avatar) {
         var https_regex = /^(https)/
         if (https_regex.test(String(user.avatar).toLowerCase()) == true) {
            setAvatar(user.avatar)
         } else {
            setAvatar(config.URL + user.avatar)
         }
      }
      if (user && user.name) {
         setName(user.name)
      }
   }, [isUserUpdated])
   const handleHome = () => {
      navigate('/')
   }
   const handleLogout = () => {
      localStorage.removeItem('HealthCareUser')
   }

   return (
      <Navbar expand="lg" className="bg-body-tertiary">
         <div className="container-fluid">
            <Navbar.Brand onClick={handleHome}>
               <img src={logo} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
               className="justify-content-end"
               id="basic-navbar-nav"
            >
               <Nav>
                  <NavDropdown
                     title={
                        <div>
                           Chuyên mục <BsChevronDown />
                        </div>
                     }
                     className="has-megamenu"
                     id="basic-nav-dropdown"
                  >
                     <Container className="pl-0 pr-0">
                        <div className="row w-100">
                           <div className="col-lg-3 pl-0 col-md-3 pt-2 pb-2 pr-3">
                              <div className="border-right pr-3">
                                 <h6>
                                    <b>Chuyên mục sức khỏe</b>
                                 </h6>
                                 <ul className="w-100 mt-3">
                                    {categories.map((category, index) => (
                                       <li key={index}>
                                          <img
                                             className="icon"
                                             src={
                                                category.thumbnail &&
                                                config.URL + category.thumbnail
                                             }
                                          />
                                          <Link>{category.name}</Link>
                                       </li>
                                    ))}
                                 </ul>
                                 <Link className="btn btn-outline-primary w-100">
                                    Xem tất cả danh mục{' '}
                                    <i className="fa-solid fa-chevron-right"></i>
                                 </Link>
                              </div>
                           </div>
                           <div className="col-lg-9 col-md-9 pr-0">
                              <div className="hospitals-list">
                                 <div className="list-title">
                                    <h2>Bài viết nổi bật</h2>
                                 </div>
                              </div>
                              <div className="row main-section">
                                 {articles.map((article, index) => {
                                    return (
                                       <div className="col-lg-4 col-md-4 list-article">
                                          <article className="article">
                                             <div className="banner-article">
                                                <span>
                                                   <img
                                                      src={
                                                         article.thumbnail_article &&
                                                         config.URL +
                                                            article.thumbnail_article
                                                      }
                                                   />
                                                </span>
                                             </div>
                                             <div className="content">
                                                <div className="inner-content">
                                                   <p className="category-name">
                                                      <Link className="name">
                                                         {article.name_category}
                                                      </Link>
                                                   </p>
                                                   <h5 className="title-article">
                                                      <Link
                                                         to={
                                                            '/article/' +
                                                            article.id_article
                                                         }
                                                      >
                                                         {article.title}
                                                      </Link>
                                                   </h5>
                                                   <div className="footer-article d-flex">
                                                      <img
                                                         className="img-doctor"
                                                         src={
                                                            article.avatar_user
                                                               ? config.URL +
                                                                 article.avatar_user
                                                               : '/image/avatar_admin_default.png'
                                                         }
                                                      />
                                                      <p>
                                                         Tham vấn y khoa:
                                                         <span className="name-doctor ml-1">
                                                            {article.name_user}
                                                         </span>
                                                      </p>
                                                   </div>
                                                </div>
                                             </div>
                                          </article>
                                       </div>
                                    )
                                 })}
                              </div>
                           </div>
                        </div>
                     </Container>
                  </NavDropdown>
                  {/* <NavDropdown
                     title={
                        <div>
                           Kiểm tra sức khỏe <BsChevronDown />
                        </div>
                     }
                     className="has-megamenu"
                     id="basic-nav-dropdown"
                  >
                     <Container className="pl-0 pr-0">
                        <div className="row w-100">
                           <div className="col-lg-3 pl-0 col-md-3 pt-2 pb-2 pr-3">
                              <div className="border-right pr-3">
                                 <h6>
                                    <b>Chuyên mục sức khỏe</b>
                                 </h6>
                                 <ul className="w-100 mt-3">
                                    {categories.map((category, index) => (
                                       <li>
                                          <img
                                             className="icon"
                                             src={
                                                category.thumbnail &&
                                                config.URL + category.thumbnail
                                             }
                                          />
                                          <Link>{category.name}</Link>
                                       </li>
                                    ))}
                                 </ul>
                                 <Link className="btn btn-outline-primary w-100">
                                    Xem tất cả danh mục{' '}
                                    <i className="fa-solid fa-chevron-right"></i>
                                 </Link>
                              </div>
                           </div>
                           <div className="col-lg-9 col-md-9  pr-0"></div>
                        </div>
                     </Container>
                  </NavDropdown> */}
                  <NavDropdown
                     title={
                        <div>
                           Đặt lịch bác sĩ <BsChevronDown />
                        </div>
                     }
                     className="has-megamenu"
                     id="basic-nav-dropdown"
                  >
                     <Container className="pl-0 pr-0">
                        <div className="row w-100">
                           <div className="col-lg-3 pl-0 col-md-5 pt-2 pb-2 pr-3">
                              <div className="border-right pr-3">
                                 <h6>
                                    <b>Các chuyên khoa</b>
                                 </h6>
                                 <ul className="w-100 mt-3">
                                    {departments.map((department, index) => (
                                       <li>
                                          <img
                                             className="icon"
                                             src={
                                                department.thumbnail &&
                                                config.URL +
                                                   department.thumbnail
                                             }
                                          />
                                          <Link>{department.name}</Link>
                                       </li>
                                    ))}
                                 </ul>
                                 <Link className="btn btn-outline-primary w-100">
                                    Tất cả chuyên khoa{' '}
                                    <i className="fa-solid fa-chevron-right"></i>
                                 </Link>
                              </div>
                           </div>
                           <div className="col-lg-9 col-md-7 pr-0">
                              <div className="hospitals-list">
                                 <div className="list-title">
                                    <h2>Bệnh viện nổi bật</h2>
                                 </div>
                                 <div className="row">
                                    {hospitals.map((hospital, index) => (
                                       <div className="col-lg-4 col-md-4 pr-1 pl-0">
                                          <Link
                                             to={
                                                '/hospital/' +
                                                hospital.id_hospital
                                             }
                                             className="hospital"
                                          >
                                             <img
                                                className="bg-banner"
                                                src="https://hhg-common.hellobacsi.com/common/navCareCardBg.svg"
                                             />
                                             <div className="banner">
                                                <img
                                                   src={
                                                      hospital.avatar &&
                                                      config.URL +
                                                         hospital.avatar
                                                   }
                                                />
                                             </div>
                                             <div className="hospital-content">
                                                <p className="hospital-name">
                                                   {hospital.name}
                                                </p>
                                                <p className="hospital-desc">
                                                   {hospital.description}
                                                </p>
                                                <div className="hospital-footer">
                                                   <Link>Xem thêm</Link>
                                                </div>
                                             </div>
                                          </Link>
                                       </div>
                                    ))}
                                    <div className="list-footer">
                                       <Link to="/all" className="view-book">
                                          <button className="btn btn-primary py-2 px-4">
                                             Trang chủ đặt lịch
                                             <i className="fa-solid fa-chevron-right" />
                                          </button>
                                       </Link>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </Container>
                  </NavDropdown>
                  {/* <NavDropdown
                     title={
                        <div>
                           Cộng đồng <BsChevronDown />
                        </div>
                     }
                     id="basic-nav-dropdown"
                  >
                     <NavDropdown.Item href="#action/3.1">
                        Action
                     </NavDropdown.Item>
                     <NavDropdown.Item href="#action/3.2">
                        Another action
                     </NavDropdown.Item>
                     <NavDropdown.Item href="#action/3.3">
                        Something
                     </NavDropdown.Item>
                     <NavDropdown.Divider />
                     <NavDropdown.Item href="#action/3.4">
                        Separated link
                     </NavDropdown.Item>
                  </NavDropdown> */}
                  {user ? (
                     <NavDropdown
                        className="nav-info"
                        title={
                           <div className="pull-left d-flex">
                              <img
                                 className="avatar"
                                 src={avatar}
                                 alt="user pic"
                              />
                              <span className="my-auto ml-1">{user.name}</span>
                           </div>
                        }
                        id="basic-nav-dropdown"
                     >
                        <NavDropdown.Item className="p-2">
                           <Link
                              to={
                                 user.role === 'hospital'
                                    ? 'hospital/profile '
                                    : user.role === 'doctor'
                                    ? 'hospital/doctor-profile'
                                    : 'user/profile'
                              }
                              tag={Link}
                           >
                              <div className="d-flex info-user">
                                 <img
                                    className="avatar"
                                    src={avatar}
                                    alt="user pic"
                                 />
                                 <p className="ml-1">
                                    {name}
                                    <div>
                                       <small>
                                          Xem hồ sơ của bạn
                                          <i className="fa-solid fa-chevron-right"></i>
                                       </small>
                                    </div>
                                 </p>
                              </div>
                           </Link>
                        </NavDropdown.Item>
                        {user.role == 'user' && (
                           <div className="row mr-0 ml-0">
                              <div className="col-lg-6 col-md-6">
                                 <div className="dropdown-info">
                                    <Link to={'user/setting'}>
                                       <AiFillSetting className="text-secondary" />
                                       <br />
                                       Thiết lập
                                    </Link>
                                 </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                 <div className="dropdown-info">
                                    <Link to={'/user/schedule'}>
                                       <AiOutlineHistory />
                                       <br />
                                       Quản lý đặt lịch
                                    </Link>
                                 </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                 <div className="dropdown-info">
                                    <Link>
                                       <GiHealthNormal className="text-danger" />
                                       <br />
                                       Sức khỏe
                                    </Link>
                                 </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                 <div className="dropdown-info">
                                    <Link>
                                       <IoShareSocialSharp className="text-primary" />
                                       <br />
                                       Cộng đồng
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        )}
                        {user.role == 'doctor' && (
                           <div className="row mr-0 ml-0">
                              <div className="col-lg-12 col-md-12">
                                 <div className="dropdown-info">
                                    <Link to={'/hospital/doctor-dashboard'}>
                                       <AiOutlineLogout className="mr-1 text-dark" />
                                       Quản lý bác sĩ
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        )}
                        {user.role == 'hospital' && (
                           <div className="row mr-0 ml-0">
                              <div className="col-lg-12 col-md-12">
                                 <div className="dropdown-info">
                                    <Link to={'/hospital/dashboard'}>
                                       <AiOutlineLogout className="mr-1 text-dark" />
                                       Quản lý bệnh viện
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        )}
                        <div className="row mr-0 ml-0">
                           <div className="col-lg-12 col-md-12">
                              <div className="dropdown-info">
                                 <Link
                                    to={'/user-login'}
                                    onClick={handleLogout}
                                 >
                                    <AiOutlineLogout className="mr-1 text-dark" />
                                    Đăng xuất
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </NavDropdown>
                  ) : (
                     <Link to={'/user-login'} tag={Link}>
                        <button className="btn-login">
                           Đăng nhập
                           <span>
                              <i className="fa-solid fa-chevron-right"></i>
                           </span>
                        </button>
                     </Link>
                  )}
               </Nav>
            </Navbar.Collapse>
         </div>
      </Navbar>
   )
}

export default Navbars
