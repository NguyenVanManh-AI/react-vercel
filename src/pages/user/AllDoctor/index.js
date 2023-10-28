import { Container } from 'reactstrap'

import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import httpUser from '~/utils/httpUser'
import config from '~/router/config'
import ReactPaginate from 'react-paginate'
import { pushSearchKeyToUrl } from '~/helpers/utils'
function AllDoctorPage() {
   const location = useLocation()
   const [doctors, setDoctors] = useState([
      {
         id_hospital: '',
         name_doctor: '',
         name_department: '',
         avatar: '',
         name_hospital: '',
      },
   ])

   const navigate = useNavigate()
   const [search, setSearch] = useState({
      search: '',
      paginate: 12,
      page: 1,
      sort_search_number: true,
   })
   const parseSearchParams = () => {
      const searchParams = new URLSearchParams(location.search)

      if (searchParams.get('paginate') === null) {
         return search
      }

      return {
         search: searchParams.get('search') || search.search,
         paginate: parseInt(searchParams.get('paginate')) || search.paginate,
         page: parseInt(searchParams.get('page')) || search.page,
         sort_search_number: searchParams.get('sort_search_number') === 'true',
      }
   }
   useEffect(() => {
      setSearch(parseSearchParams())
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [location.search])
   const [total, setTotal] = useState(0)
   const pageCount = Math.ceil(total / 12)
   const updateSearchParams = (newSearchParams) => {
      setSearch((prevSearch) => ({
         ...prevSearch,
         ...newSearchParams,
      }))
   }
   const handleChangeInput = (e) => {
      const newSearchValue = e.target.value
      updateSearchParams({ search: newSearchValue, page: 1 })
   }
   const handlePageClick = (event) => {
      const selectedPage = event.selected + 1
      updateSearchParams({ page: selectedPage })
   }

   const fetchDoctor = async () => {
      try {
         const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sort_search_number=${search.sort_search_number}`
         const response = await httpUser.get(
            'infor-hospital/all-doctor-care' + queryParams
         )
         setDoctors(response.data.data.data)
         setTotal(response.data.data.total)
      } catch (error) {
         console.error('Lấy timework thất bại', error)
      }
   }

   const handleNavigateDoctor = (id) => {
      navigate('/hospital/' + id + '/doctor')
   }
   useEffect(() => {
      fetchDoctor()
      pushSearchKeyToUrl(search, location)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [search, location])
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
               <div className="all-search-box">
                  <div className="row">
                     <div className="col-4">
                        <select className="form-control">
                           <option>Chọn tỉnh thành</option>
                           <option>Some thing</option>
                        </select>
                     </div>
                     <div className="col-8">
                        <input
                           defaultValue={search.search}
                           onChange={handleChangeInput}
                           className="form-control"
                           placeholder="Tìm kiếm theo tên..."
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt_100 mb-5">
               <div className="main-section container mt-3">
                  <h2>Bác sĩ </h2>

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
                                 handleNavigateDoctor(doctor.id_hospital)
                              }
                              className="book-appointment-button mt-1"
                           >
                              Xem chi tiết
                           </button>
                        </div>
                     ))}
                  </div>
                  <div className={'paginate_department'}>
                     <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={4}
                        pageCount={pageCount}
                        previousLabel="< Previous"
                        renderOnZeroPageCount={null}
                        forcePage={search.page - 1}
                     />
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default AllDoctorPage
