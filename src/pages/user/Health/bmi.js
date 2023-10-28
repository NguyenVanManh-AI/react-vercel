import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./bmi.css";
import { Container } from "reactstrap";
import { ReactComponent as Community } from "~/Assets/community.svg";
import { ReactComponent as Care } from "~/Assets/care.svg";
import { ReactComponent as Discover } from "~/Assets/discover.svg";
import { ReactComponent as HealthTools } from "~/Assets/health-tools.svg";
import { BsFillBookmarkFill } from "react-icons/bs";
import http from "~/utils/httpUser";
import config from "~/router/config";
import LoadingDot from "~/components/Loading/LoadingDot";
import { GrFormNext } from "react-icons/gr";

const BMICanculate = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <LoadingDot />}
      <div className="header-hospital">
        <div className="breadcrumb">
          <Container className="d-flex">
            <div className="first-link">
              <Link>Công cụ kiểm tra sức khỏe</Link>
            </div>
            <div className="between">
              <GrFormNext />
            </div>
            <div className="second-link">
              <Link>Tính chỉ số BMI - Chỉ số khối cơ thể</Link>
            </div>
          </Container>
        </div>
      </div>
      <div className="header-bmi">
        <div className="content-header">
          <div className="padding-header">
            <div className="mantine">
              <div className="content-mantine">
                <h1>Tính chỉ số BMI - Chỉ số khối cơ thể</h1>
                <p>
                  Sử dụng công cụ này để kiểm tra chỉ số khối cơ thể (BMI) để
                  biết bạn có đang ở mức cân nặng hợp lý hay không. Bạn cũng có
                  thể kiểm tra chỉ số BMI của trẻ tại đây.
                </p>
              </div>
            </div>
            <div className="mantine-2">
              <div className="content-mantine-2">
                <div className="image">
                  <div className="image-cover">
                    <img src="https://cdn.hellobacsi.com/wp-content/uploads/2017/10/BMI_new.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Container className="mt-4">
        <div className="row main-bmi">
          <div className="col-md-7 col-lg-7">
            <form>
              <div className="form-flex">
                <div className="form-child">
                    <div>
                  <div className="label">
                    <p className="mb-0">Giới tính của bạn</p>
                  </div>
                  <div className="w-100">
                    <select
                      // onChange={handleChangeInput}
                      name="gender"
                      className="form-control"
                      type="text"
                    >
                      <option value={"male"}>Nam</option>
                      <option value={"femail"}>Nữ</option>
                    </select>
                  </div>
                  </div>
                  <div>
                    <div className="label">
                      <p className="mb-0">Bạn bao nhiêu tuổi ?</p>
                    </div>
                    <div className="w-100">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your age"
                        name="age"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="label">
                      <p className="mb-0">Chiều cao của bạn ? (cm)</p>
                    </div>
                    <div className="w-100">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Height"
                        name="height"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="label">
                      <p className="mb-0">Cân nặng của bạn ? (kg)</p>
                    </div>
                    <div className="w-100">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your Weight"
                        name="weight"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-100">
                    <button className="btn btn-primary w-100 h5">Tính ngay</button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-5 col-lg-5">
            <div className="w-100">
                <img className="w-100" src="/image/fit-ness.png"/>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default BMICanculate;
