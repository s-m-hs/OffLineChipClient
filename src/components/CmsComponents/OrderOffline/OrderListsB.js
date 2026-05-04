import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useState } from 'react';
import OrderOfflineB from './OrderOfflineB';
export default function OrderListsB() {
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
                <Tab eventKey="A" title=" کلیه سفارشات  " style={{ background: 'inherit' }}>
                    {flagResetInput == "A" && <OrderOfflineB componentTyp="A" status="allOrder" />}
                </Tab>

                <Tab eventKey="B" title=" سفارشات در حال استعلام گیری " style={{ background: 'inherit' }}>
                    {flagResetInput == "B" && <OrderOfflineB componentTyp="B" status="inQuring" />}
                </Tab>

                <Tab eventKey="C" title=" سفارشات در صف خرید " style={{ background: 'inherit' }}>
                    {flagResetInput == "C" && <OrderOfflineB componentTyp="C" status="inOrderToSupply" />}
                </Tab>



                <Tab eventKey="D" title=" سفارشات در حال تامین   " style={{ background: 'inherit' }}>
                    {flagResetInput == "D" && <OrderOfflineB componentTyp="D" status="inSupply" />}
                </Tab>






            </Tabs>
        </div>
    )
}
