import React, { useContext, useEffect, useState } from 'react'
import './CmsSystemAsembly.css'
import ExellToArray from './ExellToArray.js'
import { CmsContext, CmsSistemAssembly } from '../../../context/CmsContext.js'
import SearchBox from '../../../components/CmsComponents/SearchBox/SearchBox.js'
import SearchBoxB from './SearchBoxB.js'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import transition from "react-element-popper/animations/transition"
import opacity from "react-element-popper/animations/opacity"
import InputIcon from "react-multi-date-picker/components/input_icon"
import ExcelProcessor from './ExcelProcessor.js'
import ExcelProcessorB from './ExcelProcessorB.js'
import apiUrl from '../../../utils/ApiConfig.js'
import ExcelMerger from './ExcelMerger.js'
export default function CmsSystemAsembly() {
    const [dataProp, setDataProp] = useState([]);
    const [xtSearchB, setXtSearchB] = useState('');
    const [xtSearchPrice, setXtSearchPrice] = useState('');
    const [prices, setPrices] = useState([]);
    const [flagA,setFlagA]=useState(false)
    const [flagB,setFlagB]=useState(false)
    const [flagC,setFlagC]=useState(false)
    const[resetSearchbox,setResetSearchbox]=useState(false)
const [textArea,setTextArea]=useState('توضیحات :')
const [priceArray,setPriceArray]=useState([])
    const cmsContext = useContext(CmsContext);

    const HardWareName = [
        { id: 1, name: 'MAIN' },
        { id: 2, name: 'CPU' },
        { id: 3, name: 'RAM' },
        { id: 4, name: 'GRAFIC' },
        { id: 5, name: 'SSD' },
        { id: 6, name: 'HDD' },
        { id: 7, name: 'POWER' },
        { id: 8, name: 'CASE' },
        { id: 9, name: 'COOLING' },
        { id: 10, name: 'MONITOR' },
        { id: 11, name: 'KEY & MOUSE' },
        { id: 12, name: 'DVD_R' },
        { id: 13, name: 'OTHER' },
    ];

// const getPriceArray=()=>{
//     async function myApp(){
//         const res=await fetch(`${apiUrl}/api/CyGuarantee?phoneNumber=09196025114`,{
//             method:'GET',
//             headers: {
//                 Authorization: `Bearer ${cmsContext.token.token}`,
//                 "Content-Type": "application/json",
//               },
//         }).then(res=>{
//             console.log(res)
//             return res.json().then(result=>{
//                 setPriceArray(JSON.parse(result[0].details))
//             })
//         })
//     }
//     myApp()
// }
const getPriceArray=()=>{
    async function myApp(){
        const res=await fetch(`${apiUrl}/api/CyKeyDatas/9`,{
            method:'GET',
            headers: {
                Authorization: `Bearer ${cmsContext.token.token}`,
                "Content-Type": "application/json",
              },
        }).then(res=>{
            console.log(res)
            return res.json().then(result=>{
                setPriceArray(JSON.parse(result.tag))
            })
        })
    }
    myApp()
}
useEffect(()=>{
    getPriceArray()
},[])

    const changeTerxArea=(e)=>{
        setTextArea(e.target.value)
    }
    useEffect(() => {
        cmsContext.setFlagClass(false);
        cmsContext.setSideMenueFlag(false);
        return () => cmsContext.setFlagClass(true);
    }, []);

    const handlePriceChange = (price, index) => {
        setPrices((prevPrices) => {
            const newPrices = [...prevPrices];
            newPrices[index] = price;
            return newPrices;
        });
    };

    const resetAll = () => {
        setPrices(HardWareName.map(() => 0))
        setPrices([]); // صفر کردن تمام مقادیر قیمت‌ها
    };

    const resetTotal = () => {
        setPrices([]); // صفر کردن مجموع کل
    };

    const total = prices.reduce((acc, curr) => acc + curr, 0); // مجموع کل

    return (
        <CmsSistemAssembly.Provider value={{ dataProp, setDataProp,  resetSearchbox}}>
            <div className="container ">
                <div className="row boxSh CmsSystemAsembly-row">
                    <div className="col text-center CmsSystemAsembly-list">

<div className='centerr CmsSystemAsembly-header-div'  >
  <img src="../../../images/photo_2023-12-28_17-13-57.jpg" alt="" />

{flagA ? 
 <h3>پیش فاکتور</h3>
 : 
 <h3>فاکتور فروش</h3>
}

<DatePicker
      className='custom-input'
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        // value={value4}
        // onChange={handleChange}
        animations={[
          opacity(), 
          transition({ from: 35, duration: 800 })
        ]}     
        render={<InputIcon/>}  />
</div>
<div className='CmsSystemAsembly-user'> 
    <label htmlFor="">نام مشتری:</label>
    <input type="text" 
/></div>

                        <div>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>قطعه</th>
                                        <th>مشخصات</th>
                                        <th>تعداد</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {HardWareName.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td className={!flagB ? '': 'systemAs-searchtd'} >
                                                <SearchBoxB
                                                    // array={dataProp}
                                                    array={priceArray}
                                                    placeholder={' ...'}
                                                    id="manufacturerNameForAdd"
                                                    onPriceChange={(price) => handlePriceChange(price, index)} // دریافت تغییر قیمت
                                                />
                                            </td>
                                            <td>
                                                <input type="number" placeholder="1" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3">
                            <div className='systemAs-detail-div'> 
                                                         {/* <button className='btn btn-secondary systemAs-total-but'>مجموع کل: {total} تومان</button> */}
{/* <textarea type="text" className='systemAs-detail-input'
placeholder='توضیحات'/>  */}
                            </div>
  
<div className='systemAs-bottom-maindiv'> 

<div className=' systemAs-total-but'>
    <h6>مجموع کل :</h6>
{/* <input type="text" placeholder={total ?`${ (total*1000).toLocaleString()}  تومان`:null} /> */}
<input type="text" placeholder={`${ (total).toLocaleString()}  تومان`} />

</div>
  {/* <img src="../../../images/photo_2023-12-28_17-13-57.jpg" alt="" /> */}
  {/* <img src="../../../images/photo_2023-12-28_17-13-57.jpg" alt="" /> */}

</div>

<div className='systemAs-detail-div'> 
                                                
<textarea type="text" className='systemAs-detail-input'
// placeholder='توضیحات'
onChange={(e)=>changeTerxArea(e)}
value={textArea}/> 
                            </div>

<div className='systemAs-bottom-detail-div' >
<ul>
    {!flagC ? <> 
      <li>به قیمتهای مندرج در فاکتور 1.5 تا 2 درصد افزوده میشود.</li>
    <li>هزینه اسمبل قطعات سیستم بین 300 تا 500 هزار تومان میباشد.</li>
    </> :
    null
    
}
 
    <li>کلیه اقلام مندرج در فاکتور به صورت صحیح و سالم  و با شمارش دقیق تحویل خریدار گردید و تا تسویه کامل نزد خریدار امانت میباشد.</li>

    {flagA ? <li>قیمتهای مندرج در فاکتور فقط در همان تاریخ معتبر است.</li>
 : null}
</ul>
<span>آدرس:قم ،ابتدای 55 متری عماریاسر ،سرای چهارسو،پلاک 34و35،کامپیوترصانع**********شماره تلفن:37835456/7-37839322</span>
<div className='centerr'>
    <span>امضای خریدار</span>
<span>امضای فروشنده</span>
</div>
</div>
<div className='centerr systemAs-button-panel'>
<span
style={{backgroundColor:'green',width:'50px',borderRadius:'15px'} } disabled
>  
    <ExellToArray />
</span>

<button type="button" class="btn btn-secondary" onClick={resetAll}></button>

<button type="button" class="btn btn-success"></button>
<button type="button" class="btn btn-danger"
onClick={()=>
    {setResetSearchbox(!resetSearchbox)
        setPrices(HardWareName.map(() => 0))
        setPrices([]); // صفر کردن تمام مقادیر قیمت‌ها
    // console.log(resetSearchbox);
    
    }
    
    }></button>
<button type="button" class="btn btn-warning"
></button>


<button type="button" class="btn btn-info"
onClick={()=>setFlagC(!flagC)}
></button>

<button type="button" class="btn btn-light"
onClick={()=>setFlagA(!flagA)}></button>

<button type="button" class="btn btn-dark" 
onClick={()=>setFlagB(!flagB)}></button>
</div>

  

                            {/* <button className="btn btn-danger mx-2" onClick={resetAll}>
                                پاک کردن تمام فاکتور
                            </button>
                            <button className="btn btn-warning mx-2" onClick={resetTotal}>
                                صفر کردن مجموع کل
                            </button> */}
                        </div>
                    </div>
                </div>

                <div className='row boxSh'>
                    <div className='col-12'>
                        <ExcelProcessor/>
                        <hr />    
    
                    </div>

                    <div className='col-12'>
                    <ExcelProcessorB/>

</div>
<hr/>

<div className='col-12'>
                    <ExcelMerger/>

</div>



                </div>
            </div>
        </CmsSistemAssembly.Provider>
    );
}
