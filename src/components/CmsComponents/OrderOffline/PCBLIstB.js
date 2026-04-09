import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import { useState } from 'react';
import PcbMyAddingB from './AllPCBListsB/PcbMyAddingB';
export default function PCBLIstB() {
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
                <Tab eventKey="A" title=" کلیه سفارشات PCB " style={{ background: 'inherit' }}>
                    {flagResetInput == "A" && <PcbMyAddingB status="allPcb" />}
                </Tab>
                <Tab eventKey="B" title=" سفارشات در حال استعلام گیری " style={{ background: 'inherit' }}>
                    {flagResetInput == "B" && <PcbMyAddingB status="inQuring" />}
                </Tab>

                <Tab eventKey="C" title=" سفارشات در صف خرید " style={{ background: 'inherit' }}>
                    {flagResetInput == "C" && <PcbMyAddingB status="inOrderToSupply" />}
                </Tab>

                <Tab eventKey="D" title=" سفارشات در حال تامین " style={{ background: 'inherit' }}>
                    {flagResetInput == "D" && <PcbMyAddingB status="inSupply" />}
                </Tab>







            </Tabs>
        </div>
    )
}
