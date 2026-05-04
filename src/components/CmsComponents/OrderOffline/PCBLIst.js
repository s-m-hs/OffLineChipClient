import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext, FactorContext } from '../../../context/CmsContext';
import { useState } from 'react';
import PcbMyAdding from './AllPCBLists/PcbMyAdding';
export default function PCBLIst() {
  const [flagResetInput, setFlagResetInput] = useState("B")

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
        <Tab eventKey="B" title="سفارشات PCB زیر مجموعه من" style={{ background: 'inherit' }}>
          {flagResetInput == "B" && <PcbMyAdding componentTyp="B" />}
        </Tab>

        <Tab eventKey="A" title="سفارشات PCB ایجاد شده توسط من" style={{ background: 'inherit' }}>
          {flagResetInput == "A" && <PcbMyAdding componentTyp="A" />}
        </Tab>

        <Tab eventKey="C" title="سفارشات PCB ارجاع شده من" style={{ background: 'inherit' }}>
          {flagResetInput == "C" && <PcbMyAdding componentTyp="C" />}
        </Tab>



      </Tabs>
    </div>
  )
}
