import React, { useEffect, useState } from 'react'
import BaseGrid from '../../Grid/BaseGrid'
import DateFormat from '../../../utils/DateFormat';
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2';
import { useNavigate } from 'react-router-dom';

export default function OpenOrderS(props) {
    const [openOrders, setOpenOrders] = useState([])
    const pending = 10
    const AwaitingCustomerApproval = 20
    const bom = 1
    const pcb = 2
    const inquery = 3

    const navigate = useNavigate();


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
            field: '', headerName: "کد سفارش", width: 150,
            cellRenderer: (params) => (
                <>
                    <button onClick={() => {
                        navigate(`/p-admin/OrderLists?id=${params.data.id}`) ///انتقال به صفحه 
                    }} >*</button>
                </>
            )

        },

        {
            field: 'orderCode', headerName: "کد سفارش", width: 150,

        },

        {
            field: 'orderStatus', headerName: "وضعیت سفارش", width: 200, cellStyle: { color: "#454e4c", fontWeight: '700' }, cellRenderer: (params) => (
                <>
                    {params.data.orderStatus == AwaitingCustomerApproval ? "در انتظار تایید مشتری" : "در حال ثبت سفارش"}
                </>
            )

        },
        { field: 'createDate', headerName: "تاریخ ایجاد", width: 300, cellRenderer: (params) => <DateFormat dateString={params.value} /> },
        {
            field: 'cyUser', headerName: "ایجاد کننده", width: 200,

        },
        { field: 'cyGorooh', headerName: "گروه", width: 200, },

        {
            field: 'cyVahed', headerName: "واحد", width: 200,

        },
    ]);

    const getOpenOrder = () => {
        const url = props.orderType == bom ? `/api/CyOrdersB/openOrder` :
            props.orderType == pcb ? `/api/CyPCB/openPcbOrder` : ''

        ApiGetX2(url, setOpenOrders)
    }

    useEffect(() => {
        getOpenOrder()
    }, [])
    return (
        <div className='container'>

            <div className='row' style={{ height: "800px" }}>

                <div className='col-12'>
                    <BaseGrid rowData={openOrders} colDefs={colDefs} rtl={true} />

                </div>

            </div></div>
    )
}
