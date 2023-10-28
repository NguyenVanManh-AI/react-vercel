import { Container } from 'reactstrap'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import httpUser from '~/utils/httpUser'
import ReactPaginate from 'react-paginate'
import config from '~/router/config'
import { pushSearchKeyToUrl } from '~/helpers/utils'
function AllServicePage() {
   const location = useLocation()
   const [services, setServices] = useState([
      {
         name: '',
         price: '',
         name_hospital: '',
      },
   ])

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
   const fetchService = async () => {
      try {
         const queryParams = `?search=${search.search}&page=${search.page}&paginate=${search.paginate}&sort_search_number=${search.sort_search_number}`
         const response = await httpUser.get(
            'hospital-service/all' + queryParams
         )
         setServices(response.data.data.data)
         setTotal(response.data.data.total)
      } catch (error) {
         console.error('Lấy timework thất bại', error)
      }
   }

   useEffect(() => {
      fetchService()
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

            <div className="all-bg-zig mb-3 mt_100">
               <div className="main-section container mt-3">
                  <h2>Dịch vụ dành cho bạn</h2>

                  <div className="all-hospital-list">
                     {services.map((service, index) => (
                        <div key={index} className="all-service-card">
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
                              <div className="p-1">
                                 <i className="ti-location-pin"></i> Giá dịch
                                 vụ&nbsp;
                                 <span className="srv_price">
                                    {service.price}
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

export default AllServicePage
