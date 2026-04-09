import React, { useEffect, useState } from 'react'
import ChangeUplodeC from '../../../utils/ChangeUplodeC';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadFile from '../../../utils/DownloadFile';
import { Download, DownloadRounded } from '@mui/icons-material';
import ApiPostX0 from '../../../utils/ApiServicesX/ApiPostX0';
import alertA from '../../../utils/AlertFunc/AlertA';
import BaseGrid from '../../Grid/BaseGrid';
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2';
import { Barcode, Eye } from '@phosphor-icons/react';
import { Modal } from 'react-bootstrap';
import DateFormat from '../../../utils/DateFormat';

export default function InquiryList() {
    const [guIdA, setGuIdA] = useState("");
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [comment, setComment] = useState('')
    const [allInquiry, setAllInquiry] = useState([])
    const [show, setShow] = useState(false)

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
            field: 'requestFile', headerName: " فایل استعلام", maxWidth: 400,
            cellRenderer: (params) => (
                <button
                    className='btn btn-light '
                    style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                    onClick={() => {
                        DownloadFile(params.data.requestFile)
                    }}
                >
                    <DownloadRounded />
                </button>
            )
        },
        {
            field: 'responseFile', headerName: "پاسخ استعلام",
            cellRenderer: (params) => (
                params.data.responseFile ?
                    <button
                        className='btn btn-light '
                        style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                        onClick={() => {
                            DownloadFile(params.data.responseFile)
                        }}
                    >
                        <DownloadRounded style={{ color: "#f81313" }} />
                    </button>
                    :
                    ''

            )
        },

        {
            field: 'creatorName', headerName: "درخواست دهنده",

        },

        {
            field: 'creatorComment', headerName: "توضیحات مشتری",
            cellRenderer: (params) => (
                <button className='btn btn-light  ' onClick={() => {
                    setComment(params.data.creatorComment)
                    setShow(true)
                }}>
                    <Eye />
                </button>
            )
        },
        {
            field: 'commentB', headerName: "توضیحات فروشنده", cellRenderer: (params) => (
                <button className='btn btn-light  ' onClick={() => {
                    setComment(params.data.commentB)
                    setShow(true)
                }}>
                    <Eye />
                </button>
            )
        },
        {
            field: 'createDate', headerName: "تاریخ ارسال استعلام",
            cellRenderer: (params) => (
                <DateFormat dateString={params.data.createDate} />
            )
        },
        {
            field: 'responseDate', headerName: "تاریخ پاسخ به استعلام",
            cellRenderer: (params) => (
                params.data.responseDate && <DateFormat dateString={params.data.responseDate} />
            )
        },



    ]);


    const getAllInquirt = () => {
        ApiGetX2(`/api/CyInquiry/getInquiry`, setAllInquiry)
    }

    useEffect(() => {
        getAllInquirt()
    }, [])

    return (
        <div className='container'>

            <div className='row' style={{ height: "800px" }}>

                <div className='col-12'>
                    <BaseGrid rowData={allInquiry} colDefs={colDefs} rtl={true} />

                </div>

            </div>


            <Modal show={show} fullscreen={false} onHide={() => {
                setShow(false)
                setComment('')

            }}>
                <Modal.Header
                    dir='ltr'
                    closeButton
                >

                </Modal.Header>
                <Modal.Body>
                    <p>{comment}</p>
                </Modal.Body>
            </Modal>

        </div>
    )
}
