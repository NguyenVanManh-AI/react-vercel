import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import config from "~/router/config";
import {AiFillEdit} from 'react-icons/ai'
import {BsCameraFill} from 'react-icons/bs'

const UserEditProfile = () => {
  const user = JSON.parse(localStorage.getItem("HealthCareUser"));
  const [avatar, setAvatar] = useState("/image/avatar_admin_default.png");
  useEffect(() => {
    if (user && user.avatar) {
        var https_regex = /^(https)/;
        if(https_regex.test(String(user.avatar).toLowerCase()) == true) {
          setAvatar(user.avatar);
        } 
        else {
          setAvatar(config.URL + user.avatar)
        }
    }
  }, []);

  return (
    <div className="col-md-10 col-lg-10">
      <div className="title">
        <h3>Hồ sơ</h3>
        <Link to={'/user/edit-profile'} className="edit-link">Chỉnh sửa <AiFillEdit/></Link>
      </div>
      <div className="info mt-5">
        <label className="edit-image" htmlFor="image">
            <img className="avatar" src={avatar} alt="user pic" />
        </label>
        <div className="my-auto name ml-4">
          {user.name}
          <br/>
          <span className="email">{user.email}</span>
        </div>
      </div>
      <div className="main-profile mt-5 mb-5">
        <div className="item-info">
            <span className="item-title">
                Họ và tên
            </span>
            <p className="item-content">
                {user.name}
            </p>
            <hr/>
        </div>
        <div className="item-info">
            <span className="item-title">
                Email
            </span>
            <p className="item-content">
                {user.email}
            </p>
            <hr/>
        </div>
        <div className="item-info">
            <span className="item-title">
                Tên người dùng
            </span>
            <p className="item-content">
                {user.username ? user.username : <span className="text-danger"><b>--</b></span>}
            </p>
            <hr/>
        </div>
        <div className="item-info">
            <span className="item-title">
                Ngày sinh
            </span>
            <p className="item-content">
                {user.date_of_birth}
            </p>
            <hr/>
        </div>
        <div className="item-info">
            <span className="item-title">
                Giới tính
            </span>
            <p className="item-content">
                { user.gender == 0 ? "Nam" : (user.gender == 1  ? "Nữ" : "Khác" )             
                }
            </p>
            <hr/>
        </div>
        <div className="item-info">
            <span className="item-title">
                Quê quán
            </span>
            <p className="item-content">
                {user.address}
            </p>
            <hr/>
        </div>
        <div className="item-info">
            <span className="item-title">
                Số điện thoại
            </span>
            <p className="item-content">
                {user.phone ? user.phone : <span className="text-danger"><b>--</b></span>}
            </p>
        </div>
      </div>
    </div>
  );
};

export default UserEditProfile;
