import React from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, Outlet } from "react-router-dom";
import "./profile.css";
import {FaUserAlt} from 'react-icons/fa';
import {GiHealthNormal} from 'react-icons/gi';
import {BsFillSaveFill} from 'react-icons/bs';
import {BiSolidHelpCircle} from 'react-icons/bi';
import {IoShareSocialSharp} from 'react-icons/io5';
import {AiOutlineHistory, AiOutlineLogout, AiFillSetting} from 'react-icons/ai';

const handleLogout = () => {
  localStorage.removeItem('HealthCareUser')
}

const UserProfile = () => {
  return (
    <div className="container-fluid">
    <div className="row mt-4">
      <div className="col-lg-3 col-md-3">
        <div className="catalog">
            <ListGroup>
                <ListGroup.Item>
                  <Link to={'profile'}><FaUserAlt className="mr-1"/> Hồ sơ</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to={'setting'}><AiFillSetting className="mr-1 text-dark"/> Thiết lập tài khoản</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link  to={'/user/schedule'}><AiOutlineHistory className="mr-1 text-dark"/> Quản lý đặt lịch</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to={'profile'}><BsFillSaveFill className="mr-1 text-success"/> Đã lưu </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <Link to={'profile'}><GiHealthNormal className="mr-1 text-danger"/> Sức khỏe của tôi</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to={'profile'}><IoShareSocialSharp className="mr-1 text-primary"/> Cộng đồng</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to={'profile'}><BiSolidHelpCircle className="mr-1 text-dark"/> Trợ giúp</Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to={'/user-login'} onClick={handleLogout}><AiOutlineLogout className="mr-1 text-dark"/> Đăng xuất</Link>
                </ListGroup.Item>
            </ListGroup>    
        </div>
      </div>
      <div className="col-lg-9 col-md-9">
           <Outlet/> 
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
