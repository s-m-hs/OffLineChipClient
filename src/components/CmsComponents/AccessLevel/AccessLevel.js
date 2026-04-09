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
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
export default function AccessLevel() {
    const [flagUpdate, setFlagUpdate] = useState(false);
    const [allAccess, setAllAccess] = useState([]);
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
        // {
        //     headerName: 'عملیات', maxWidth: 200,
        //     cellRenderer: (params) => (
        //         <>
        //             <button className='btn btn-info' style={{ width: "30px", height: "15px", margin: "1px", fontSize: "8px", padding: "1px" }} onClick={() => console.log(params)}>+</button>
        //             <button className='btn btn-danger' style={{ width: "30px", height: "15px", margin: "1px", fontSize: "8px", padding: "1px" }} onClick={() => deleteHandler(params.data.id)}>×</button>
        //         </>
        //     )
        // }

    ];

    const handleRegistration = (data) => {
        console.log(data)
        async function myApp() {
            const res = await fetch(`${apiUrl}/api/CyAcces/addAccess`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }).then(res => {
                console.log(res)
                if (res.ok) {
                    alertA("دسترسی جدید ایجاد شد ")
                    getAccess()
                }
            })
        }
        myApp()
    }


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
                                <input {...register("AllowCreateOrdere")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>2-</label>
                                <label> قیمت قطعات و قیمت کل سفارش </label>
                                <input {...register("AllowSeePriceOrder_OrderParts")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>3-</label>
                                <label>درخواست استعلام اولیه </label>
                                <input {...register("AllowRequestInitialinquiry")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>4-</label>
                                <label> دعوت به گفتگو</label>
                                <input {...register("AllowInviteToChat")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>5-</label>
                                <label>  مشاهده سفارشات</label>
                                <input {...register("AllowSeeOrders")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>6-</label>
                                <label>بارگذاری استعلام سفارشات </label>
                                <input {...register("AllowUploudInitialinquiry")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>7-</label>
                                <label>   سفارشات ارسال شده جهت اسعلام گیری </label>
                                <input {...register("AllowSentOrdersForInquiry")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>8-</label>
                                <label> تعیین وضعیت سفارشات جاری(تحویل شده، در حال ارسال و یا در حال تامین)</label>
                                <input {...register("AllowSetCurrentOrdersStatusA")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>9-</label>
                                <label>تغییر وضعیت سفارش از حالت درانتظار تایید مشتری به در حال تامین </label>
                                <input {...register("AllowSetCurrentOrdersStatusB")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>10-</label>
                                <label>  سفارشات تایید شده مشتری جهت تامین</label>
                                <input {...register("AllowAccessConfirmedOrdersForSupply")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>11-</label>
                                <label>  سفارشات تحویل شده </label>
                                <input {...register("AllowAccessDeliveredOrders")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>12-</label>
                                <label>  سفارشات لغو شده  </label>
                                <input {...register("AllowAccessCanceledOrders")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>13-</label>
                                <label>  تمامی سفارشات </label>
                                <input {...register("AllowAccessAllOrders")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>14-</label>
                                <label>لغو درخواست خرید </label>
                                <input {...register("AllowCanclePurchaseRequest")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>15-</label>
                                <label>بارگذاری و موجودی انبار </label>
                                <input {...register("AllowUploudWarehouse")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>16-</label>
                                <label>  پنل بخش خرید </label>
                                <input {...register("AllowAccessPurchasePanel")} type="checkbox" />
                            </div>
                            <div className='access-div centerr'>
                                <label>17-</label>
                                <label>  پنل حساب های کاربران </label>
                                <input {...register("AllowAccessUsersPanel")} type="checkbox" />
                            </div>

                        </div>


                        {flagUpdate && (
                            <div className="user-resticon">
                                <i
                                    class="fa-solid fa-rotate-left fa-2xl"
                                    style={{ color: " #74C0FC" }}
                                // onClick={resetUpdatField}
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
                <div className="col-12 col-sm-10 Access-col10">
                    {/* <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                        <span>sads</span>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                        />
                    </div> */}

                    <BaseGrid rowData={allAccess} colDefs={colDefs} maxWidth='150' rtl={true} />

                </div>

            </div>
        </div>
    )
}
