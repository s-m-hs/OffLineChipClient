import React, { useContext, useEffect, useState } from 'react'
import './PCBFactor.css'
import { useForm } from "react-hook-form";
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2';
import { CmsContext, HomeContext } from '../../../context/CmsContext';
import LodingA from '../../../utils/LodingA';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Download } from '@mui/icons-material';
import apiUrl from '../../../utils/ApiConfig';
import alertA from '../../../utils/AlertFunc/AlertA';
import ChangeUplode from '../../../utils/ChangeUplode';
import DownloadFile from '../../../utils/DownloadFile';
import ApiPostX from '../../../utils/ApiServicesX/ApiPostX';
import ChangeUplodeC from '../../../utils/ChangeUplodeC';
import ApiPostX0 from '../../../utils/ApiServicesX/ApiPostX0';
import routes from '../../../routes';
import { useNavigate, useRoutes } from 'react-router-dom';
export default function PCBFactor() {
    const cmsContext = useContext(CmsContext);
    const homeContext = useContext(HomeContext);
    let { userDetail } = useContext(CmsContext)
    const [allGroup, setAllGroup] = useState([])
    const [allVahed, setAllVahed] = useState([])
    const [flagUpdate, setFlagUpdate] = useState(false);
    const [currentGroups, setCurrentGroups] = useState([])
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [guIdA, setGuIdA] = useState("");
    const [guIdB, setGuIdB] = useState("");
    const [guIdC, setGuIdC] = useState("");
    const [guIdD, setGuIdD] = useState("");
    const [guIdE, setGuIdE] = useState("");
    const [list, setList] = useState([])

    const navigate = useNavigate();

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
        PriJCode: { required: "PriJCode is required" },
        count: { required: "count is required" },

    };
    const handleError = (errors) => { };
    const selectedVahed = watch(!flagUpdate ? "vahed" : "update.vahed");
    const isMechanizedWatch = watch("isMechanizedAssembly")

    const afterResponse = () => {
        alertA('')
        reset(setValue(''))
        setGuIdA('')
        setGuIdB('')
        setGuIdC('')
        setGuIdD('')
        setGuIdE('')
        setList([])
        navigate('/p-admin/PCBLIst')///انتقال به صفحه 
    }

    const handleRegistration = (data) => {
        const listB = []
        list.forEach(element => {
            listB.push(element.fileId)
        });
        let obj = {
            orderCode: data.PriJCode,
            amount: 0,
            count: data.count,
            totalAmount: 0,
            currency: 1,
            creatorComment: null,
            commentB: null,
            cyVahedId: data.vahed ? data.vahed : null,
            cyGoroohId: data.group ? data.group : null,
            guidFileList: listB,
            isMechanizedAssembly: true,
        }
        ApiPostX(`/api/CyPCB/addPcb`, obj, afterResponse)
    }


    const funcA = () => {
        // alertA('')
    }

    const addPcbFile = (fileId, enumId) => {
        const getidFromApi = (id) => {
            let fileObj = { enumid: enumId, fileId: id }
            setList(prev => {
                const exists = prev.some(x => x.enumid === fileObj.enumid);

                if (exists) {
                    // جایگزین کردن
                    return prev.map(x =>
                        x.enumid === enumId ? fileObj : x
                    );
                } else {
                    // اضافه کردن
                    return [...prev, fileObj];
                }
            })
            setLoadingFlag(false)

        }
        let obj = {
            id: null,
            cyPCBOrderID: null,
            cyUserID: null,
            fileID: fileId,
            sendDate: null,
            type: enumId
        }
        ApiPostX0(`/api/CyPCB/addPcbFile`, obj, getidFromApi)
    }
    useEffect(() => {

        const enumId = 1;
        const funcB = (id) => {
            setGuIdA(id);
            addPcbFile(id, enumId)
        };
        if (getValues("Gerber")) {
            ChangeUplodeC(getValues("Gerber"), funcB);
            // changeUplode();
        }
    }, [getValues("Gerber")]);

    useEffect(() => {
        const enumId = 2;
        const funcB = (id) => {
            setGuIdB(id);
            addPcbFile(id, enumId)
        };
        if (getValues("StackLayer")) {
            ChangeUplodeC(getValues("StackLayer"), funcB);
            // changeUplode();
        }


    }, [getValues("StackLayer")])

    useEffect(() => {
        const enumId = 3;
        const funcB = (id) => {
            setGuIdC(id);
            addPcbFile(id, enumId)
        };
        if (getValues("MI")) {
            ChangeUplodeC(getValues("MI"), funcB);
        }


    }, [(getValues("MI"))])

    useEffect(() => {
        const enumId = 4;
        const funcB = (id) => {
            setGuIdD(id);
            addPcbFile(id, enumId)
        };
        if (getValues("PickAndPlace")) {
            ChangeUplodeC(getValues("PickAndPlace"), funcB);
            // changeUplode();
        }


    }, [getValues("PickAndPlace")])

    useEffect(() => {
        const enumId = 5;
        const funcB = (id) => {
            setGuIdE(id);
            addPcbFile(id, enumId)
        };
        if (getValues("BOM")) {
            ChangeUplodeC(getValues("BOM"), funcB);
            // changeUplode();
        }


    }, [getValues("BOM")])

    useEffect(() => {
        if (selectedVahed && (userDetail.role == "DepartmentManager" || userDetail.role == "GeneralManager")) {
            setCurrentGroups(allGroup?.filter((filter => (
                filter.vahedId == selectedVahed)))
            )
        } else if (userDetail.role == "DepartmentManager") {
            if (!loadingFlag) {
                setTimeout(() => {
                    let VahedId = userDetail.vahedId
                    setValue("vahed", VahedId)
                }, 1500);

            }
        } else if (userDetail.role == "GroupExpert" || userDetail.role == "GroupManager") {
            setCurrentGroups(allGroup)
            if (!loadingFlag) {
                setTimeout(() => {
                    let VahedId = userDetail.vahedId
                    let GroupId = userDetail.gruopId
                    setValue("vahed", VahedId)
                    setValue("group", GroupId)
                }, 1500);
            }
        }


    }, [selectedVahed, userDetail, loadingFlag])

    useEffect(() => {
        cmsContext.setFlagClass(false);
        homeContext.setSideMenueFlag(false)

        ApiGetX2(`/api/CyGroupVahed/getGroup`, setAllGroup)
        ApiGetX2(`/api/CyGroupVahed/getVahed`, setAllVahed)


        return () => cmsContext.setFlagClass(true);
    }, []);

    return (
        <form className="Factor-container" dir="rtl"
            onSubmit={handleSubmit(handleRegistration, handleError)}
        >

            {loadingFlag && <LodingA isShow={true} />
            }


            {/* سربرگ */}
            <div className="Factor-header">
                <div className=" Factor-header-items">


                    <div className="login-label-float" style={{ width: '100px', justifySelf: 'flex-start' }} >
                        <input
                            name="PriJCode"
                            type="number"
                            placeholder=""
                            className={errors.PriJCode ? "formerror" : ""}
                            {...register(
                                !flagUpdate ? "PriJCode" : "update.PriJCode", registerOptions.PriJCode
                            )}
                        />
                        <label style={{ fontSize: "15px" }}> کد پروژه</label>
                        <div className='Factor-searchPartNumber-div'>

                        </div>
                    </div>


                    <div>
                        <label className="user-col3-selectlabel ">واحد :</label>
                        <select

                            className={userDetail.role == "GeneralManager" ? "user-col3-select" : "user-col3-select disabled"}
                            {...register(
                                !flagUpdate ? "vahed" : "update.vahed"
                            )}

                        // disabled={(selectedVahedB == 10 || selectedVahedB == 12 || selectedVahedB == 13) ? false : true}
                        >
                            <option value="">انتخاب کنید...</option>
                            {allVahed.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {" "}
                                    {item.text}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="user-col3-selectlabel">گروه :</label>
                        <select
                            className={(userDetail.role == "SysAdmin" || userDetail.role == "GeneralManager" || userDetail.role == "DepartmentManager") ? "user-col3-select" : "user-col3-select disabled"}
                            disabled={!selectedVahed}
                            {...register(!flagUpdate ? "group" : "update.group")}
                        >
                            <option value="">انتخاب کنید...</option>
                            {currentGroups?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.text}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

            </div>

            <div className="pcbForm-middle-div boxSh container">
                {/* <button onClick={() => {
                    console.log(getValues('Gerber'))
                    console.log(getValues('StackLayer'))
                    console.log(getValues('MI'))
                    console.log(getValues('PickAndPlace'))
                    console.log(getValues('BOM'))

                }}>====</button> */}
                <div className='row m-1'>
                    <div className='col-4 OrderOfflineB-exel-div centercc'>
                        <span>	Gerber</span>
                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc  '>
                        {<div className='boxSh'>
                            <span><UploadFileIcon />
                                بارگزاری فایل اکسل
                            </span>
                            <input
                                type="file"
                                // className="order-right-message-file-input"
                                onChange={(e) => {
                                    setLoadingFlag(true)
                                    setValue("Gerber", e.target.files[0])
                                    e.target.value = null
                                    // setflag(!flag)
                                }}
                            />
                        </div>}

                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc'>

                        <button
                            type='button '
                            className={guIdA ? 'btn btn-light ' : 'btn btn-light disabled'}
                            style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                            onClick={() => {
                                DownloadFile(guIdA)
                            }}
                        >
                            <Download />
                        </button>
                    </div>
                </div>

                <hr />

                <div className='row m-1'>
                    <div className='col-4 OrderOfflineB-exel-div centercc'>
                        <span>	Stack Layer</span>
                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc  '>
                        {<div className='boxSh'>
                            <span><UploadFileIcon />
                                بارگزاری فایل اکسل
                            </span>
                            <input
                                type="file"
                                // className="order-right-message-file-input"
                                onChange={(e) => {
                                    setLoadingFlag(true)
                                    setValue("StackLayer", e.target.files[0])
                                    e.target.value = null
                                }}

                            />
                        </div>}

                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc'>

                        <button
                            type='button '
                            className={guIdB ? 'btn btn-light ' : 'btn btn-light disabled'}
                            style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                            onClick={() => {
                                DownloadFile(guIdB)
                            }}
                        >
                            <Download />
                        </button>
                    </div>
                </div>

                <hr />

                <div className='row m-1'>
                    <div className='col-4 OrderOfflineB-exel-div centercc'>
                        <span>MI</span>
                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc  '>
                        {<div className='boxSh'>
                            <span><UploadFileIcon />
                                بارگزاری فایل اکسل
                            </span>
                            <input
                                type="file"
                                // className="order-right-message-file-input"
                                onChange={(e) => {
                                    setLoadingFlag(true)
                                    setValue("MI", e.target.files[0])
                                    e.target.value = null
                                }}
                            />
                        </div>}

                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc'>

                        <button
                            type='button '
                            className={guIdC ? 'btn btn-light ' : 'btn btn-light disabled'}
                            style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                            onClick={() => {
                                DownloadFile(guIdC)
                            }}
                        >
                            <Download />
                        </button>
                    </div>
                </div>

                <hr />

                <div className='row'>
                    <div className='col-4'>
                        <label style={{ fontWeight: '600', fontSize: '18px', borderBottom: '1px dotted' }}>ثبت سفارش مونتاژ مکانیزه</label>
                        <input {...register("isMechanizedAssembly")} type="checkbox" value="isMechanizedAssembly" />
                    </div>
                </div>
                <div className={isMechanizedWatch ? 'row m-1 ' : 'row m-1 disabled'} >
                    <div className='col-4 OrderOfflineB-exel-div centercc'>
                        <span>	PickAndPlace</span>
                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc  '>
                        {<div className='boxSh'>
                            <span><UploadFileIcon />
                                بارگزاری فایل اکسل
                            </span>
                            <input
                                type="file"
                                // className="order-right-message-file-input"
                                onChange={(e) => {
                                    setLoadingFlag(true)
                                    setValue("PickAndPlace", e.target.files[0])
                                    e.target.value = null
                                }}
                            />
                        </div>}

                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc'>

                        <button
                            type='button '
                            className={guIdD ? 'btn btn-light ' : 'btn btn-light disabled'}
                            style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                            onClick={() => {
                                DownloadFile(guIdD)
                            }}
                        >
                            <Download />
                        </button>
                    </div>
                </div>


                <div className={isMechanizedWatch ? 'row m-1 ' : 'row m-1 disabled'}>
                    <div className='col-4 OrderOfflineB-exel-div centercc'>
                        <span>	BOM</span>
                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc  '>
                        {<div className='boxSh'>
                            <span><UploadFileIcon />
                                بارگزاری فایل اکسل
                            </span>
                            <input
                                type="file"
                                // className="order-right-message-file-input"
                                onChange={(e) => {
                                    setLoadingFlag(true)
                                    setValue("BOM", e.target.files[0])
                                    e.target.value = null
                                }}
                            />
                        </div>}

                    </div>

                    <div className='col-4 OrderOfflineB-exel-div centercc'>

                        <button
                            type='button '
                            className={guIdE ? 'btn btn-light ' : 'btn btn-light disabled'}
                            style={{ width: "60px", height: "30px", fontSize: "20px", padding: "1px", margin: '1px' }}
                            onClick={() => {
                                DownloadFile(guIdE)
                            }}
                        >
                            <Download />
                        </button>
                    </div>
                </div>

                <hr />

                <div className="login-label-float" style={{ width: '100px', justifySelf: 'flex-start' }} >
                    <input
                        name="count"
                        type="number"
                        placeholder=""
                        className={errors.count ? "formerror" : ""}
                        {...register(
                            !flagUpdate ? "count" : "update.count", registerOptions.count
                        )}
                    />
                    <label style={{ fontSize: "15px" }}> تعداد </label>
                    <div className='Factor-searchPartNumber-div'>

                    </div>
                </div>

                <button className='btn btn-primary pcb-save-button'>ثبت</button>
            </div>


        </form>
    )
}
