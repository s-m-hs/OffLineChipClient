import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import { useState } from 'react';
export default function C() {
    const [flagResetInput, setFlagResetInput] = useState("Factor")

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
                <Tab eventKey="A" title="پیام ها  " style={{ background: 'inherit' }}></Tab>
                <Tab eventKey="B" title=" سفارشات باز قطعه (قابل مشاهده برای من) " style={{ background: 'inherit' }}></Tab>
                <Tab eventKey="C" title=" سفارشات باز PCB (قابل مشاهده برای من) " style={{ background: 'inherit' }}></Tab>
                <Tab eventKey="D" title=" استعلام اولیه های باز من " style={{ background: 'inherit' }}></Tab>







            </Tabs>
        </div>
    )
}
