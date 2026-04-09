import React, { useContext, useEffect, useState } from 'react'
import './CmsFactor.css'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import User from '../../../components/CmsComponents/User/User';
import Factor from '../../../components/CmsComponents/Factor/Factor';
import OrderOffline from '../../../components/CmsComponents/OrderOffline/OrderOffline';
import OrderOfflineB from '../../../components/CmsComponents/OrderOffline/OrderOfflineB';
import PCBFactor from '../../../components/CmsComponents/Factor/PCBFactor';
import InquiryFactor from '../../../components/CmsComponents/Factor/InquiryFactor';


export default function CmsFactor() {
    let { userDetail, setUserDetail } = useContext(CmsContext)

    const [flagResetInput, setFlagResetInput] = useState("Factor")
    const [orderDetails, setOrderDetails] = useState([])

    const ffc = (tabName) => {
        setFlagResetInput(tabName)
    }
    const UserType = () => [
        { userType: "SysAdmin", enum: 8 },
        { userType: "GroupExpert", enum: 10 },///کارشناس گروه
        { userType: "GroupManager", enum: 12 },///مدیر گروه
        { userType: "DepartmentManager", enum: 13 },        /// مدیر واحد
        { userType: "GeneralManager", enum: 15 },        /// مدیر کل
        { userType: "PurchasingExpert", enum: 11 },  /// کارشناس خرید
        { userType: "PurchasingManager", enum: 14 },        /// مدیر خرید
        { userType: "CustomerAdmin", enum: 16 },///ادمین پنل
        { userType: "Reporter", enum: 4 },///بازرس
        { userType: "NewUser", enum: -1 }, /// تعیین نقش نشده 
        { userType: "AllType", enum: 0 },
    ]
    return (
        <>
            <FactorContext.Provider value={{ orderDetails, setOrderDetails }}>

                <div className='container CmsNUser-container'>
                    <>
                        <Tabs
                            // defaultActiveKey="newOrder"
                            activeKey={flagResetInput}
                            id="fill-tab-Factor"
                            className="mb-2"
                            // fill
                            onSelect={ffc}
                        // onClick={()=>ffc(id)}
                        >
                            {
                                (userDetail.role == "GroupExpert" || userDetail.role == "GroupManager" || userDetail.role == "DepartmentManager" || userDetail.role == "GeneralManager") &&
                                <Tab eventKey="Factor" title="ثبت سفارش قطعه" style={{ background: 'inherit' }}>
                                    {flagResetInput == "Factor" && <Factor setFlagResetInput={setFlagResetInput}
                                    />}
                                </Tab>
                            }

                            {/* 
                            <Tab eventKey="OrderOffline" title="سفارشات من " style={{ background: 'inherit' }}>
                                {(userDetail.role != "PurchasingExpert" && userDetail.role != "PurchasingManager") &&
                                    flagResetInput == "OrderOffline" && <OrderOffline />}

                                {
                                    (userDetail.role == "PurchasingExpert" || userDetail.role == "PurchasingManager") && <OrderOfflineB />
                                }

                            </Tab> */}

                            <Tab eventKey="PCB" title="ثبت سفارش PCB" style={{ background: 'inherit' }}>
                                {flagResetInput == "PCB" && <PCBFactor />}
                            </Tab>

                            <Tab eventKey="inqu" title="ثبت درخواست استعلام اولیه" style={{ background: 'inherit' }}>
                                {flagResetInput == "inqu" && <InquiryFactor />}
                            </Tab>



                        </Tabs>

                    </>


                </div>
            </FactorContext.Provider>

        </>

    )
}
