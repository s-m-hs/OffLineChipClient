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
import BaseGrid from "../../Grid/BaseGrid";
import { RotateLeft } from "@mui/icons-material";
import ApiPutX0 from "../../../utils/ApiServicesX/ApiPutX0";

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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const registerOptions = {
    userName: { required: "userName is required" },
    password: { required: "password is required" },
    userStatus: { required: "userStatus is required" },
    userType: { required: "userType is required" },
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

  const [colDefs] = useState([
    { field: '', headerName: "شماره" },
    { field: 'userName', headerName: "نام کاربری" },
    {
      field: 'userType', headerName: "سمت", cellRenderer: (params) => (
        <span>{userUserType.filter((filter) => { return filter.UserTypeId == params.data.userType })[0] &&
          userUserType.filter(filter => { return filter.UserTypeId == params.data.userType })[0].UserType
        } </span>
      )
    },
    { field: 'access', headerName: "سطح دسترسی" },
    { field: 'vahed', headerName: "واحد" },
    { field: 'group', headerName: "گروه" },
    {
      field: 'status', headerName: "وضعیت کاربر", cellRenderer: (params) => (
        <span>
          {userStatus.filter((filter) => {
            return filter.statusId == params.data.userStatus
              ;
          })[0] &&
            userStatus.filter((filter) => {
              return filter.statusId == params.data.userStatus
                ;
            })[0].status}
        </span>
      )
    },
    {
      field: '', headerName: "ویرایش/حذف", minWidth: 250, cellRenderer: (params) => (
        <>
          <button
            className="btn btn-info user-editbut"
            onClick={() =>
              editHandler(
                params.data.id,
                params.data.userName,
                params.data.userStatus,
                params.data.userType,
                params.data.accessID,
                params.data.vahedID,
                params.data.groupID,

              )
            }
          >
            ویرایش
          </button>
          <button
            className="btn btn-danger user-deletbut"
            onClick={() => deleteHandler(params.data.id)}
          >
            حذف
          </button>
        </>
      )
    },
  ])
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
    console.log(data)
    if (!flagUpdate) {
      let obj = {
        id: null,
        cyUsNm: data.userName,
        cyHsPs: data.password,
        status: Number(data.userStatus),
        userType: Number(data.userType),
        accessTableID: data.accessLevel,
        cyGoroohID: data.group,
        cyVahedID: data.vahed
      };
      ApiPostX("/api/CyUsers", obj, funcA);
    } else if (flagUpdate) {
      let obj = {
        id: putId,
        cyUsNm: data.update.userName,
        cyHsPs: data.update.password,
        status: Number(data.update.userStatus),
        userType: Number(data.update.userType),
        accessTableID: (data.update.accessLevel),
        cyGoroohID: (data.update.group),
        cyVahedID: (data.update.vahed)
      };
      ApiPutX("/api/CyUsers", putId, obj, funcB);
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
      userStatus: data[2],
      userType: data[3],
      accessLevel: data[4],
      vahed: data[5],
      group: data[6],
    });
  };
  /////////////////
  const resetUpdatField = () => {
    setFlagUpdate(false);
    reset(setValue(""));
  };
  //////////////////
  // const selectedVahed = 'watch(!flagUpdate ? "vahed" : "update.vahed")';
  const selectedVahed = watch(!flagUpdate ? "vahed" : "update.vahed");
  const selectedVahedB = watch(!flagUpdate ? "userType" : "update.userType");

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
                  errors.userType
                    ? "user-col3-select formerror"
                    : "user-col3-select"
                }
                {...register(
                  !flagUpdate ? "userType" : "update.userType",
                  registerOptions.userType
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






              <div className="user-resticon">
                <RotateLeft style={{ fontSize: "35px", color: " #74C0FC" }} onClick={resetUpdatField} />

              </div>


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
              <>
                <BaseGrid rowData={userArray} colDefs={colDefs} tableWidth="600px" rtl={true} />



              </>



            )}
          </div>
        </div>
      </div>

    </>

  );
}
