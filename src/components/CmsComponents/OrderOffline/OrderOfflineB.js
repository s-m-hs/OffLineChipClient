import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import "./OrderOffline.css"
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2'
import BaseGrid from '../../Grid/BaseGrid'
import DateFormat from '../../../utils/DateFormat';
import Modal from "react-bootstrap/Modal";
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import alertA from '../../../utils/AlertFunc/AlertA';
import ApiGetX3 from '../../../utils/ApiServicesX/ApiGetX3';
import AlertError from '../../../utils/AlertFunc/AlertError';
import { useForm } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";

import { Eye } from "@phosphor-icons/react";
import { Link } from 'react-router-dom';
import ApiPostX from '../../../utils/ApiServicesX/ApiPostX';
import LodingA from '../../../utils/LodingA';
import AlertQ from '../../../utils/AlertFunc/AlertQ';
import { ArrowBack, CheckCircleOutline, CheckCircleRounded, CheckCircleSharp, Download, Edit } from '@mui/icons-material';
import ApiPuX2 from '../../../utils/ApiServicesX/ApiPutX2';
import DownloadFile from '../../../utils/DownloadFile';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ChangeUplode from '../../../utils/ChangeUplode';
import apiUrl from '../../../utils/ApiConfig';
import getRowClass from './RowClass';
import ChatPanel from './ChatPanel';

