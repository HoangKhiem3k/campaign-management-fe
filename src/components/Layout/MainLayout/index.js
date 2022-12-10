
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { authServices } from '../../../services/authService';
import { logoutAction, logoutSuccess } from '../../../store/actions/authActions';
import './MainLayout.css';

import { ROLES } from '../../../config/settingSystem';
export default function MainLayout() {
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [isShowLogout, setIsShowLogout] = useState(false);
  let currentUser = useSelector((state) => state.auth?.currentUser)
  const isAdmin = () => {
    let isAdmin = 0
    currentUser.userRole.map((item,index) => {
      if(item.role_name === ROLES.ADMIN){
        isAdmin += 1
      }else{
        isAdmin +=0
      }
    })
    return isAdmin
  }
  

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [])
  const handleToggleSidebar = () => {
    setIsShowSidebar(!isShowSidebar);
  };

  const handleShowLogout = () => {
    setIsShowLogout(!isShowLogout);
  };
  const handleLogout = () => {
    dispatch(logoutAction(navigate))
  }
  return (
    <div className={isShowSidebar ? 'wrapper isShowSidebar' : 'wrapper'}>
      {currentUser ? (<><div className='banner'><h1>Banner</h1></div>
        <div id="header">
          <div className="navbar">
            <div className="tool-bar">
              <div className="navbar-btn">
                <i
                  onClick={() => {
                    handleToggleSidebar();
                  }}
                  className="fa-solid fa-bars"
                ></i>
              </div>
            </div>
            <p>LOGO</p>
            <div className="action">
              <div
                className="avatar"
                onClick={() => {
                  handleShowLogout();
                }}
              >
                <img src={require('../../../assets/images/default-avatar.png')} alt="" />
                {isShowLogout && (
                  <div className="menu">
                    <ul>
                      <li>
                        <i className="fas fa-user-circle" />
                        <div href="#">My Profile</div>
                      </li>
                      <li>
                        <i className="fas fa-sign-out-alt" />
                        <div href="/login" onClick={handleLogout} >Logout</div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <ul className="sidebar-menu-toggle">
            <li className="interface">
              <img
                src={require("../../../assets/images/default-avatar.png")}
                alt=""
              />
              <div className="username">
                <p>{currentUser.userProfile.first_name + " " + currentUser.userProfile.last_name}</p>
              </div>
            </li>
            <li className="item">
              <a href="dashboard">
                <i className="icon fa-solid fa-book-medical" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="item">
              <a href="campaign">
                <i className="icon fa fa-calendar-plus"></i>
                <span>Campaign</span>
              </a>
            </li>
            <li className={isAdmin() === 1 ? "item" : "item disable-account"}>
            {/* <li className="item"> */}
              <a href="account">
                <i className="icon fa fa-user"></i>
                <span>Account</span>
              </a>
            </li>
          </ul>
        </div></>) : (<>

        </>)}

      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}