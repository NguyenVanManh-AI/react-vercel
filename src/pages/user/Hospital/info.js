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
import Map from "~/components/Map"
import FormBooking from "~/components/Form/form-booking";

const HospitalInformation = () => {
   const [loading, setLoading] = useState(false)
   const [infrastructures, setInfrastructure] = useState([])
   const [departments, setDepartment] = useState([])
   const [services, setService] = useState([])
   const { id, tab } = useParams()
   const [timeWork, setTimeWork] = useState({
      friday: {
         night: {
            time: [],
            enable: null,
         },
         enable: null,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      monday: {
         night: {
            time: [],
            enable: null,
         },
         enable: null,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      sunday: {
         night: {
            time: [],
            enable: null,
         },
         enable: null,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      tuesday: {
         night: {
            time: [],
            enable: null,
         },
         enable: null,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      saturday: {
         night: {
            time: [],
            enable: null,
         },
         enable: null,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      thursday: {
         night: {
            time: [],
            enable: null,
         },
         enable: null,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
      wednesday: {
         night: {
            time: [],
            enable: null,
         },
         enable: null,
         morning: {
            time: [],
            enable: true,
         },
         afternoon: {
            time: [],
            enable: true,
         },
      },
   })

   const dayOfWeek = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
   ]

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
            setInfrastructure(response.data.data.infrastructure)
            setDepartment(response.data.data.departments)
            setTimeWork(response.data.data.time_work.times)
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
            const response = await http.get('/hospital-service/hospital/' + id)
            setService(response.data.data)
         } catch (error) {
            console.log('Lỗi kết nối đến API !', error)
         } finally {
            setLoading(false)
         }
      }
      getService()
   }, [id])
   const handleChildData = (data) => {
      // setUsers({ ...users, location: data })
    };
    return (
      <>
       <div className="col-lg-8 col-md-8">
            <div className="infor-hospital">
              <div className="timesheet">
                <div className="week-working-time d-flex ">
                  <h2>Giờ làm việc:</h2>
               </div>
               <div className="week-working-time">
                  {dayOfWeek.map((day) => (
                     <div className="working-time">
                        <p className="day">{formatDayVN(day)}</p>
                        <p className="time">
                           {timeWork[day].enable == true
                              ? (timeWork[day].morning.enable == true
                                   ? timeWork[day].morning.time[0] +
                                     '-' +
                                     timeWork[day].morning.time[1]
                                   : 'Đóng cửa') +
                                ', ' +
                                (timeWork[day].afternoon.enable == true
                                   ? timeWork[day].afternoon.time[0] +
                                     '-' +
                                     timeWork[day].afternoon.time[1]
                                   : 'Đóng cửa') +
                                ', ' +
                                (timeWork[day].night.enable == true
                                   ? timeWork[day].night.time[0] +
                                     '-' +
                                     timeWork[day].night.time[1]
                                   : 'Đóng cửa')
                              : 'Đóng cửa'}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
            <div className="description">
               <h2 className="border-heading">Thông tin bệnh viện</h2>
               <p className="hospital-see-more">{hospital.description}</p>
               <div className="list-specialties">
                  <h2 className="border-heading">Chuyên khoa</h2>
                  <ol>
                     {departments.map((department) => (
                        <li>{department}</li>
                     ))}
                  </ol>
               </div>
               <div className="list-specialties">
                  <h2 className="border-heading">Cơ sở vật chất</h2>
                  <ol>
                     {infrastructures.map((infrastructure) => (
                        <li>{infrastructure}</li>
                     ))}
                  </ol>
               </div>
               <div className="list-service">
                  <h2 className="border-heading mb-3">Danh mục dịch vụ</h2>
                  {services.map((services, index) => (
                     <Accordion>
                        <Accordion.Item className="card" eventKey="0">
                           <Accordion.Header className="header">
                              {index + 1}. {services.name}
                              <span className="float-right see-detail">
                                 Xem chi tiết
                              </span>
                           </Accordion.Header>
                           <Accordion.Body>
                              <div className="service-body">
                                 <p className="service-name">{services.name}</p>
                                 <p
                                    className="service-description"
                                    dangerouslySetInnerHTML={{
                                       __html: services.infor.about_service,
                                    }}
                                 ></p>
                                 <div className="service-fee">
                                    <p className="fee-icon">
                                       <RiMoneyDollarCircleFill />
                                    </p>
                                    <p className="fee-desc">
                                       Phí tư vấn trong khoảng
                                    </p>
                                    <p className="fee">
                                       {formatMoney(
                                          services.price_hospital_service
                                       )}
                                    </p>
                                 </div>
                              </div>
                           </Accordion.Body>
                        </Accordion.Item>
                     </Accordion>
                  ))}
               </div>
               <div className="location">
                  <h2 className="border-heading mb-3">Vị trí</h2>
                  <div className="map-section">
                     <Map onChildData={handleChildData}></Map>
                  </div>
               </div>
               <div className="instruction">
                  <h2 className="border-heading mb-3">Hướng dẫn khám bệnh</h2>
                  <p>
                     • Khi tiến hành đặt lịch khám, quý bệnh nhân sẽ nhận được
                     email xác nhận đặt lịch từ Hello Bacsi. Trong quá trình lấy
                     số và đăng ký thông tin khám bệnh, có thể đưa email này cho
                     đội ngũ lễ tân/nhân viên y tế.
                  </p>
                  <p>• Quy trình thăm khám tại bệnh viện:</p>
                  <ul>
                     <li>
                        <b>Bước 1:</b> Quý khách đến trực tiếp quầy tiếp đón ấn
                        nút màu xanh có chữ “Tiếp nhận” để đăng ký khám bệnh.
                        Trường hợp khám theo BHYT, quý khách nhấn nút màu cam có
                        chữ “Bảo hiểm”.
                     </li>
                     <li>
                        <b>Bước 2:</b> Lấy số thứ tự và ngồi chờ tới lượt khám.
                     </li>
                     <li>
                        <b>Bước 3:</b> Khám lâm sàng và thực hiện một số kiểm
                        tra theo chỉ định của bác sĩ (nếu có).
                     </li>
                     <li>
                        <b>Bước 4:</b> Đến quầy nhận thuốc và thanh toán chi
                        phí.
                     </li>
                  </ul>
                  <p>
                     <b>Lưu ý: </b>
                     <span className="text-danger">
                        Các bước khám chữa bệnh có thể thay đổi tùy thuộc vào
                        yêu cầu từ phía bác sĩ đối với từng trường hợp bệnh khác
                        nhau.
                     </span>
                  </p>
               </div>
            </div>
        </div>
        </div>
        <div className="col-md-4 col-lg-4">
              <FormBooking id={id}/>
        </div>
      </>
    )
}
export default HospitalInformation
