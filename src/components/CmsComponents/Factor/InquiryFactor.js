import React, { useState } from 'react'
import "./InquiryFactor.css"
import ChangeUplodeC from '../../../utils/ChangeUplodeC';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadFile from '../../../utils/DownloadFile';
import { Download } from '@mui/icons-material';
import ApiPostX0 from '../../../utils/ApiServicesX/ApiPostX0';
import alertA from '../../../utils/AlertFunc/AlertA';

export default function InquiryFactor() {
    const [guIdA, setGuIdA] = useState("");
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [creatorComment, setCreatorComment] = useState('')

    const funcA = (result) => {
        setCreatorComment('')
        setGuIdA('')
        alertA(result.msg)

    }
    const addInquiry = () => {
        let obj = {
            requestFile: guIdA,
            creatorComment: creatorComment
        }
        ApiPostX0(`/api/CyInquiry/addInquiry`, obj, funcA)
    }

    return (
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
                        value={creatorComment}
                        onChange={(e) => setCreatorComment(e.target.value)} rows="10" placeholder='توضیحات'></textarea>

                    <button style={{ width: '70%', fontSize: '20px' }} className='btn btn-primary'
                        onClick={() => addInquiry()}
                    >ارسال درخواست </button>


                </div>

            </div>

        </div>
    )
}
