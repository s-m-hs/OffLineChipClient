import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CmsHeader.css";
import GridViewIcon from "@mui/icons-material/GridView";
import LanguageIcon from "@mui/icons-material/Language";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightModeIcon from "@mui/icons-material/LightMode";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import { CmsContext, HomeContext } from "../../../context/CmsContext";
import MenuIcon from "@mui/icons-material/Menu";
import mode from "../../../utils/ModsB";
import apiUrl from "../../../utils/ApiConfig";
import ApiGetX2 from "../../../utils/ApiServicesX/ApiGetX2";
import Swal from "sweetalert2";
import { UserType } from "../../../utils/OrderStatusList";
import { ImExit } from "react-icons/im";
import { Alarm, MessengerLogo, Notification, Warning } from "@phosphor-icons/react";
import { Message, NotificationAdd } from "@mui/icons-material";
import { RiMessengerLine } from "react-icons/ri";
export default function CmsHeader() {
  const [flagThem, setFlagThem] = useState(false);

  const cmsContext = useContext(CmsContext);
  const homeContext = useContext(HomeContext);
  let { userDetail, notifCount, setNotifCount } = useContext(CmsContext)
  const navigatt = useNavigate();

  // const headerAuth = `Bearer ${cmsContext.token.token}`;
  // const getlocalStorage= localStorage.getItem('loginToken')

  const sideMenueHandler = () => {
    ///<<< to control sidemenue on mobileSize
    homeContext.setSideMenueFlag((prev) => !prev);
  };

  const changeTheme = () => {
    setFlagThem((prev) => !prev);
    homeContext.setThemContext((prev) => !prev);
  };

  const funcA = (result) => {
    homeContext.setMessageNotification(result);
  };
  const getAllTicket = () => {
    ApiGetX2("/api/CyTicket/getAllTickets?status=1", funcA);
  };

  const getUnSeenNotif = () => {
    ApiGetX2(`/api/CyNotification/unSeenNotif`, setNotifCount)
  }
  useEffect(() => {
    if (flagThem) {
      document.documentElement.style.setProperty("--white", "#464646");
      document.documentElement.style.setProperty("--white1", "#2e2e2e");
      document.documentElement.style.setProperty("--gray3", "#9b9b9b");
      // document.documentElement.style.setProperty('--gray4','#9b9b9b')
      document.documentElement.style.setProperty("--white3", "#d6d6d6");
      document.documentElement.style.setProperty("--white2", "#d6d6d6");
      document.documentElement.style.setProperty("--black0", "#ffffff");
      document.documentElement.style.setProperty("--blue0", "#555 ");
      document.documentElement.style.setProperty("--blue2", "#B9B9B9 ");
    } else {
      document.documentElement.style.setProperty("--white", "#ffffff");
      document.documentElement.style.setProperty("--white1", "#fafaff");
      document.documentElement.style.setProperty("--gray3", "#555");
      // document.documentElement.style.setProperty('--gray4','#555')
      document.documentElement.style.setProperty("--white3", "#555");
      document.documentElement.style.setProperty("--white2", "#ffffff");
      document.documentElement.style.setProperty("--black0", "#000000");
      document.documentElement.style.setProperty("--blue0", "#f0f8ff");
      document.documentElement.style.setProperty("--blue2", "#fff");
    }
  }, [flagThem]);

  useEffect(() => {
    getUnSeenNotif()
    console.log(notifCount)
  }, [notifCount])
  const LogOut = () => {
    async function myApp() {
      const res = await fetch(`${apiUrl}/api/CyLogin/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          // navigatt("/");
          Swal.fire({
            position: "center",
            icon: "info",
            title: "با موفقیت از حساب کاربری خارج شدید...",
            showConfirmButton: false,
            timer: 2000,
          }).then((res) => {
            navigatt("/");
            homeContext.setIsLogin(false);
          });
        }
      });
    }
    myApp();
  };

  // useEffect(() => {
  //   getAllTicket();
  // }, [homeContext.flagMessageNotification]);

  return (
    <div className="container cmsheader-container">
      <div className="row cmsheader-row">
        <div className="col col-6 cmsheader-col1">
          <h4 className="cmsheader-gridviewIcon">
            <i class="fa-solid fa-chart-pie fa-beat fa-xs"></i> پنل مدیریت
            {mode.mode}
          </h4>
        </div>
        <div className="col col-1 col-sm-2 cmsheader-col2"></div>
        <div className="col cmsheader-col3 cmsheader-col3">
          <button
            className="cmsheader-sidemenue-button"
            onClick={sideMenueHandler}
          >
            <MenuIcon />
          </button>

          {/* <div className="cmsheader-div">
            {" "}
            <Link to={"tickets"}>
              {" "}
              <NotificationsIcon />
              {homeContext.messageNotification?.length > 0 && (
                <span className="cmsheader-span">
                  {homeContext.messageNotification?.length}
                </span>
              )}
            </Link>{" "}
          </div> */}

          <div className="cmsheader-div">
            <i class="fa-regular fa-circle-user fa-2xl"></i>
            {/* <i class="fa-solid fa-circle-user fa-2xl"></i> */}
            {/* <i class="fa-regular fa-user fa-xl"></i> */}
          </div>

          <div className="cmsheader-div">
            <span className="cmsheader-span-user ">
              {cmsContext.user?.toUpperCase()}_
              {UserType.filter(filter => (
                filter.userType == userDetail.role
              ))[0]?.name}
            </span>
          </div>

          <div className="cmsheader-div">
            <span className="cmsheader-notif-span">  {notifCount != 0 ? notifCount : ''}<NotificationsIcon /></span>

          </div>

          <div className="cmsheader-div">
            {" "}
            <span
              onClick={() => {
                // localStorage.clear("loginToken");
                localStorage.clear("user");
                LogOut();
              }}
            // to={"/"}
            >
              <ImExit size={18} style={{ transform: 'rotate(180deg)' }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
