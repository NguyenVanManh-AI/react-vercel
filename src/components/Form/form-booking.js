import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "~/pages/user/Hospital/hospital.css";
import { GrFormNext } from "react-icons/gr";
import { ReactComponent as Search } from "~/Assets/search.svg";
import { FaLocationDot, FaUserDoctor } from "react-icons/fa6";
import { RiMoneyDollarCircleFill, RiServiceFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";
import http from "~/utils/httpUser";
import config from "~/router/config";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import LoadingDot from "~/components/Loading/LoadingDot";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const FormBooking = ({ id = null, 
  id_department_selected = null, name_department_selected =null, 
  id_doctor_selected=null, name_doctor_selected=null,
  id_service_selected=null, name_service_selected=null, tab_booking_select = null}) => {
  const [id_department, setIdDepartment] = useState(id_department_selected);
  const [id_doctor, setIdDoctor] = useState(id_doctor_selected);
  const [id_service, setIdService] = useState(id_service_selected);
  const [tab_booking, setTabBooking] = useState("doctor");
  const [default_day, setDefaultDay] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [day_selected, setDay] = useState(null);
  const [day_off, setDayOff] = useState(true);
  const inputRef = useRef(null);
  const [morning_times, setMorning] = useState({
    time: "",
    enable: null,
    divided_times:[],
  });
  const [afternoon_times, setAfternoon] = useState({
    time: "",
    enable: null,
    divided_times:[],
  });
  const [night_times, setNight] = useState({
    time: "",
    enable: null,
    divided_times:[],
  });

    const [morning_service_times, setMorningService] = useState({
    time: "",
    enable: null,
    divided_times:[],
  });
  const [afternoon_service_times, setAfternoonService] = useState({
    time: "",
    enable: null,
    divided_times:[],
  });
  const [night_service_times, setNightService] = useState({
    time: "",
    enable: null,
    divided_times:[],
  });
  const [active, setIdActive] = useState("");

  
  // set Default Day and set Min for input date
  useEffect(() => {
    var today = new Date();
    var dd = today.getDate() + 1; //get day after today
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    var tomorrow = yyyy + "-" + mm + "-" + dd;
    if(default_day === null) {
      setDefaultDay(tomorrow);
      setTimeBooking({
        ...time_booking,
        date: ""+tomorrow+"",
     })
     setTimeServiceBooking({
      ...time_booking_service,
      date: ""+tomorrow+"",
    })
    }
    document.getElementById("datefield").setAttribute("min", tomorrow);
  }, [default_day]);

  const getTomorrow = () => {
    var today = new Date();
    var dd = today.getDate() + 1; //get day after today
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    var tomorrow = yyyy + "-" + mm + "-" + dd;
    return tomorrow;
  }

  const [time_booking, setTimeBooking] = useState({
    date: "",
    interval: []
  })

  const [time_booking_service, setTimeServiceBooking] = useState({
    date: "",
    interval: []
  })

  const [book_advise, setBookiAdvise] = useState({
    id_doctor : null,
    time : {}
  });
  const [book_advise_service, setBookiAdviseService] = useState({
    id_hospital_service : null,
    time : {}
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
  const [time_advise, setTimeAdvise] = useState({
    friday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    monday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    tuesday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    saturday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    thursday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    wednesday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    sunday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
  });

  const [time_service, setTimeService] = useState({
    friday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    monday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    tuesday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    saturday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    thursday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    wednesday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
    sunday: {
      night: {
        time: [],
        enable: null,
        divided_times: [],
      },
      enable: null,
      morning: {
        time: [null],
        enable: null,
        divided_times: [],
      },
      afternoon: {
        time: [],
        enable: null,
        divided_times: [],
      },
      date: "",
      space: null,
    },
  });

  const toastOptions = {
		position: "top-right",
		autoClose: 4000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	};
  const [loading, setLoading] = useState(false);
  const [doctorEnable, setDoctorEnable] = useState(false);
  const [departerments, setDepartment] = useState([]);
  const [doctors, setManyDoctors] = useState([]);
  const [name_department, setNameDepartment] = useState(name_department_selected);
  const [name_doctor, setNameDoctor] = useState(name_doctor_selected);
  const [name_service, setNameService] = useState(name_service_selected);
  const [show, setShow] = useState(false);
  const [services, setService] = useState([]);
  const [show_doctors, setShowDoctor] = useState(false);
  const [show_service, setShowService] = useState(false);
  const isBookingChanged = useSelector((state) => state.booking.keyBookingUpdated)
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
    if(name_department_selected && id_department_selected && id_doctor_selected && name_doctor_selected) {
      setNameDepartment(name_department_selected);
      setIdDepartment(id_department_selected);
      setDoctorEnable(true);
      setNameDoctor("");
      setTimeBooking({
          ...time_booking,
          date: ""+getTomorrow()+"",
      })
      setIdDoctor(null);
      setShow(false);
      setNameDoctor(name_doctor_selected);
      setIdDoctor(id_doctor_selected);
      setBookiAdvise({
        ...book_advise,
        id_doctor: id_doctor_selected,
     })
      setDoctorEnable(true);
      setShowDoctor(false);
      name_department_selected = null;
      id_department_selected = null; 
      id_doctor_selected = null; 
      name_doctor_selected = null;
      id_service_selected = null;
      name_service_selected = null;
    }
 }, [isBookingChanged])

 useEffect(() => {
  if(name_service_selected && id_service_selected) {
    setTimeServiceBooking({
      ...time_booking_service,
      date: ""+getTomorrow()+"",
    })
    setNameService(name_service_selected);
    setIdService(id_service_selected);
    setBookiAdviseService({
      ...book_advise_service,
      id_hospital_service: id_service_selected,
   })
    setShowService(false);
    name_department_selected = null;
    id_department_selected = null; 
    id_doctor_selected = null; 
    name_doctor_selected = null;
    id_service_selected = null;
    name_service_selected = null;
   
  }
}, [isBookingChanged])


  useEffect(() => {
    const getHospital = async () => {
      try {
        setLoading(true);
        const response = await http.get("/infor-hospital/view-profile/" + id);
        setHospital(response.data.data);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
    getHospital();
  }, [id, id_doctor, time_advise, day_off, time_service, id_service]);

  useEffect(() => {
    if (id) {
      const getDepartment = async () => {
        try {
          setLoading(true);
          const response = await http.get(
            "/hospital-department/hospital/" + id
          );
          setDepartment(response.data.data);
        } catch (error) {

        } finally {
          setLoading(false);
        }
      };

      getDepartment();
    }
  }, [id, id_doctor, time_advise]);

   useEffect(() => {
    if (id) {
      const getService = async () => {
        try {
          setLoading(true);
          const response = await http.get(
            "/hospital-service/hospital/" + id
          );
          setService(response.data.data);
        } catch (error) {

        } finally {
          setLoading(false);
        }
      };

      getService();
    }
  }, [id, id_service]);

  const handleSetInputDepartment = (name, id) => {
    setNameDepartment(name);
    setIdDepartment(id);
    getDoctor(id);
    setDoctorEnable(true);
    setNameDoctor("");
    setIdDoctor(null);
    setShow(false);
  };

  const formatMoney = (money) => {
    if (money) {
       return money.toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND',
       })
    }
    return ''
 }

  const handleSetInputDoctor = (name, id) => {
    setNameDoctor(name);
    setIdDoctor(id);
    setBookiAdvise({
      ...book_advise,
      id_doctor: id,
   })
    setDoctorEnable(true);
    setShowDoctor(false);
  };
  const handleSetInputService = (name,id) => {
    setNameService(name);
    setIdService(id);
    setBookiAdviseService({
      ...book_advise_service,
      id_hospital_service: id,
   })
    // setSeriveEnable(true);
    setShowService(false);

  }
  const getDoctor = async (id_department) => {
    if (id && id_department) {
      try {
        setLoading(true);
        const response = await http.get(
          "infor-doctor/book-doctor/" + id + "/" + id_department
        );
        setManyDoctors(response.data.data);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const getTimeWork = async () => {
      try {
        const response = await http.get("/time-work/advise/" + id_doctor);
        setTimeAdvise(response.data.data.times);
      } catch (error) {

      } 
    };
    getTimeWork();
  }, [id_doctor]);

  useEffect(() => {
    if(tab_booking_select != null){
      setTabBooking(tab_booking_select);
      tab_booking_select=null;
    }
  },[tab_booking]);

  useEffect(() => {
    const getTimeService = async () => {
      try {
        const response = await http.get("/time-work/service/" + id_service);
        setTimeService(response.data.data.times);
      } catch (error) {
        console.log(error);
      } 
    };
    getTimeService();
  }, [id_service]);

  let menuRef = useRef();
  let buttonRef = useRef();
  const handleOpenDropdown = () => {
    setShow((CurrentStatus) => !CurrentStatus);
  };
  const handleOpenDoctorDropdown = () => {
    setShowDoctor((CurrentStatus) => !CurrentStatus);
  };
  const handleOpenSerivceDropdown = () => {
    setShowService((CurrentStatus) => !CurrentStatus);
  };
  // useEffect(() => {
  //   document.addEventListener("mousedown", (event) => {
  //     if (
  //       !menuRef.current.contains(event.target) &&
  //       !buttonRef.current.contains(event.target)
  //     ) {
  //       setShow(false);
  //     }
  //   });
  // });
  useEffect(() => {
    dayOfWeek.map((day) => {
        if (time_advise[day].date === default_day) {
          setDayOff(time_advise[day].enable)
          if(time_advise[day].enable==true) {
            setNight(time_advise[day].night);
            setMorning(time_advise[day].morning);
            setAfternoon(time_advise[day].afternoon);
          } else {
            setNight({
              time: "",
              enable: null,
              divided_times:[],
            });
            setMorning({
              time: "",
              enable: null,
              divided_times:[],
            });
            setAfternoon({
              time: "",
              enable: null,
              divided_times:[],
            })
          }
        }
    });
},[day_off, time_advise, id_doctor]);

    useEffect(() => {
      dayOfWeek.map((day) => {
          if (time_service[day].date === default_day) {
            setDayOff(time_service[day].enable)
            if(time_service[day].enable==true) {
              setNightService(time_service[day].night);
              setMorningService(time_service[day].morning);
              setAfternoonService(time_service[day].afternoon);
            }
            else {
              setNightService({
                time: "",
                enable: null,
                divided_times:[],
              });
              setMorningService({
                time: "",
                enable: null,
                divided_times:[],
              });
              setAfternoonService({
                time: "",
                enable: null,
                divided_times:[],
              })
            }
        }
      });
    },[day_off, time_service, id_service]);

  const handleDateService = (e) => {
    const { name, value } = e.target;
    dayOfWeek.map((day) => {
        setDefaultDay(value);
        setTimeServiceBooking({
          ...time_booking_service,
          date: ""+value+"",
       })
      if (time_service[day].date == value) {
        if(time_service[day].enable==true) {
          setNightService(time_service[day].night);
          setMorningService(time_service[day].morning);
          setAfternoonService(time_service[day].afternoon);
        }
        else {
          setNightService({
            time: "",
            enable: null,
            divided_times:[],
          });
          setMorningService({
            time: "",
            enable: null,
            divided_times:[],
          });
          setAfternoonService({
            time: "",
            enable: null,
            divided_times:[],
          })
        }
      }
    });
  }

  const handleDate = (e) => {
    const { name, value } = e.target;
    dayOfWeek.map((day) => {
        setDefaultDay(value);
        setTimeBooking({
          ...time_booking,
          date: ""+value+"",
       })
        if (time_advise[day].date === value) {
            setDayOff(time_advise[day].enable)
            if(time_advise[day].enable==true) {
              setNight(time_advise[day].night);
              setMorning(time_advise[day].morning);
              setAfternoon(time_advise[day].afternoon);
            } else {
              setNight({
                time: "",
                enable: null,
                divided_times:[],
              });
              setMorning({
                time: "",
                enable: null,
                divided_times:[],
              });
              setAfternoon({
                time: "",
                enable: null,
                divided_times:[],
              })
            }
        }
    });
  };

  const handleTime = (interval) => {
    setTimeBooking({
      ...time_booking,
      interval: interval,
    })
    setIsButtonDisabled(false)
  };

  const handleTimeService = (interval) => {
    setTimeServiceBooking({
      ...time_booking_service,
      interval: interval,
    })
    setIsButtonDisabled(false)
  };

  const handleClickBooking =  async (e) => {
    e.preventDefault()
    try {
      const response = await http.post(
         'work-schedule/add-advise',
         {
          id_doctor:id_doctor,
          time: time_booking
         },
      )
       toast.success(' Đặt lịch thành công!', toastOptions)
   } catch (error) {
      toast.error(error.response.data.message, toastOptions)
      console.log("Lỗi API!", error)
   } finally {
      clearInput();
   }
  }

  const handleClickBookingService =  async (e) => {
    e.preventDefault()
    console.log(time_booking_service)
    try {
      const response = await http.post(
         '/work-schedule/add-service',
         {
          id_hospital_service:id_service,
          time: time_booking_service
         },
      )
       toast.success(' Đặt lịch thành công!', toastOptions)
   } catch (error) {
      toast.error(error.response.data.message, toastOptions)
   } finally {
      clearInput();
   }
  }

  const handleChangeTab = (tab_changed) => {
      setTabBooking(tab_changed); 
      clearInput();
  } 

  const clearInput = () => {
    setIsButtonDisabled(true);
    setNameDepartment("");
    setIdDepartment(null);
    setDoctorEnable(false);
    setNameDoctor("");
    setIdDoctor(null);
    setTimeBooking({
      date: "",
      interval: []
    })
    setTimeServiceBooking({
      date: "22",
      interval: []
    })  
    setIsButtonDisabled(true);
    setNameService("");
    setIdService(null);     
    inputRef.current.value = getTomorrow();
    setDefaultDay(null);
    name_department_selected = null;
    id_department_selected = null
    id_doctor_selected = null;
    name_doctor_selected = null;
    id_service_selected = null;
    name_service_selected = null;
  }

  return (
    <>
      <ToastContainer />
      {loading && <LoadingDot />}
      <div className="modal-booking">
        <h5 className="title">Đặt lịch ngay</h5>
        <p className="advice">
          Lựa chọn bác sĩ phù hợp, dịch vụ y tế cần khám và tiến hành đặt lịch
          ngay.
        </p>
        <ul className="list-choice">
          <li onClick={() => handleChangeTab("doctor")} className={tab_booking==="doctor" && "active"}>
            <FaUserDoctor className="mr-1" /> Bác sĩ
          </li>
          <li onClick={() => handleChangeTab("service")} className={tab_booking==="service" && "active"}>
            <RiServiceFill className="mr-1" />
            Dịch vụ
          </li>
        </ul>
        {tab_booking === "doctor" ? 
        <div className="form-booking">
          <div>
            <label htmlFor="hospital">Bệnh viện</label>
            <div className="selected-hospital">
              <div className="input-hospital">
                <input type="text" disabled defaultValue={hospital.name} />
                <div className="logo-hospital">
                  <img
                    src={
                      hospital.avatar
                        ? config.URL + hospital.avatar
                        : "/image/avatar_admin_default.png"
                    }
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="input-booking">
            <div className="dropdown">
              <label className="department">Chuyên khoa</label>
              <div className="select-department">
                <div className="input-department">
                  <div className="dropdown-input">
                    <div className="p-relative">
                      <input
                        onClick={handleOpenDropdown}
                        ref={buttonRef}
                        type="text"
                        value={name_department}
                        className="dropdown-department"
                        placeholder="Tìm chuyên khoa"
                        readOnly={true}
                      />
                      <ul
                        ref={menuRef}
                        id="menu"
                        className={
                          show
                            ? "dropdown-menu dropdown-departerment show"
                            : "dropdown-menu dropdown-departerment"
                        }
                      >
                        {departerments.map((departerment, index) => (
                          <li
                            key={index}
                            onClick={() =>
                              handleSetInputDepartment(
                                departerment.name,
                                departerment.id
                              )
                            }
                          >
                            <a>
                              <img src={config.URL + departerment.thumbnail} />
                              <p>{departerment.name}</p>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div className="icon-search">
                        <Search className="icon" />
                      </div>
                      <div className="icon-down">
                        <BiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="dropdown">
                <label className="department">Bác sĩ</label>
                <div className="select-department">
                  <div className="input-department">
                    <div className="dropdown-input">
                      <div className="p-relative">
                        <input
                          type="text"
                          className="dropdown-department"
                          placeholder="Tìm bác sĩ"
                          disabled={doctorEnable == true ? false : true}
                          readOnly={true}
                          value={name_doctor}
                          onClick={handleOpenDoctorDropdown}
                        />
                        <ul
                          id="menu"
                          className={
                            show_doctors
                              ? "dropdown-menu dropdown-departerment show"
                              : "dropdown-menu dropdown-departerment"
                          }
                        >
                          {doctors.map((doctor, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleSetInputDoctor(
                                  doctor.name_doctor,
                                  doctor.id_doctor
                                )
                              }
                            >
                              <a>
                                <img src={doctor.avatar!=null ? config.URL + doctor.avatar : "/image/avatar_admin_default.png"} />
                                <p>{doctor.name_doctor} <br/>
                                   <span className="text-success money"><RiMoneyDollarCircleFill/> {formatMoney(doctor.price)}</span> 
                                </p>
                              </a>
                            </li>
                          ))}
                        </ul>
                        <div className="icon-search">
                          <Search className="icon" />
                        </div>
                        <div className="icon-down">
                          <BiChevronDown className="icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="advise">
                <ul>
                  <li>
                    <div className="title">
                      <p className="content">Tư vấn trực tiếp</p>
                    </div>
                  </li>
                </ul>
                <div className="booking-description">
                  Vui lòng lựa chọn lịch khám bên dưới
                </div>
              </div>
              <div className="main-form-booking">
                <p className="title-booking mb-2 mt-4">Thời gian</p>
                <div className="input-datetime">
                  <div className="pickerContainer">
                    <div className="datetime">
                      <div className="input-cover">
                        <input
                          onChange={handleDate}
                          defaultValue={default_day}
                          id="datefield"
                          ref={inputRef}
                          type="date"
                          name="interval"
                        />
                      </div>
                    </div>
                    {id_doctor != null ? (
                    <>
                      <Tabs
                        defaultActiveKey="morning"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                      >
                        <Tab eventKey="morning" title="Sáng">
                          {morning_times.enable===true ? (
                          <div className="time-booking">
                            {morning_times.divided_times.map((morning_time, index) => (
                              <button key={index} onClick={() => handleTime(morning_time)} className={morning_time[0] === time_booking.interval[0] && "active"}>
                                <span>
                                  {morning_time[0]} - {morning_time[1]}
                                </span>
                              </button>
                            ))}
                          </div>
                          ) : (<div className="mt-3">
                                <p className="text-danger">Rất tiếc! Bác sĩ của chúng tôi không làm vào buổi này</p> 
                             </div>)}
                        </Tab>
                        <Tab eventKey="afternoon" title="Chiều">
                        {afternoon_times.enable===true ? (
                          <div className="time-booking">
                            {afternoon_times.divided_times.map((afternoon_time, index) => (
                              <button key={index} onClick={() => handleTime(afternoon_time)} className={afternoon_time[0] === time_booking.interval[0] && "active"}>
                                <span>
                                  {afternoon_time[0]} - {afternoon_time[1]}
                                </span>
                              </button>
                            ))}
                          </div>
                          ) : (<div className="mt-3">
                              <p className="text-danger">Rất tiếc! Bác sĩ của chúng tôi không làm vào buổi này</p> 
                          </div>)}
                        </Tab>
                        <Tab eventKey="night" title="Tối">
                        {night_times.enable===true ? (
                          <div className="time-booking">
                            {night_times.divided_times.map((night_time, index) => (
                              <button key={index} onClick={() => handleTime(night_time)} className={night_time[0] === time_booking.interval[0] && "active"}>
                                <span>
                                  {night_time[0]} - {night_time[1]}
                                </span>
                              </button>
                            ))}
                          </div>
                          ) : (<div className="mt-3">
                          <p className="text-danger">Rất tiếc! Bác sĩ của chúng tôi không làm vào buổi này</p> 
                      </div>)}
                        </Tab>
                        
                      </Tabs>
                      </>
                    ) : (
                      <p className="mt-3">
                        Hãy chọn bác sĩ bạn muốn được tư vấn 
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button onClick={handleClickBooking} disabled={isButtonDisabled} className="btn-booking">
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>
        : <div className="form-booking">
        <div>
          <label htmlFor="hospital">Bệnh viện</label>
          <div className="selected-hospital">
            <div className="input-hospital">
              <input type="text" disabled defaultValue={hospital.name} />
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
            </div>
          </div>
        </div>
        <div className="input-booking">
          <div className="dropdown">
              <label className="department">Dịch vụ</label>
              <div className="select-department">
                <div className="input-department">
                  <div className="dropdown-input">
                    <div className="p-relative">
                      <input
                        onClick={handleOpenSerivceDropdown}
                        ref={buttonRef}
                        type="text"
                        value={name_service}
                        className="dropdown-department"
                        placeholder="Tìm dịch vụ"
                        readOnly={true}
                      />
                      <ul
                        ref={menuRef}
                        id="menu"
                        className={
                          show_service
                            ? "dropdown-menu dropdown-departerment show"
                            : "dropdown-menu dropdown-departerment"
                        }
                      >
                        {services.map((service, index) => (
                          <li
                            key={index}
                            onClick={() =>
                              handleSetInputService(
                                service.name,
                                service.id_hospital_service
                              )
                            }
                          >
                            <a>
                              <img src={config.URL + service.thumbnail_department} />
                              <p>{service.name}</p>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div className="icon-search">
                        <Search className="icon" />
                      </div>
                      <div className="icon-down">
                        <BiChevronDown className="icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="main-form-booking">
                <p className="title-booking mb-2">Thời gian</p>
                <div className="input-datetime">
                  <div className="pickerContainer">
                    <div className="datetime">
                      <div className="input-cover">
                        <input
                          onChange={handleDateService}
                          defaultValue={default_day}
                          id="datefield"
                          ref={inputRef}
                          type="date"
                          name="interval"
                        />
                      </div>
                    </div>
                    {id_service != null ? (
                      <>
                      <Tabs
                        defaultActiveKey="morning"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                      >
                        <Tab eventKey="morning" title="Sáng">
                          {morning_service_times.enable===true ? (
                          <div className="time-booking">
                            {morning_service_times.divided_times.map((morning_time, index) => (
                              <button key={index} onClick={() => handleTimeService(morning_time)} className={morning_time[0] === time_booking_service.interval[0] && "active"}>
                                <span>
                                  {morning_time[0]} - {morning_time[1]}
                                </span>
                              </button>
                            ))}
                          </div>
                          ) : (<div className="mt-3">
                                <p className="text-danger">Rất tiếc! Dịch vụ này của chúng tôi đang giờ nghỉ</p> 
                             </div>)}
                        </Tab>
                        <Tab eventKey="afternoon" title="Chiều">
                        {afternoon_service_times.enable===true ? (
                          <div className="time-booking">
                            {afternoon_service_times.divided_times.map((afternoon_time, index) => (
                              <button key={index} onClick={() => handleTimeService(afternoon_time)} className={afternoon_time[0] ===time_booking_service.interval[0] && "active"}>
                                <span>
                                  {afternoon_time[0]} - {afternoon_time[1]}
                                </span>
                              </button>
                            ))}
                          </div>
                          ) : (<div className="mt-3">
                              <p className="text-danger">Rất tiếc! Dịch vụ này của chúng tôi đang giờ nghỉ</p> 
                          </div>)}
                        </Tab>
                        <Tab eventKey="night" title="Tối">
                        {night_service_times.enable===true ? (
                          <div className="time-booking">
                            {night_service_times.divided_times.map((night_time, index) => (
                              <button key={index} onClick={() => handleTimeService(night_time)} className={night_time[0] === time_booking_service.interval[0] && "active"}>
                                <span>
                                  {night_time[0]} - {night_time[1]}
                                </span>
                              </button>
                            ))}
                          </div>
                          ) : (<div className="mt-3">
                          <p className="text-danger">Rất tiếc! Dịch vụ này của chúng tôi đang giờ nghỉ</p> 
                      </div>)}
                        </Tab>
                        
                      </Tabs>
                      </>
                    ) : (
                      <p className="mt-3">
                        Hãy chọn dịch vụ bạn muốn được sử dụng 
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
              <button onClick={handleClickBookingService} disabled={isButtonDisabled} className="btn-booking">
                Đặt lịch ngay
              </button>
            </div>
        </div>
        </div>
        }
      </div>
    </>
  );
};
export default FormBooking;
