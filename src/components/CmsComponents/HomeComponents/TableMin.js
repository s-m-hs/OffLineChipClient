import React from 'react'
import './TableMin.css'
import imgSrc from '../../../utils/ImageUser'
import imgSrcB from '../../../utils/ImageProduct'

export default function TableMin(props) {


  return (


    <div className={`table  ${props.table} table-hover table-striped tablemin-div ` } >

<h4 className='boxSh TableMin-h4'>{props.title}</h4>
        <thead>
            <tr key="">
                <th>{props.th1}</th>
                <th>{props.th2}</th>
                <th>{props.th3}</th>
            </tr>
        </thead>
        
        <tbody>
            {props.users.map(item=>(
                 <tr key={item.id}>
                <td>{item.id}</td>
                <td> {props.th3 !== "مبلغ" ?  <img className='tablemin-div-img' src={(props.th3 == "کاربر" && item.img) ? item.img :
                    (props.th3 == "محصول" && item.smallImage) ? item.smallImage :
                    props.th3 == "کاربر" ? imgSrc : props.th3 == "محصول" ? imgSrcB :''
                    } alt="" /> :
                    
                    item.userName }  </td>

                <td>{props.th3 !== "مبلغ" ?  item.name : item.totalAmount}</td>
            </tr>
            ))}
           
        </tbody>
    </div>
  )
}
