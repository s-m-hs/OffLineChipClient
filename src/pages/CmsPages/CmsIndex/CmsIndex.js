import React, { useContext, useEffect, useState } from "react";
import "./CmsIndex.css";
import CmsHeader from "../../../components/CmsComponents/CmsHeader/CmsHeader";
import CmsSidebar from "../../../components/CmsComponents/CmsSidebar/CmsSidebar";
import { CmsContext, HomeContext } from "../../../context/CmsContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ScrollTo from "../../../utils/ScrollTo/ScrollTo";
import ApiGetX2 from "../../../utils/ApiServicesX/ApiGetX2";

export default function CmsIndex() {
  const [isValid, setIsValid] = useState(false);
  const [flagResetInput, setFlagResetInput] = useState(false);
  const [sideMenueFlag, setSideMenueFlag] = useState(false);
  const [flagClass, setFlagClass] = useState(true);
  const [flagPublic, setFlagPublic] = useState(false);
  const [arrayIdParam, setArrayIdParam] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [resetSearchbox, setResetSearchbox] = useState(false);
  const [xtSearchA, setXtSearchA] = useState("");
  const [xtSearchB, setXtSearchB] = useState("");
  const [xtSearchC, setXtSearchC] = useState("");
  const [xtSearchD, setXtSearchD] = useState("");
  const [xtSearchE, setXtSearchE] = useState("");
  const [xtSearchF, setXtSearchF] = useState("");
  const [xtSearchG, setXtSearchG] = useState("");
  const [flagError, setFlagError] = useState(false);
  const [isolaEdiImg, setIsolaEdiImg] = useState("");
  const [isolaSave, setIsolaSave] = useState(false);
  const [isolaLocal, setIsplaLocal] = useState("");
  const [userDetail, setUserDetail] = useState({})
  const [orderDetails, setOrderDetails] = useState([])
  const [notifCount, setNotifCount] = useState(0)
  const navigatt = useNavigate();
  let { setIsLogin, isLogin } = useContext(HomeContext);



  useEffect(() => {
    // setToken(JSON.parse(localStorage.getItem('loginToken')))
    ApiGetX2(`/api/CyLogin/getUserDetile`, setUserDetail)
    setUser(localStorage.getItem("user"));
  }, []);
  // useEffect(()=>{
  //   return()=>setToken('')
  // })

  console.log(userDetail)
  return (
    <>
      <CmsContext.Provider
        value={{
          arrayIdParam,
          setArrayIdParam,
          isValid,
          setIsValid,
          flagResetInput,
          setFlagResetInput,
          sideMenueFlag,
          setSideMenueFlag,
          flagClass,
          setFlagClass,
          flagPublic,
          setFlagPublic,
          token,
          setToken,
          user,
          setUser,
          xtSearchA,
          setXtSearchA,
          xtSearchB,
          setXtSearchB,
          xtSearchC,
          setXtSearchC,
          xtSearchD,
          setXtSearchD,
          xtSearchE,
          setXtSearchE,
          xtSearchF,
          setXtSearchF,
          xtSearchG,
          setXtSearchG,
          resetSearchbox,
          setResetSearchbox,
          flagError,
          setFlagError,
          isolaEdiImg,
          setIsolaEdiImg,
          isolaSave,
          setIsolaSave,
          isolaLocal,
          setIsplaLocal,
          userDetail, orderDetails, setOrderDetails,
          notifCount, setNotifCount
        }}
      >
        <div className="cms-container">
          <CmsHeader />

          <div className="container  app-container">
            <div className="row">
              <div className="col col-1 col-md-2 mt-5">
                <CmsSidebar />
              </div>
              <div className="col col-10 col-md-10 mt-5">
                <div
                  className={
                    flagClass
                      ? "cmsindex-maincontainer-div"
                      : "cmsindex-maincontainer-div-hidden"
                  }
                >
                  <div className="container">
                    <div className="row "></div>

                    <div className="row"></div>
                  </div>
                </div>
                <ScrollTo />
                <Outlet />
                {/* {isLogin ? <Outlet /> : <Navigat />} */}
              </div>
            </div>
          </div>
        </div>
      </CmsContext.Provider>
    </>
  );
}
