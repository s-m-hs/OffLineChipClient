import React, { useContext, useEffect, useMemo, useState } from 'react'
import './PcbMyAdding.css'
import BaseGrid from '../../../Grid/BaseGrid'
import ApiGetX from '../../../../utils/ApiServicesX/ApiGetX'
import { Download, Eye, } from "@phosphor-icons/react";
import ApiGetX2 from '../../../../utils/ApiServicesX/ApiGetX2';
import Modal from "react-bootstrap/Modal";
import DateFormat from '../../../../utils/DateFormat';
import { Currency, OrderStatusList, PCBTypes, UserType } from '../../../../utils/OrderStatusList';
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
import ChatPanel from '../ChatPanel';

export default function PcbMyAdding(props) {
    let { userDetail, setUserDetail } = useContext(CmsContext)
    const [allOrder, setAllOrder] = useState([])
    const [orderItems, setOrderItewms] = useState([])
    const [orderId, setOrderId] = useState('')
    const [showB, setShowB] = useState(false);
    const [guIdA, setGuIdA] = useState("");
    const [fileType, setFileType] = useState(1)////در قسمت سلکت باکس آپلود فایل پر میشه
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [orderStatusEnum, setOrderStatusEnum] = useState('')
    const [orderStatus, setOrderStatus] = useState('')
    const [orderNextStatus, setOrderNextStatus] = useState('')
    const [toNextState, setToNextState] = useState(false)
    const [approvalDetails, setApprovalDetails] = useState([])
    const [isShowMessage, setIsShowMessage] = useState(false)
    const [allMessageA, setAllMessageA] = useState([])
    const [mentionList, setMentionList] = useState([])
    const [getMentionList, setGetMentionList] = useState([])
    const [ChatguId, setChatguId] = useState("");
    const [getInviteList, setGetInviteList] = useState([])
    const [inviteList, setInviteList] = useState([])
    const faramoj = 1
    const pcb = 2


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
                        onClick={() => {
                            console.log(params)
                            setOrderId(params.data.id)
                            getOrderDetails(params.data.id)
                            setOrderStatusEnum(params.data.status)
                            getMessageA(params.data.id, faramoj)
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
            cellRenderer: (params) => (<DateFormat dateString={params.data.orderDate} />)
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
    const List = [
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
        const func = () => ApiGetX3(`/api/CyPCB/changeOrderStatus?orderId=${orderId}`, funcG, funcB)

        ApiGetX2(`/api/CyPCB/orderItemsOk?OrderId=${orderId}`, func)///اول ثبت استیت  levelOk
    }
    const handleSave = () => {
        AlertQ("آیا از تایید فرایند سفارش اطمینان دارید ؟", "تایید لغو شد", ChangeOrderStatus)

    };


    const reRender = (result) => {
        getOrderDetails(orderId)
        alertA("")
    }
    const orderItemsOk = () => {
        ApiGetX3(`/api/CyPCB/orderItemsOk?OrderId=${orderId}`, reRender, AlertError)

    }
    const approvalChek = (id) => [
        ApiGetX3(`/api/CyPCB/ApprovalCheck?id=${id}`, reRender, AlertError)
    ]

    const getOrderDetails = (id) => {
        ApiGetX2(`/api/CyPCB/getPcbById?id=${id}`, setOrderItewms)
    }

    const alert = () => {
        getOrderDetails(orderId)
        alertA('')
        setLoadingFlag(false)
        setGuIdA('')
        setFileType(1)

    }
    const addFileToPcb = () => {
        if (!guIdA) return AlertError('فایلی بارگزاری نشده است')
        setLoadingFlag(true)
        let obj = {
            id: null,
            cyPCBOrderID: orderId,
            cyUserID: null,
            fileID: guIdA,
            sendDate: null,
            type: Number(fileType),
            userName: null
        }
        ApiPostX0(`/api/CyPCB/addPcbInEditPage`, obj, alert)
    }
    const sortedOrderItems = useMemo(() => {
        if (!orderItems?.pcbFileDTO) return [];
        return [...orderItems?.pcbFileDTO].sort((a, b) => {
            const dateA = new Date(a.createDate);
            const dateB = new Date(b.createDate);
            return dateB - dateA; // جدید → قدیم
        });
    }, [orderItems]);

    const getMessageA = (id, type) => {
        ApiGetX2(`/api/CyOrderMessage/GetMessagesByOrderID?OrderID=${id}&type=${type}`, setAllMessageA)
    }
    const getMentionListS = (id) => {
        ApiGetX2(`/api/CyOrderMessage/mention?orderId=${id}&isPcb=true`, setGetMentionList)
    }
    const getInviteListS = () => {
        ApiGetX2(`/api/CyOrderMessage/invite`, setGetInviteList)
    }

    const getAllPcbOrders = () => {
        var url = props.componentTyp == "A" ? `/api/CyPCB/getUserPcbList` :
            props.componentTyp == "B" ? `/api/CyPCB/getUserPcbListB` :
                props.componentTyp == "C" ? `/api/CyPCB/getInviteOrders` : ''
        ApiGetX2(url, setAllOrder)
    }


    useEffect(() => {
        if (orderItems?.pcbFileDTO?.length > 0 && (orderStatusEnum == 10 || orderStatusEnum == 20)) {
            setOrderStatus(OrderStatusList?.filter(filter => (
                filter.statusId == orderItems.status
            ))[0].status)
            setOrderNextStatus(OrderStatusList?.filter(filter => (
                filter?.statusId == (orderItems.status + 5)
            ))[0].status)
        }
    }, [orderItems])

    ///صرفا برای کنترل باز نبودن لودینگ . ایجاد خطای ناخواسته
    useEffect(() => {
        if (loadingFlag) {
            setTimeout(() => {
                setLoadingFlag(false)
            }, 1500);
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
                <BaseGrid rowData={allOrder} colDefs={colDefs} rtl={true} />
            </div >


            <Modal show={showB} fullscreen={true} onHide={() => {
                setOrderItewms([])
                setGuIdA('')
                setFileType(1)
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


                                        <div className={(orderStatusEnum == 10) ? 'col-4 boxSh centercc picmyAdding-currency select ' : 'col-4 boxSh centercc picmyAdding-currency select disabled'} >

                                            <select style={{ borderRadius: '5px', outline: 'none' }}
                                                onChange={(e) => setFileType(e.target.value)}>
                                                {PCBTypes.map(item => (
                                                    <option value={item.enumId} key={item.enumId}>{item.typee}</option>
                                                ))}
                                            </select>

                                            <div className='col-4 OrderOfflineB-exel-div centercc m-5 '>

                                                <div className='boxSh'>
                                                    <span><UploadFileIcon />
                                                        بارگزاری فایل
                                                    </span>
                                                    <input
                                                        type="file"
                                                        // className="order-right-message-file-input"
                                                        onChange={(e) => {
                                                            setLoadingFlag(true)

                                                            const funcB = (id) => {
                                                                setGuIdA(id);
                                                                setLoadingFlag(false)
                                                            };
                                                            ChangeUplodeC(e.target.files[0], funcB)
                                                            e.target.value = null
                                                            // setflag(!flag)
                                                        }}
                                                    />
                                                </div>

                                            </div>

                                            <button style={{ width: '70%', fontSize: '20px' }} className='btn btn-primary'
                                                onClick={() => addFileToPcb()}
                                            >افزودن فایل</button>



                                        </div>
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


                                    <table className='table table table-bordered  pcbmyadding-table'>

                                        <tbody>
                                            <tr key="">
                                                <td><label>کد پروژه :</label>{orderItems.orderCode}</td>
                                                <td><label> شماره سفارش :</label>{orderItems.pcbNumber}</td>
                                                <td><label>درخواست دهنده :</label>{orderItems.creatorName}</td>
                                                <td> <label>زمان ثبت درخواست :</label><DateFormat dateString={orderItems.orderDate} /></td>
                                                <td> <label>  وضعیت سفارش :</label>{
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
                                    {/* 

                            <div className='row pcbmyadding-row-1 mb-3' >


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
                                    {/* <div className='row pcbmyadding-row-1 mb-3' >


                                <div className='col-2 '>

                                    <label>تعداد </label>
                                    <button className='btn btn-secondary' disabled>{orderItems.amount}</button>
                                </div>

                                <div className='col-2 '>

                                    <label>  قیمت</label>
                                    <button className='btn btn-secondary' disabled>{orderItems.count}</button>
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



                                    {/* row 4 */}

                                    <div className='row pcbmyadding-row-4 mb-3 ' >

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
                                        <div className={(orderStatusEnum == 10 || orderStatusEnum == 20) ? 'col-3  ' : 'col-3 disabled '} >

                                            <div className="orderoff-footer-div ">

                                                <div className=''>
                                                    <button className='btn btn-light pcbmyadding-row5-firstOk' onClick={() => orderItemsOk()}> ثبت اولیه  ✅  <div className='pcbmyadding-card-chekB' >{orderItems?.levelOk ? UserType.filter(filter => (filter.enum == orderItems?.levelOk))[0]?.name : ''}</div></button>

                                                </div>
                                            </div>



                                        </div>



                                        <div className='col-3'>
                                            <div className="orderoff-footer-div ">
                                                <button className='orderOff-status-btn btn btn-info '> زمان آغاز سفارش :
                                                    <DateFormat dateString={orderItems.sendDate} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-3'></div>


                                        <div className='col-3'>

                                            <div className="orderoff-footer-div ">


                                                {((userDetail.role == "DepartmentManager" || userDetail.role == "GeneralManager") && (orderStatusEnum == 10 || orderStatusEnum == 20)) &&
                                                    <button type='button'
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