export default function OrderOfflineB(props) {
    const { userDetail, orderDetails, setOrderDetails } = useContext(CmsContext)
    // const { orderDetails, setOrderDetails } = useContext(FactorContext)
    const [userOrders, setUserOrders] = useState([])
    const [orderItemS, setOrderItemS] = useState([])
    const [orderItemSDetails, setOrderItemSDetails] = useState([])
    const [show, setShow] = useState(false);
    const [showB, setShowB] = useState(false);
    const [approvalsList, setApprovalsList] = useState([]);
    const [orderId, setOrderId] = useState('')
    const [creatorName, setCreatorName] = useState('')

    const [cellState, setCellState] = useState('')
    const [cellStateB, setCellStateB] = useState('')
    const [appravlDetal, setAppravlDetal] = useState([])
    const gridRef = useRef();
    const userRole = userDetail?.role;
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [orderStatus, setOrderStatus] = useState('')
    const [orderNextStatus, setOrderNextStatus] = useState('')

    const [orderStatusEnum, setOrderStatusEnum] = useState('')
    const [startOrderDate, setStartOrderDate] = useState('')


    const [orderItemId, setOrderItemId] = useState('')
    const [itemQuntity, setItemQuntity] = useState('')
    const [file, setFile] = useState({});
    const [guId, setGuId] = useState("");
    const [orderItemExel, setOrderItemExel] = useState([])
    const [isShowMessage, setIsShowMessage] = useState(false)
    const [allMessageA, setAllMessageA] = useState([])
    const [getMentionList, setGetMentionList] = useState([])
    const [mentionList, setMentionList] = useState([])
    const [messageType, setMessageType] = useState(1)
    const [ChatguId, setChatguId] = useState("");
    const [getInviteList, setGetInviteList] = useState([])
    const [inviteList, setInviteList] = useState([])
    const novin = 2
    const bom = 1
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        getValues,
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

    ////////////////////////////////////

    const funcB = (result) => {
        AlertError(`${result}`)

    }


    const checkboxCellRenderer = useCallback((params) => {
        // console.log(params.data.levelOk)
        const field = params.colDef.field;
        // console.log(params)
        const role = field;
        const isEditable = userRole === role;
        const value = params.value ?? false;
        const isFirstRow = params.node.rowIndex === 0;

        const handleSelectAll = () => {
            const newValue = !value;
            gridRef.current?.api.forEachNode(node => {
                node.setDataValue(field, newValue);
                // updateApproval(node.data.id, role, newValue);
            });
        };

        return (
            <div style={{
                height: '40px',        // ✅ fixed height
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2px',
                boxSizing: 'border-box'
            }}

                ////////با رویداد موس اینتر مختصات خانه جدول مشخص و به ای پی آی مربوط به تایید یه ان خانه فرستاده میشه 
                onMouseMove={() => {

                    // console.log(appravlDetal)
                    setCreatorName(params.data.creatorName)
                    // setCellState(params.data.id)
                    // setCellStateB(params.column.colId)
                    setAppravlDetal(params?.data?.approvals?.filter(filter => (
                        filter.isFirst && filter.roleName == role
                    ))[0])
                }

                }
                onMouseLeave={() => {
                    // setCellState('')
                    // setCellStateB('')
                    setAppravlDetal([])
                }}
            >
                {isFirstRow && isEditable && (
                    <button
                        className='order-btn-selectAll'
                        onClick={handleSelectAll}
                        style={{
                            // background: value ? '#dc3545' : '#28a745',
                            // color: 'white',
                            border: 'none',
                            borderRadius: '2px',
                            padding: '0 3px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '28px',
                            height: '14px',
                            lineHeight: '14px',
                            boxSizing: 'border-box'
                        }}
                        title='انتخاب گروهی'
                    // title={value ? 'همه را بردار' : 'همه را انتخاب کن'}
                    >
                        ✓
                        {/* {value ? '×' : '✓'} */}
                    </button>
                )}
                <input
                    type="checkbox"
                    checked={value}
                    disabled={!isEditable}
                    onChange={(e) => {
                        const newValue = e.target.checked;
                        params.setValue(newValue);
                        // updateApproval(params.data.id, role, newValue);
                    }}
                    style={{
                        width: '14px',
                        height: '14px',
                        margin: 0,
                        transform: 'translateY(0px)'  // ✅ no shift
                    }}
                />
            </div>
        );
    }, [userRole, appravlDetal, orderItemS]);////با این استیتها زمان رندر شدن مجدد اطلاعت پشت خانه های جدول مشخص


    ////////////گرفتن اطلاعات تاییده هر خانه
    // useEffect(() => {
    //     if (cellState && cellStateB) {
    //         ApiGetX3(`/api/CyOrdersB/getApprovalDetail?id=${cellState}&userTypeStrng=${cellStateB}`, setAppravlDetal, funcB)
    //     }
    // }, [cellStateB])


    const colDefs = useMemo(() => [
        {
            headerName: "ردیف",
            width: 80,
            valueGetter: (params) => params.node.rowIndex + 1,
            suppressHeaderMenuButton: true,
            sortable: false,
            filter: false,
        },
        {
            field: 'orderStatus', headerName: "وضعیت سفارش", width: 200, cellStyle: { color: 'red', 'font-weight': '600' }, cellRenderer: (params) => (
                <span>{orderStatusList.filter(filter => (filter.statusId === params.data.orderStatus))[0]?.status}</span>)
        },
        {
            headerName: 'مشاهده/دانلود', width: 200,
            cellRenderer: (params) => (
                <>
                    <button
                        className='btn btn-light '
                        style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                        onClick={() => {
                            getOrderDetail(params.data.id)
                            setOrderId(params.data.id)
                            setOrderDetails(params.data)
                            setOrderStatusEnum(params.data.orderStatus)
                            setStartOrderDate(params.data.startOrderDate)
                            // console.log(params)
                        }}
                    >
                        <Eye />
                    </button>

                    <button
                        className='btn btn-light '
                        style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                        onClick={() => {
                            downloadExcel(params.data.id)
                        }}
                    >
                        <Download />
                    </button>
                </>

            )
        },
        { field: 'id', headerName: "شماره سفارش", width: 200 },
        { field: 'orderCode', headerName: "کد پروژه", width: 200 },
        { field: 'cyVahed', headerName: "واحد", width: 200 },
        { field: 'cyGorooh', headerName: "گروه", width: 200 },
        {
            field: "createDate",
            headerName: "تاریخ ثبت سفارش",
            width: 200,
            cellRenderer: (params) => <DateFormat dateString={params.value} />,
        },
        { field: 'totalAmount', headerName: "مبلغ سفارش" },

    ], []);

    const colDefsB = useMemo(() => [
        {
            headerName: "ردیف",
            width: 100,      // ✅ fixed کوچکتر
            minWidth: 100,
            maxWidth: 100,
            valueGetter: (params) => params.node.rowIndex + 1,
            suppressHeaderMenuButton: true,
            sortable: false,
            filter: false,
            cellRenderer: (params) => (
                <div className='order-tooltib-main-div'>
                    <button className='order-tooltib-but'
                        style={{
                            backgroundColor: params.data.levelOk == 10 ? '#f1c40f' :
                                params.data.levelOk == 12 ? '#e74c3c' :
                                    params.data.levelOk == 13 ? '#3498db' :
                                        params.data.levelOk == 15 ? '#07bc0c' : '#fff'
                        }}
                    >{params.node.rowIndex + 1}</button>
                </div>


            )
        },
        {
            field: 'ویرایش/ثبت', headerName: " ویرایش ",
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
            cellRenderer: (params) => (
                <>
                    {/* چک کردن این شرط که آیا با لولاوکی برابر با 15 و تاییدیه مربوط به ستون اول و با رولنیم مدیرکل ایا ایتم با تایید فالس هست
                     یا 
                    چک کردن این شرط که آیا با لولاوکی برابر با 13 و تاییدیه مربوط به ستون اول و با رولنیم مدیرواحد ایا ایتم  با تایید فالس هست یا  */}
                    {(orderStatusEnum == 15 || orderStatusEnum == 30) &&
                        ((params.data.levelOk == 15 && !params.data.approvals.some(item => (
                            ((item.roleName == "GeneralManager") && item.isFirst && item.isApproved == false)))) ||
                            (params.data.levelOk == 13 && !params.data.approvals.some(item => (
                                ((item.roleName == "DepartmentManager") && item.isFirst && item.isApproved == false)))))
                        &&
                        (<button className='btn btn-secondary'
                            onClick={() => {
                                showOrderDetail(params.data)
                                console.log(params)
                            }

                            }>
                            <Edit style={{ color: '#fff' }} />
                        </button>)
                    }
                </>

            )
        },
        {
            field: 'partNumber', headerName: "پارت نامبر", width: 300,      // ✅ fixed کوچکتر
            minWidth: 300,
            maxWidth: 300,


        },
        {
            field: 'quantity', headerName: " تعداد", width: 100,      // ✅ fixed کوچکتر
            minWidth: 100,
            maxWidth: 100,
        },
        {
            field: 'manufacturer', headerName: "شرکت سازنده",
            width: 200,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,
        },

        {
            field: 'unitPrice', headerName: "قیمت واحد",
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
        },
        {
            field: 'totalPrice', headerName: "قیمت مجموع",
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
        },

        {
            field: 'duration', headerName: "زمان تأمین",
            width: 130,      // ✅ fixed کوچکتر
            minWidth: 130,
            maxWidth: 130,

        },

        {
            field: 'inSupplyStatus', headerName: "وضعیت تأمین",
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
        },
        {
            field: 'creatorCommentA', headerName: " توضیحات مشتری",
            width: 200,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 250,
        },
        {
            field: 'commentB', headerName: " توضیحات تامین کننده",
            width: 200,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 250,
        },


        // Approval columns با دکمه "همه" در ردیف اول
        // {
        //     headerName: "کارشناس گروه",
        //     field: 'GroupExpert',
        //     width: 150,      // ✅ fixed کوچکتر
        //     minWidth: 150,
        //     maxWidth: 150,
        //     tooltipField: 'partNumber',
        //     tooltipComponent: CustomTooltip,
        //     cellRenderer: checkboxCellRenderer,
        //     cellEditor: 'agCheckboxCellEditor',
        //     // editable: (params) => userRole === 'GroupExpert',
        //     valueGetter: (params) => {

        //         const approval = approvalsList?.find(a =>
        //             a.cyOrderItemID === params.data.id && a.role === 10 ///<===شرط نمایش تیک چک باکس
        //         );
        //         return approval?.isApproved ?? false;
        //     }
        // },
        // {
        //     headerName: "مدیر گروه",
        //     field: 'GroupManager',
        //     width: 150,      // ✅ fixed کوچکتر
        //     minWidth: 150,
        //     maxWidth: 150,
        //     tooltipField: 'partNumber',
        //     tooltipComponent: CustomTooltip,
        //     cellRenderer: checkboxCellRenderer,
        //     cellEditor: 'agCheckboxCellEditor',
        //     // editable: (params) => userRole === "GroupManager",
        //     valueGetter: (params) => {
        //         const approval = approvalsList?.find(a =>
        //             a.cyOrderItemID === params.data.id && a.role === 12 ///<===شرط نمایش تیک چک باکس
        //         );
        //         return approval?.isApproved ?? false;
        //     }
        // },
        // {
        //     headerName: "مدیر واحد",
        //     field: 'DepartmentManager',
        //     width: 150,      // ✅ fixed کوچکتر
        //     minWidth: 150,
        //     maxWidth: 150,
        //     tooltipField: 'partNumber',
        //     tooltipComponent: CustomTooltip,
        //     cellRenderer: checkboxCellRenderer,
        //     cellEditor: 'agCheckboxCellEditor',
        //     // editable: (params) => userRole === 'DepartmentManager',
        //     valueGetter: (params) => {
        //         const approval = approvalsList?.find(a =>
        //             a.cyOrderItemID === params.data.id && a.role === 13 ///<===شرط نمایش تیک چک باکس
        //         );
        //         return approval?.isApproved ?? false;
        //     }
        // },
        // {
        //     headerName: "مدیر کل",
        //     field: 'GeneralManager',
        //     width: 150,      // ✅ fixed کوچکتر
        //     minWidth: 150,
        //     maxWidth: 150,
        //     tooltipField: 'partNumber',
        //     tooltipComponent: CustomTooltip,
        //     cellRenderer: checkboxCellRenderer,
        //     cellEditor: 'agCheckboxCellEditor',
        //     // editable: (params) => userRole === 'GeneralManager',
        //     valueGetter: (params) => {
        //         const approval = approvalsList?.find(a =>
        //             a.cyOrderItemID === params.data.id && a.role === 15 ///<===شرط نمایش تیک چک باکس
        //         );
        //         return approval?.isApproved ?? false;
        //     }
        // }
    ], [userRole, approvalsList, checkboxCellRenderer, showB]);

    ////////////////////////////////////////
    const funcG = (result) => {
        alertA(result.msg)
        getAllOrder()
        setShow(false)
    }
    const ChangeOrderStatus = () => {
        ApiGetX3(`/api/CyOrdersB/changeOrderStatusB?orderId=${orderId}`, funcG, funcB)
    }
    // بقیه توابع بدون تغییر...
    const handleSave = () => {
        AlertQ("آیا از تایید فرایند سفارش اطمینان دارید ؟", "تایید لغو شد", ChangeOrderStatus)
    };

    const defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,

        suppressSizeToFit: true,
    };


    const getAllOrder = () => {
        const url = props.status == "allOrder" ? `/api/CyOrdersB/UserOrderC` :
            props.status == "inQuring" ? `/api/CyOrdersB/UserOrderC?status=${15}` :
                props.status == "inOrderToSupply" ? `/api/CyOrdersB/UserOrderC?status=${25}` :
                    props.status == "inSupply" ? `/api/CyOrdersB/UserOrderC?status=${30}` : ''

        ApiGetX2(url, setUserOrders)
    }
    const getOrderDetail = (id) => {
        ApiGetX2(`/api/CyOrdersB/getOrderItems?orderId=${id}`, setOrderItemS)
    }


    const orderStatusList = [
        { id: 1, status: "ثبت سفارش", statusId: 10 },
        { id: 2, status: "در حال استعلام گیری", statusId: 15 },
        { id: 3, status: "در انتظار تایید مشتری", statusId: 20 },
        { id: 3, status: "در صف خرید", statusId: 25 },
        { id: 4, status: "در حال تامین", statusId: 30 },
        { id: 4, status: "خاتمه یافته", statusId: 35 },
        { id: 5, status: "خاتمه یافته", statusId: 40 },
        { id: 6, status: "", statusId: 45 },
        { id: 7, status: "تحویل داده شده", statusId: 50 },
        { id: 8, status: "لغو شده", statusId: -1 },
    ]
    const inSupplyStatus = [
        { id: 1, status: "در حال تامین" },
        { id: 2, status: "در حال ارسال" },
        { id: 3, status: "تحویل داده شده" },
    ]

    const showOrderDetail = (data) => {
        setOrderItemSDetails(data)
        setOrderItemId(data.id)
        setItemQuntity(data.quantity)
        setShowB(true)
    }
    const getOrderItem = () => {
        alertA("ویرایش ")
        getOrderDetail(orderId)
        setShowB(false)
    }
    const editeOrderItem = (data) => {
        let obj = {
            id: orderItemId,
            quantity: Number(itemQuntity),
            unitPrice: data.unitPrice ? data.unitPrice : 0,
            commentB: data.commentB,
            Duration: data.duration,
            totalPrice: data.unitPrice ? Number(itemQuntity) * data.unitPrice : 0,

        }
        ApiPuX2(`/api/CyOrdersB/updateOrderItem`, obj, getOrderItem)
    }
    const editeInsupplyStatus = () => {
        let obj = {
            id: orderItemId,
            inSupplyStatus: getValues("inSupplyStatus")

        }
        ApiPuX2(`/api/CyOrdersB/updateOrderItemSupplyStatus`, obj, getOrderItem)
    }


    /////////////
    const downloadExcel = async (id) => {
        const response = await fetch(
            `${apiUrl}/api/CyProductsB/downloadExell?orderId=${id}`
        );

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `Order_${orderId}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    ////////////////
    const getMessageA = (id, type) => {
        ApiGetX2(`/api/CyOrderMessage/GetMessagesByOrderID?OrderID=${id}&type=${type}`, setAllMessageA)
    }



    ////////////
    useEffect(() => {
        if (orderItemS?.length > 0) {
            setShow(true);
            const initialApprovals = [];
            orderItemS.forEach(element => {

                element.approvals.forEach(elementt => {
                    initialApprovals.push(elementt)
                });
            });
            setApprovalsList(initialApprovals)

        }



    }, [orderItemS])
    useEffect(() => {
        if (orderItemS?.length > 0) {
            setOrderStatus(orderStatusList?.filter(filter => (
                filter.statusId == orderDetails.orderStatus
            ))[0].status)
            setOrderNextStatus(orderStatusList?.filter(filter => (
                filter?.statusId == (orderDetails?.orderStatus + 5)
            ))[0]?.status)
        }
    }, [orderDetails, orderItemS])

    useEffect(() => {
        getAllOrder()
        setFile('')
    }, [])

    useEffect(() => {
        if (showB && orderItemSDetails?.length != 0) {
            setValue("unitPrice", orderItemSDetails.unitPrice)
            setValue("duration", orderItemSDetails.duration)
            setValue("commentB", orderItemSDetails.commentB)
        }
        if (!showB) {
            setGuId('')
            setFile('')
        }
    }, [showB])

    const funcA = () => [
        alertA('')
    ]
    const funcD = (id) => {
        setGuId(id);
    };
    const handleOrderItemExel = (result) => {
        setOrderItemExel(result)
        setShow(false)
        setLoadingFlag(false)
        setFile('')
        setGuId('')
    }
    const setError = (result) => {
        setLoadingFlag(false)
        AlertError(`${result}`)
        setFile('')
        setGuId('')
    }
    useEffect(() => {
        if (file?.name) {
            setLoadingFlag(true)
            ChangeUplode(file, funcA, funcD);
            // changeUplode();
        }
    }, [file]);
    useEffect(() => {
        if (guId) {
            ApiGetX3(`/api/CyProductsB/updateOrderByExell?input=${guId}&&orderId=${orderId}`, handleOrderItemExel, setError)
        }
    }, [guId])
    return (
        <div style={{ height: "700px" }}>



            {loadingFlag && <LodingA isShow={true} />
            }



            <BaseGrid rowData={userOrders} colDefs={colDefs} rtl={true} />


            <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
                <Modal.Header
                    dir='ltr'
                    closeButton
                >
                    <button className='btn btn-success disabled'>سمت : {userRole}</button>

                    <button
                        className='btn btn-light '
                        style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                        onClick={() => {
                            downloadExcel(orderId)
                        }}
                    >
                        <Download />
                    </button>

                    <div className='OrderOfflineB-exel-div  centerrc '>
                        {!loadingFlag && orderStatusEnum == 15 && <div className='boxSh'>
                            <span><UploadFileIcon />
                                بارگزاری فایل اکسل
                            </span>
                            <input
                                type="file"
                                // className="order-right-message-file-input"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>}

                    </div>

                </Modal.Header>
                <Modal.Body>
                    <div className="orderOffLine-wrapper " >

                        <ChatPanel
                            setIsShowMessage={setIsShowMessage}
                            isShowMessage={isShowMessage}
                            allMessageA={allMessageA}
                            mentionList={mentionList}
                            setMentionList={setMentionList}
                            setInviteList={setInviteList}
                            setChatguId={setChatguId}
                            ChatguId={ChatguId}
                            getMessageA={getMessageA}
                            orderId={orderId}
                            setLoadingFlag={setLoadingFlag}
                            // getMentionList={getMentionList}
                            // getInviteList={getInviteList}
                            // getInviteListS={getInviteListS}
                            setGetInviteList={setGetInviteList}
                            orderStatusEnum={orderStatusEnum}
                            userDetail={userDetail}
                            messageType={novin}
                            orderType={bom}
                            isPcb={false}
                        />



                        <div className={`orderOffLine-container-div ${isShowMessage ? 'shrink' : ''}`}>

                            <div style={{ height: "800px" }}>
                                <BaseGrid ref={gridRef}
                                    getRowClass={orderStatusEnum != 10 && getRowClass}
                                    rowData={[...orderItemS].sort((a, b) => {
                                        const dateA = new Date(a.createDate);
                                        const dateB = new Date(b.createDate);

                                        // برای مرتب‌سازی از جدید به قدیم (نزولی)
                                        return dateB - dateA;

                                        // اگر می‌خواهید از قدیم به جدید (صعودی) باشد، از کد زیر استفاده کنید:
                                        // return dateA - dateB;
                                    })} defaultColDef={defaultColDef} colDefs={colDefsB} rtl={true} />
                            </div>


                            <div className="orderoff-footer-div ">
                                <button className='orderOff-status-btn btn btn-warning '>وضعیت سفارش :{orderStatus}</button>

                                <button className='orderOff-status-btn btn btn-info '> زمان آغاز سفارش :<DateFormat dateString={startOrderDate} /></button>

                                {/* <span>تأیید شده: {approvalsList?.filter(a => a.isApproved).length}/{approvalsList?.length}</span> */}

                                {/* <span>{orderDetails.totalAmount}</span> */}
                                <span>{orderDetails.orderCode}</span>
                                {((userDetail.role == "PurchasingExpert" || userDetail.role == "PurchasingManager") && orderStatusEnum != 40) && (orderStatusEnum == 15 || orderStatusEnum == 25 || orderStatusEnum == 30) &&
                                    <button type='button'
                                        onClick={handleSave} className="btn btn-success">

                                        <span>تغییر به :</span>
                                        <ArrowBack size={40} style={{ color: '#f80606', margin: '2px' }} />

                                        <span>{orderNextStatus}</span>
                                    </button>
                                }

                            </div>
                        </div>

                    </div>



                </Modal.Body>
            </Modal>

            {/* const values = [true, "sm-down", "md-down", "lg-down", "xl-down", "xxl-down"]; */}

            <Modal size={'xl'} show={showB} onHide={() => setShowB(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    {/* نمایش فقط در مرحله در حال استعلام گیری */}
                    {orderItemSDetails?.length != 0 && orderStatusEnum == 15 &&
                        <form onSubmit={handleSubmit(editeOrderItem)}>
                            <table className='table'>
                                <thead>
                                    <tr key={orderItemSDetails.id}>
                                        <th>پارت نامبر</th>
                                        <th>قیمت </th>
                                        <th>زمان تامین</th>
                                        <th>توضیحات</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr key={orderItemSDetails.id}>
                                        <td>{orderItemSDetails.partNumber}
                                        </td>
                                        <td>
                                            <input type="number"{...register("unitPrice")} />
                                        </td>
                                        <td>
                                            <input type="text" {...register("duration")} />
                                        </td>
                                        <td>
                                            <input type="text" {...register("commentB")} />
                                        </td>
                                    </tr>
                                </tbody>
                                <button type='submit'
                                    className='btn btn-light'>
                                    <CheckCircleRounded style={{ color: "#fff" }} />
                                </button>

                            </table>
                        </form>

                    }

                    {orderItemSDetails?.length != 0 && orderStatusEnum == 30 &&

                        <>
                            <label className="user-col3-selectlabel">وضعیت تامین :</label>
                            <select
                                className={errors.vahed ? "user-col3-select formerror" : "user-col3-select"}
                                {...register("inSupplyStatus")}
                            >
                                <option value="">انتخاب کنید...</option>
                                {inSupplyStatus.map((item) => (
                                    <option key={item.id} value={item.status}>
                                        {" "}
                                        {item.status}
                                    </option>
                                ))}
                            </select>
                            <button type='button'
                                className='btn btn-secondary' onClick={() => editeInsupplyStatus()}>
                                <CheckCircleRounded style={{ color: "#fff" }} />
                            </button>
                        </>




                    }
                </Modal.Body>
            </Modal>


        </div>
    )
}
