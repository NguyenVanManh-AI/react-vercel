import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "./hospital.css";
import { Container, Nav } from "reactstrap";
import { GrFormNext } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import http from "~/utils/http";
import config from "~/router/config";
import LoadingDot from "~/components/Loading/LoadingDot";
import { Accordion } from "react-bootstrap";
import Map from "~/components/Map";
import FormBooking from "~/components/Form/form-booking";

const HospitalInsurance = () => {
   const [loading, setLoading] = useState(false)
   const [insurances, setInsurance] = useState([])
   const { id, tab } = useParams()
   const [keyword, setKeyword] = useState("");
   const formatMoney = (money) => {
      if (money) {
         return money.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
         })
      }
      return ''
   }

   const formatDayVN = (day) => {
      switch (day) {
         case 'monday':
            return 'Thứ Hai'
         case 'tuesday':
            return 'Thứ Ba'
         case 'wednesday':
            return 'Thứ Tư'
         case 'thursday':
            return 'Thứ Năm'
         case 'friday':
            return 'Thứ Sáu'
         case 'saturday':
            return 'Thứ Bảy'
         case 'sunday':
            return 'Chủ Nhật'
      }
   }
   const [hospital, setHospital] = useState({
      id: null,
      email: '',
      username: '',
      name: '',
      phone: '',
      address: '',
      avatar: null,
      is_accept: null,
      role: '',
      email_verified_at: '',
      created_at: '',
      updated_at: '',
      id_hospital: null,
      province_code: null,
      infrastructure: null,
      description: '',
      location: null,
      search_number: null,
      time_work: null,
      enable: null,
      departments: null,
   })

   useEffect(() => {
      const getHospital = async () => {
         try {
            setLoading(true)
            const response = await http.get(
               '/infor-hospital/view-profile/' + id
            )
            setHospital(response.data.data)
         } catch (error) {
            console.log('Lỗi kết nối đến API !', error)
         } finally {
            setLoading(false)
         }
      }
      getHospital()
   }, [id, tab])
   useEffect(() => {
      const getInsurance = async () => {
         try {
            setLoading(true)
            const response = await http.get('/health-insurace-hospital/hospital/' + id+ +'?search='+keyword)
            setInsurance(response.data.data)
         } catch (error) {
            console.log('Lỗi kết nối đến API !', error)
         } finally {
            setLoading(false)
         }
      }
      getInsurance()
   }, [id, keyword])

   const handleChangeInput = (e) => {
      const { name, value } = e.target
      console.log(value)
      setKeyword(value)
   }

    return (
      <>
        {loading && <LoadingDot />}
       <div className="col-lg-8 col-md-8">
       <div className="service infor-hospital">
        <div className="service-list list-service mt-4">
                  {insurances.map((insurance, index) => (
                           <div className="service-card">
                         <Accordion className="main-card">
                        <Accordion.Item className="card w-100 pt-1 pb-0" eventKey="0">
                           <Accordion.Header className="header">
                              {index + 1}. {insurance.name}
                              <span className="float-right see-detail">
                                 Xem chi tiết
                              </span>
                              <div className="infor-hospital">
                                 <span className="avatar-hospital">
                                 <img src={  hospital.avatar
                                    ? config.URL + hospital.avatar
                                    : "/image/avatar_admin_default.png"} />
                                 </span>
                                 <div className="detail-hospital">
                                 <p>{hospital.name}</p>
                                 <div className="address-hospital">
                                    <div className="address">
                                       <p>
                                       {hospital.address}
                                       </p>
                                    </div>
                                 </div>
                                          </div>
                                       </div>
                           </Accordion.Header>
                           <Accordion.Body>
                              <div className="service-body">
                                 <p className="service-name">{insurance.name}</p>
                                 <p
                                    className="px-4"
                                    dangerouslySetInnerHTML={{
                                       __html: insurance.description,
                                    }}
                                 ></p>
                              </div>
                           </Accordion.Body>
                        </Accordion.Item>
                     </Accordion>
                     </div>
                  ))}
               </div>
        </div>
        </div>
        <div className="col-md-4 col-lg-4">
              <FormBooking id={id}/>
        </div>
      </>
    )
}
export default HospitalInsurance;