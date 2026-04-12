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
import UploadFileIcon from "@mui/icons-material/UploadFile";

import {
    MagnifyingGlass,
    Plus,
    Barcode,
    Eye,
    Check,
    ArrowArcLeft,
    PlusCircle,
    Command

} from "@phosphor-icons/react";
import { Link } from 'react-router-dom';
import ApiPostX from '../../../utils/ApiServicesX/ApiPostX';
import LodingA from '../../../utils/LodingA';
import AlertQ from '../../../utils/AlertFunc/AlertQ';
import { Add, ArrowBack, CloseFullscreen, CloseOutlined, Download, ListAlt, ListAltSharp, PlusOne, Refresh, Send } from '@mui/icons-material';
import getRowClass from './RowClass';
import getRowClassB from './RowClassB';
import { RiArrowDropRightLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { RiArrowDropLeftLine } from "react-icons/ri";
import ChangeUplodeC from '../../../utils/ChangeUplodeC';
import ApiPostX0 from '../../../utils/ApiServicesX/ApiPostX0';
import DownloadFile from '../../../utils/DownloadFile';
import { List, Tooltip } from '@mui/material';
import { UserType } from '../../../utils/OrderStatusList';
import ChatPanel from './ChatPanel';


export default function OrderOffline(props) {
    const { userDetail, orderDetails, setOrderDetails } = useContext(CmsContext)
    // const { orderDetails, setOrderDetails } = useContext(FactorContext)
    const [userOrders, setUserOrders] = useState([])
    const [orderItemS, setOrderItemS] = useState([])
    const [show, setShow] = useState(false);
    const [showB, setShowB] = useState(false);
    const [showC, setShowC] = useState(false);
    const [showD, setShowD] = useState(false);
    const [approvalsList, setApprovalsList] = useState([]);
    const [approvalsListB, setApprovalsListB] = useState([]);
    const [orderId, setOrderId] = useState('')
    const [appravlDetal, setAppravlDetal] = useState([])
    const [creatorName, setCreatorName] = useState('')
    const gridRef = useRef();
    const userRole = userDetail?.role;
    const [searchInput, setSearchInput] = useState('')
    const [searchList, setSearchList] = useState([])
    const [currentSearchProduct, setCurrentSearchProduct] = useState('')
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [orderStatus, setOrderStatus] = useState('')
    const [orderNextStatus, setOrderNextStatus] = useState('')
    const [orderStatusEnum, setOrderStatusEnum] = useState('')
    const [startOrderDate, setStartOrderDate] = useState('')
    const [isTrue, setIsTrue] = useState(true)
    const [searchProductDetail, setSearchProductDetail] = useState([])
    const [falsApprovals, setFalsApprovals] = useState([])
    const [toNextState, setToNextState] = useState(false)
    const [isfirstState, setIsfirstState] = useState(true)
    const [isShowMessage, setIsShowMessage] = useState(false)
    const [guIdA, setGuIdA] = useState("");
    const [allMessageA, setAllMessageA] = useState([])
    const [getMentionList, setGetMentionList] = useState([])
    const [mentionList, setMentionList] = useState([])
    const [messageType, setMessageType] = useState(1)
    const [ChatguId, setChatguId] = useState("");
    const [getInviteList, setGetInviteList] = useState([])
    const [inviteList, setInviteList] = useState([])
    const faramoj = 1
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
    const CustomTooltip = (props) => {
        // داده‌های مربوط به آن سلول را دریافت می‌کنیم
        const data = props.api.getDisplayedRowAtIndex(props.rowIndex).data;

        return (<>
            {appravlDetal?.length != 0 && <div style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '8px', width: '300px' }}>
                <p className='tooltip-p'><h6>تایید کننده:  </h6> {appravlDetal?.userName}</p>
                <p className='tooltip-p'><h6>زمان آخرین تغییر:  </h6><DateFormat dateString={appravlDetal?.actionTime}></DateFormat> </p>
                <hr />
                <p className='tooltip-p'><h6>ایجادکننده:  </h6> {creatorName}</p>
                <p className='tooltip-p'><h6>سمت ایجادکننده:  </h6> {appravlDetal?.roleName}</p>
                <p className='tooltip-p'><h6>زمان ایجاد:  </h6><DateFormat dateString={appravlDetal?.createDate}></DateFormat> </p>
            </div>}
        </>


        );
    };
    const funcB = (result) => {
        AlertError(`${result}`)
        setLoadingFlag(false)

    }
    const updateApproval = useCallback((orderItemId, role, isApproved) => {
        if (orderStatusEnum == 10) {
            setLoadingFlag(true)
            const func = () => {
                setApprovalsList(prev =>
                    prev?.map(approval =>
                        approval.cyOrderItemID === orderItemId && approval.roleName === role
                            ? { ...approval, isApproved, actionTime: new Date().toISOString() }
                            : approval
                    )
                );
                setLoadingFlag(false)
            }


            ApiGetX3(`/api/CyOrdersB/ApprovalCheck?id=${orderItemId}`, func, funcB)


        }

    }, [orderStatusEnum]);
    const updateApprovalB = useCallback((orderItemId, role, isApproved) => {
        if (orderStatusEnum == 20) {
            setLoadingFlag(true)

            const func = () => {
                setApprovalsListB(prev =>
                    prev?.map(approval =>
                        approval.cyOrderItemID === orderItemId && approval.roleName === role
                            ? { ...approval, isApproved, actionTime: new Date().toISOString() }
                            : approval
                    )
                );
                setLoadingFlag(false)

            }

            ApiGetX3(`/api/CyOrdersB/ApprovalCheckB?id=${orderItemId}`, func, funcB)
        }
    }, [orderStatusEnum]);
    const updateApprovalAllA = useCallback((orderItemId, role, isApproved) => {
        if (orderStatusEnum == 10) {

            const func = () => {
                setApprovalsList(prev =>
                    prev?.map(approval =>
                        approval.cyOrderItemID === orderItemId && approval.roleName === role
                            ? { ...approval, isApproved, actionTime: new Date().toISOString() }
                            : approval
                    )
                );
            }
            func()
        }

    }, [orderStatusEnum]);
    const updateApprovalAllB = useCallback((orderItemId, role, isApproved) => {
        if (orderStatusEnum == 20) {

            const func = () => {
                setApprovalsListB(prev =>
                    prev?.map(approval =>
                        approval.cyOrderItemID === orderItemId && approval.roleName === role
                            ? { ...approval, isApproved, actionTime: new Date().toISOString() }
                            : approval
                    )
                );
            }
            func()
        }

    }, [orderStatusEnum]);

    const SelectAllHeader = (props) => {
        const { api, column, displayName, userRole, updateApproval } = props;
        const field = column.colDef.field;
        const isEditable = userRole === field;

        const handleSelectAll = () => {
            let anyUnchecked = false;
            const func = () => {
                api.forEachNodeAfterFilter(node => {
                    if (!node.data[field]) {
                        anyUnchecked = true;
                    }
                });
                api.forEachNodeAfterFilter(node => {
                    node.setDataValue(field, anyUnchecked);
                    updateApprovalAllA(node.data.id, field, anyUnchecked);
                });
                setLoadingFlag(false)
                setIsTrue(!isTrue)
            }
            if (isEditable && orderStatusEnum == 10) {
                setLoadingFlag(true)

                ApiGetX3(`/api/CyOrdersB/ApprovalCheckSelectAll?id=${orderId}&&role=${field}&&isFirest=${true}&&isTrue=${isTrue}`, func, funcB)
            }
        };


        return (
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '2px',
                    boxSizing: 'border-box'
                }}
            >
                {/* عنوان ستون */}
                <div
                    style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {displayName}
                </div>

                {/* دکمه انتخاب همه */}
                <button
                    className="order-btn-selectAll btn btn-success"
                    onClick={handleSelectAll}
                    title="انتخاب گروهی"
                    style={{
                        border: 'none',
                        borderRadius: '2px',
                        padding: '0 3px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '28px',
                        height: '14px',
                        lineHeight: '14px'
                    }}
                >
                    ✓
                </button>

            </div>
        );
    };

    const SelectAllHeaderB = (props) => {
        const { api, column, displayName, userRole, updateApproval } = props;
        const field = column.colDef.field;
        const isEditable = userRole === field;

        const handleSelectAll = () => {
            let anyUnchecked = false;
            const func = () => {
                api.forEachNodeAfterFilter(node => {
                    if (!node.data[field]) {
                        anyUnchecked = true;
                    }
                });

                api.forEachNodeAfterFilter(node => {
                    node.setDataValue(field, anyUnchecked);
                    updateApprovalAllB(node.data.id, field, anyUnchecked);
                });
                setLoadingFlag(false)
                setIsTrue(!isTrue)

            }
            if (isEditable && orderStatusEnum == 20) {
                setLoadingFlag(true)
                ApiGetX3(`/api/CyOrdersB/ApprovalCheckSelectAll?id=${orderId}&&role=${field}&&isFirest=${false}&&isTrue=${isTrue}`, func, funcB)
            }
        };

        return (
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '2px',
                    boxSizing: 'border-box'
                }}
            >
                {/* عنوان ستون */}
                <div
                    style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {displayName}
                </div>

                {/* دکمه انتخاب همه */}

                <button
                    className="order-btn-selectAll btn btn-warning"
                    onClick={handleSelectAll}
                    title="انتخاب گروهی"
                    style={{
                        border: 'none',
                        borderRadius: '2px',
                        padding: '0 3px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '28px',
                        height: '14px',
                        lineHeight: '14px'
                    }}
                >
                    ✓
                </button>

            </div>
        );
    };

    const checkboxCellRenderer = useCallback((params) => {
        const field = params.colDef.field;
        const role = field;
        const isEditable = userRole === role;
        const value = params.value ?? false;
        const isFirstRow = params.node.rowIndex === 0;
        return (

            <>
                <div className='centercc '


                    ////////////گرفتن اطلاعات تاییده هر خانه
                    ////////با رویداد موس اینتر مختصات خانه جدول مشخص و به ای پی آی مربوط به تایید یه ان خانه فرستاده میشه
                    onMouseMove={() => {
                        if (!appravlDetal?.id) {
                            setCreatorName(params.data.creatorName)
                            setAppravlDetal(params?.data?.approvals?.filter(filter => (
                                filter.isFirst && filter.roleName == role
                            ))[0])
                        }
                    }

                    }

                    onMouseLeave={() => {
                        setAppravlDetal([])
                    }}
                >
                    <div style={{
                        height: '40px',        // ✅ fixed height
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2px',
                        boxSizing: 'border-box',
                        // pointerEvents: orderDetails.orderStatus != 10 ? 'none' : 'all',
                        opacity: orderDetails.orderStatus != 10 ? '0.3' : '1',
                    }}

                    >

                        <input
                            type="checkbox"
                            checked={value}
                            disabled={!isEditable}
                            onChange={(e) => {
                                const newValue = e.target.checked;
                                params.setValue(newValue);
                                updateApproval(params.data.id, role, newValue);
                            }}
                            style={{
                                width: '14px',
                                height: '14px',
                                margin: 0,
                                transform: 'translateY(0px)'  // ✅ no shift
                            }}
                        />
                    </div>

                </div>

            </>
        );
    }, [userRole, updateApproval, appravlDetal, orderItemS, isTrue,]);////با این استیتها زمان رندر شدن مجدد اطلاعت پشت خانه های جدول مشخص


    const checkboxCellRendererB = useCallback((params) => {
        const field = params.colDef.field;
        const role = field;
        const isEditable = userRole === role;
        const value = params.value ?? false;
        const isFirstRow = params.node.rowIndex === 0;

        return (

            <>
                <div className='centercc'                      ////////////گرفتن اطلاعات تاییده هر خانه
                    ////////با رویداد موس اینتر مختصات خانه جدول مشخص و به ای پی آی مربوط به تایید یه ان خانه فرستاده میشه
                    onMouseMove={() => {

                        if (!appravlDetal?.id) {
                            setCreatorName(params.data.creatorName)
                            setAppravlDetal(params?.data?.approvals?.filter(filter => (
                                !filter.isFirst && filter.roleName == role
                            ))[0])
                        }

                    }
                    }
                    onMouseLeave={() => {
                        setAppravlDetal([])
                    }}
                >
                    <div style={{
                        height: '40px',        // ✅ fixed height
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2px',
                        boxSizing: 'border-box',
                        // pointerEvents: orderDetails.orderStatus != 20 ? 'none' : 'all',
                        opacity: orderDetails.orderStatus != 20 ? '0.3' : '1',
                    }}


                    >

                        <input
                            type="checkbox"
                            checked={value}
                            disabled={!isEditable}
                            onChange={(e) => {
                                const newValue = e.target.checked;
                                params.setValue(newValue);
                                updateApprovalB(params.data.id, role, newValue);
                            }}
                            style={{
                                width: '14px',
                                height: '14px',
                                margin: 0,
                                transform: 'translateY(0px)'  // ✅ no shift
                            }}
                        />
                    </div>

                </div>

            </>
        );
    }, [userRole, updateApprovalB, approvalsListB, appravlDetal, orderItemS,]);////با این استیتها زمان رندر شدن مجدد اطلاعت پشت خانه های جدول مشخص



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
            field: 'orderStatus', headerName: "وضعیت سفارش", width: 200,
            cellStyle: { color: 'red', 'font-weight': '600' }
            ,
            cellRenderer: (params) => (
                <span>{orderStatusList.filter(filter => (filter.statusId === params.data.orderStatus))[0]?.status}</span>)
        },
        {
            headerName: 'مشاهده', width: 200,
            cellRenderer: (params) => (
                <button
                    className='btn btn-light '
                    style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                    onClick={() => {
                        setLoadingFlag(true)
                        getOrderDetail(params.data.id)
                        setOrderId(params.data.id)
                        setOrderDetails(params.data)
                        setOrderStatusEnum(params.data.orderStatus)
                        setStartOrderDate(params.data.startOrderDate)
                        // getMessageA(params.data.id)
                        getMentionListS(params.data.id)
                    }}
                >
                    <Eye />
                </button>
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
                            backgroundColor: params.data.levelBOk == 10 ? '#f1c40f' :
                                params.data.levelBOk == 12 ? '#e74c3c' :
                                    params.data.levelBOk == 13 ? '#3498db' :
                                        params.data.levelBOk == 15 ? '#07bc0c' :
                                            (params.data.levelBOk == null && params.data.levelOk == 10) ? '#f1c40f' :
                                                (params.data.levelBOk == null && params.data.levelOk == 12) ? '#e74c3c' :
                                                    (params.data.levelBOk == null && params.data.levelOk == 13) ? '#3498db' :
                                                        (params.data.levelBOk == null && params.data.levelOk == 15) ? '#07bc0c' : '#fff'
                        }}
                    >{params.node.rowIndex + 1}</button>
                </div>


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
            field: 'commentB', headerName: "توضیحات ب",

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
            field: 'lastModified', headerName: "زمان آغاز سفارش",
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
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
        },
        {
            field: 'commentB', headerName: " توضیحات تامین کننده",
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
        },

        // Approval columns با دکمه "همه" در ردیف اول
        {
            headerName: "کارشناس گروه (تایید اولیه)",
            field: 'GroupExpert',
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
            // tooltipField: 'partNumber',
            // tooltipComponent: CustomTooltip,
            cellRenderer: checkboxCellRenderer,
            cellEditor: 'agCheckboxCellEditor',
            editable: (params) => userRole === 'GroupExpert',
            cellStyle: { backgroundColor: '#f7f7f7' },
            headerComponent: SelectAllHeader,
            headerComponentParams: {
                userRole,
                updateApproval,
            },
            valueGetter: (params) => {

                const approval = approvalsList?.find(a =>
                    a.cyOrderItemID === params.data.id && a.role === 10 ///<===شرط نمایش تیک چک باکس
                );
                return approval?.isApproved ?? false;
            }
        },
        {
            headerName: "تایید ثانویه",
            field: 'GroupExpert',
            width: 100,      // ✅ fixed کوچکتر
            minWidth: 100,
            maxWidth: 100,
            // tooltipField: 'partNumber',
            // tooltipComponent: CustomTooltip,
            cellRenderer: checkboxCellRendererB,
            cellEditor: 'agCheckboxCellEditor',
            editable: (params) => userRole === 'GroupExpert',
            cellStyle: { backgroundColor: '#f7f7f7' },
            headerComponent: SelectAllHeaderB,
            headerComponentParams: {
                userRole,
                updateApprovalB
            },
            valueGetter: (params) => {
                const approval = approvalsListB?.find(a =>
                    a.cyOrderItemID === params.data.id && a.role === 10 ///<===شرط نمایش تیک چک باکس
                );
                return approval?.isApproved ?? false;
            }
        },
        {
            headerName: "مدیر گروه (تایید اولیه)",
            field: 'GroupManager',
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
            // tooltipField: 'partNumber',
            // tooltipComponent: CustomTooltip,
            cellRenderer: checkboxCellRenderer,
            cellEditor: 'agCheckboxCellEditor',
            editable: (params) => userRole === "GroupManager",
            cellStyle: { backgroundColor: '#f1f1f1' },
            headerComponent: SelectAllHeader,
            headerComponentParams: {
                userRole,
                updateApproval,
            },
            valueGetter: (params) => {
                const approval = approvalsList?.find(a =>
                    a.cyOrderItemID === params.data.id && a.role === 12 ///<===شرط نمایش تیک چک باکس
                );
                return approval?.isApproved ?? false;
            }
        },
        {
            headerName: "تایید ثانویه",
            field: 'GroupManager',
            width: 100,      // ✅ fixed کوچکتر
            minWidth: 100,
            maxWidth: 100,
            // tooltipField: 'partNumber',
            // tooltipComponent: CustomTooltip,
            cellRenderer: checkboxCellRendererB,
            cellEditor: 'agCheckboxCellEditor',
            editable: (params) => userRole === "GroupManager",
            cellStyle: { backgroundColor: '#f1f1f1' },
            headerComponent: SelectAllHeaderB,
            headerComponentParams: {
                userRole,
                updateApprovalB
            },
            valueGetter: (params) => {
                const approval = approvalsListB?.find(a =>
                    a.cyOrderItemID === params.data.id && a.role === 12 ///<===شرط نمایش تیک چک باکس
                );
                return approval?.isApproved ?? false;
            }
        },


        {
            headerName: "مدیر واحد(تایید اولیه)",
            field: 'DepartmentManager',
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
            // tooltipField: 'partNumber',
            // tooltipComponent: CustomTooltip,
            cellRenderer: checkboxCellRenderer,
            cellEditor: 'agCheckboxCellEditor',
            editable: (params) => userRole === 'DepartmentManager',
            cellStyle: { backgroundColor: '#e7e5e5' },
            headerComponent: SelectAllHeader,
            headerComponentParams: {
                userRole,
                updateApproval,
            },
            valueGetter: (params) => {
                const approval = approvalsList?.find(a =>
                    a.cyOrderItemID === params.data.id && a.role === 13 ///<===شرط نمایش تیک چک باکس
                );
                return approval?.isApproved ?? false;
            }
        },
        {
            headerName: "تایید ثانویه",
            field: 'DepartmentManager',
            width: 100,      // ✅ fixed کوچکتر
            minWidth: 100,
            maxWidth: 100,
            // tooltipField: 'partNumber',
            // tooltipComponent: CustomTooltip,
            cellRenderer: checkboxCellRendererB,
            cellEditor: 'agCheckboxCellEditor',
            editable: (params) => userRole === 'DepartmentManager',
            cellStyle: { backgroundColor: '#e7e5e5' },
            headerComponent: SelectAllHeaderB,
            headerComponentParams: {
                userRole,
                updateApprovalB
            },
            valueGetter: (params) => {
                const approval = approvalsListB?.find(a =>
                    a.cyOrderItemID === params.data.id && a.role === 13 ///<===شرط نمایش تیک چک باکس
                );
                return approval?.isApproved ?? false;
            }
        },


        {
            headerName: "مدیر کل(تاییداولیه)",
            field: 'GeneralManager',
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
            // tooltipField: 'partNumber',
            // tooltipComponent: CustomTooltip,
            cellRenderer: checkboxCellRenderer,
            cellEditor: 'agCheckboxCellEditor',
            editable: (params) => userRole === 'GeneralManager',
            cellStyle: { backgroundColor: '#dfdbdb' },
            headerComponent: SelectAllHeader,
            headerComponentParams: {
                userRole,
                updateApproval,
            },
            valueGetter: (params) => {
                const approval = approvalsList?.find(a =>
                    a.cyOrderItemID === params.data.id && a.role === 15 ///<===شرط نمایش تیک چک باکس
                );
                return approval?.isApproved ?? false;
            }
        }, {
            headerName: "تاییدثانویه",
            field: 'GeneralManager',
            width: 100,      // ✅ fixed کوچکتر
            minWidth: 100,
            maxWidth: 100,
            // tooltipField: 'partNumber',
            // tooltipComponent: CustomTooltip,
            cellRenderer: checkboxCellRendererB,
            cellEditor: 'agCheckboxCellEditor',
            editable: (params) => userRole === 'GeneralManager',
            cellStyle: { backgroundColor: '#dfdbdb' },
            headerComponent: SelectAllHeaderB,
            headerComponentParams: {
                userRole,
                updateApprovalB
            },
            valueGetter: (params) => {
                const approval = approvalsListB?.find(a =>
                    a.cyOrderItemID === params.data.id && a.role === 15 ///<===شرط نمایش تیک چک باکس
                );
                return approval?.isApproved ?? false;
            }
        }
    ], [userRole, approvalsList, checkboxCellRenderer, checkboxCellRendererB]);

    ////////////////////////////////////////
    const funcG = (result) => {
        alertA(result.msg)
        getAllOrder()
        setShow(false)
        setToNextState(false)
        setFalsApprovals([])
        setShowC(false)

    }
    const ChangeOrderStatus = () => {
        const func = () => ApiGetX3(`/api/CyOrdersB/changeOrderStatus?orderId=${orderId}`, funcG, funcB)

        ApiGetX2(`/api/CyOrdersB/orderItemsOk?OrderId=${orderId}`, func)///اول ثبت استیت  levelOk
    }
    // بقیه توابع بدون تغییر...
    const handleSave = () => {
        // AlertQ("آیا از تایید فرایند سفارش اطمینان دارید ؟", "تایید لغو شد", ChangeOrderStatus)
        setToNextState(true)
        const funcjj = (result) => {
            // setOrderItemS(result)
            setFalsApprovals(result.filter(orderItem =>
                orderItem.approvals?.some(approval =>
                    approval.roleName == userRole &&
                    approval.isApproved == false && approval.isFirst == isfirstState
                )
            ));
        }
        ApiGetX2(`/api/CyOrdersB/getOrderItems?orderId=${orderId}`, funcjj)


    };
    useEffect(() => {
        if (orderStatusEnum == 20) {
            setIsfirstState(false)
        } else if (orderStatusEnum == 10) {
            setIsfirstState(true)
        }
    }, [isfirstState, orderStatusEnum])

    const defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,

        suppressSizeToFit: true,
    };
    const funcC = () => {
        alertA('با موفقیت انجام شد')
        setLoadingFlag(true)
        setCurrentSearchProduct('')
        setSearchInput('')
        setSearchList([])
        reset(setValue(''))
        getOrderDetail(orderId)
        setTimeout(() => {
            setLoadingFlag(false)
        }, 1500);
    }
    const addOrderItem = (data) => {
        let obj = {
            cyProductID: currentSearchProduct.id ? currentSearchProduct.id : null,
            cyOrderID: orderId,
            quantity: Number(data.quantity),
            unitPrice: data.price ? data.price : 0,
            totalPrice: data.price ? (Number(data.quantity) * data.price) : 0,
            partNumber: data.partNumber,
            manufacturer: data.cyManufacturer,
            creatorCommentA: data.creatorComment,
            commentB: null,
            creatorId: null,
            creatorName: userDetail.userName,
            levelOk: null,
        }

        ApiPostX('/api/CyOrdersB/addOrderItemToOrder', obj, funcC)
    }
    useEffect(() => {

        if (currentSearchProduct) {
            setValue("partNumber", currentSearchProduct.partNo)
            setValue("cyManufacturer", currentSearchProduct.cyManufacturer)
            setValue("quantity", currentSearchProduct.supply)
            setValue("price", currentSearchProduct.price)
        }
    }, [currentSearchProduct])


    const getAllOrder = () => {
        const url = props.componentTyp == "A" ? `/api/CyOrdersB/UserOrderB` :

            props.componentTyp == "B" ? `/api/CyOrdersB/UserOrder` :

                props.componentTyp == "C" ? `/api/CyOrdersB/getInviteOrders` : ''

        ApiGetX2(url, setUserOrders)
    }


    const funcj = (result) => {
        setOrderItemS(result)
        setLoadingFlag(false)
    }
    const getOrderDetail = (id) => {
        ApiGetX2(`/api/CyOrdersB/getOrderItems?orderId=${id}`, funcj)
    }



    const func = (result) => {
        alertA(`${result.msg}`)
        getOrderDetail(orderId)
    }
    const orderItemsOk = (orderId) => {
        ApiGetX2(`/api/CyOrdersB/orderItemsOk?OrderId=${orderId}`, func)

    }
    const searchPartNumber = (searchText, sortA, sortB, pageN, pageSize) => {
        const url = `/api/CyProductsB/searchProduct?Search=${searchText}&SortBy=${sortA}&Descending=${sortB}&Page=${pageN}&PageSize=${pageSize}`

        ApiGetX2(url, setSearchList)
    }
    const [colDefsC] = useState([
        { field: 'partNo', headerName: "نام", maxWidth: 400, },
        { field: 'cyProductCategory', headerName: "گروه" },
        { field: 'cyManufacturer', headerName: "شرکت سازنده" },
        // { field: 'description', headerName: "جزییات" },
        // { field: 'supply', headerName: "موجودی" },
        // { field: 'price', headerName: "قیمت" },
        // { field: 'smallImage', headerName: "عکس" },
        {
            field: '', headerName: "جزییات", width: 200, cellRenderer: (params) => (
                <button className='btn btn-light' onClick={() => {
                    setSearchProductDetail(params.data)
                }}>

                    <Barcode size={25} />
                </button>
            )
        },
        {
            headerName: 'عملیات', maxWidth: 200,
            cellRenderer: (params) => (
                <>
                    <button type='button' className='btn btn-light'
                        onClick={() => {
                            setCurrentSearchProduct([])
                            setCurrentSearchProduct(params.data)
                            setShowB(false)
                            // setSearchList([])
                            // reset(setValue(""))
                        }}><Plus size={25} /></button>

                </>
            )
        }
    ]);

    const [colDefsD] = useState([
        { field: 'partNumber', headerName: "نام", maxWidth: 400, },
        { field: 'manufacturer', headerName: "شرکت سازنده" },

    ]);


    const orderStatusList = [
        { id: 1, status: "ثبت سفارش", statusId: 10 },
        { id: 2, status: "در حال استعلام گیری", statusId: 15 },
        { id: 3, status: "در انتظار تایید مشتری", statusId: 20 },
        { id: 4, status: "در صف خرید", statusId: 25 },
        { id: 5, status: "در حال تامین", statusId: 30 },
        { id: 6, status: "خاتمه یافته", statusId: 40 },
        { id: 6, status: "", statusId: 45 },
        { id: 7, status: "تحویل داده شده", statusId: 50 },
        { id: 8, status: "لغو شده", statusId: -1 },
    ]

    const getMessageA = (id, type) => {
        ApiGetX2(`/api/CyOrderMessage/GetMessagesByOrderID?OrderID=${id}&type=${type}`, setAllMessageA)
    }

    const getInviteListS = () => {
        ApiGetX2(`/api/CyOrderMessage/invite`, setGetInviteList)
    }
    const getMentionListS = (id) => {
        ApiGetX2(`/api/CyOrderMessage/mention?orderId=${id}`, setGetMentionList)
    }

    useEffect(() => {
        if (orderItemS?.length > 0) {
            setShow(true);
            const initialApprovals = [];
            const initialApprovalsB = [];
            orderItemS.forEach(element => {

                element.approvals.forEach(elementt => {
                    if (elementt.isFirst) {

                        initialApprovals.push(elementt)
                    }
                });
                element.approvals.forEach(elementt => {
                    if (elementt.isFirst == false) {

                        initialApprovalsB.push(elementt)
                    }
                });
            });
            setApprovalsList(initialApprovals)
            setApprovalsListB(initialApprovalsB)

        }



    }, [orderItemS])

    useEffect(() => {
        if (orderItemS?.length > 0 && (orderStatusEnum == 10 || orderStatusEnum == 20)) {
            setOrderStatus(orderStatusList?.filter(filter => (
                filter.statusId == orderDetails.orderStatus
            ))[0].status)
            setOrderNextStatus(orderStatusList?.filter(filter => (
                filter?.statusId == (orderDetails?.orderStatus + 5)
            ))[0].status)
        }
    }, [orderDetails, orderItemS])


    useEffect(() => {
        if (appravlDetal?.id) {
            setTimeout(() => {
                setAppravlDetal([])
            }, 4000);
        }
    }, [appravlDetal])

    useEffect(() => {
        getAllOrder()
    }, [])

    const sortedOrderItems = useMemo(() => {
        if (!orderItemS) return [];

        return [...orderItemS].sort((a, b) => {
            const dateA = new Date(a.createDate);
            const dateB = new Date(b.createDate);
            return dateB - dateA; // جدید → قدیم
        });
    }, [orderItemS]);

    useEffect(() => {
        if (falsApprovals.length > 0) {
            setShowC(true)
        } else if (falsApprovals.length == 0 && toNextState) {
            AlertQ("آیا از تایید فرایند سفارش اطمینان دارید ؟", "تایید لغو شد", ChangeOrderStatus)

        }
    }, [showC, falsApprovals])

    console.log(userDetail)

    return (



        <div className="ordeerOff-container" style={{ height: "800px" }}>

            {loadingFlag && <LodingA isShow={true} />
            }

            <BaseGrid rowData={userOrders} colDefs={colDefs} rtl={true} />


            <Modal show={show} fullscreen={true} onHide={() => {
                setShow(false)
                setIsTrue(true)
                setAppravlDetal([])
                setMentionList([])
            }}>
                <Modal.Header
                    dir='ltr'
                    closeButton
                ><button className='btn btn-success disabled'>سمت : {userRole}</button>
                </Modal.Header>
                <Modal.Body>
                    <>
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
                                getMentionList={getMentionList}
                                getMentionListS={getMentionListS}
                                setGetMentionList={setGetMentionList}
                                getInviteList={getInviteList}
                                getInviteListS={getInviteListS}
                                setGetInviteList={setGetInviteList}
                                orderStatusEnum={orderStatusEnum}
                                userDetail={userDetail}
                                messageType={faramoj}
                                orderType={bom}
                                isPcb={false}
                            />


                            <div className={`orderOffLine-container-div ${isShowMessage ? 'shrink' : ''}`}>


                                <div className='orderOffline-Colors-div '>
                                    {(orderStatusEnum == 10 || orderStatusEnum == 20) &&
                                        <button type='button' className='btn btn-light ' onClick={() => {
                                            orderItemsOk(orderId)
                                        }}>ثبت✅ </button>}


                                    <span className='boxSh p-1 centercc'><p>تایید نشده</p>⚪</span>
                                    <span className='boxSh p-1 centercc'><p>تایید کارشناس گروه</p>🟡</span>
                                    <span className='boxSh p-1 centercc'><p>تایید مدیر گروه</p>🟠</span>
                                    <span className='boxSh p-1 centercc'><p>تایید مدیر واحد</p>🔵</span>
                                    <span className='boxSh p-1 centercc'><p>تایید مدیر کل</p>🟢</span>

                                    {((userDetail.role == "GroupExpert" || userDetail.role == "GroupManager") || (userDetail.role == "DepartmentManager") || (userDetail.role == "GeneralManager")) && orderStatusEnum == 10 && <>
                                        <div className='col-2'></div>

                                        <div className='col-5 login-label-float '>
                                            <input
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                                type="text"
                                                placeholder=""
                                            />
                                            <label>  پارت نامبر را وارد کنید</label>
                                        </div>



                                        <button className='btn btn-light' onClick={() => {
                                            searchPartNumber(searchInput, "name", true, 1, 100)
                                            setShowB(true)
                                        }}><MagnifyingGlass size={30} /></button>
                                    </>}


                                </div>


                                {/* بخش اضافه کردن کالا به صورت دستی ********************************/}
                                {((userDetail.role == "GroupExpert" || userDetail.role == "GroupManager") || (userDetail.role == "DepartmentManager") || (userDetail.role == "GeneralManager")) && orderStatusEnum == 10 && <div>
                                    <form className="items-table" onSubmit={handleSubmit(addOrderItem)}>

                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>پارت نامبر</th>
                                                    <th>شرکت سازنده</th>
                                                    <th>توضیحات</th>
                                                    <th >تعداد</th>
                                                    <th className='hidden'>قیمت واحد</th>
                                                    <th className='hidden'>قیمت مجموع</th>
                                                    <th className='hidden'>زمان تأمین</th>
                                                    <th>عملیات</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr key={currentSearchProduct.id}>


                                                    <td><input {...register("partNumber")}

                                                    /></td>

                                                    <td><input
                                                        {...register("cyManufacturer")} /></td>

                                                    <td><input type='text'
                                                        {...register("creatorComment")}
                                                    /></td>

                                                    <td >
                                                        <input type="number"
                                                            {...register("quantity")}
                                                            placeholder={currentSearchProduct.supply ? currentSearchProduct.supply : null}

                                                        />
                                                    </td>

                                                    <td className='hidden'>
                                                        <input
                                                            {...register("price")}
                                                            type="number"


                                                        />
                                                    </td>

                                                    <td className='hidden'>{(currentSearchProduct.TotalPrice)?.toLocaleString('fa-IR')} ریال</td>

                                                    <td className='hidden'><input /></td>

                                                    <td className='centerr'>
                                                        <button className="btn btn-success m-1" type='submit' onClick={() => {
                                                        }}>➕</button>
                                                        <button className="btn btn-danger m-1"
                                                            type='button'
                                                            onClick={() => {
                                                                reset(setValue(''))
                                                                setCurrentSearchProduct('')
                                                            }} >➖</button>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>


                                    </form>

                                </div>}




                                <div style={{ height: "700px" }}>
                                    <BaseGrid ref={gridRef}
                                        rowData={sortedOrderItems}
                                        getRowClass={((orderStatusEnum == 15) && getRowClass) ||
                                            ((orderStatusEnum != 15 && orderStatusEnum != 10) && getRowClassB)}
                                        // rowData={orderItemS}
                                        // rowData={[...orderItemS].sort((a, b) => {
                                        //     const dateA = new Date(a.createDate);
                                        //     const dateB = new Date(b.createDate);

                                        //     // برای مرتب‌سازی از جدید به قدیم (نزولی)
                                        //     return dateB - dateA;

                                        //     // اگر می‌خواهید از قدیم به جدید (صعودی) باشد، از کد زیر استفاده کنید:
                                        //     // return dateA - dateB;
                                        // })}
                                        defaultColDef={defaultColDef} colDefs={colDefsB} rtl={true} />
                                </div>


                                <div className="orderoff-footer-div ">
                                    <button className='orderOff-status-btn btn btn-warning '>وضعیت سفارش :{orderStatus}</button>


                                    <button className='orderOff-status-btn btn btn-info '> زمان آغاز سفارش :<DateFormat dateString={startOrderDate} /></button>

                                    <span>تأیید شده: {approvalsList?.filter(a => a.isApproved).length}/{approvalsList?.length}</span>

                                    {/* <span>{orderDetails.totalAmount}</span> */}
                                    <span>{orderDetails.orderCode}</span>

                                    {((userDetail.role == "DepartmentManager" || userDetail.role == "GeneralManager") && (orderStatusEnum == 10 || orderStatusEnum == 20)) &&
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


                    </>








                </Modal.Body>
            </Modal>



            <Modal show={showB} fullscreen={true} onHide={() => {
                setSearchProductDetail([])
                setShowB(false)

            }
            }

            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body >
                    <>
                        <div className='container'>


                            <hr />

                            {showB &&
                                <div className='row' style={{ height: "900px" }}>

                                    <div className='col-12'>
                                        <BaseGrid rowData={searchList?.products} colDefs={colDefsC} rtl={true} />

                                    </div>

                                </div>
                            }

                        </div>

                    </>


                </Modal.Body>
            </Modal>




            <Modal show={showC} fullscreen={false} onHide={() => {
                setShowC(false)
                setToNextState(false)
                setFalsApprovals([])

            }
            }

            >
                <Modal.Header  >
                    <div className='centerrc' style={{ width: '100%' }}>
                        <h3 style={{ width: '80%' }}>قطعات تایید نشده</h3>
                        <button className='btn btn-primary m-3' style={{ width: '20%' }} onClick={() => {
                            AlertQ("آیا از تایید فرایند سفارش اطمینان دارید ؟", "تایید لغو شد", ChangeOrderStatus)
                        }}>تایید</button>
                        <button className='btn btn-danger m-3' style={{ width: '20%' }} onClick={() => {
                            setShowC(false)
                            setToNextState(false)
                            setFalsApprovals([])
                        }}>برگشت</button>
                    </div>


                </Modal.Header>
                <Modal.Body >
                    <>
                        <div className='container'>


                            <hr />

                            {showC &&
                                <div className='row' style={{ height: "900px" }}>

                                    <div className='col-12'>
                                        <BaseGrid rowData={falsApprovals} colDefs={colDefsD} rtl={true} />

                                    </div>

                                </div>
                            }

                        </div>

                    </>


                </Modal.Body>
            </Modal>


            {appravlDetal?.length != 0 && <div style={{ position: 'fixed', left: '10px', top: 0, zIndex: 100000, padding: '10px', backgroundColor: '#222020', border: '1px solid #ccc', borderRadius: '8px', width: '300px', color: "#fff", fontSize: '15px' }}>
                <p className='tooltip-p'><h6>تایید کننده:  </h6> {appravlDetal?.userName}</p>
                <p className='tooltip-p'><h6>زمان آخرین تغییر:  </h6><DateFormat dateString={appravlDetal?.actionTime}></DateFormat> </p>
                <hr />
                <p className='tooltip-p'><h6>ایجادکننده:  </h6> {creatorName}</p>
                <p className='tooltip-p'><h6>سمت ایجادکننده:  </h6> {appravlDetal?.roleName}</p>
                <p className='tooltip-p'><h6>زمان ایجاد:  </h6><DateFormat dateString={appravlDetal?.createDate}></DateFormat> </p>
            </div>}

            {searchProductDetail?.length != 0 && <div style={{ position: 'fixed', left: '10px', top: 0, zIndex: 100000, padding: '10px', backgroundColor: '#222020', border: '1px solid #ccc', borderRadius: '8px', width: '450px', color: "#fff", fontSize: '15px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setSearchProductDetail([])}>                <CloseOutlined style={{ color: "#fff" }} />
                </span>
                <hr />
                <p className='tooltip-p'>
                    <h6> پارت نامبر:  </h6> {searchProductDetail?.partNo}</p>

                <p className='tooltip-p'><h6>جزییات :  </h6> {searchProductDetail?.description}</p>

                <hr />

                <p className='tooltip-p'><h6>دسته بندی:  </h6> {searchProductDetail?.cyProductCategory}</p>

                <p className='tooltip-p'><h6> شرکت سازنده:  </h6> {searchProductDetail?.cyManufacturer}</p>


                <p className='tooltip-p'><h6> قیمت:  </h6> {searchProductDetail?.price}</p>

                <p className='tooltip-p'><h6>موجودی :  </h6> {searchProductDetail?.supply}</p>

                <p className='tooltip-p'><h6>شناسه :  </h6> {searchProductDetail?.id}</p>

                <p className='tooltip-p'><h6>عکس :  </h6>
                    <img style={{ width: '100px' }} src={searchProductDetail?.smallImage} alt={searchProductDetail?.smallImage} />
                </p>
            </div>}

        </div>
    )
}
