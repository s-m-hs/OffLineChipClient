// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import './Factor.css';
// import { CmsContext, HomeContext } from '../../../context/CmsContext';

// const Factor = () => {
//     const cmsContext = useContext(CmsContext);
//     const homeContext = useContext(HomeContext);
//     useEffect(() => {
//         cmsContext.setFlagClass(false);
//         homeContext.setSideMenueFlag(false)

//         return () => cmsContext.setFlagClass(true);
//     }, []);

import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import './Factor.css';
import { CmsContext, HomeContext } from '../../../context/CmsContext';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2';
import { useForm } from "react-hook-form";
import BaseGrid from '../../Grid/BaseGrid';
import apiUrl from '../../../utils/ApiConfig';
import alertA from '../../../utils/AlertFunc/AlertA';
import { Mosaic } from 'react-loading-indicators';
import AlertError from '../../../utils/AlertFunc/AlertError';
import LodingA from '../../../utils/LodingA';
import { Link, useNavigate } from 'react-router-dom';
import UploadFileIcon from "@mui/icons-material/UploadFile";

import {
    MagnifyingGlass,
    Plus,
    Phone,
    SignIn,
    BuildingApartment,
    Barcode,
    UserCheck,
    SignOut,
    Wrench,
    Fingerprint,
    ShoppingCart,
    User,
    EnvelopeSimple,
    House,
    TextIndent,
    XCircle,
    SunDim,
    UserCircleGear,
    ChatText,
    ChatCircleText,
    Bell,
    ExclamationMark,
    Laptop,
    UsersThree,
    Eyeglasses,
    EyeSlash,
    Eyes, Eye

} from "@phosphor-icons/react";
import { Add, CloseOutlined, More, MoreHorizOutlined, MoreHorizRounded, MoreHorizSharp, MoreTime, MoreVert, Save, SaveAlt, SaveAs, SaveOutlined, Search, SearchOffOutlined, SearchSharp } from '@mui/icons-material';
import ChangeUplode from '../../../utils/ChangeUplode';
import DownloadFile from '../../../utils/DownloadFile';
const Factor = (props) => {
    const cmsContext = useContext(CmsContext);
    const homeContext = useContext(HomeContext);
    let { userDetail } = useContext(CmsContext)
    const navigate = useNavigate();

    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const searchRef = useRef(null)
    const [loadingFlag, setLoadingFlag] = useState(false)
    const [file, setFile] = useState({});
    const [guId, setGuId] = useState("");
    const [orderItemExel, setOrderItemExel] = useState([])
    const [searchProductDetail, setSearchProductDetail] = useState([])

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
    const handleError = (errors) => { };

    const [allGroup, setAllGroup] = useState([])
    const [allVahed, setAllVahed] = useState([])
    const [currentGroups, setCurrentGroups] = useState([])
    const [flagUpdate, setFlagUpdate] = useState(false);
    const [searchList, setSearchList] = useState([])
    const selectedVahed = watch("vahed");
    const searchWatch = watch("searchPartNumber");

    const [orderItems, setOrderItems] = useState([]);
    const [totals, setTotals] = useState({ discount: 0, tax: 0, subtotal: 0, grandTotal: 0 });
    const [error, setError] = useState('');

    const addItem = useCallback((product) => {
        const newId = `tmp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newItem = {
            ID: newId,
            partNumber: product?.partNo,
            manufacturer: product?.manufacturer,
            CyProductID: product?.ProductID ? product.ProductID : null,
            CyOrderID: null,
            quantity: product?.supply ? product.supply : 0,
            UnitPrice: product?.price ? product.price : 0,
            TotalPrice: product?.price ? product.price * product.supply : 0,
            Duration: '',
            // Information: description,
            creatorCommentA: product?.creatorCommentA,
            creatorId: userDetail?.id,
            creatorName: userDetail?.userName,

        };
        // فقط محصولات با PartNumber پر شده را چک کن
        const filledItems = orderItems.filter(item => item.partNumber && item.partNumber?.trim());
        const isDuplicate = filledItems.some(item =>
            item.partNumber?.trim() === newItem.partNumber?.trim() && newItem.partNumber?.trim()
        );

        if (isDuplicate) {
            setError('این محصول قبلاً در فاکتور اضافه شده است!');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setOrderItems(prev => [...prev, newItem]);
        setError('');
    }, [orderItems]);

    const removeItem = useCallback((id) => {
        setOrderItems(prev => prev.filter(item => item.ID !== id));
    }, []);

    const updateItemField = useCallback((id, field, value) => {
        setOrderItems(prev =>
            prev.map(item =>
                item.ID === id ? { ...item, [field]: value } : item
            )
        );
    }, []);

    const updateRowTotal = useCallback((id) => {
        setOrderItems(prev =>
            prev.map(item => {
                if (item.ID === id) {
                    const total = (item.quantity || 0) * (item.UnitPrice || 0);
                    return { ...item, TotalPrice: total };
                }
                return item;
            })
        );
    }, []);

    const calculateTotals = useCallback(() => {
        const subtotal = orderItems.reduce((sum, item) => sum + (item.TotalPrice || 0), 0);
        const discountAmount = subtotal * ((totals.discount || 0) / 100);
        const taxAmount = (subtotal - discountAmount) * ((totals.tax || 0) / 100);
        const grandTotal = subtotal - discountAmount + taxAmount;

        setTotals({
            subtotal,
            discount: totals.discount || 0,
            tax: totals.tax || 0,
            discountAmount,
            taxAmount,
            grandTotal
        });
    }, []);
    // const handleRegistration = (data) => {
    //     console.log(data)
    // }

    useEffect(() => {
        calculateTotals();
    }, [orderItems, calculateTotals]);

    const handleRegistration = (data) => {
        setLoadingFlag(true)
        orderItems.forEach(item => {
            item.ID = null
        });
        const orderStatus = 10
        let obj = {
            id: null,
            status: orderStatus,  ///Inquiring = 15,
            orderMode: 0,//Normal = 0,
            statusText: data.StatusText,
            totalAmount: totals.grandTotal,
            orderCode: data.PriJCode,
            cyVahedId: data.vahed ? data.vahed : null,
            cyGoroohId: data.group ? data.group : null,
            cyOrderItems: orderItems,
        }
        async function myApp() {
            const res = await fetch(`${apiUrl}/api/CyOrdersB/addOrder`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj)
            }).then(res => {
                if (res.ok) return res.json().then(result => {
                    setLoadingFlag(false)
                    setOrderItems([])
                    reset(setValue(''))
                    alertA("عملیات با موفقیت ثبت شد")
                    navigate('/p-admin/OrderLists')///انتقال به صفحه 

                    // props.setFlagResetInput("OrderOffline")
                })
                else {
                    setLoadingFlag(false)
                    AlertError("مشکلی پیش آمده...")
                }
            })
        }
        myApp()

    }

    const [colDefs] = useState([
        { field: 'partNo', headerName: "نام", maxWidth: 400, },
        { field: 'cyProductCategory', headerName: "گروه" },
        { field: 'cyManufacturer', headerName: "شرکت سازنده" },
        // { field: 'description', headerName: "جزییات" },
        // { field: 'supply', headerName: "موجودی" },
        // { field: 'price', headerName: "قیمت" },
        // { field: 'smallImage', headerName: "عکس" },
        {
            field: '', headerName: "جزییات", width: 200, cellRenderer: (params) => (
                <button className='btn btn-light' onClick={() => {
                    setSearchProductDetail(params.data)
                }}>

                    <Barcode size={25} />
                </button>
            )
        },
        {
            headerName: 'عملیات', maxWidth: 200,
            cellRenderer: (params) => (
                <>
                    <button type='button' className='btn btn-light'
                        onClick={() => {
                            addItem({
                                partNo: params.data.partNo,
                                cyManufacturer: params.data.cyProductCategory,
                                manufacturer: params.data.cyManufacturer,
                                creatorCommentA: params.data.creatorCommentA,
                                price: params.data.price,
                                supply: params.data.supply,
                                smallImage: params.data.smallImage,
                                ProductID: params.data.id
                            })
                            setShow(false)
                            // setSearchList([])
                            // reset(setValue(""))
                        }}><Plus size={25} /></button>

                </>
            )
        }
    ]);

    const searchPartNumber = (searchText, sortA, sortB, pageN, pageSize) => {
        const url = `/api/CyProductsB/searchProduct?Search=${searchText}&SortBy=${sortA}&Descending=${sortB}&Page=${pageN}&PageSize=${pageSize}`

        ApiGetX2(url, setSearchList)
    }
    const funcA = () => [
        alertA('')
    ]
    const funcB = (id) => {
        setGuId(id);
    };
    useEffect(() => {
        if (file?.name) {
            ChangeUplode(file, funcA, funcB);
            // changeUplode();
        }
    }, [file]);
    useEffect(() => {
        if (guId) {
            ApiGetX2(`/api/CyProductsB/updateSupplyPriceByExell?input=${guId}`, setOrderItemExel)
        }
    }, [guId])

    useEffect(() => {
        if (orderItemExel?.partList?.length != 0) {
            orderItemExel?.partList?.forEach(element => {
                addItem({
                    partNo: element.partNumber,
                    cyManufacturer: null,
                    manufacturer: element.manufacturer,
                    creatorCommentA: element.creatorCommentA,
                    price: 0,
                    supply: element.quantity,
                    smallImage: null,
                    ProductID: null
                })
            });
        }
    }, [orderItemExel])
    /////////مربوط به سرچ اتوماتیک
    // useEffect(() => {
    //     if (getValues("searchPartNumber")?.length > 2) {
    //         searchPartNumber(getValues("searchPartNumber"), "name", true, 1, 100)
    //     }

    // }, [searchWatch])

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

            {error && <div className="error-message">{error}</div>}

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
                                !flagUpdate ? "PriJCode" : "update.PriJCode"
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
                    {/* 
                    <input placeholder="گروه" value={FactorData.FactorCode} onChange={e => setFactorData({ ...FactorData, FactorCode: e.target.value })} />
                    <input placeholder="واحد" value={FactorData.FactorDate} onChange={e => setFactorData({ ...FactorData, FactorDate: e.target.value })} />
                    <input placeholder="کد پروژه" value={FactorData.FactorDate} onChange={e => setFactorData({ ...FactorData, FactorDate: e.target.value })} /> */}
                </div>
                {/* <div className="header-row">
                    <input placeholder="نام مشتری" value={FactorData.customerName} onChange={e => setFactorData({ ...FactorData, customerName: e.target.value })} />
                    <input placeholder="کد مشتری" value={FactorData.customerCode} onChange={e => setFactorData({ ...FactorData, customerCode: e.target.value })} />
                </div> */}
            </div>

            {/* جدول */}
            <div className=' Factor-header-items mb-3' style={{ height: "50px" }}>

                <button type='button' className="add-btn" onClick={() => {
                    // setShow(true)
                    addItem()
                }}><Add></Add> اضافه کردن کالا</button>

                <div className='factor-exel-div boxSh centercc'>
                    <button type='button'
                        onClick={() => {
                            const sampleGuid = "a7e36cd3-0b8c-44bc-b8c3-6cba040df295"
                            DownloadFile(sampleGuid)
                        }}
                    >نمونه اکسل</button>
                    <span>
                        بارگزاری فایل اکسل <UploadFileIcon />
                    </span>
                    <input
                        type="file"
                        // className="order-right-message-file-input"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>



                <button type='button' className='btn btn-warning m-1' onClick={() => {
                    setShow(true)
                }}>
                    <MoreHorizOutlined />
                    <Search />
                </button>

                {/* <div className="login-label-float Factor-searchBox"  >
                        <input
                            name="searchPartNumber"
                            type="text"
                            placeholder=""
                            {...register(
                                !flagUpdate ? "searchPartNumber" : "update.searchPartNumber",
                                registerOptions.userName
                            )}
                        />
                        <label> جستجو پارت نامبر</label>
                    </div> */}


            </div>
            <div className="items-table">


                <table>
                    <thead>
                        <tr>
                            <th>ردیف</th>
                            <th>پارت نامبر</th>
                            <th>شرکت سازنده</th>
                            <th>توضیحات</th>
                            <th >تعداد</th>
                            <th className='hidden'>قیمت واحد</th>
                            <th className='hidden'>قیمت مجموع</th>
                            <th className='hidden'>زمان تأمین</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>

                                <td><input value={item.partNumber || ''} onChange={e => updateItemField(item.ID, 'partNumber', e.target.value)} /></td>

                                <td><input value={item.manufacturer || ''} onChange={e => updateItemField(item.ID, 'manufacturer', e.target.value)} /></td>

                                <td><input value={item.creatorCommentA || ''} onChange={e => updateItemField(item.ID, 'creatorCommentA', e.target.value)} /></td>

                                <td >
                                    <input type="number" value={item.quantity || 0}
                                        onChange={e => {
                                            const value = parseInt(e.target.value) || 0;
                                            updateItemField(item.ID, 'quantity', value);
                                            updateRowTotal(item.ID);
                                        }}
                                    />
                                </td>

                                <td className='hidden'>
                                    <input type="number" value={item.UnitPrice || 0}
                                        onChange={e => {
                                            const value = parseInt(e.target.value) || 0;
                                            updateItemField(item.ID, 'UnitPrice', value);
                                            updateRowTotal(item.ID);
                                        }}
                                    />
                                </td>

                                <td className='hidden'>{(item.TotalPrice || 0).toLocaleString('fa-IR')} ریال</td>

                                <td className='hidden'><input value={item.Duration || ''} onChange={e => updateItemField(item.ID, 'Duration', e.target.value)} /></td>

                                <td className='centerr'>
                                    <button className="remove-btn" onClick={() => removeItem(item.ID)}>➖</button></td>
                            </tr>
                        ))}

                        {/* {guId && orderItems?.partList?.map((item, index) => (
                            <tr key={item.ID}>
                                <td>{index + 1}</td>

                                <td><input
                                    disabled
                                    value={item.partNumber || ''} onChange={e => updateItemField(item.ID, 'partNumber', e.target.value)} /></td>

                                <td><input
                                    disabled
                                    value={item.manufacturer || ''} onChange={e => updateItemField(item.ID, 'manufacturer', e.target.value)} /></td>

                                <td><input
                                    disabled
                                    value={item.creatorCommentA || ''} onChange={e => updateItemField(item.ID, 'creatorCommentA', e.target.value)} /></td>

                                <td >
                                    <input
                                        disabled
                                        type="number" value={item.quantity || 0}
                                        onChange={e => {
                                            const value = parseInt(e.target.value) || 0;
                                            updateItemField(item.ID, 'quantity', value);
                                            updateRowTotal(item.ID);
                                        }}
                                    />
                                </td>

                                <td className='hidden'>
                                    <input type="number" value={item.UnitPrice || 0}
                                        onChange={e => {
                                            const value = parseInt(e.target.value) || 0;
                                            updateItemField(item.ID, 'UnitPrice', value);
                                            updateRowTotal(item.ID);
                                        }}
                                    />
                                </td>

                                <td className='hidden'>{(item.TotalPrice || 0).toLocaleString('fa-IR')} ریال</td>

                                <td className='hidden'><input value={item.Duration || ''} onChange={e => updateItemField(item.ID, 'Duration', e.target.value)} /></td>

                                <td className='centerr'>
                                    <button className="remove-btn" onClick={() => removeItem(item.ID)}>➖</button></td>
                            </tr>
                        ))} */}
                    </tbody>
                </table>

                {orderItems.length === 0 && <p style={{ color: '#666', fontSize: '14px' }}>هیچ محصولی اضافه نشده</p>}
            </div>

            {/* باکس محاسبات */}
            {/* <div className="totals-box">
                <div className="total-row"><strong>زیرمجموع:</strong> {totals.subtotal.toLocaleString('fa-IR')} ریال</div>
                <div className="total-row">
                    تخفیف (%): <input type="number" value={totals.discount} onChange={e => setTotals({ ...totals, discount: parseFloat(e.target.value) || 0 })} style={{ width: '80px' }} />
                </div>
                <div className="total-row">
                    مالیات (%): <input type="number" value={totals.tax} onChange={e => setTotals({ ...totals, tax: parseFloat(e.target.value) || 0 })} style={{ width: '80px' }} />
                </div>
                <div className="grand-total">
                    <strong>مجموع نهایی: {totals.grandTotal.toLocaleString('fa-IR')} ریال</strong>
                </div>
            </div>

            <div className="footer-section">
                <button className="submit-btn" onClick={submitFactor}>💾 ثبت فاکتور</button>
                <div className="notes-section">
                    <label>توضیحات:</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
                </div>
            </div> 
            */}

            <div className="notes-section">
                <label>توضیحات:</label>
                <textarea
                    {...register("StatusText")}
                    rows={4} />
            </div>

            <div className="footer-section">
                <button className="submit-btn" type='submit'><SaveOutlined style={{ color: '#fff' }} /> ثبت </button>

            </div>

            <Modal show={show} fullscreen={fullscreen} onHide={() => {
                setShow(false)
                setSearchProductDetail([])

            }}
                onEntered={() => {
                    searchRef.current?.focus();
                }}
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body >
                    <>
                        <div className='container'>
                            <div className='row centerrc'>
                                <div className="col-6 login-label-float "  >
                                    <input
                                        type="text"
                                        placeholder=""
                                        {...register("searchPartNumber")}
                                        ref={(el) => {
                                            register("searchPartNumber").ref(el);
                                            searchRef.current = el;
                                        }}
                                    />
                                    <label>  پارت نامبر را وارد کنید</label>
                                </div>

                                <div className='col-1 btn btn-success' onClick={() => {
                                    searchPartNumber(getValues("searchPartNumber"), "name", true, 1, 100)
                                }}><MagnifyingGlass size={30} /></div>
                            </div>

                            <hr />

                            <div className='row' style={{ height: "800px" }}>

                                <div className='col-12'>
                                    <BaseGrid rowData={searchList?.products} colDefs={colDefs} rtl={true} />

                                </div>

                            </div>

                        </div>

                    </>


                </Modal.Body>
            </Modal>

            {searchProductDetail?.length != 0 && <div style={{ position: 'fixed', left: '10px', top: 0, zIndex: 100000, padding: '10px', backgroundColor: '#222020', border: '1px solid #ccc', borderRadius: '8px', width: '450px', color: "#fff", fontSize: '15px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setSearchProductDetail([])}>                <CloseOutlined style={{ color: "#fff" }} />
                </span>
                <hr />
                <p className='tooltip-p'>
                    <h6> پارت نامبر:  </h6> {searchProductDetail?.partNo}</p>

                <p className='tooltip-p'><h6>جزییات :  </h6> {searchProductDetail?.description}</p>

                <hr />

                <p className='tooltip-p'><h6>دسته بندی:  </h6> {searchProductDetail?.cyProductCategory}</p>

                <p className='tooltip-p'><h6> شرکت سازنده:  </h6> {searchProductDetail?.cyManufacturer}</p>


                <p className='tooltip-p'><h6> قیمت:  </h6> {searchProductDetail?.price}</p>

                <p className='tooltip-p'><h6>موجودی :  </h6> {searchProductDetail?.supply}</p>

                <p className='tooltip-p'><h6>شناسه :  </h6> {searchProductDetail?.id}</p>

                <p className='tooltip-p'><h6>عکس :  </h6>
                    <img style={{ width: '100px' }} src={searchProductDetail?.smallImage} alt={searchProductDetail?.smallImage} />
                </p>
            </div>}

        </form>
    );
};

export default Factor;
