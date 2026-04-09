import React, { useContext, useEffect, useState } from 'react'
import './CmsNUser.css'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { CmsContext } from '../../../context/CmsContext';
import User from '../../../components/CmsComponents/User/User';
import Group from '../../../components/CmsComponents/Gruop/Group';
import Vahed from '../../../components/CmsComponents/Vahed/Vahed';
import AccessLevel from '../../../components/CmsComponents/AccessLevel/AccessLevel';


export default function CmsNUser() {

  const [flagResetInput, setFlagResetInput] = useState("newuser")

  const ffc = (tabName) => {
    setFlagResetInput(tabName)
  }

  return (
    <div className='container'>
      <>
        <Tabs
          defaultActiveKey="newuser"
          id="fill-tab-example"
          className="mb-2"
          // fill
          onSelect={ffc}
        // onClick={()=>ffc(id)}
        >
          <Tab eventKey="newuser" title=" کاربر جدید" style={{ background: 'inherit' }}>
            {flagResetInput == "newuser" && <User />}
          </Tab>

          <Tab eventKey="access" title=" سطح دسترسی" style={{ background: 'inherit' }}>
            {flagResetInput == "access" && <AccessLevel />}

          </Tab>

          <Tab eventKey="vahed" title=" واحد" style={{ background: 'inherit' }}>
            {flagResetInput == "vahed" && <Vahed />}


          </Tab>

          <Tab eventKey="group" title=" گروه " style={{ background: 'inherit' }}>
            {flagResetInput == "group" && <Group />}


          </Tab>

        </Tabs>

      </>


    </div>
  )
}
