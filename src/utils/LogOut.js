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
      if (res.ok) {

      }
    });
  }
  myApp();
};

export default LogOut;
