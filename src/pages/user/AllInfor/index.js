import { Container } from 'reactstrap'
import './AllHospital.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import httpUser from '~/utils/httpUser'
import config from '~/router/config'

function AllInforPage() {
   const [hospitals, setHospitals] = useState([
      {
         id_hospital: '',
         avatar: '',
         address: '',
      },
   ])
   const [doctors, setDoctors] = useState([
      {
         name_doctor: '',
         name_department: '',
         avatar: '',
         name_hospital: '',
      },
   ])
   const [services, setServices] = useState([
      {
         name: '',
         price: '',
         name_hospital: '',
      },
   ])
   const navigate = useNavigate()
   const search = {
      search: '',
      paginate: 8,
      page: 1,
      sort_search_number: true,
   }
   
   const formatMoney = (money) => {
      if (money) {
         return money.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
         })
      }
      return ''
   }

   const fetchHospital = async () => {
      try {
         const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sort_search_number=${search.sort_search_number}`
         const response = await httpUser.get(
            'infor-hospital/all-hospital' + queryParams
         )
         setHospitals(response.data.data.data)
      } catch (error) {
         console.error('Lấy timework thất bại', error)
      }
   }
   const fetchService = async () => {
      try {
         const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sort_search_number=${search.sort_search_number}`
         const response = await httpUser.get(
            'hospital-service/all' + queryParams
         )
         setServices(response.data.data.data)
      } catch (error) {
         console.error('Lấy timework thất bại', error)
      }
   }
   const fetchDoctor = async () => {
      try {
         const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sort_search_number=${search.sort_search_number}`
         const response = await httpUser.get(
            'infor-hospital/all-doctor-care' + queryParams
         )
         setDoctors(response.data.data.data)
      } catch (error) {
         console.error('Lấy timework thất bại', error)
      }
   }

   const handleNavigateHospital = (id) => {
      navigate('/hospital/' + id)
   }
   const handleNavigateDoctor = (id) => {
      navigate('/hospital/' + id + '/doctor')
   }
   useEffect(() => {
      fetchHospital()
      fetchDoctor()
      fetchService()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   return (
      <>
         <div className="home">
            <div className="w-100 banner">
               <Container>
                  <div className="row">
                     <div className="col-lg-6 col-md-6 banner-left">
                        <h3>
                           Bệnh viện - Bác sĩ - Dịch vụ y tế: Đặt hẹn khám ngay
                        </h3>
                        <p>
                           Trải nghiệm tính năng đặt khám trực tuyến tại các
                           Bệnh viện, Phòng khám, Bác sĩ chuyên khoa và Dịch vụ
                           y tế uy tín hoàn toàn miễn phí với Elister Health
                           Care ngay hôm nay!
                        </p>
                     </div>
                     <div className="col-lg-6 col-md-6 banner-right">
                        <span>
                           <img
                              alt="background"
                              src={require('~/Assets/Doctor-Care.webp')}
                           />
                        </span>
                     </div>
                  </div>
               </Container>
               {/* <div className="all-search-box">
                  <div className="row">
                     <div className="col-4">
                        <select className="form-control">
                           <option>Chọn tỉnh thành</option>
                           <option>Some thing</option>
                        </select>
                     </div>
                     <div className="col-8">
                        <input
                           className="form-control"
                           placeholder="Tìm kiếm theo tên..."
                        />
                     </div>
                  </div>
               </div> */}
            </div>
            <div className="mb-3 mt-5">
               <div className="main-section container">
                  <h2>Bệnh viện/Phòng khám cho bạn</h2>
                  <div className="float-right">
                     <Link to="/all-hospital">
                        Xem tất cả <i className="ti-angle-double-right" />
                     </Link>
                  </div>
                  <div className="all-hospital-list">
                     {hospitals.map((hospital, index) => (
                        <div key={index} className="all-hospital-card">
                           <img
                              className="all-hospital-avatar"
                              src={
                                 hospital.avatar
                                    ? config.URL + hospital.avatar
                                    : '/image/default-hospital-search.jpg'
                              }
                              alt="Hospital 1"
                           />
                           <h5>{hospital.name}</h5>
                           <div>
                              <i className="ti-location-pin"></i>{' '}
                              {hospital.address}
                           </div>
                           <button
                              onClick={() =>
                                 handleNavigateHospital(
                                    hospital.id_hospital
                                       ? hospital.id_hospital
                                       : 1
                                 )
                              }
                              className="book-appointment-button"
                           >
                              Đặt lịch bệnh viện
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="all-bg-zig ">
               <div className="main-section container mt-3">
                  <h2>Dịch vụ dành cho bạn</h2>
                  <div className="float-right">
                     <Link to="/all-service">
                        Xem tất cả <i className="ti-angle-double-right" />
                     </Link>
                  </div>
                  <div className="all-hospital-list">
                     {services.map((service, index) => (
                        <div key={index} className="all-service-card shadow">
                           <img
                              className="all-service-avatar"
                              src={
                                 service.thumbnail_department
                                    ? config.URL + service.thumbnail_department
                                    : '/image/service_default.png'
                              }
                              alt="Hospital 1"
                           />
                           <div className="px-1 mt-2">
                              <Link
                                 to={
                                    '/hospital/' +
                                    service.id_hospital +
                                    '/service'
                                 }
                                 className="tt_service"
                              >
                                 {service.name}
                              </Link>
                              <div className="p-1 d-block">
                                 <i className="ti-location-pin"></i> Giá dịch
                                 vụ&nbsp; 
                                 <br/>
                                 <span className="srv_price text-success">
                                    {formatMoney(service.price)}
                                 </span>
                              </div>
                              <div className="p-1">
                                 <i className="ti-support"></i>&nbsp;{' '}
                                 {service.name_hospital
                                    ? service.name_hospital
                                    : ''}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="mt-3 mb-5">
               <div className="main-section container mt-3">
                  <h2>Bác sĩ </h2>
                  <div className="float-right">
                     <Link to="/all-doctor">
                        Xem tất cả <i className="ti-angle-double-right" />
                     </Link>
                  </div>
                  <div className="all-hospital-list">
                     {doctors.map((doctor, index) => (
                        <div key={index} className="all-service-card">
                           <img
                              className="all-service-avatar"
                              src={
                                 doctor.avatar
                                    ? config.URL + doctor.avatar
                                    : '/image/avata-default-doctor.jpg'
                              }
                              alt="Hospital 1"
                           />
                           <div className="px-2 mt-2">
                              <h5>{doctor.name_doctor}</h5>
                              <div>
                                 <i className="ti-user"></i>&nbsp;{' '}
                                 {doctor.name_department}
                              </div>
                              <div>
                                 <i className="ti-support"></i>&nbsp;{' '}
                                 {doctor.name_hospital
                                    ? doctor.name_hospital
                                    : 'Bệnh viện rất rất tốt'}
                              </div>
                           </div>
                           <button
                              onClick={() =>
                                 handleNavigateDoctor(
                                    doctor.id_hospital ? doctor.id_hospital : 1
                                 )
                              }
                              className="book-appointment-button mt-1"
                           >
                              Xem chi tiết
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default AllInforPage
