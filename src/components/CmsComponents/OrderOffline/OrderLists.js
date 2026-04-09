import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import { useState } from 'react';
import PcbMyAdding from './AllPCBLists/PcbMyAdding';
import OrderOfflineB from './OrderOfflineB';
import OrderOffline from './OrderOffline';
export default function OrderLists() {
    const [flagResetInput, setFlagResetInput] = useState("A")

    const ffc = (tabName) => {
        setFlagResetInput(tabName)
    }
    return (
        <div>
            <Tabs
                // defaultActiveKey="newOrder"
                activeKey={flagResetInput}
                id="fill-tab-Factor"
                className="mb-2"
                // fill
                onSelect={ffc}
            // onClick={()=>ffc(id)}
            >
                <Tab eventKey="A" title="  سفارشات ایجاد شده توسط من" style={{ background: 'inherit' }}>
                    {flagResetInput == "A" && <OrderOffline componentTyp="A" />}
                </Tab>



                <Tab eventKey="B" title="سفارشات زیر مجموعه من  " style={{ background: 'inherit' }}>
                    {flagResetInput == "B" && <OrderOffline componentTyp="B" />}
                </Tab>

                <Tab eventKey="C" title="  سفارشات ارجاع شده من" style={{ background: 'inherit' }}>
                    {flagResetInput == "C" && <OrderOffline componentTyp="C" />}
                </Tab>




            </Tabs>
        </div>
    )
}
