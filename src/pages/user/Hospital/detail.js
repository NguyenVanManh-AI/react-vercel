import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import "./hospital.css";
import { Container, Nav } from "reactstrap";
import { GrFormNext } from "react-icons/gr";
import { ReactComponent as Search } from "~/Assets/search.svg";
import { FaLocationDot, FaUserDoctor } from "react-icons/fa6";
import { RiServiceFill } from "react-icons/ri";
import { BiChevronDown  } from "react-icons/bi";
import http from "~/utils/http";
import config from "~/router/config";
import LoadingDot from "~/components/Loading/LoadingDot";
import FormBooking from "~/components/Form/form-booking";

const HospitalDetail = () => {
  const [loading, setLoading] = useState(false);
  const [insurances, setInsurance] = useState([])
  const [doctors, setDoctor] = useState([]);
  const [services, setService] = useState([]);
  const navigate = useNavigate();
  const [active, setActive] = useState("infor");
  const { id, tab } = useParams();

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

  useEffect(() => {
    setActive("infor");
    if(tab) {
      setActive(tab);
    }
    else {
      setActive("infor");
    }
    }, [tab]
  )

  useEffect(() => {
    const getDoctor = async () => {
      try {
        setLoading(true);
        const response = await http.get("/infor-hospital/doctors-home/" + id + "?sortname=true");
        setDoctor(response.data.data);
      } catch (error) {
        console.log("Lỗi kết nối đến API !", error);
      } finally {
        setLoading(false);
      }
    };
    getDoctor();
  }, [id,tab]);  

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
    const getHospital = async () => {
      try {
        setLoading(true);
        const response = await http.get("/infor-hospital/view-profile/" + id);
        setHospital(response.data.data);
      } catch (error) {
        if(error.response.data.status == 404 ) {
          navigate("/page-not-found");
        }
      } finally {
        setLoading(false);
      }
    };
    getHospital();
  }, [id, tab]);
  useEffect(() => {
    const getService = async () => {
      try {
        setLoading(true);
        const response = await http.get("/hospital-service/hospital/" + id);
        setService(response.data.data);
      } catch (error) {
        console.log("Lỗi kết nối đến API !", error);
      } finally {
        setLoading(false);
      }
    };
    getService();
  }, [active, tab]);

  useEffect(() => {
    const getInsurance = async () => {
       try {
          setLoading(true)
          const response = await http.get('/health-insurace-hospital/hospital/' + id)
          setInsurance(response.data.data)
       } catch (error) {
          console.log('Lỗi kết nối đến API !', error)
       } finally {
          setLoading(false)
       }
    }
    getInsurance()
 }, [id])

  const handleChildData = (data) => {
    // setUsers({ ...users, location: data })
  };

  const handleInfor = () => {
    setActive("infor");
  };
  const handleService = () => {
    setActive("service");
  };
  const handleDoctor = () => {
    setActive("doctor");
  };
  const handleInsurance = () => {
    setActive("insurance");
  };
  return (
    <>
      {loading && <LoadingDot />}
      <div className="header-hospital">
        <div className="breadcrumb">
          <Container className="d-flex">
            <div className="first-link">
              <Link>Đặt lịch với bác sĩ</Link>
            </div>
            <div className="between">
              <GrFormNext />
            </div>
            <div className="second-link">
              <Link>{hospital.name}</Link>
            </div>
          </Container>
        </div>
        <Container className="main-hospital">
          <div>
            <div className="banner">
              <div className="thumbnail-cover">
                <div className="thumbnail">
                  <div className="grid-layout">
                    <img
                      src={ hospital.avatar
                        ? config.URL + hospital.avatar
                        : "/image/default-hospital-search.jpg"}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="infor-hospital">
              <div className="logo-hospital">
                <img
                  src={
                    hospital.avatar
                      ? config.URL + hospital.avatar
                      : "/image/default-hospital-search.jpg"
                  }
                  alt=""
                />
              </div>
              <div className="name-hospital">
                <h2>{hospital.name}</h2>
                <p className="address">
                  <span className="icon-location mr-1">
                    <FaLocationDot />
                  </span>
                  {hospital.address}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className="non-space"></div>
      <div className="body-hospital">
        <Container>
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <div className="list-link">
                <Link
                  onClick={handleInfor}
                  to={"/hospital/" + id}
                  className={
                    active == "infor" ? "active link-item" : "link-item"
                  }
                >
                  Thông tin chung
                </Link>
                <Link
                  onClick={handleService}
                  to={"/hospital/" + id + "/service"}
                  className={
                    active == "service" ? "active link-item" : "link-item"
                  }
                >
                  Dịch vụ {"("+services.length+")"}
                </Link>
                <Link
                  onClick={handleDoctor}
                  to={"/hospital/" + id+"/doctor"}
                  className={
                    active == "doctor" ? "active link-item" : "link-item"
                  }
                >
                 Bác sĩ {"("+doctors.length+")"}
                </Link>
                <Link
                  onClick={handleInsurance}
                  to={"/hospital/" + id+"/insurance"}
                  className={
                    active == "insurance" ? "active link-item" : "link-item"
                  }
                >
                 Bảo hiểm {"("+insurances.length+")"}
                </Link>
              </div>
            </div>
            <Outlet />
          </div>
        </Container>
      </div>
    </>
  );
};

export default HospitalDetail;
