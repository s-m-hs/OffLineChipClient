import React, { useContext, useEffect, useState } from 'react'
import BaseGrid from '../../Grid/BaseGrid'
import DateFormat from '../../../utils/DateFormat';
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2';
import { useNavigate } from 'react-router-dom';
import { MoveUp } from '@mui/icons-material';
import { CmsContext } from '../../../context/CmsContext';
import { PurchasingExpert, PurchasingManager } from '../../../utils/Variable';
import { AwaitingCustomerApproval, Bom, InOrderToSupply, Inquiring, InSupply, PCB, Pending } from '../../../utils/Enums';

export default function OpenOrderS(props) {
    let { userDetail } = useContext(CmsContext)

    const [openOrders, setOpenOrders] = useState([])
    // const bom = 1
    // const pcb = 2

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
            field: '', headerName: "انتقال به سفارش", maxWidth: 180,
            cellRenderer: (params) => (
                <>
                    <button className='btn btn-light' onClick={() => {

                        const url = (props.orderType == Bom && (userDetail.role == PurchasingExpert || userDetail.role == PurchasingManager)) ? `/p-admin/OrderListsB?id=${params.data.id}` :
                            (props.orderType == Bom && (userDetail.role != PurchasingExpert && userDetail.role != PurchasingManager)) ? `/p-admin/OrderLists?id=${params.data.id}` :
                                (props.orderType == PCB && (userDetail.role != PurchasingExpert && userDetail.role != PurchasingManager)) ?
                                    `/p-admin/PCBLIst?id=${params.data.id}` :
                                    (props.orderType == PCB && (userDetail.role == PurchasingExpert || userDetail.role == PurchasingManager)) ?
                                        `/p-admin/PCBLIstB?id=${params.data.id}` : ""
                        navigate(url) ///انتقال به صفحه 
                    }} >
                        <MoveUp />
                    </button>
                </>
            )

        },

        {
            field: 'orderCode', headerName: "کد سفارش", width: 150,

        },

        {
            field: 'orderStatus', headerName: "وضعیت سفارش", width: 200, cellStyle: { color: "#454e4c", fontWeight: '700' }, cellRenderer: (params) => (
                <>
                    {params.data.orderStatus == AwaitingCustomerApproval ? "در انتظار تایید مشتری" :
                        params.data.orderStatus == Pending ? "در حال ثبت سفارش" :
                            params.data.orderStatus == Inquiring ? "در حال استعلام گیری" :
                                params.data.orderStatus == InOrderToSupply ? "در صف خرید" :
                                    params.data.orderStatus == InSupply ? "در حال تامین" : ""
                    }
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
        const url = props.orderType == Bom ? `/api/CyOrdersB/openOrder` :
            props.orderType == PCB ? `/api/CyPCB/openPcbOrder` : ''

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
