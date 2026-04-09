import React, { useContext, useEffect } from 'react'
import './CmsSidebar.css'
import CmsSidebarContent from './CmsSidebarContent';
import { CmsContext } from '../../../context/CmsContext';


export default function CmsSidebar() {
    const cmsContext = useContext(CmsContext)
    return (
        <div className='cmssidebar-container'>
            <div className="cmssidebar-maindiv">
                <CmsSidebarContent />
            </div>

            {/* /////// to control sidemenue on mobileSize */}
            {cmsContext.sideMenueFlag && <div className='sidemenue'>
                <div className="cmssidebar-maindivb">
                    <CmsSidebarContent />
                </div>
            </div>}


        </div>
    )
}
