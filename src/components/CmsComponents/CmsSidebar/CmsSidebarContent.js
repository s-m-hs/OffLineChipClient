import React, { useContext, useEffect, useState } from "react";
import "./CmsSidebar.css";
import { NavLink, Link } from "react-router-dom";
import BuildVirsion from "../../../utils/BuildVirsion";
import { HomeContext } from "../../../context/CmsContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { FaUsers } from "react-icons/fa";
import { BsClipboardPlusFill } from "react-icons/bs";
import { FaListCheck } from "react-icons/fa6";
import { FaList } from "react-icons/fa6";
import { FaClipboardQuestion } from "react-icons/fa6";
import { FaFolderOpen } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";




export default function CmsSidebarContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const homeContext = useContext(HomeContext);
  const getlocalRole = localStorage.getItem("cyRole");
  const [roleState, setRoleState] = useState(parseInt(getlocalRole));

  const hasAccess = (field) => {
    if (roleState === 8 || roleState === 16 || roleState === 15) return true; // دسترسی کامل
    const accessMap = {
      NOpurchasing: [10, 12, 13, 16, 4],
      purchasing: [11, 14, 16, 4],
      products: [5, 6, 4],
      levelAccess: [16],

    };
    return accessMap[field]?.includes(roleState) || false;
  };

  return (
    <>
      <h6 className="cmssidebar-h6">Dashboard</h6>
      <Link className="cmssidebar-div" to={"/p-admin"}>
        <i
          className="fa-sharp fa-solid fa-house fa-lg"
          style={{ marginLeft: "5px" }}
        ></i>
        <span>خانه</span>
      </Link>

      <hr />
      <h6 className="cmssidebar-h6">Quick menu</h6>

      {hasAccess("levelAccess") && (
        <NavLink className="cmssidebar-div" to={"users"}>
          <FaUsers size={20} style={{ marginLeft: "5px" }} />
          <span>  نقش ها و دسترسی ها</span>
        </NavLink>)}

      {hasAccess("NOpurchasing") && (
        <>

          <NavLink className="cmssidebar-div" to={"Factor"}>
            <BsClipboardPlusFill size={20} style={{ marginLeft: "5px" }} />
            <span>  ثبت سفارش </span>
          </NavLink>
          <NavLink className="cmssidebar-div" to={"OrderLists"}>
            <FaListCheck size={20} style={{ marginLeft: "5px" }} />        <span> سفارشات قطعه   </span>
          </NavLink>


          <NavLink className="cmssidebar-div" to={"PCBLIst"}>
            <FaList size={20} style={{ marginLeft: "5px" }} />        <span> سفارشات PCB</span>
          </NavLink>


          <NavLink className="cmssidebar-div" to={"InquiryList"}>
            <FaClipboardQuestion size={20} style={{ marginLeft: "5px" }} />        <span> استعلام اولیه </span>
          </NavLink>

        </>)}


      {/* سمت فروشنده */}
      {hasAccess("purchasing") && (
        <>
          <NavLink className="cmssidebar-div" to={"OrderListsB"}>
            <FaListCheck size={20} style={{ marginLeft: "5px" }} />        <span> {(roleState === 8 || roleState === 16 || roleState === 15) ? " سفارشات قطعه (فروشنده)" : 'سفارشات قطعه'}   </span>
          </NavLink>

          <NavLink className="cmssidebar-div" to={"PCBLIstB"}>
            <FaList size={20} style={{ marginLeft: "5px" }} />        <span>  {(roleState === 8 || roleState === 16 || roleState === 15) ? " سفارشات PCB (فروشنده)" : 'سفارشات PCB'} </span>
          </NavLink>

          <NavLink className="cmssidebar-div" to={"InQueryListB"}>
            <FaClipboardQuestion size={20} style={{ marginLeft: "5px" }} />        <span>  {(roleState === 8 || roleState === 16 || roleState === 15) ? "  استعلام اولیه (فروشنده)" : 'استعلام اولیه'} </span>
          </NavLink>


          <NavLink className="cmssidebar-div" to={"product"}>
            <MdManageAccounts size={20} style={{ marginLeft: "5px" }} />
            <span>مدیریت عمومی</span>
          </NavLink>
        </>

      )}

      <NavLink className="cmssidebar-div" to={"C"}>
        <FaFolderOpen size={20} style={{ marginLeft: "5px" }} />        <span> کار پوشه </span>
      </NavLink>




      {/* {hasAccess("customer") && (
        <NavLink className="cmssidebar-div" to={"customer"}>
          <i
            class="fa-solid fa-user-pen fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span> کاربران</span>
        </NavLink>
      )}



      {hasAccess("menue") && (
        <NavLink className="cmssidebar-div" to={"menu"}>
          <i
            class="fa-solid fa-calendar-minus fa-lg  "
            style={{ marginLeft: "5px" }}
          ></i>
          <span>منو </span>
        </NavLink>
      )}

      {hasAccess("publicCategory") && (
        <NavLink className="cmssidebar-div" to={"category"}>
          <i
            class="fa-solid fa-layer-group fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span>دسته بندی عمومی </span>{" "}
        </NavLink>
      )}

      {hasAccess("categorySpecialty") && (
        <NavLink className="cmssidebar-div" to={"categoryspecialty"}>
          <i
            className="fa-solid fa-layer-group fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span>دسته بندی تخصصی</span>
        </NavLink>
      )}

      {hasAccess("subjects") && (
        <NavLink className="cmssidebar-div" to={"CmsSubject"}>
          <i
            className="fa-solid fa-file-lines fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span>مطالب</span>
        </NavLink>
      )}

      {hasAccess("parameter") && (
        <NavLink className="cmssidebar-div" to={"parameter"}>
          <i class="fa-solid fa-key fa-lg" style={{ marginLeft: "5px" }}></i>
          <span>متغیرها </span>{" "}
        </NavLink>
      )}

      {hasAccess("skin") && (
        <NavLink className="cmssidebar-div" to={"skin"}>
          <i
            class="fa-solid fa-palette fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span>قالب ها </span>{" "}
        </NavLink>
      )}

      {hasAccess("manufacturer") && (
        <NavLink className="cmssidebar-div" to={"manufacturer"}>
          <i
            className="fa-solid fa-compass-drafting fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span>شرکت سازنده</span>
        </NavLink>
      )}



      {hasAccess("orders") && (
        <NavLink className="cmssidebar-div" to={"order"}>
          <i
            className="fa-solid fa-store fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span>سفارشات</span>
        </NavLink>
      )}

      {hasAccess("testPage") && (
        <NavLink className="cmssidebar-div" to={"testpage"}>
          <i class="fa-solid fa-store fa-lg" style={{ marginLeft: "5px" }}></i>
          <span>TEST-PAGE </span>{" "}
        </NavLink>
      )}

      <hr />
      <h6 className="cmssidebar-h6">Notifications</h6>
      {hasAccess("email") && (
        <NavLink className="cmssidebar-div" to={"useremail"}>
          <i
            class="fa-solid fa-envelope fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span>ایمیل </span>{" "}
        </NavLink>
      )}

      {hasAccess("messages") && (
        <NavLink className="cmssidebar-div" to={"tickets"}>
          <i
            className="fa-solid fa-message fa-lg"
            style={{ marginLeft: "5px" }}
          ></i>
          <span>پیام‌ها</span>
          <div className="cmssidebar-div cmssidebarrr">
            {homeContext.messageNotification?.length > 0 && (
              <>
                <NotificationsIcon />
                <span className="cmssidebar-span">
                  {homeContext.messageNotification?.length}
                </span>
              </>
            )}
          </div>
        </NavLink>
      )} */}


      {/* <NavLink
        className="cmssidebar-div"
        to={"/"}
        onClick={() => {
          // localStorage.removeItem('loginToken')
          localStorage.removeItem("user");
          localStorage.removeItem("cyRole");
        }}
      >
        <i
          className="fa-solid fa-right-from-bracket fa-lg"
          style={{ marginLeft: "5px" }}
        ></i>
        <span>خروج</span>
      </NavLink> */}
      <hr />

      {/* نمایش تاریخ */}
      <div
        className="date-display"
        style={{ textAlign: "center", fontWeight: "bold", fontSize: "15px" }}
      >
        {currentDate.toLocaleDateString("fa-IR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>

      {/* نمایش نسخه */}
      <div
        className="unique-code"
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        V.{BuildVirsion}
      </div>
    </>
  );
}
