import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./article.css";
import "~/pages/user/Hospital/hospital.css";
import { Container } from "reactstrap";
import LoadingDot from "~/components/Loading/LoadingDot";
import { GrFormNext } from "react-icons/gr";
import http from "~/utils/httpUser";
import config from "~/router/config";
import { AiFillEye } from "react-icons/ai";
import FormBooking from "~/components/Form/form-booking";
const ServiceDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [articles, setArticles] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [id_hospital, setIdHospital] = useState(null);
  const [service, setService] = useState({
    id: null,
    id_hospital_department: null,
    name: "",
    time_advise: null,
    price: null,
    infor: {
      location: [],
      about_service: "",
      prepare_process: "",
      service_details: "",
    },
    created_at: null,
    updated_at: "",
    id_department: null,
    id_hospital: null,
    id_hospital_service: null,
    id_hospital_departments: null,
    time_advise_hospital_service: null,
    time_advise_hospital_departments: null,
    price_hospital_service: null,
    price_hospital_departments: null,
    name_hospital: "",
    name_department: "",
    thumbnail_department: "",
  });

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
  });

  const dayOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const formatMoney = (money) => {
    if (money) {
      return money.toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
    }
    return "";
  };

  const formatDayVN = (day) => {
    switch (day) {
      case "monday":
        return "Thứ Hai";
      case "tuesday":
        return "Thứ Ba";
      case "wednesday":
        return "Thứ Tư";
      case "thursday":
        return "Thứ Năm";
      case "friday":
        return "Thứ Sáu";
      case "saturday":
        return "Thứ Bảy";
      case "sunday":
        return "Chủ Nhật";
    }
  };
  const [hospital, setHospital] = useState({
    id: null,
    email: "",
    username: "",
    name: "",
    phone: "",
    address: "",
    avatar: null,
    is_accept: null,
    role: "",
    email_verified_at: "",
    created_at: "",
    updated_at: "",
    id_hospital: null,
    province_code: null,
    infrastructure: null,
    description: "",
    location: null,
    search_number: null,
    time_work: null,
    enable: null,
    departments: null,
  });

  useEffect(() => {
    const getService = async () => {
      try {
        setLoading(true);
        const response = await http.get("/hospital-service/detail/" + id);
        console.log(response.data.data.name)
        setService(response.data.data);
        setIdHospital(response.data.data.id_hospital);
      } catch (error) {
        if(error.response.data.status == 404 ) {
            navigate("/page-not-found");
        }
      } finally {
        setLoading(false);
      }
    };
    getService();
  }, [id]);

  useEffect(() => {
    const getHospital = async () => {
      try {
        setLoading(true);
        const response = await http.get(
          "/infor-hospital/view-profile/" + id_hospital
        );
        setHospital(response.data.data);
        setTimeWork(response.data.data.time_work.times);
        const lon = response.data.data.location[0];
        const lat = response.data.data.location[1];
       
      } catch (error) {
        console.log("Lỗi kết nối đến API !", error);
      } finally {
        setLoading(false);
      }
    };
    getHospital();
  }, [id_hospital]);

  useEffect(() => {
    const getHospitals = async () => {
      try {
        const queryParams = `?page=1&paginate=5&sort_search_number=true`;
        const response = await http.get(
          "infor-hospital/all-hospital" + queryParams
        );
        setHospitals(response.data.data.data);
      } catch (error) {
        console.log("Lỗi kết nối đến API !", error);
      }
    };
    getHospitals();
  }, []);

  useEffect(() => {
    const getListArticle = async () => {
      try {
        const response = await http.get(
          "/article?&page=1&paginate=7&sort_search_number=true"
        );
        setArticles(response.data.data.data);
      } catch (error) {
        console.log("Lỗi kết nối đến API !", error);
      } finally {
        setLoading(false);
      }
    };
    getListArticle();
  }, []);
  return (
    <>
      {loading && <LoadingDot />}
      <div className="header-hospital">
        <div className="breadcrumb">
          <Container className="d-flex">
            <div className="first-link">
              <Link>Tìm kiếm</Link>
            </div>
            <div className="between">
              <GrFormNext />
            </div>
            <div className="second-link">
              <Link>{service.name}</Link>
            </div>
          </Container>
        </div>
      </div>
      <Container className="main-article mt-5">
        <div className="row w-100">
          <div className="col-md-8 col-lg-8">
            <div className="header-article">
              <div className="category">
                <button className="btn-category">
                  <div className="content">
                    <span className="image">
                      <img src={config.URL + hospital.avatar} />
                    </span>
                    <span className="name">{hospital.name}</span>
                  </div>
                </button>
              </div>
              <div className="name-article">
                <h1>{service.name}</h1>
                <h5>Giá dịch vụ: <span className="text-success">
                {formatMoney(service.price_hospital_service)}
                </span>
                </h5>
              </div>
              <div className="content-article">
                <h2>Về dịch vụ</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: service.infor.about_service,
                  }}
                />
              </div>
              <hr className="mt-5" />
              <div className="content-article">
                <h2>Quá trình chuẩn bị</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: service.infor.prepare_process,
                  }}
                />
              </div>
              <hr className="mt-5" />
              <div className="content-article">
                <h2>Chi tiết dịch vụ</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: service.infor.service_details,
                  }}
                />
              </div>
              <hr className="mt-5" />
              <div className="content-article body-hospital">
                <h2>Chi tiết bệnh viện</h2>
                <h3>{service.name_hospital}</h3>
                <p className="mb-1">
                  <b>Địa điểm:</b> {hospital.address}
                </p>
                <p className="mb-0">
                  <b>Chuyên khoa:</b> {service.name_department}
                </p>
                <div className="infor-hospital w-100">
                  <div className="timesheet w-100">
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
                                    "-" +
                                    timeWork[day].morning.time[1]
                                  : "Đóng cửa") +
                                ", " +
                                (timeWork[day].afternoon.enable == true
                                  ? timeWork[day].afternoon.time[0] +
                                    "-" +
                                    timeWork[day].afternoon.time[1]
                                  : "Đóng cửa") +
                                ", " +
                                (timeWork[day].night.enable == true
                                  ? timeWork[day].night.time[0] +
                                    "-" +
                                    timeWork[day].night.time[1]
                                  : "Đóng cửa")
                              : "Đóng cửa"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-lg-4 pr-0">
            <div className="right-component w-100">
              <FormBooking
                id={service.id_hospital}
                tab_booking_select={"service"}
              />
              <div className="list-article">
                <div className="list-title">
                  <h3 className="">Các bài viết nổi bật</h3>
                </div>
                <div className="list">
                  {articles.map((item, index) => {
                    return (
                      <div key={index} className="list-item">
                        <div className="thumbnail">
                          <img src={config.URL + item.thumbnail_article} />
                        </div>
                        <div className="item-infor">
                          <div className="name-article">
                            <p>{item.title}</p>
                          </div>
                          <div className="name-category">
                            <p>{item.name_category}</p>
                          </div>
                          <p className="view-more">
                            <Link to={"/article/" + item.id_article}>
                              Xem ngay
                            </Link>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <hr />
              </div>
              <div className="list-article">
                <div className="list-title">
                  <h3 className="">Bệnh viện nổi bật</h3>
                </div>
                <div className="list">
                  {hospitals.map((hospital, index) => {
                    return (
                      <div key={index} className="list-item">
                        <div className="thumbnail">
                          <img
                            src={
                              hospital.avatar
                                ? config.URL + hospital.avatar
                                : "/image/default-hospital-search.jpg"
                            }
                          />
                        </div>
                        <div className="item-infor">
                          <div className="name-article">
                            <p>{hospital.name}</p>
                          </div>
                          <div className="name-category">
                            <p>{hospital.address}</p>
                          </div>
                          <p className="view-more">
                            <Link to={"/hospital/" + hospital.id_hospital}>
                              Đặt lịch khám
                            </Link>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ServiceDetail;
