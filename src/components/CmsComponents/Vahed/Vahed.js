import React, { useEffect, useState } from 'react'
import "./Vahed.css"
import { useForm } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import BaseGrid from '../../Grid/BaseGrid';
import { AgGridReact } from 'ag-grid-react';
import ApiGetX2 from '../../../utils/ApiServicesX/ApiGetX2';
import ApiPostX from '../../../utils/ApiServicesX/ApiPostX';
import alertA from '../../../utils/AlertFunc/AlertA';
import ApiDeleteX from '../../../utils/ApiServicesX/ApiDeleteX';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
export default function Vahed() {
    const [flagUpdate, setFlagUpdate] = useState(false);
    const [allVahed, setAllVahed] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {},
    });
    const registerOptions = {
        text: { required: "text is required" },
        code: { required: "code is required" },
        userStatus: { required: "password is required" },
        userUserType: { required: "password is required" },
    };
    ///////////////////
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
    });

    // const [rowData] = useState([
    //     { id: 1, name: 'Ali', age: 25 },
    //     { id: 2, name: 'Reza', age: 30 },
    // ]);

    const [colDefs] = useState([
        { field: 'text', headerName: "نام" },
        { field: 'code', headerName: "کد" },
        {
            headerName: 'عملیات', maxWidth: 200,
            cellRenderer: (params) => (
                <>
                    {/* <button className='btn btn-info' style={{ width: "30px", height: "15px", margin: "1px", fontSize: "8px", padding: "1px" }} onClick={() => console.log(params)}>+</button> */}
                    <button className='btn btn-danger' style={{ width: "30px", height: "15px", margin: "1px", fontSize: "8px", padding: "1px" }} onClick={() => deleteHandler(params.data.id)}>×</button>
                </>
            )
        }
    ]);
    function funA() {
        alertA("واحد جدید با موفقیت اضافه شد")
        getVahed()
        reset(setValue(""))

    }
    const handleRegistration = (data) => {
        let obj = {
            id: null,
            text: data.text,
            code: data.code,

        }
        ApiPostX(`/api/CyGroupVahed/addVahed`, obj, funA)
    }

    const getVahed = () => {
        ApiGetX2(`/api/CyGroupVahed/getVahed`, setAllVahed)
    }
    const funcC = () => {
        getVahed()
        reset(setValue(""));
    };
    const deleteHandler = (id) => {
        ApiDeleteX("/api/CyGroupVahed", `deletVahed?id=${id}`, funcC);
    };
    useEffect(() => {
        getVahed()
    }, [])
    return (

        <div className='container'>

            <div className='row'>
                <div className="col-12 col-sm-3 Vahed-col3">
                    <form
                        action=""
                        onSubmit={handleSubmit(handleRegistration)}
                    >
                        <div className="login-label-float">
                            <input
                                name="text"
                                type="text"
                                placeholder=""
                                className={errors.text ? "formerror" : ""}
                                {...register(
                                    !flagUpdate ? "text" : "update.text",
                                    registerOptions.text
                                )}
                            />
                            <label> نام واحد</label>
                        </div>
                        <div className="login-label-float">
                            <input
                                name="code"
                                type="text"
                                placeholder=""
                                className={errors.code ? "formerror" : ""}
                                {...register(
                                    !flagUpdate ? "code" : "update.code",
                                    registerOptions.code
                                )}
                            />
                            <label> کد واحد</label>
                        </div>

                        <div className='group-div-Alert mt-5'><label> ⚠️نام و کد واحد نباید تکراری باشد </label></div>


                        {flagUpdate && (
                            <div className="user-resticon">
                                <i
                                    class="fa-solid fa-rotate-left fa-2xl"
                                    style={{ color: " #74C0FC" }}
                                // onClick={resetUpdatField}
                                ></i>
                            </div>
                        )}

                        <Button
                            className="user-regbutton"
                            type="submit"
                            variant="contained"
                            color="info"
                            endIcon={<SendIcon />}
                        >
                            {!flagUpdate ? <span> افزودن </span> : <span> ویرایش </span>}
                        </Button>
                    </form>

                </div>
                <div className="col-12 col-sm-9 Vahed-col9">
                    {/* <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                        <span>sads</span>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                        />
                    </div> */}

                    <BaseGrid rowData={allVahed} colDefs={colDefs} tableWidth="600px" rtl={true} />

                </div>

            </div>
        </div>
    )
}
