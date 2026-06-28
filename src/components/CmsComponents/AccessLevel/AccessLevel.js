import React, { useEffect, useState } from 'react'
import "./AccessLevel.css"
import { useForm } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import BaseGrid from '../../Grid/BaseGrid';
import { AgGridReact } from 'ag-grid-react';
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2';
import apiUrl from '../../../utils/ApiConfig';
import alertA from '../../../utils/AlertFunc/AlertA';
import ApiDeleteX from '../../../utils/ApiServicesX/ApiDeleteX';
import ApiPostX from '../../../utils/ApiServicesX/ApiPostX';
import { RotateLeft } from '@mui/icons-material';
import ApiPuX2 from '../../../utils/ApiServicesX/ApiPutX2';
import ApiPutX from '../../../utils/ApiServicesX/ApiPutX';
import ApiPutX0 from '../../../utils/ApiServicesX/ApiPutX0';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
export default function AccessLevel() {
    const [flagUpdate, setFlagUpdate] = useState(false);
    const [allAccess, setAllAccess] = useState([]);
    const [putId, setPutId] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: { id: null },
    });
    const registerOptions = {
        text: { required: "text is required" },
        password: { required: "password is required" },
        userStatus: { required: "password is required" },
        userUserType: { required: "password is required" },
    };
    ///////////////////
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });
    const colDefs = [
        { field: 'text', headerName: 'عنوان', maxWidth: 200 },
        { field: 'allowCreateOrdere', headerName: ' 1', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowSeePriceOrder_OrderParts', headerName: '2', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowRequestInitialinquiry', headerName: '3', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowInviteToChat', headerName: '4', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowSeeOrders', headerName: '5', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowUploudInitialinquiry', headerName: '6', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowSentOrdersForInquiry', headerName: '7', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowSetCurrentOrdersStatusA', headerName: '8', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowSetCurrentOrdersStatusB', headerName: '9', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowAccessConfirmedOrdersForSupply', headerName: '10', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowAccessDeliveredOrders', headerName: '11', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowAccessCanceledOrders', headerName: '12', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowAccessAllOrders', headerName: '13', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowCanclePurchaseRequest', headerName: '14', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowUploudWarehouse', headerName: '15', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowAccessPurchasePanel', headerName: '16', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        { field: 'allowAccessUsersPanel', headerName: '17', valueFormatter: (p) => (p.value ? 'بله' : 'خیر') },
        {
            field: '', headerName: "عملیات", minWidth: 300, cellRenderer: (params) => (
                <>
                    <button style={{ width: "60px", height: "30px", margin: "1px", fontSize: "12px", padding: "1px" }} className='btn btn-info'
                        onClick={() => {
                            setPutId(params.data.id);
                            setFlagUpdate(true);
                            editHandler(
                                {
                                    text: params.data.text,
                                    allowCreateOrdere: params.data.allowCreateOrdere,
                                    allowSeePriceOrder_OrderParts: params.data.allowSeePriceOrder_OrderParts,
                                    allowRequestInitialinquiry: params.data.allowRequestInitialinquiry,
                                    allowInviteToChat: params.data.allowInviteToChat,
                                    allowSeeOrders: params.data.allowSeeOrders,
                                    allowUploudInitialinquiry: params.data.allowUploudInitialinquiry,
                                    allowSentOrdersForInquiry: params.data.allowSentOrdersForInquiry,
                                    allowSetCurrentOrdersStatusA: params.data.allowSetCurrentOrdersStatusA,
                                    allowSetCurrentOrdersStatusB: params.data.allowSetCurrentOrdersStatusB,
                                    allowAccessConfirmedOrdersForSupply: params.data.allowAccessConfirmedOrdersForSupply,
                                    allowAccessDeliveredOrders: params.data.allowAccessDeliveredOrders,
                                    allowAccessCanceledOrders: params.data.allowAccessCanceledOrders,
                                    allowAccessAllOrders: params.data.allowAccessAllOrders,
                                    allowCanclePurchaseRequest: params.data.allowCanclePurchaseRequest,
                                    allowUploudWarehouse: params.data.allowUploudWarehouse,
                                    allowAccessPurchasePanel: params.data.allowAccessPurchasePanel,
                                    allowAccessUsersPanel: params.data.allowAccessUsersPanel,
                                }
                            )
                        }


                        }
                    >ویرایش</button>
                    <button
                        onClick={() => deleteHandler(params.data.id)}
                        style={{ width: "60px", height: "30px", margin: "1px", fontSize: "12px", padding: "1px" }} className='btn btn-danger'>حذف</button>
                </>
            )
        },

    ];

    const funcA = () => {
        alertA("دسترسی جدید ایجاد شد ")
        getAccess()
        reset(setValue(""))
    }
    function funB() {
        alertA("دسترسی جدید با موفقیت ویرایش شد")
        getAccess()
        reset(setValue(""))

    }
    const handleRegistration = (data) => {
        if (!flagUpdate) {
            ApiPostX(`/api/CyAcces/addAccess`, data, funcA)

        } else {

            ApiPuX2(`/api/CyAcces/editAccess?id=${putId}`, data.update, funB)
        }

    }

    /////////////////////
    const editHandler = (data) => {
        setFlagUpdate(true);
        setValue("update", {
            text: data.text,
            AllowSeePriceOrder_OrderParts: data.allowSeePriceOrder_OrderParts,
            AllowCreateOrdere: data.allowCreateOrdere,
            AllowSeePriceOrder_OrderParts: data.allowSeePriceOrder_OrderParts,
            AllowRequestInitialinquiry: data.allowRequestInitialinquiry,
            AllowInviteToChat: data.allowInviteToChat,
            AllowSeeOrders: data.allowSeeOrders,
            AllowUploudInitialinquiry: data.allowUploudInitialinquiry,
            AllowSentOrdersForInquiry: data.allowSentOrdersForInquiry,
            AllowSetCurrentOrdersStatusA: data.allowSetCurrentOrdersStatusA,
            AllowSetCurrentOrdersStatusB: data.allowSetCurrentOrdersStatusB,
            AllowAccessConfirmedOrdersForSupply: data.allowAccessConfirmedOrdersForSupply,
            AllowAccessDeliveredOrders: data.allowAccessDeliveredOrders,
            AllowAccessCanceledOrders: data.allowAccessCanceledOrders,
            AllowAccessAllOrders: data.allowAccessAllOrders,
            AllowCanclePurchaseRequest: data.allowCanclePurchaseRequest,
            AllowUploudWarehouse: data.allowUploudWarehouse,
            AllowAccessPurchasePanel: data.allowAccessPurchasePanel,
            AllowAccessUsersPanel: data.allowAccessUsersPanel,
        });
    };
    /////////////////

    /////////////////
    const resetUpdatField = () => {
        setFlagUpdate(false);
        reset(setValue(""));
    };
    const getAccess = () => {
        ApiGetX2(`/api/CyAcces/getAccess`, setAllAccess)
    }

    const funcC = () => {
        getAccess()
        reset(setValue(""));
    };
    const deleteHandler = (id) => {
        ApiDeleteX("/api/CyAcces", `deleteAccess?id=${id}`, funcC);
    };
    useEffect(() => {
        getAccess()
    }, [])
    return (

        <div className='container'>

            <div className='row'>
                <div className="col-12 col-sm-2 access-col2">
                    <form
                        action=""
                        onSubmit={handleSubmit(handleRegistration)}
                    >
                        <input style={{ display: "none" }} type="text" name='id'  {...register("id")} />
                        <div className="login-label-float">
                            <input
                                name="text"
                                type="text"
                                placeholder=""
                                className={errors.text ? "formerror" : ""}
                                {...register(
                                    !flagUpdate ? "text" : "update.text",
                                    registerOptions.text
                                )}
                            />
                            <label> نام دسترسی</label>
                        </div>

                        <div >
                            <div className='access-div centerr '>
                                <label>1-</label>
                                <label>ایجاد درخواست</label>
                                <input {...register(!flagUpdate ? "AllowCreateOrdere" : "update.AllowCreateOrdere")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>2-</label>
                                <label> قیمت قطعات و قیمت کل سفارش </label>
                                <input {...register(!flagUpdate ? "AllowSeePriceOrder_OrderParts" : "update.AllowSeePriceOrder_OrderParts")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>3-</label>
                                <label>درخواست استعلام اولیه </label>
                                <input {...register(!flagUpdate ? "AllowRequestInitialinquiry" : "update.AllowRequestInitialinquiry")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>4-</label>
                                <label> دعوت به گفتگو</label>
                                <input {...register(!flagUpdate ? "AllowInviteToChat" : "update.AllowInviteToChat")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>5-</label>
                                <label>  مشاهده سفارشات</label>
                                <input {...register(!flagUpdate ? "AllowSeeOrders" : "update.AllowSeeOrders")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>6-</label>
                                <label>بارگذاری استعلام سفارشات </label>
                                <input {...register(!flagUpdate ? "AllowUploudInitialinquiry" : "update.AllowUploudInitialinquiry")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>7-</label>
                                <label>   سفارشات ارسال شده جهت اسعلام گیری </label>
                                <input {...register(!flagUpdate ? "AllowSentOrdersForInquiry" : "update.AllowSentOrdersForInquiry")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>8-</label>
                                <label> تعیین وضعیت سفارشات جاری(تحویل شده، در حال ارسال و یا در حال تامین)</label>
                                <input {...register(!flagUpdate ? "AllowSetCurrentOrdersStatusA" : "update.AllowSetCurrentOrdersStatusA")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>9-</label>
                                <label>تغییر وضعیت سفارش از حالت درانتظار تایید مشتری به در حال تامین </label>
                                <input {...register(!flagUpdate ? "AllowSetCurrentOrdersStatusB" : "update.AllowSetCurrentOrdersStatusB")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>10-</label>
                                <label>  سفارشات تایید شده مشتری جهت تامین</label>
                                <input {...register(!flagUpdate ? "AllowAccessConfirmedOrdersForSupply" : "update.AllowAccessConfirmedOrdersForSupply")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>11-</label>
                                <label>  سفارشات تحویل شده </label>
                                <input {...register(!flagUpdate ? "AllowAccessDeliveredOrders" : "update.AllowAccessDeliveredOrders")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>12-</label>
                                <label>  سفارشات لغو شده  </label>
                                <input {...register(!flagUpdate ? "AllowAccessCanceledOrders" : "update.AllowAccessCanceledOrders")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>13-</label>
                                <label>  تمامی سفارشات </label>
                                <input {...register(!flagUpdate ? "AllowAccessAllOrders" : "update.AllowAccessAllOrders")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>14-</label>
                                <label>لغو درخواست خرید </label>
                                <input {...register(!flagUpdate ? "AllowCanclePurchaseRequest" : "update.AllowCanclePurchaseRequest")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>15-</label>
                                <label>بارگذاری و موجودی انبار </label>
                                <input {...register(!flagUpdate ? "AllowUploudWarehouse" : "update.AllowUploudWarehouse")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>16-</label>
                                <label>  پنل بخش خرید </label>
                                <input {...register(!flagUpdate ? "AllowAccessPurchasePanel" : "update.AllowAccessPurchasePanel")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>17-</label>
                                <label>  پنل حساب های کاربران </label>
                                <input {...register(!flagUpdate ? "AllowAccessUsersPanel" : "update.AllowAccessUsersPanel")} type="checkbox" />
                            </div>

                        </div>


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
                <div className="col-12 col-sm-10 Access-col10">
                    {/* <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                        <span>sads</span>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                        />
                    </div> */}

                    <BaseGrid rowData={allAccess} minWidth={100} colDefs={colDefs} rtl={true} />

                </div>

            </div>
        </div>
    )
}
