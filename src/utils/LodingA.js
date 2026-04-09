import React from 'react'
import { Mosaic } from 'react-loading-indicators'

export default function LodingA({ isShow }) {
    return (

        <>
            {isShow &&
                <div className='factor-Loading'>
                    <div>

                        <Mosaic color="#32cd32" size="large" text="درحال ثبت عملیات" textColor="" />
                    </div>
                </div>}
        </>

    )
}
