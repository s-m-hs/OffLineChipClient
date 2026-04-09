import React, { useContext, useEffect, useState } from 'react'
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Download, DownloadRounded } from '@mui/icons-material';
import ChangeUplodeC from '../../../../utils/ChangeUplodeC';
import ApiPostX0 from '../../../../utils/ApiServicesX/ApiPostX0';
import alertA from '../../../../utils/AlertFunc/AlertA';
import { Barcode, Eye, PlusCircle } from '@phosphor-icons/react';
import { Modal } from 'react-bootstrap';
import DownloadFile from '../../../../utils/DownloadFile';
import ApiGetX2 from '../../../../utils/ApiServicesX/ApiGetX2';
import DateFormat from '../../../../utils/DateFormat';
import BaseGrid from '../../../Grid/BaseGrid';
import ApiPutX0 from '../../../../utils/ApiServicesX/ApiPutX0';
import { CmsContext } from '../../../../context/CmsContext';

export default function InquiryB(props) {
    let { userDetail } = useContext(CmsContext)
    const [guIdA, setGuIdA] = useState("");
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [comment, setComment] = useState('')
    const [commentB, setCommentB] = useState('')
    const [allInquiry, setAllInquiry] = useState([])
    const [show, setShow] = useState(false)
    const [showB, setShowB] = useState(false)
    const [inquId, setInquId] = useState('')

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
            field: '', headerName: "پاسخ به استعلام", maxWidth: 400,
            cellRenderer: (params) => (
                (!params.data.responseFile && (userDetail.role == 'PurchasingExpert' || userDetail.role == 'PurchasingManager')) ?
                    <button
                        className='btn btn-light '
                        style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                        onClick={() => {
                            setInquId(params.data.id)
                            setShowB(true)
                        }}
                    >
                        <PlusCircle />
                    </button> :
                    ''
            )
        },
        {
            field: 'requestFile', headerName: "فایل استعلام", maxWidth: 400,
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
            field: 'responseFile', headerName: "پاسخ استعلام ",
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

    const funcA = (result) => {
        setCommentB('')
        setGuIdA('')
        alertA(result.msg)
        setShowB(false)
        getAllInquirt()

    }
    const addInquiry = () => {
        let obj = {
            id: inquId,
            responseFile: guIdA,
            commentB: commentB
        }
        ApiPutX0(`/api/CyInquiry/editInquiry`, obj, funcA)
    }
    const getAllInquirt = () => {
        const url = props.componentTyp == "A" ? `/api/CyInquiry/getInquiry` :
            props.componentTyp == "B" ? `/api/CyInquiry/getRequestedInquiry` : ''
        ApiGetX2(url, setAllInquiry)
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
            {/* 
مدال مربوط به نمایش کامنتها */}
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


            {/* مدال مربوط به نمایش اضافه کردن فایل */}
            <Modal
                size="lg"
                show={showB} fullscreen={false} onHide={() => {
                    setShowB(false)

                }}>
                <Modal.Header
                    dir='ltr'
                    closeButton
                >

                </Modal.Header>
                <Modal.Body>
                    <div className='container'>

                        <div className='row'>
                            <div className='col-8 InquiryFactor-div p-3 centercc boxSh'>


                                <div className='boxSh centercc p-3 m-2'>
                                    <div className=' OrderOfflineB-exel-div  centercc m-5 '>

                                        <div className='boxSh '>
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


                                    <div className=' OrderOfflineB-exel-div centercc'>

                                        <button
                                            type='button '
                                            className={guIdA ? 'btn btn-light mb-5' : 'btn btn-light disabled mb-5'}
                                            style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                                            onClick={() => {
                                                DownloadFile(guIdA)
                                            }}
                                        >
                                            <Download />
                                        </button>
                                    </div>
                                </div>




                                <textarea
                                    value={commentB}
                                    onChange={(e) => setCommentB(e.target.value)} rows="10" placeholder='توضیحات'></textarea>

                                <button style={{ width: '70%', fontSize: '20px' }} className='btn btn-primary'
                                    onClick={() => addInquiry()}
                                >ارسال استعلام </button>


                            </div>

                        </div>

                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}
