import { Container } from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import httpUser from '~/utils/httpUser'
import config from '~/router/config'
import ReactPaginate from 'react-paginate'
import { pushSearchKeyToUrl } from '~/helpers/utils'
function AllHospitalPage() {
   const location = useLocation()
   const [hospitals, setHospitals] = useState([
      {
         id_hospital: '',
         avatar: '',
         address: '',
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
   const fetchHospital = async () => {
      try {
         const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sort_search_number=${search.sort_search_number}`
         const response = await httpUser.get(
            'infor-hospital/all-hospital' + queryParams
         )
         setHospitals(response.data.data.data)
         setTotal(response.data.data.total)
      } catch (error) {
         console.error('Lấy timework thất bại', error)
      }
   }

   const handleNavigateHospital = (id) => {
      navigate('/hospital/' + id)
   }

   useEffect(() => {
      fetchHospital()
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
            <div className="mt_100 mb-3">
               <div className="main-section container mt_100">
                  <h2>Bệnh viện/Phòng khám cho bạn</h2>

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

export default AllHospitalPage
