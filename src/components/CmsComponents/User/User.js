import React, { useState, useEffect, useContext } from "react";
import "./User.css";
import { CmsContext, HomeContext } from "../../../context/CmsContext";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import DataTable from "../DataTable/DataTable";
import Swal from "sweetalert2";
import DotLoader from "react-spinners/DotLoader";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../../utils/ApiConfig";
import alertA from "../../../utils/AlertFunc/AlertA";
import ApiPostX from "../../../utils/ApiServicesX/ApiPostX";
import ApiPutX from "../../../utils/ApiServicesX/ApiPutX";
import ApiGetX from "../../../utils/ApiServicesX/ApiGetX";
import ApiDeleteX from "../../../utils/ApiServicesX/ApiDeleteX";
import ApiGetX2 from "../../../utils/ApiServicesX/ApiGetX2";

export default function User() {
  const [userArray, setuserArray] = useState([]);
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [putId, setPutId] = useState("");
  const navigate = useNavigate();
  const cmsContext = useContext(CmsContext);
  const homeContext = useContext(HomeContext);

  const [allAccess, setAllAccess] = useState([])
  const [allGroup, setAllGroup] = useState([])
  const [allVahed, setAllVahed] = useState([])
  // const headerAuth = `Bearer ${cmsContext.token.token}`;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const registerOptions = {
    userName: { required: "userName is required" },
    password: { required: "password is required" },
    userStatus: { required: "userStatus is required" },
    userUserType: { required: "userUserType is required" },
    accessLevel: { required: "accessLevel is required" },
  };
  ///////////////////
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  ////////////////////////////
  const userStatus = [
    { id: 1, status: "فعال", statusId: 0 },
    { id: 2, status: "مسدود", statusId: 1 },
    { id: 3, status: "غیرفعال", statusId: 2 },
  ];

  // {
  //     /// <summary>
  //     /// تعیین نقش نشده 
  //     /// </summary>
  //     NewUser = -1,
  //   AllType = 0,
  //     SysAdmin = 8,
  //     Reporter = 4,
  //     GroupExpert = 10,
  //     PurchasingExpert = 11,
  //     GroupManager = 12,
  //     DepartmentManager = 13,
  //     PurchasingManager = 14,
  //     GeneralManager = 15,
  //     CustomerAdmin = 16
  // }
  const userUserType = [
    { id: 1, UserType: "ادمین", UserTypeId: 8 },
    { id: 2, UserType: "بازرس", UserTypeId: 4 },
    { id: 3, UserType: "کارشناس گروه", UserTypeId: 10 },
    { id: 3, UserType: "کارشناس خرید", UserTypeId: 11 },
    { id: 4, UserType: "مدیر گروه", UserTypeId: 12 },
    { id: 5, UserType: "مدیرواحد", UserTypeId: 13 },
    { id: 6, UserType: "مدیر خرید", UserTypeId: 14 },
    { id: 6, UserType: "مدیر کل", UserTypeId: 15 },
    { id: 6, UserType: "ادمین پنل", UserTypeId: 16 },
  ];

  ////////////////////////////////
  const handleError = (errors) => { };

  const funcB = () => {
    alertA("ویرایش با موفقیت انجام شد");
    reset(setValue(""));
    setFlagUpdate(false);
    getuserItem();
  };
  const funcA = () => {
    alertA("کاربر با موفقیت اضافه شد");
    reset(setValue(""));
    getuserItem();
  };
  const handleRegistration = (data) => {
    // console.log(data)
    if (!flagUpdate) {
      let obj = {
        id: null,
        cyUsNm: data.userName,
        cyHsPs: data.password,
        status: Number(data.userStatus),
        userType: Number(data.userUserType),
        accessTableID: data.accessLevel,
        cyGoroohID: data.group,
        cyVahedID: data.vahed
      };
      // console.log(obj)
      ApiPostX("/api/CyUsers", obj, funcA);
    } else if (flagUpdate) {
      let obj = {
        id: putId,
        cyUsNm: data.update.userName,
        cyHsPs: data.update.password,
        status: Number(data.update.userStatus),
        userType: Number(data.update.userUserType),
        // accessTableID: 
        //   cyGoroohID:
        // cyVahedID:
      };
      ApiPutX("/api/CyUsers", putId, obj, funcB);

      // async function myAppPut() {
      //   const res = await fetch(`${apiUrl}/api/CyUsers/${putId}`, {
      //     method: 'PUT',
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(obj)
      //   }).then(res => {
      //     if (res.ok) {
      //       Swal.fire({
      //         position: "center",
      //         icon: "success",
      //         title: "ویرایش با موفقیت انجام شد",
      //         showConfirmButton: false,
      //         timer: 1500,
      //       });
      //       reset(
      //         setValue('')
      //       )
      //       setFlagUpdate(false)
      //       getuserItem()
      //     }
      //   }
      //   ).catch(err=>console.log(err))
      // }
      // myAppPut()
    }
  };
  /////////////////////////////////
  const getuserItem = () => {
    ApiGetX("/api/CyUsers/GetUserByType/0", setuserArray, navigate);
  };
  //////////////////////
  const funcC = () => {
    getuserItem();
    reset(setValue(""));
  };
  const deleteHandler = (id) => {
    ApiDeleteX("/api/CyUsers", id, funcC);
  };
  /////////////////////
  const editHandler = (...data) => {
    setPutId(data[0]);
    setFlagUpdate(true);
    setValue("update", {
      userName: data[1],
      password: data[2],
      userStatus: data[3],
      userUserType: data[4],
    });
  };
  /////////////////
  const resetUpdatField = () => {
    setFlagUpdate(false);
    reset(setValue(""));
  };
  //////////////////
  const selectedVahed = watch(!flagUpdate ? "vahed" : "update.vahed");
  const selectedVahedB = watch(!flagUpdate ? "userUserType" : "update.userUserType");

  useEffect(() => {
    if (selectedVahed) {
      ApiGetX2(
        `/api/CyGroupVahed/getGroupByVahed?id=${selectedVahed}`,
        setAllGroup
      );
    } else {
      setAllGroup([]);
    }
  }, [selectedVahed]);


  useEffect(() => {
    cmsContext.setFlagClass(false);
    getuserItem();
    ApiGetX2(`/api/CyAcces/getAccess`, setAllAccess)
    ApiGetX2(`/api/CyGroupVahed/getGroup`, setAllGroup)
    ApiGetX2(`/api/CyGroupVahed/getVahed`, setAllVahed)

    return () => cmsContext.setFlagClass(true);

  }, []);
  return (
    <>


      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-3 user-col3">
            <form
              action=""
              onSubmit={handleSubmit(handleRegistration, handleError)}
            >
              <div className="login-label-float">
                <input
                  name="userName"
                  type="text"
                  placeholder=""
                  className={errors.userName ? "formerror" : ""}
                  {...register(
                    !flagUpdate ? "userName" : "update.userName",
                    registerOptions.userName
                  )}
                />
                <label> نام کاربری</label>
              </div>
              <div className="login-label-float">
                <input
                  name="password"
                  type="text"
                  placeholder=""
                  className={errors.password ? "formerror" : ""}
                  {...register(
                    !flagUpdate ? "password" : "update.password",
                    registerOptions.password
                  )}
                />
                <label> رمزعبور</label>
              </div>

              <hr />

              <label className="user-col3-selectlabel"> وضعیت کاربر:</label>
              <select
                className={
                  errors.userStatus
                    ? "user-col3-select formerror"
                    : "user-col3-select"
                }
                {...register(
                  !flagUpdate ? "userStatus" : "update.userStatus",
                  registerOptions.userStatus
                )}
              >
                <option value="">انتخاب کنید...</option>
                {userStatus.map((item) => (
                  <option key={item.id} value={item.statusId}>
                    {" "}
                    {item.status}
                  </option>
                ))}
              </select>

              <hr />

              <label className="user-col3-selectlabel"> سمت کاربر:</label>
              <select
                className={
                  errors.userUserType
                    ? "user-col3-select formerror"
                    : "user-col3-select"
                }
                {...register(
                  !flagUpdate ? "userUserType" : "update.userUserType",
                  registerOptions.userUserType
                )}
              >
                <option value="">انتخاب کنید...</option>
                {userUserType.map((item) => (
                  <option key={item.id} value={item.UserTypeId}>
                    {" "}
                    {item.UserType}
                  </option>
                ))}
              </select>


              <hr />
              <label className="user-col3-selectlabel"> سطح دسترسی :</label>
              <select
                className={
                  errors.accessLevel
                    ? "user-col3-select formerror"
                    : "user-col3-select"
                }
                {...register(
                  !flagUpdate ? "accessLevel" : "update.accessLevel",
                  registerOptions.accessLevel
                )}
              >
                <option value="">انتخاب کنید...</option>
                {allAccess.map((item) => (
                  <option key={item.id} value={item.id}>
                    {" "}
                    {item.text}
                  </option>
                ))}
              </select>

              <hr />

              <label className="user-col3-selectlabel">واحد :</label>
              <select
                className="user-col3-select"
                {...register(
                  !flagUpdate ? "vahed" : "update.vahed"
                )}

                disabled={(selectedVahedB == 10 || selectedVahedB == 12 || selectedVahedB == 13) ? false : true}
              >
                <option value="">انتخاب کنید...</option>
                {allVahed.map((item) => (
                  <option key={item.id} value={item.id}>
                    {" "}
                    {item.text}
                  </option>
                ))}
              </select>

              <hr />
              <label className="user-col3-selectlabel">گروه :</label>
              <select
                className="user-col3-select"
                disabled={!selectedVahed}
                {...register(!flagUpdate ? "group" : "update.group")}
              >
                <option value="">انتخاب کنید...</option>
                {allGroup.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.text}
                  </option>
                ))}
              </select>





              {flagUpdate && (
                <div className="user-resticon">
                  <i
                    class="fa-solid fa-rotate-left fa-2xl"
                    style={{ color: " #74C0FC" }}
                    onClick={resetUpdatField}
                  ></i>
                </div>
              )}

              <Button
                className="user-regbutton"
                type="submit"
                variant="contained"
                color="info"
                endIcon={<SendIcon />}
              >
                {!flagUpdate ? <span> افزودن </span> : <span> ویرایش </span>}
              </Button>
            </form>
          </div>

          <div className="col-12 col-sm-9 user-col9">
            {userArray.length == 0 ? (
              <div className="user-colsm9-div">
                <DotLoader
                  color="#0d6efd"
                  loading
                  size={150}
                  speedMultiplier={1}
                />
              </div>
            ) : (
              <DataTable title={"لیست کاربران :"}>
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
                      <th>نام کاربری</th>
                      <th>سمت</th>
                      <th>سطح دسترسی</th>
                      <th>واحد</th>
                      <th>گروه</th>
                      <th>وضعیت کاربر</th>
                      <th>حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userArray.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.userName}</td>

                        <td>{userUserType.filter((filter) => { return filter.UserTypeId == item.userType })[0] &&
                          userUserType.filter(filter => { return filter.UserTypeId == item.userType })[0].UserType
                        } </td>

                        <td>{item.access}</td>
                        <td>{item.vahed}</td>
                        <td>{item.group}</td>


                        <td>
                          {userStatus.filter((filter) => {
                            return filter.statusId == item.userStatus
                              ;
                          })[0] &&
                            userStatus.filter((filter) => {
                              return filter.statusId == item.userStatus
                                ;
                            })[0].status}{" "}
                        </td>


                        <td>
                          {/* <button
                            className="btn btn-info user-editbut"
                            onClick={() =>
                              editHandler(
                                item.id,
                                item.cyUsNm,
                                item.cyHsPs,
                                item.status,
                                item.userType
                              )
                            }
                          >
                            ویرایش
                          </button> */}
                          <button
                            className="btn btn-danger user-deletbut"
                            onClick={() => deleteHandler(item.id)}
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
      </div>

    </>

  );
}
