import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import { useState } from 'react';
import PcbMyAdding from './AllPCBLists/PcbMyAdding';
import InquiryList from './InquiryList';
import InquiryB from './InQuiryListB/InquiryB';
export default function InQueryListB() {
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
                <Tab eventKey="A" title="کلیه استعلام ها" style={{ background: 'inherit' }}>
                    {flagResetInput == "A" && <InquiryB componentTyp="A" />}
                </Tab>



                <Tab eventKey="B" title="استعلامهای باز (درحال استعلام گیری )" style={{ background: 'inherit' }}>
                    {flagResetInput == "B" && <InquiryB componentTyp="B" />}

                </Tab>




            </Tabs>
        </div>
    )
}
