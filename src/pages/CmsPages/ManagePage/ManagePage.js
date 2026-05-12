import React, { useContext, useEffect, useState } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import User from '../../../components/CmsComponents/User/User';
import Factor from '../../../components/CmsComponents/Factor/Factor';
import OrderOffline from '../../../components/CmsComponents/OrderOffline/OrderOffline';
import OrderOfflineB from '../../../components/CmsComponents/OrderOffline/OrderOfflineB';
import PCBFactor from '../../../components/CmsComponents/Factor/PCBFactor';
import InquiryFactor from '../../../components/CmsComponents/Factor/InquiryFactor';
import Product from '../../../components/CmsComponents/Product/Product';
import Parameter from '../Parameter/Parameter';
import ParameterCom from '../../../components/CmsComponents/Parameter/ParameterCom';


export default function ManagePage() {
    let { userDetail, setUserDetail } = useContext(CmsContext)

    const [flagResetInput, setFlagResetInput] = useState("Factor")
    const [orderDetails, setOrderDetails] = useState([])

    const ffc = (tabName) => {
        setFlagResetInput(tabName)
    }

    return (
        <>
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

                        <Tab eventKey="product" title="محصولات" style={{ background: 'inherit' }}>
                            {flagResetInput == "product" && <Product setFlagResetInput={setFlagResetInput}
                            />}
                        </Tab>

                        <Tab eventKey="Parameter" title="ارز ها" style={{ background: 'inherit' }}>
                            {flagResetInput == "Parameter" && <ParameterCom setFlagResetInput={setFlagResetInput}
                            />}
                        </Tab>

                    </Tabs>

                </>


            </div>

        </>

    )
}
