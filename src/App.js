import React, { useState, useEffect } from "react";
import "./App.css";
import routes from "./routes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useRoutes } from "react-router-dom";
import { HomeContext } from "./context/CmsContext";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";



import apiUrl from "./utils/ApiConfig";
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';

export default function App() {
  // const getlocalStorage= localStorage.getItem('loginToken')
  const navigatt = useNavigate();
  const location = useLocation();
  const [sideMenueFlag, setSideMenueFlag] = useState(false);
  const [messageNotification, setMessageNotification] = useState([]);
  const [flagMessageNotification, setFlagMessageNotification] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [themContext, setThemContext] = useState(false);
  let router = useRoutes(routes);
  const navigatToOut = () => {
    if (location.pathname.includes("p-admin")) {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "لطفا با حساب کاربری معتبر وارد شوید...",
        showConfirmButton: false,
        timer: 2000,
      }).then((res) => {
        navigatt("/");
        setIsLogin(false);
      });
    } else {
      setIsLogin(false);
    }
  };

  const refreshToken = () => {
    async function myApp() {
      const res = await fetch(`${apiUrl}/api/CyLogin/refreshToken`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            setIsLogin(true);
          } else {
            navigatToOut();
          }
        })
        .catch((err) => console.log(err));
    }
    myApp();
  };
  const intervalId = () => {
    setInterval(() => {
      refreshToken();
    }, 600000);
  };

  useEffect(() => {
    refreshToken();
    intervalId();
    clearInterval(intervalId);
  }, []);

  // useEffect(()=>{
  // if(getlocalStorage){
  //   setIsLogin(true)
  // }
  // },[getlocalStorage])
  ///////////////
  //  useEffect(()=>{
  //   return()=>localStorage.removeItem('loginToken')
  // })   const getAllTicket=()=>{

  return (
    <>
      <HomeContext.Provider
        value={{
          isLogin,
          setIsLogin,
          themContext,
          setThemContext,
          messageNotification,
          setMessageNotification,
          flagMessageNotification,
          setFlagMessageNotification,
          sideMenueFlag,
          setSideMenueFlag, ///<<< to control sidemenue on mobileSize
        }}
      >
        <div className="App">{router}</div>
      </HomeContext.Provider>
    </>
  );
}
