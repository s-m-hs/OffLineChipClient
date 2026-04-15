import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import { useState } from 'react';
import Notifications from './Notifications';
import OpenOrderS from './OpenOrderS';
export default function OrderKarPooshe() {
    const [flagResetInput, setFlagResetInput] = useState("Notifications")
    const bom = 1
    const pcb = 2
    const inquery = 3
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
                <Tab eventKey="Notifications" title="اعلانات" style={{ background: 'inherit' }}>
                    <Notifications />
                </Tab>

                <Tab eventKey="OpenOrderBom" title=" سفارشات باز قطعه (قابل مشاهده برای من) " style={{ background: 'inherit' }}>
                    {flagResetInput == "OpenOrderBom" && <OpenOrderS orderType={bom} />}
                </Tab>

                <Tab eventKey="OpenOrderPcb" title=" سفارشات باز PCB (قابل مشاهده برای من) " style={{ background: 'inherit' }}>
                    {flagResetInput == "OpenOrderPcb" && <OpenOrderS orderType={pcb} />}
                </Tab>


                {/* <Tab eventKey="D" title=" استعلام اولیه های باز من " style={{ background: 'inherit' }}></Tab> */}







            </Tabs>
        </div>
    )
}
