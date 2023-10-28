import React, { useState, useEffect } from "react";
import { updateUser } from "~/redux/userSlice";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useAppContext } from "~/contexts/AppContext";
import { useDispatch } from "react-redux";
import validateForm from "~/helpers/validation";
import "react-toastify/dist/ReactToastify.css";
import http from "~/utils/http";
import LoadingDot from "~/components/Loading/LoadingDot";

const UserPasswordSetting = () => {
  const user = JSON.parse(localStorage.getItem("HealthCareUser"));
  const [notify, setNotify] = useState({});
  const isUserUpdated = useSelector((state) => state.user.keyUserUpdated);
  const [loading, setLoading] = useState(false);
  const [have_password, setHavePassWord] = useState(user.have_password);
  const handleInputPasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...passwordCreated,
      [name]: value,
    });
  };

  const rules = {
    current_password: {
      password: true,
    },
    new_password: {
      password: true,
      new_password: true,
    },
    new_password_confirmation: {
      new_password_confirmation: true,
    },
  };
  const [password, setPasswordChange] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange({
      ...password,
      [name]: value,
    });
  };
  const handleSubmitPassWord = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(password, rules);
    if (Object.keys(validationErrors).length === 0) {
      setNotify(validationErrors);
      try {
        setLoading(true);
        const response = await http.post("user/change-password", password);
        // setPasswordChange({
        //   current_password: "",
        //   new_password: "",
        //   new_password_confirmation: "",
        // });
        toast.success(response.data.message, toastOptions);
      } catch (error) {
        if (error.response.data.message === "Validation errors") {
          setNotify({
            new_password: "Mật khẩu phải trùng khớp với mật khẩu xác nhận",
          });
        } else {
          setNotify({
            current_password: "Mật khẩu hiện tại chưa chính xác",
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setNotify(validationErrors);
    }
  };
  const dispatch = useDispatch();
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
  const [passwordCreated, setPassword] = useState({
    new_password: "",
    new_password_confirmation: "",
  });
  const handleUpdateUser = async () => {
    try {
      const response = await http.get("infor-user/profile");
      console.log("Get profile thành công");
      const profile = response.data.data;
      setHavePassWord(true);
      const updatedUser = {
        ...user,
        id: profile.id,
        email: profile.email,
        address: profile.address,
        date_of_birth: profile.date_of_birth,
        phone: profile.phone,
        name: profile.name,
        have_password: true,
        gender: profile.gender,
        avatar: profile.avatar,
      };
      localStorage.setItem("HealthCareUser", JSON.stringify(updatedUser));
      dispatch(updateUser());
    } catch (error) {
      console.log(error);
      console.error("Lỗi kết nối đến API", error);
    }
  };

  const handleCreatePassword = async () => {
    setLoading(true);

    try {
      const response = await http.post(
        "infor-user/create-password",
        passwordCreated
      );
      handleUpdateUser();
      toast.success(" Tạo mật khẩu thành công!", toastOptions);
    } catch (error) {
      toast.error( error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="col-md-10 col-lg-10">
        {loading && <LoadingDot />}
        <div className="title">
          <h3>Thiết lập tài khoản</h3>
        </div>
        <hr />
        {have_password == false ? (
          <div className="main-profile mt-4">
            <h4>Tạo mật khẩu</h4>
            <form>
              <div className="form-group">
                <label htmlFor="password">Mật khẩu mới:</label>
                <input
                  name="new_password"
                  onChange={handleInputPasswordChange}
                  defaultValue={passwordCreated.new_password}
                  type="password"
                  className="login-input"
                  aria-describedby="emailHelp"
                  placeholder="Password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="new_password_confirmation">
                  Mật khẩu xác nhận:
                </label>
                <input
                  name="new_password_confirmation"
                  onChange={handleInputPasswordChange}
                  defaultValue={passwordCreated.new_password_confirmation}
                  type="password"
                  className="login-input"
                  id="new_password_confirmation"
                  aria-describedby="emailHelp"
                  placeholder="Password"
                />
              </div>
            </form>
            <button
              onClick={handleCreatePassword}
              className="btn btn-outline-primary"
            >
              Tạo mật khẩu
            </button>
          </div>
        ) : (
          <div className="main-profile mt-4">
            <h4>Đổi mật khẩu</h4>
            <form className="form-horizontal mt-3">
              <div className="form-group row">
                <label
                  htmlFor="inputPassword1"
                  className="col-md-3 control-label"
                >
                  Mật khẩu hiện tại
                </label>
                <div className="col-md-9">
                  <input
                    onChange={handleInputChange}
                    defaultValue={password.current_password}
                    name="current_password"
                    type="password"
                    className="form-control"
                    id="inputPassword1"
                    placeholder="Nhập mật khẩu"
                  />
                  {notify.current_password && (
                    <p className="text_danger">{notify.current_password}</p>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="inputPassword2"
                  className="col-md-3 control-label"
                >
                  Mật khẩu mới
                </label>
                <div className="col-md-9">
                  <input
                    onChange={handleInputChange}
                    defaultValue={password.new_password}
                    name="new_password"
                    type="password"
                    className="form-control"
                    id="inputPassword2"
                    placeholder="Nhập mật khẩu mới"
                  />
                  {notify.new_password && (
                    <p className="text_danger">{notify.new_password}</p>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="inputPassword3"
                  className="col-md-3 control-label"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="col-md-9">
                  <input
                    onChange={handleInputChange}
                    defaultValue={password.new_password_confirmation}
                    name="new_password_confirmation"
                    type="password"
                    className="form-control"
                    id="inputPassword3"
                    placeholder="Nhập lại mật khẩu"
                  />
                  {notify.new_password_confirmation && (
                    <p className="text_danger">{notify.new_password_confirmation}</p>
                  )}
                </div>
              </div>

              <div className="form-group row justify-content-end mb-0">
                <div className="col-lg-3 col-md-9">
                  <button
                    onClick={handleSubmitPassWord}
                    className="btn btn-info"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
export default UserPasswordSetting;
