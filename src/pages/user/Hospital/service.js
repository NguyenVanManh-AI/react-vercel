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
import { GiConsoleController } from "react-icons/gi";
import FormBooking from "~/components/Form/form-booking";
import { changeBooking } from '~/redux/bookingSlice';
import { useDispatch, useSelector } from 'react-redux';

const HospitalService = () => {
   const [services, setService] = useState([])
   const [keyword, setKeyword] = useState('')
   const [id_service, setIdService] = useState(null);
   const [name_service, setNameService] = useState(null);
   const { id, tab } = useParams()
   const [loading, setLoading] = useState(false)
   const isDoctorChanged = useSelector((state) => state.booking.keyBookingUpdated)
   const dispatch = useDispatch();
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
      const getService = async () => {
         try {
            setLoading(true)
            const response = await http.get(
               '/hospital-service/hospital/' + id + '?search=' + keyword
            )
            setService(response.data.data)
         } catch (error) {
            console.log('Lỗi kết nối đến API !', error)
         } finally {
            setLoading(false)
         }
      }
      getService()
   }, [id, tab, keyword])
   const formatMoney = (money) => {
      if (money) {
         return money.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
         })
      }
      return ''
   }

   const handleChangeInput = (e) => {
      const { name, value } = e.target
      console.log(value)
      setKeyword(value)
   }

   const handleBooking = (id_service, name_service) => {
    setIdService(id_service);
    setNameService(name_service);
    dispatch(changeBooking());
  }
   
  return (
    <>
      {loading && <LoadingDot />}
      <div className="col-lg-8 col-md-8">
      <div className="service">
        <div className="search">
          <div className="input-service">
            <input
              type="text"
              placeholder="Tìm dịch vụ"
              className="form-control"
              onKeyUp={handleChangeInput}
            />
          </div>
        </div>
        <div className="service-list mt-4">
          {services.map((service) => (
            <div className="service-card">
              <div className="main-card">
                <div className="content">
                  <div className="service-info">
                    <Link>
                      <h6>{service.name}</h6>
                    </Link>
                    <div className="price">
                      <RiMoneyDollarCircleFill />
                      <p className="number">{formatMoney(service.price_hospital_service)} (Giá dịch vụ)</p>
                    </div>
                  </div>
                </div>
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
                           <button onClick={() => handleBooking(service.id_hospital_service, service.name)} className="btn btn-primary btn-book">
                              Đặt lịch hẹn
                           </button>
                        </div>
                     </div>

                  </div>
               ))}
            </div>
        </div>
      </div>
        <div className="col-md-4 col-lg-4">
              <FormBooking
               id={id} 
               id_service_selected={id_service}
               name_service_selected={name_service}
               tab_booking_select = {tab}
              />
        </div>
    </>
  );
};
export default HospitalService;
