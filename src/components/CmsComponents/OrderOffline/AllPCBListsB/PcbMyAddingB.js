import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import './PcbMyAddingB.css'
import BaseGrid from '../../../Grid/BaseGrid'
import ApiGetX from '../../../../utils/ApiServicesX/ApiGetX'
import { Download, Eye, } from "@phosphor-icons/react";
import ApiGetX2 from '../../../../utils/ApiServicesX/ApiGetX2';
import Modal from "react-bootstrap/Modal";
import DateFormat from '../../../../utils/DateFormat';
import { Currency, inSupplyStatus, OrderStatusList, PCBTypes, UserType } from '../../../../utils/OrderStatusList';
import apiUrl from '../../../../utils/ApiConfig';
import DownloadFile from '../../../../utils/DownloadFile';
import ChangeUplodeC from '../../../../utils/ChangeUplodeC';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { CmsContext } from '../../../../context/CmsContext';
import { ArrowBack, DownloadRounded } from '@mui/icons-material';
import alertA from '../../../../utils/AlertFunc/AlertA';
import ApiPostX0 from '../../../../utils/ApiServicesX/ApiPostX0';
import AlertError from '../../../../utils/AlertFunc/AlertError';
import ApiGetX3 from '../../../../utils/ApiServicesX/ApiGetX3';
import AlertQ from '../../../../utils/AlertFunc/AlertQ';
import { useForm } from 'react-hook-form';
import ApiPutX0 from '../../../../utils/ApiServicesX/ApiPutX0';
import ChatPanel from '../ChatPanel';
import { useLocation } from 'react-router-dom';
import LodingA from '../../../../utils/LodingA';
export default function PcbMyAddingB(props) {
    let { userDetail, setUserDetail } = useContext(CmsContext)
    const gridRefB = useRef();
    const location = useLocation();
    const [allOrder, setAllOrder] = useState([])
    const [orderItems, setOrderItewms] = useState([])
    const [orderId, setOrderId] = useState('')
    const [showB, setShowB] = useState(false);
    const [guIdA, setGuIdA] = useState("");
    const [currency, setCurrency] = useState(1)////در قسمت سلکت باکس آپلود فایل پر میشه
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [orderStatusEnum, setOrderStatusEnum] = useState('')
    const [orderStatus, setOrderStatus] = useState('')
    const [orderNextStatus, setOrderNextStatus] = useState('')
    const [approvalDetails, setApprovalDetails] = useState([])
    const [inSupplyState, setInSupplyState] = useState("در حال تامین")
    const [isShowMessage, setIsShowMessage] = useState(false)
    const [allMessageA, setAllMessageA] = useState([])
    const [mentionList, setMentionList] = useState([])
    const [getMentionList, setGetMentionList] = useState([])
    const [ChatguId, setChatguId] = useState("");
    const novin = 2
    const pcb = 2

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
        amount: { required: "amount is required" },
        duration: { required: "duration is required" },

    };

    //////////////start بخش مربوط به گرفتن کویری از آدرس و جستجو در جدول 
    // دریافت GUID از URL
    const getGuidFromUrl = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('id');
    };

    const guid = getGuidFromUrl();
    const highlightAndScrollToRow = (guid) => {
        if (!gridRefB.current?.api) return;

        const api = gridRefB.current.api;
        let targetNode = null;

        api.forEachNode((node) => {
            if (node.data && String(node.data.id) === guid) {
                targetNode = node;
            }
        });

        if (targetNode) {
            // اسکرول به ردیف
            api.ensureIndexVisible(targetNode.rowIndex, 'middle');

            // انتخاب ردیف (روش صحیح)
            targetNode.setSelected(true, false);

            // اگر می‌خواهید فقط یک ردیف انتخاب شود
            // targetNode.setSelected(true, true);
        }
    };
    // هایلایت کردن ردیف مربوط به GUID
    useEffect(() => {
        console.log('first')
        if (guid && gridRefB.current) {
            setLoadingFlag(true)
            setTimeout(() => {
                setLoadingFlag(false)
                highlightAndScrollToRow(guid)

            }, 3000);
        }
    }, [guid]);
    //////////////////end/////

    const colDefs = ([


        {
            headerName: "ردیف",
            width: 100,      // ✅ fixed کوچکتر
            minWidth: 100,
            maxWidth: 100,
            valueGetter: (params) => params.node.rowIndex + 1,
            suppressHeaderMenuButton: true,
            sortable: false,
            filter: false,
        },
        {
            headerName: 'مشاهده',
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
            cellRenderer: (params) => (
                <>

                    <button
                        className='btn btn-light '
                        style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                        type='button'
                        onClick={() => {
                            console.log(params)
                            setOrderId(params.data.id)
                            getOrderDetails(params.data.id)
                            setOrderStatusEnum(params.data.status)
                            // getMessageA(params.data.id, novin)
                        }}
                    >
                        <Eye />
                    </button>
                </>

            )
        },
        {
            field: 'status', headerName: " وضعیت سفارش", width: 100,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,
            cellStyle: { color: 'red', 'font-weight': '600' },
            cellRenderer: (params) => (
                OrderStatusList.filter(filter => (
                    filter.statusId == params.data.status
                ))[0].status
            )
        },
        {
            field: 'pcbNumber', headerName: "شماره PCB", width: 300,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,


        },
        {
            field: 'orderCode', headerName: " کدپروژه", width: 100,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
        },
        {
            field: 'cyVahed', headerName: " واحد", width: 100,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,
        },
        {
            field: 'cyGorooh', headerName: "گروه", width: 100,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,
        },
        {
            field: 'orderDate', headerName: " تاریخ ثبت", width: 100,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,
        },
        {
            field: 'creatorName', headerName: " درخواست کننده", width: 100,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,
        }
        , {
            field: 'totalAmount', headerName: " قیمت سفارش", width: 100,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,
        },
        {
            field: 'duration', headerName: " زمان تامین", width: 100,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
        },


    ])

    const colDefsB = ([
        {
            headerName: "ردیف",
            width: 100,      // ✅ fixed کوچکتر
            minWidth: 100,
            maxWidth: 100,
            valueGetter: (params) => params.node.rowIndex + 1,
            suppressHeaderMenuButton: true,
            sortable: false,
            filter: false,
        },
        {
            headerName: 'مشاهده/دانلود',
            width: 150,      // ✅ fixed کوچکتر
            minWidth: 150,
            maxWidth: 150,
            cellRenderer: (params) => (
                <>

                    <button
                        type='button'
                        className='btn btn-light '
                        style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                        onClick={() => {
                            DownloadFile(params.data.fileID)
                        }}
                    >
                        <DownloadRounded />
                    </button>
                </>

            )
        },
        {
            field: 'type', headerName: "نوع", width: 100,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,
            cellStyle: { color: '#ff9100', fontSize: '15px', fontWeight: 700 },
            cellRenderer: (params) => (<span>{PCBTypes?.filter(filter => (
                filter.enumId == params.data?.type
            ))[0]?.typee}</span>)
        },
        {
            field: 'userName', headerName: "ایجادکننده", width: 300,      // ✅ fixed کوچکتر
            minWidth: 200,
            maxWidth: 200,


        },

        {
            field: 'sendDate', headerName: " زمان ارسال", width: 100,      // ✅ fixed کوچکتر
            minWidth: 250,
            maxWidth: 250,
            cellRenderer: (params) => (
                <DateFormat dateString={params.data.sendDate} />
            )
        },

        {
            field: 'createDate', headerName: " تاریخ ثبت", width: 100,      // ✅ fixed کوچکتر
            minWidth: 250,
            maxWidth: 250,
            cellRenderer: (params) => (
                <DateFormat dateString={params.data.createDate} />
            )
        },


    ])

    const getApproval = (id) => {
        ApiGetX2(`/api/CyPCB/getApprovalDetail?id=${id}`, setApprovalDetails)
    }

    const funcB = (result) => {
        AlertError(`${result}`)
        setLoadingFlag(false)

    }
    const funcG = (result) => {
        getAllPcbOrders()
        alertA(result.msg)
        setLoadingFlag(false)
        setShowB(false)


    }
    const ChangeOrderStatus = () => {
        setLoadingFlag(true)
        ApiGetX3(`/api/CyPCB/changeOrderStatusB?orderId=${orderId}`, funcG, funcB)

    }
    const handleSave = () => {
        AlertQ("آیا از تایید فرایند سفارش اطمینان دارید ؟", "تایید لغو شد", ChangeOrderStatus)

    };


    const reRender = (result) => {
        getOrderDetails(orderId)
        alertA("")
    }

    const approvalChek = (id) => [
        ApiGetX3(`/api/CyPCB/ApprovalCheck?id=${id}`, reRender, AlertError)
    ]

    const getOrderDetails = (id) => {
        ApiGetX2(`/api/CyPCB/getPcbById?id=${id}`, setOrderItewms)
    }

    const alert = (result) => {
        // setOrderItewms([])
        getOrderDetails(orderId)
        reset(setValue(''))
        setCurrency(1)
        alertA(result.msg)
    }

    const sortedOrderItems = useMemo(() => {
        if (!orderItems?.pcbFileDTO) return [];
        return [...orderItems?.pcbFileDTO].sort((a, b) => {
            const dateA = new Date(a.createDate);
            const dateB = new Date(b.createDate);
            return dateB - dateA; // جدید → قدیم
        });
    }, [orderItems]);

    const getAllPcbOrders = () => {
        var url = props.status == "allPcb" ? `/api/CyPCB/getUserPcbListC` :
            props.status == "inQuring" ? `/api/CyPCB/getUserPcbListC?status=${15}` :
                props.status == "inOrderToSupply" ? `/api/CyPCB/getUserPcbListC?status=${25}` :
                    props.status == "inSupply" ? `/api/CyPCB/getUserPcbListC?status=${30}` :
                        ''
        ApiGetX2(url, setAllOrder)
    }

    const handlerSubbit = (data) => {
        let obj = {
            id: orderId,
            amount: Number(data.amount),
            currency: Number(currency),
            commentB: data.commentB,
            duration: data.duration

        }
        ApiPutX0(`/api/CyPCB/updateOrderItem`, obj, alert)

    }

    ////تغییر استتیت در وضعیت درحل تامین
    const changInSuplyStte = () => {
        console.log(inSupplyState)
        ApiGetX2(`/api/CyPCB/updateOrderItemSupplyStatus?state=${inSupplyState}&orderId=${orderId}`, alert)

    }
    const getMessageA = (id, type) => {
        ApiGetX2(`/api/CyOrderMessage/GetMessagesByOrderID?OrderID=${id}&type=${type}`, setAllMessageA)
    }


    useEffect(() => {
        if (orderItems?.pcbFileDTO?.length > 0) {
            setOrderStatus(OrderStatusList?.filter(filter => (
                filter.statusId == orderItems.status
            ))[0].status)
            if (orderStatusEnum != 35) {
                setOrderNextStatus(OrderStatusList?.filter(filter => (
                    filter.statusId == (orderItems.status + 5)
                ))[0]?.status)
            }

        }
    }, [orderItems])

    ///صرفا برای کنترل باز نبودن لودینگ . ایجاد خطای ناخواسته
    useEffect(() => {
        if (loadingFlag) {
            setTimeout(() => {
                setLoadingFlag(false)
            }, 3500);
        }
    }, [loadingFlag])
    useEffect(() => {
        if (approvalDetails?.cyPCBOrderID
        ) {
            setTimeout(() => {
                setApprovalDetails([])
            }, 5000);
        }
    }, [approvalDetails])

    useEffect(() => {
        if (orderItems?.length != 0) {
            setShowB(true)
        } else { setShowB(false) }
    }, [orderItems])
    useEffect(() => {
        getAllPcbOrders()
    }, [])
    return (
        <>
            <div style={{ height: "700px" }}>
                {loadingFlag && <LodingA isShow={true} />
                }
                <BaseGrid ref={gridRefB} rowData={allOrder} colDefs={colDefs} rtl={true} />
            </div >


            <Modal show={showB} fullscreen={true} onHide={() => {
                setOrderItewms([])
                setGuIdA('')
                setCurrency(1)
                setShowB(false)

            }
            }

            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body >
                    <>
                        <div className='orderOffLine-wrapper'>

                            <ChatPanel
                                setIsShowMessage={setIsShowMessage}
                                isShowMessage={isShowMessage}
                                allMessageA={allMessageA}
                                mentionList={mentionList}
                                setMentionList={setMentionList}
                                setChatguId={setChatguId}
                                ChatguId={ChatguId}
                                getMessageA={getMessageA}
                                orderId={orderId}
                                setLoadingFlag={setLoadingFlag}
                                getMentionList={getMentionList}
                                setGetMentionList={setGetMentionList}
                                orderStatusEnum={orderStatusEnum}
                                userDetail={userDetail}
                                novin={true}
                                messageType={novin}
                                orderType={pcb}
                                isPcb={true}
                            />

                            <div className={`orderOffLine-container-div ${isShowMessage ? 'shrink' : ''}`}>
                                <div className='container text-center'>

                                    {/* row 1 */}

                                    <div className='row'>
                                        <div className='col-8 boxSh'>
                                            {showB && <div style={{ height: "400px" }}>
                                                <BaseGrid rowData={!loadingFlag && sortedOrderItems} colDefs={colDefsB} rtl={true} />
                                            </div >}
                                        </div>

                                        {(orderStatusEnum == 15 || orderStatusEnum == 25) &&
                                            <form onSubmit={handleSubmit(handlerSubbit)} className={orderStatusEnum == 15 ? 'col-4 boxSh centercc' : 'col-4 boxSh centercc disabled'}>


                                                <div className='container'>
                                                    <div className='row'>
                                                        <div className='centercc picmyAdding-currency'>
                                                            <select style={{ borderRadius: '5px', outline: 'none' }}
                                                                onChange={(e) => setCurrency(e.target.value)}>
                                                                {Currency.map(item => (
                                                                    <option value={item.enumId} key={item.enumId}>{item.currency}</option>
                                                                ))}
                                                            </select>

                                                            <div className="login-label-float" style={{ width: '50%' }}>
                                                                <input
                                                                    name="amount"
                                                                    type="number"
                                                                    placeholder=""
                                                                    className={errors.amount ? "formerror" : ""}
                                                                    {...register(
                                                                        "amount",
                                                                        registerOptions.amount
                                                                    )}
                                                                />
                                                                <label>قیمت</label>
                                                            </div>

                                                            <div className="login-label-float" style={{ width: '50%' }}>
                                                                <input
                                                                    name="duration"
                                                                    type="text"
                                                                    placeholder=""
                                                                    className={errors.duration ? "formerror" : ""}
                                                                    {...register(
                                                                        "duration",
                                                                        registerOptions.duration
                                                                    )}
                                                                />
                                                                <label>زمان تامین</label>
                                                            </div>

                                                            <div className="login-label-float picmyAdding-textArea" >
                                                                <textarea
                                                                    name="commentB"
                                                                    type="text"
                                                                    placeholder="توضیحات"
                                                                    {...register(
                                                                        "commentB"
                                                                    )}
                                                                />
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>

                                                <button style={{ width: '80%', fontSize: '20px' }} className='btn btn-primary'
                                                // onClick={() => addFileToPcb()}
                                                > ثبت</button>




                                            </form>}

                                        {orderStatusEnum != 15 && orderStatusEnum != 25 &&
                                            <form onSubmit={handleSubmit(handlerSubbit)} className={orderStatusEnum == 30 ? 'col-4 boxSh centercc' : 'col-4 boxSh centercc disabled'}>


                                                <div className='container'>
                                                    <div className='row mb-3'>
                                                        <div className='centercc picmyAdding-currency'>
                                                            <select style={{ borderRadius: '5px', outline: 'none' }}
                                                                onChange={(e) => setInSupplyState(e.target.value)}>

                                                                {inSupplyStatus.map(item => (
                                                                    <option value={item.status} key={item.status}>{item.status}</option>
                                                                ))}
                                                            </select>


                                                        </div>
                                                    </div>

                                                </div>

                                                <button type='button' style={{ width: '60%', fontSize: '20px' }} className='btn btn-primary'
                                                    onClick={() => changInSuplyStte()}
                                                > ثبت</button>




                                            </form>}

                                    </div>






                                    {/* <div className='row pcbmyadding-row-3 mb-3 ' >

                                <div className='col-2 '>

                                    <button className='btn btn-primary' >Gerber</button>
                                </div>

                                <div className='col-2 '>

                                    <button className='btn btn-success' >StackLayer</button>
                                </div>

                                <div className='col-2 '>

                                    <button className='btn btn-info' >MI</button>
                                </div>

                                <div className='col-2 '>

                                    <button className='btn btn-warning' >PickAndPlace</button>
                                </div>

                                <div className='col-2 '>

                                    <button className='btn btn-danger' >BOM</button>
                                </div>






                            </div> */}


                                    {/* row 2 */}

                                    <table className='table table table-bordered   pcbmyadding-table'>

                                        <tbody>
                                            <tr key="">
                                                <td><label>کد پروژه :</label>{orderItems.orderCode}</td>
                                                <td><label> شماره سفارش :</label>{orderItems.pcbNumber}</td>
                                                <td><label>درخواست دهنده :</label>{orderItems.creatorName}</td>
                                                <td> <label>زمان ثبت درخواست :</label><DateFormat dateString={orderItems.orderDate} /></td>
                                                <td> <label> وضعیت سفارش :</label>{
                                                    OrderStatusList.filter(filter => (
                                                        filter.statusId == orderItems.status
                                                    ))[0]?.status
                                                }</td>

                                            </tr>

                                            <tr key="">
                                                <td><label>تعداد :</label>{orderItems.count}</td>
                                                <td><label>  قیمت :</label>{orderItems.amount}</td>
                                                <td><label> قیمت کل :</label>{orderItems.totalAmount}</td>
                                                <td><label> واحد پول :</label>{
                                                    Currency.filter(filter => (
                                                        filter.enumId == orderItems.currency
                                                    ))[0]?.currency
                                                }</td>
                                                <td><label> زمان تامین :</label>{orderItems.duration ? orderItems.duration : 0}</td>
                                            </tr>

                                            <tr key="">
                                                {/* <td colspan="2"><label>توضیحات مشتری :</label>    <textarea
                                            className='pcbmyadding-comment'
                                            value={orderItems.creatorComment}
                                            disabled  ></textarea></td> */}

                                                <td><label>وضعیت(درحال تامین) :</label>{orderItems.inSupplyStatus ? orderItems.inSupplyStatus : '*****'}</td>

                                                <td colspan="4"><label>توصیحات فروشنده :</label>         <textarea
                                                    className='pcbmyadding-comment'
                                                    value={orderItems.commentB}
                                                    disabled  >

                                                </textarea></td>

                                            </tr>




                                        </tbody>



                                    </table>

                                    {/* <div className='row pcbmyadding-row-1 mb-1' >


                                <div className='col-2 '>

                                    <label>کد پروژه</label>
                                    <button className='btn btn-secondary' disabled>{orderItems.orderCode}</button>
                                </div>

                                <div className='col-2 '>

                                    <label> شماره سفارش</label>
                                    <button className='btn btn-secondary' disabled>{orderItems.pcbNumber}</button>
                                </div>

                                <div className='col-2 '>

                                    <label>درخواست دهنده</label>
                                    <button className='btn btn-secondary' disabled>{orderItems.creatorName}</button>
                                </div>

                                <div className='col-2 '>

                                    <label>زمان ثبت درخواست </label>
                                    <button className='btn btn-secondary' disabled>{
                                        <DateFormat dateString={orderItems.orderDate} />
                                    }</button>
                                </div>

                                <div className='col-2 '>

                                    <label> وضعیت</label>
                                    <button className='btn btn-secondary' disabled>{
                                        OrderStatusList.filter(filter => (
                                            filter.statusId == orderItems.status
                                        ))[0]?.status
                                    }</button>
                                </div>







                            </div> */}



                                    {/* row 3 */}
                                    {/* <div className='row pcbmyadding-row-1 mb-1' >


                                <div className='col-2 '>

                                    <label>تعداد </label>
                                    <button className='btn btn-secondary' disabled>{orderItems.count}</button>
                                </div>

                                <div className='col-2 '>

                                    <label>  قیمت</label>
                                    <button className='btn btn-secondary' disabled>{orderItems.amount}</button>
                                </div>

                                <div className='col-2 '>

                                    <label> قیمت کل</label>
                                    <button className='btn btn-secondary' disabled>{orderItems.totalAmount}</button>
                                </div>

                                <div className='col-2 '>

                                    <label> واحد پول </label>
                                    <button className='btn btn-secondary' disabled>{
                                        Currency.filter(filter => (
                                            filter.enumId == orderItems.currency
                                        ))[0]?.currency
                                    }</button>
                                </div>

                                <div className='col-2 '>

                                    <label> زمان تامین</label>
                                    <button className='btn btn-secondary' disabled>{orderItems.duration ? orderItems.duration : 0}</button>
                                </div>







                            </div> */}

                                    {/* row 3.5 */}
                                    {/* <div className='row pcbmyadding-row-1 mb-1' >

                                <div className='col-5 pcbmyadding-row-1' style={{ position: 'relative' }} >
                                    <textarea
                                        value={orderItems.creatorComment}
                                        className='pcbmyadding-comment' rows="2" disabled  ></textarea>
                                    <span className='pcbmyadding-comment-span'>توضیحات مشتری</span>
                                </div>

                                <div className='col-2' style={{ position: 'relative' }}>
                                    <button className='btn btn-secondary' disabled>{orderItems.inSupplyStatus ? orderItems.inSupplyStatus : '*****'}</button>
                                    <span className='pcbmyadding-comment-span'>وضعیت درحال تامین </span>
                                </div>

                                <div className='col-5 pcbmyadding-row-1' style={{ position: 'relative' }}>
                                    <textarea
                                        value={orderItems.commentB}
                                        className='pcbmyadding-comment' rows="2" disabled  >

                                    </textarea>
                                    <span className='pcbmyadding-comment-span'>توضیحات فروشنده</span>


                                </div>
                            </div> */}




                                    {/* row 4 */}

                                    <div className='row pcbmyadding-row-4 mb-1 ' >

                                        {
                                            orderItems?.approvals?.map(item => (

                                                <div className='col-3 pcbmyadding-card boxSh' >
                                                    <>
                                                        <span onClick={() => getApproval(item.id)} >...</span>
                                                        <div className={((userDetail.role == item.roleName) && orderItems.status == 10 && item.isFirst) ? ' pcbmyadding-card-div' : ((userDetail.role == item.roleName) && orderItems.status == 20 && !item.isFirst) ? ' pcbmyadding-card-div' : ' pcbmyadding-card-div disabled'}>
                                                            <div>{UserType.filter(filter => (
                                                                filter.userType == item.roleName
                                                            ))[0].name}</div>

                                                            <div className='pcbmyadding-card-chek' >{item.isFirst ? 'تایید اولیه' : 'تایید ثانویه'}</div>

                                                            <input type='checkbox'
                                                                checked={item.isApproved}
                                                                onChange={() => {
                                                                    approvalChek(item.id)
                                                                }
                                                                }
                                                            />
                                                        </div>
                                                    </>



                                                </div>
                                            ))
                                        }

                                    </div>


                                    {/* row-5 */}
                                    <div className='row boxSh p-3 pcbmyadding-footer-div'>


                                        <div className='col-3'>
                                            <div className="orderoff-footer-div ">
                                                <button className='orderOff-status-btn btn btn-info '> زمان آغاز سفارش :
                                                    <DateFormat dateString={orderItems.startDate} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-3'></div>


                                        <div className='col-3'>

                                            <div className="orderoff-footer-div ">


                                                {((userDetail.role == "PurchasingExpert" || userDetail.role == "PurchasingManager")
                                                    // && (orderStatusEnum != 15 || orderStatusEnum == 20)
                                                ) && orderStatusEnum != 35 &&
                                                    <button
                                                        type='button'
                                                        onClick={handleSave}
                                                        className="btn btn-success">
                                                        <span>تغییر به :</span>
                                                        <ArrowBack size={40} style={{ color: '#f80606', margin: '2px' }} />
                                                        <span>{orderNextStatus}</span>

                                                    </button>
                                                }

                                            </div>
                                        </div>

                                    </div>

                                    <div />


                                </div>
                            </div>




                        </div>


                    </>


                </Modal.Body>
            </Modal>



            {approvalDetails?.cyPCBOrderID
                && <div style={{ position: 'fixed', left: '10px', top: 0, zIndex: 100000, padding: '10px', backgroundColor: '#222020', border: '1px solid #ccc', borderRadius: '8px', width: '300px', color: "#fff", fontSize: '15px' }}>
                    <p className='tooltip-p'><h6>تایید کننده:  </h6> {approvalDetails?.userName}</p>
                    <p className='tooltip-p'><h6>زمان آخرین تغییر:  </h6><DateFormat dateString={approvalDetails?.actionTime}></DateFormat> </p>
                </div>}

        </>
    )
}