import React from "react";
import apiUrl from "./ApiConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

let LogOut = () => {
  const navigatt = useNavigate();

  async function myApp() {
    const res = await fetch(`${apiUrl}/api/Customer/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        // navigatt("/");
        // Swal.fire({
        //   position: "center",
        //   icon: "info",
        //   title: "با موفقیت از حساب کاربری خارج شدید...",
        //   showConfirmButton: false,
        //   timer: 2000,
        // }).then((res) => {
        //   navigatt("/");
        // });
      }
    });
  }
  myApp();
};

export default LogOut;
