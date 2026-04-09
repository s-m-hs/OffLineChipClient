import React, { useContext, useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import './ChatPanel.css'
import { RiArrowDropRightLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { RiArrowDropLeftLine } from "react-icons/ri";
import ChangeUplodeC from '../../../utils/ChangeUplodeC';
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2';
import DateFormat from '../../../utils/DateFormat';
import { Add, ArrowBack, CloseFullscreen, CloseOutlined, Download, ListAlt, ListAltSharp, PlusOne, Refresh, Send, SwitchAccessShortcut } from '@mui/icons-material';
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
import { FaUsers } from "react-icons/fa";

import DownloadFile from '../../../utils/DownloadFile';
import { List, Tooltip } from '@mui/material';
import ApiPostX0 from '../../../utils/ApiServicesX/ApiPostX0';
import Modal from "react-bootstrap/Modal";
import { UserType } from '../../../utils/OrderStatusList';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { CmsContext } from '../../../context/CmsContext';
import { HiOutlineSwitchVertical } from "react-icons/hi";
import ApiGetX3 from '../../../utils/ApiServicesX/ApiGetX3';
import ApiGetX4 from '../../../utils/ApiServicesX/ApiGetX4';
import alertA from '../../../utils/AlertFunc/AlertA';
import AlertError from '../../../utils/AlertFunc/AlertError';

export default function ChatPanel(props) {
    const { userDetail } = useContext(CmsContext)

    const [showD, setShowD] = useState(false);
    const [messageType, setMessageType] = useState(props.messageType)
    const [chatMember, setChatMember] = useState([])
    const faramoj = 1
    const novin = 2

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


    const sendMessage = () => {
        let obj = {
            orderType: props.orderType,
            orderID: props.orderId,
            message: getValues("message"),
            messageType: Number(messageType),
            mentions: props.mentionList?.length != 0 ? props.mentionList.map(m => m.id) : [],
            fileID: props.ChatguId ? props.ChatguId : null
        }
        const func = () => {
            setValue("message", '')
            props.setChatguId('')
            props.setMentionList([])
            props.getMessageA(props.orderId, messageType)
        }
        ApiPostX0(`/api/CyOrderMessage/SendMessage`, obj, func)
    }
    const addInvite = (userId, orderId) => {
        ApiGetX4(`/api/CyOrderMessage/addInvite?userId=${userId}&orderId=${orderId}&isPcb=${props.isPcb}`, function (msg) {
            alertA(msg)
        }, function (msg) {
            AlertError(msg)
        })
    }

    const showChatMember = () => {
        ApiGetX2(`/api/CyOrderMessage/getUsersOrderMessage?orderId=${props.orderId}&isPcb=${props.isPcb}`, setChatMember)
    }
    useEffect(() => {
        if (chatMember?.length != 0) {
            setTimeout(() => {
                setChatMember([])
            }, 5000);
        }

    }, [chatMember])

    console.log(props.getInviteList)
    return (
        <>
            <button className='btn btn-light Chatt-message-btn' onClick={() => props.setIsShowMessage(!props.isShowMessage)}>
                {props.isShowMessage ? <RiArrowDropRightLine className='svg-offlin' style={{ color: "#1da752", fontSize: "30px" }} /> : <RiArrowDropLeftLine className='svg-offlin' style={{ color: "#1da752", fontSize: "30px" }} />
                }
            </button>

            <div className={`Chatt-message-div boxSh centercc ${props.isShowMessage ? 'show' : ''}`} >

                <div className='Chatt-message-div-A-chat'>
                    <div className='Chatt-message-div-chat' >

                        <div>{
                            props.allMessageA?.length != 0 && props.allMessageA?.map(item => (
                                <div className='chat-div-B'
                                    style={{
                                        backgroundColor: userDetail.id == item.senderID ? "#d3d4d5" :
                                            "#f8f4d2"
                                    }} >
                                    <span className='chat-sendName-span'>{item.senderName}</span>
                                    <span className='chat-sendDate-span'><DateFormat dateString={item.sentDate} /></span>

                                    <p >{item.message}</p>
                                    {item.mentions?.length != 0 && item.mentions?.map(item => (
                                        <p className='mention-name-p'>{item}</p>
                                    ))}

                                    {item.fileID &&
                                        <span className='chat-download-icon' onClick={() => DownloadFile(item.fileID)}>
                                            <Download />
                                        </span>
                                    }

                                </div>
                            ))
                        }</div>
                    </div>
                    {props.mentionList?.length != 0 && <div className='chat-mention-div centercc'>

                        {props.mentionList.map(item => (
                            <li>{item.name}</li>
                        ))}
                    </div>}

                </div>


                <textarea className='Chatt-message-div-input'
                    placeholder='' {...register("message")}
                />

                <div className='Chatt-message-div-btn '>

                    <div className='Chatt-message-action-btn centerrc'>


                        <Tooltip title="ارسال" placement="top"> <button type='button' className='btn btn-light m-1'
                            onClick={() => sendMessage()}><Send /></button></Tooltip>

                        <Tooltip title="تازه سازی" placement="top">  <button type='button' className='btn btn-light m-1'
                            onClick={() => props.getMessageA(props.orderId, messageType)} ><Refresh /></button></Tooltip>


                        <Tooltip title="انتخاب فایل" placement="top"> <div className=' chat-uploud-btn'>
                            <span><UploadFileIcon style={{ color: `${props.ChatguId ? 'red' : ''}` }} />

                            </span>
                            <input
                                type="file"
                                // className="order-right-message-file-input"
                                onChange={(e) => {
                                    props.setLoadingFlag(true)

                                    const funcB = (id) => {
                                        props.setChatguId(id);
                                        props.setLoadingFlag(false)
                                    };
                                    ChangeUplodeC(e.target.files[0], funcB)
                                    e.target.value = null
                                    // setflag(!flag)
                                }}
                            />
                        </div></Tooltip>

                        {(!props.novin && messageType == faramoj) && <>
                            <Tooltip title="اعضا" placement="top" >
                                <button type='button' className='btn btn-light m-1 chatpanel-tooltip-btn'
                                    onClick={() => {
                                        props.setMentionList([])
                                        props.setGetMentionList([])
                                        props.setMentionList([])
                                        props.setGetMentionList([])
                                        showChatMember()
                                    }}
                                ><FaUsers />
                                    {chatMember?.length != 0 && <div className='chatpanel-tooltip-span'>
                                        {chatMember?.map(item => (<li>{item.name}</li>))}
                                    </div>}


                                </button></Tooltip>

                            <Tooltip title="دعوت" placement="top" ><button type='button' className='btn btn-light m-1'
                                onClick={() => {
                                    props.setMentionList([])
                                    props.setGetMentionList([])
                                    props.getInviteListS()
                                    setShowD(true)
                                }}
                            ><Add /></button></Tooltip>

                            <Tooltip title="منشن" placement="top" >  <button type='button' className='btn btn-light m-1'
                                onClick={() => {
                                    props.setGetInviteList([])
                                    props.getMentionListS(props.orderId)
                                    setShowD(true)
                                }}
                            ><Command />
                            </button></Tooltip>
                        </>}


                        <Modal show={showD} fullscreen={false} onHide={() => { setShowD(false) }}
                        >
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body >

                                {props.getMentionList?.length != 0 && <div className='centercc'>
                                    {props.getMentionList?.length != 0 && props.getMentionList?.map(item => (

                                        <button type='button' className='btn btn-light m-1'
                                            onClick={() => {
                                                props.setMentionList(prev => !prev.some(x => x.id === item.id) ? [...prev, { id: item.id, name: item.name }] : prev)

                                            }}
                                        >
                                            {item.name}****{UserType.filter(filter => (
                                                filter.enum == item.uerType
                                            ))[0].name}
                                        </button>
                                    ))}
                                </div>}


                                {props.getInviteList?.length != 0 && <div className='centercc'>
                                    {props.getInviteList?.length != 0 && props.getInviteList?.map(item => (

                                        <button type='button' className='btn btn-light m-1'
                                            onClick={() => addInvite(item.id, props.orderId)}
                                        >
                                            {item.name}****{UserType.filter(filter => (
                                                filter.enum == item.uerType
                                            ))[0].name}
                                        </button>
                                    ))}
                                </div>}


                            </Modal.Body>
                        </Modal>


                    </div>

                    <div className='Chatt-message-swich-btn centerrc'>
                        <button type='button'
                            className={messageType == faramoj ? 'btn btn-primary m-1' : 'btn btn-success m-1'}
                            onClick={() => {
                                if (props.messageType == faramoj) {
                                    if (messageType == faramoj) {
                                        setMessageType(novin)
                                        props.getMessageA(props.orderId, novin)
                                    } else if (messageType == novin) {
                                        setMessageType(faramoj)
                                        props.getMessageA(props.orderId, faramoj)
                                    }
                                }

                            }}
                        >{props.messageType == faramoj && <HiOutlineSwitchVertical />} {messageType == faramoj ? "فراموج" : "نوین"}</button>
                    </div>

                </div>
            </div>
        </>
    )
}
