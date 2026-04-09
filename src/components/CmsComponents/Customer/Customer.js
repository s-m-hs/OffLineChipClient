import React, { useState, useEffect, useContext } from "react";
import "./Customer.css";
import { CmsContext, HomeContext } from "../../../context/CmsContext";
import { useForm as useFormA } from "react-hook-form";
import { useForm as useFormB } from "react-hook-form";
import { useForm as useFormC } from "react-hook-form";
import { sha512 } from "js-sha512";
import Modal from "react-bootstrap/Modal";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import DataTable from "../DataTable/DataTable";
import Swal from "sweetalert2";
import DotLoader from "react-spinners/DotLoader";
import { useForm } from "react-hook-form";
import apiUrl from "../../../utils/ApiConfig";
import mode from "../../../utils/ModsB";

export default function Customer() {
  const [customerArray, setcustomerArray] = useState([]);
  const customerArrayRevers = customerArray.slice().reverse();
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [putId, setPutId] = useState("");
  const [localToken, setLocalToken] = useState("");
  const [profileDetail, setProfileDetail] = useState([]);
  const cmsContext = useContext(CmsContext);
  const homeContext = useContext(HomeContext);
  const [searchUser, setSearchUser] = useState("");
  const [searchUserArray, setSearchUserArray] = useState([]);
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // const headerAuth = cmsContext.token.token;

  ///////////////////
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  ////////////////////////////
  const customerStatus = [
    { id: 1, status: "فعال", statusId: 0 },
    { id: 2, status: "مسدود", statusId: 1 },
    { id: 3, status: "غیرفعال", statusId: 2 },
  ];

  ////////////////////////////////

  const update = () => {
    // setValueB("update", {
    //   customerFirstName: customerFirstName ? `${customerFirstName}` : "",
    //   customerLastName: customerLastName ? `${customerLastName}` : "",
    //   mobile: mobile ? `${mobile}` : "",
    // });
  };

  const changSearchHandlet = (e) => {
    setSearchUser(e.target.value);
  };

  const searchHandler = () => {
    let searchCustomer = customerArray?.filter((filter) => {
      return filter.name?.includes(`${searchUser}`);
    });
    setSearchUserArray(searchCustomer);
  };
  useEffect(() => {
    if (searchUser.length > 2) {
      searchHandler();
    } else if (searchUser.length < 2) {
      setSearchUserArray([]);
    }
  }, [searchUser]);

  ///////////////////////////

  /////////////////////////
  const getProfile = (id) => {
    async function myApp() {
      const res = await fetch(`${apiUrl}/api/CyUsers/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          setProfileDetail(result);
        });
    }
    myApp();
  };
  /////////////////////////////////
  const getcustomerItem = () => {
    async function myAppGetcustomer() {
      const res = await fetch(`${apiUrl}/api/CyUsers/GetUserByType/1`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setcustomerArray(result);
        });
    }
    myAppGetcustomer();
  };
  //////////////////////
  const deleteHandler = (id) => {
    swalWithBootstrapButtons
      .fire({
        title: "آیا از حذف اطمینان دارید؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله",
        cancelButtonText: "خیر ",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          async function myAppDelet() {
            const res = await fetch(`${apiUrl}/api/CyUsers/${id}`, {
              method: "DELETE",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => console.log(res))
              .then((result) => {
                swalWithBootstrapButtons
                  .fire({
                    title: "حذف انجام شد!",
                    icon: "success",
                  })
                  .then((result) => {
                    getcustomerItem();
                  });
              });
          }
          myAppDelet();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "حذف انجام نشد",
            icon: "error",
          });
        }
      });
    // reset(
    //   setValue('')
    // )
  };
  /////////////////////

  //////////////////
  // useEffect(()=>{
  //   getProfile()
  // },[localToken])

  useEffect(() => {
    cmsContext.setFlagClass(false);
    getcustomerItem();

    return () => cmsContext.setFlagClass(true);
  }, []);

  return (
    <div className="container ">
      <div className="row">
        <div className="col-12 col-sm-9 customer-col9">
          {customerArray.length == 0 ? (
            <div className="customer-colsm9-div">
              <DotLoader
                color="#0d6efd"
                loading
                size={150}
                speedMultiplier={1}
              />
            </div>
          ) : (
            <DataTable title={"لیست کاربران :"}>
              <div className="customer-div-input login-label-float">
                <div className="centerr">
                  <input
                    type="text"
                    placeholder="نام مشتری را جستجو کن ..."
                    onChange={(e) => changSearchHandlet(e)}
                    value={searchUser}
                  />
                  {/* <span><button className='btn btn-warning'
  onClick={()=>{
    searchHandler()
  }}
  >بگرد</button></span> */}
                </div>

                <div
                  className={
                    searchUserArray.length != 0
                      ? "customer-search-div customer-show"
                      : "customer-search-div"
                  }
                >
                  {searchUserArray.length != 0 && (
                    <table className="table table-primary">
                      <thead>
                        <tr key="">
                          <th>شناسه مشتری</th>
                          <th>نام خانوادگی</th>
                          <th>شماره همراه</th>
                        </tr>
                      </thead>

                      <tbody>
                        {searchUserArray?.map((item) => (
                          <tr key={item.id}>
                            <td>{item.cyUserID}</td>
                            <td>{item.name}</td>
                            <td>{item.mobile}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <table
                className={
                  !homeContext.themContext
                    ? "table table-striped  user-table"
                    : "table table-striped table-dark user-table"
                }
              >
                <thead>
                  <tr>
                    <th>شماره</th>
                    <th>نام </th>
                    <th>نام خانوادگی </th>
                    <th>موبایل </th>
                    <th>شناسه</th>
                    <th>جزییات/حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {customerArrayRevers.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.family}</td>
                      <td>{item.mobile}</td>
                      <td>{item.cyUserID}</td>
                      <td>
                        <button
                          className="btn btn-info customer-editbut"
                          onClick={() => {
                            getProfile(item.cyUserID);
                            setShow(true);
                          }}
                        >
                          ...
                        </button>
                        <button
                          className="btn btn-danger customer-deletbut"
                          onClick={() => deleteHandler(item.cyUserID)}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataTable>
          )}
        </div>
      </div>

      <Modal fullscreen={fullscreen} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Body>
            <table className="table ">
              <thead>
                <tr key="">
                  <th>نام </th>
                  <th>نام خانوادگی</th>
                  <th>شماره همراه</th>
                  <th>شناسه </th>
                  <th>نام کاربری</th>
                  <th>ایمیل</th>
                  <th>نام دانشگاه - شرکت یا موسسه</th>
                  {/* <th>توضیحات</th> */}
                  {/* <th>تصویر</th> */}
                </tr>
              </thead>

              <tbody>
                {profileDetail && (
                  <tr key="">
                    <td>{profileDetail.name}</td>
                    <td>{profileDetail.family}</td>
                    <td>{profileDetail.mobile}</td>
                    <td>{profileDetail.cyUserID}</td>
                    <td>{profileDetail.username}</td>

                    <td>{profileDetail.email}</td>
                    <td>{profileDetail.website}</td>
                    {/* <td>{profileDetail.description}</td>
  <td>  {<img src={profileDetail.userImageUrl ?  profileDetail.userImageUrl: "../../../../images/40166.png"} alt='' /> }</td> */}
                  </tr>
                )}
              </tbody>
            </table>
          </Modal.Body>
        </Modal.Header>
      </Modal>
    </div>
  );
}
