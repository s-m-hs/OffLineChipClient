import React, { useContext, useEffect, useState } from 'react'
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2'
import BaseGrid from '../../Grid/BaseGrid'
import DateFormat from '../../../utils/DateFormat';
import { Eye } from '@phosphor-icons/react';
import apiUrl from '../../../utils/ApiConfig';
import { Close } from '@mui/icons-material';
import { CmsContext } from '../../../context/CmsContext';

export default function Notifications() {
    let { setNotifCount } = useContext(CmsContext)

    const [allNotif, setAllNotif] = useState([])
    const [currentOrder, setCurrentOrder] = useState([])

    const sent = 1
    const BOM = 1
    const PCB = 2

    const [colDefs] = useState([
        {
            headerName: "ردیف",
            width: 80,
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
                            if (params.data.orderType == BOM) {
                                setCurrentOrder([])
                                getCurrentOrder(params.data.orderID, false)
                            } else if (params.data.orderType == PCB) {
                                setCurrentOrder([])
                                getCurrentOrder(params.data.orderID, true)
                            }

                            if (params.data.status == sent) {
                                isSeenNotif(params.data.id)
                            }
                        }}
                    >
                        {params.data.status == sent ? <Eye /> : <Eye style={{ color: "#008000" }} />}

                    </button>
                </>

            )
        },
        { field: 'title', headerName: "عنوان", width: 400, cellStyle: { color: "#454e4c", fontWeight: '600' } },

        {
            field: 'orderType', headerName: "نوع سفارش", width: 200,
            cellRenderer: (params) => (
                <>
                    {params.value == 1 ? <span>BOM</span> : <span>PCB</span>}
                </>
            )
        },
        { field: 'sentDate', headerName: "تاریخ ارسال", width: 400, cellRenderer: (params) => <DateFormat dateString={params.value} /> },
    ]);
    const isSeenNotif = (id) => {
        async function myApp() {
            const res = await fetch(`${apiUrl}/api/CyNotification/isSeenNotif?notifId=${id}`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }
        myApp()
    }
    const getUnSeenNotif = () => {
        ApiGetX2(`/api/CyNotification/unSeenNotif`, setNotifCount)
    }
    const getCurrentOrder = (orderId, isPcb) => [
        ApiGetX2(`/api/CyOrdersB/getOrderById?orderId=${orderId}&&isPcb=${isPcb}`, setCurrentOrder)
    ]

    const getallNotif = () => {
        ApiGetX2(`/api/CyNotification/userNotif`, setAllNotif)
    }

    ///بروزرسانی  تعداد نوتیفیکیشنهای دیده نشده هنگام خروج از صفحه  اعلانات 
    useEffect(() => {
        return () => getUnSeenNotif()
    }, [])
    useEffect(() => {
        getallNotif()
    }, [])
    return (
        <div className='container'>

            <div className='row' style={{ height: "800px" }}>

                <div className='col-12'>
                    <BaseGrid rowData={allNotif} colDefs={colDefs} rtl={true} />

                </div>

            </div>

            {currentOrder?.length != 0 && <div style={{ position: 'fixed', left: '10px', top: 0, zIndex: 100000, padding: '10px', backgroundColor: '#222020', border: '1px solid #ccc', borderRadius: '8px', width: '300px', color: "#fff", fontSize: '15px' }}>

                <span style={{ cursor: "pointer" }} onClick={() => setCurrentOrder([])}><Close /></span>
                <hr />
                <p className='tooltip-p'><h6> کد سفارش:  </h6> {currentOrder?.orderCode}</p>


                <p className='tooltip-p'><h6>ایجادکننده:  </h6> {currentOrder?.creatorName}</p>

                <p className='tooltip-p'><h6>زمان ایجاد:  </h6><DateFormat dateString={currentOrder?.creatDate}></DateFormat> </p>
            </div>}
        </div>
    )
}
