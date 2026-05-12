import React, { useState, useEffect, useContext } from "react";
import "./ParameterCom.css";
import { CmsContext, HomeContext } from "../../../context/CmsContext";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import DataTable from "../DataTable/DataTable";
import Swal from "sweetalert2";
import DotLoader from "react-spinners/DotLoader";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  EditorState,
  convertToRaw,
  ContentState,
  AtomicBlockUtils,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import TextEditor from "../../Editor/TextEditor";
import Switch from "@mui/material/Switch";
import ApiPostX from "../../../utils/ApiServicesX/ApiPostX";
import ApiPutX from "../../../utils/ApiServicesX/ApiPutX";
import alertC from "../../../utils/AlertFunc/AlertC";
import ApiGetX from "../../../utils/ApiServicesX/ApiGetX";
import ApiDeleteX from "../../../utils/ApiServicesX/ApiDeleteX";
import { Refresh } from "@mui/icons-material";
// import TextEditorDark from "../../Editor/TextEditorDark";
// import DarkEditor from "../DarkEditor/DarkEditor";
// import DarkEditor from '../DarkEditor/DarkEditor'

export default function ParameterCom() {
  const [keyArray, setKeyArray] = useState([]);
  const keyArrayBRevers = keyArray.slice().reverse();
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [putId, setPutId] = useState("");
  const navigate = useNavigate();
  const cmsContext = useContext(CmsContext);
  const [ckValue, setCkValue] = useState("");
  const [radioBox, setRadioBox] = useState("option1");
  // const headerAuth = `Bearer ${cmsContext.token.token}`;
  const [checked, setChecked] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const homeContext = useContext(HomeContext);
  const handleChange = (event) => {
    setCkValue("");
    setChecked(event.target.checked);
  };

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
    key: { required: "key is required" },
    tag: { required: "tag is required" },
    value: { required: "value is required" },
  };
  ///////////////////
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  ////////////////////////////////
  ///////////////////////////////
  const handleEditorChange = (value) => {
    setCkValue(value);
  };

  // const html = "<h4>محتوای خود را وارد کنید...</h4>";
  // const contentBlock = htmlToDraft(html);
  // const contentState = ContentState.createFromBlockArray(
  //   contentBlock.contentBlocks
  // );
  // const [editorState, setEditorState] = useState(
  //   EditorState.createWithContent(contentState)
  // );

  // const onEditorStateChange = (editorState) => {
  //   setEditorState(editorState);
  //   setCkValue(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  // };
  ///////////////////////////////
  const handleError = (errors) => { };

  /////////////////////////////////

  const funcC = () => {
    alertC("ارز با موفقیت ویرایش شد", function funcD() {
      reset(setValue(""));
      setFlagUpdate(false);
      getKeyItem();
    });
  };

  const funcA = () => {
    alertC("متغیر با موفقیت اضافه شد", function funcB() {
      reset(setValue(""));
      setCkValue("");
      getKeyItem();
    });
    reset(setValue(""));
    setCkValue("");
    // setEditorState(EditorState.createWithContent(contentState)),
    getKeyItem();
  };
  const handleRegistration = (data) => {
    if (!flagUpdate) {
      let obj = {
        id: 0,
        key: data.key,
        tag: data.tag,
        value: ckValue,
      };
      ApiPostX("/api/CyKeyDatas", obj, funcA);
    } else if (flagUpdate) {
      let obj = {
        id: putId,
        value: data.update.value,
        doubleValue: Number(data.update.doubleValue),
      };
      ApiPutX("/api/CyKeyDatas", putId, obj, funcC);
    }
  };
  /////////////////////////////////

  const getKeyItem = () => {
    ApiGetX("/api/CyKeyDatas", setKeyArray, navigate);
  };
  //////////////////////
  const funcF = () => {
    alertC("حذف انجام شد!", function () {
      window.scrollTo(0, 0);
      getKeyItem();
      reset(setValue(""));
    });
  };
  const deleteHandler = (id) => {
    ApiDeleteX("/api/CyKeyDatas", id, funcF);
  };
  /////////////////////
  const editHandler = (...data) => {
    setPutId(data[0]);
    setFlagUpdate(true);
    setValue("update", { value: data[1], doubleValue: data[2] });
  };
  /////////////////
  const resetUpdatField = () => {
    const html = "<h4>محتوای خود را وارد کنید...</h4>";
    const contentBlock = htmlToDraft(html);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    setFlagUpdate(false);
    reset(setValue(""));
    setCkValue("");
    // setEditorState(EditorState.createWithContent(contentState));
  };
  //////////////////
  useEffect(() => {
    cmsContext.setFlagClass(false);
    getKeyItem();

    return () => cmsContext.setFlagClass(true);
  }, []);

  const changeSwich = (e) => {
    setCkValue(e.target.value);
  };

  useEffect(() => {
    setIsDarkMode(homeContext.themContext);
  }, [homeContext.themContext]);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-5 parametercom-col3">
            <form
              action=""
              onSubmit={handleSubmit(handleRegistration, handleError)}
            >
              {/* <div className="login-label-float">
                <input
                  name="key"
                  type="text"
                  placeholder=""
                  className={errors.key ? "formerror" : ""}
                  {...register(
                    !flagUpdate ? "key" : "update.key",
                    registerOptions.key
                  )}
                />
                <label> کلیدواژه </label>
              </div>

              <div className="login-label-float">
                <input
                  name="tag"
                  type="text"
                  placeholder=""
                  className={errors.tag ? "formerror" : ""}
                  {...register(
                    !flagUpdate ? "tag" : "update.tag",
                    registerOptions.tag
                  )}
                />
                <label> عنوان</label>
              </div> */}


              <div className="login-label-float ">
                <input
                  type="text"
                  placeholder=""
                  {...register("update.value",)}
                />
                <label> عنوان</label>
              </div>

              <div className="login-label-float ">
                <input
                  type="number"
                  placeholder=""
                  {...register("update.doubleValue")}
                />
                <label> سقف ارز</label>
              </div>




              {flagUpdate && (
                <div className="parametercom-resticon">
                  <span
                    onClick={resetUpdatField}><Refresh style={{ color: " #74C0FC" }} /></span>

                </div>
              )}

              <Button
                className="parametercom-regbutton"
                type="submit"
                variant="contained"
                color="info"
                endIcon={<SendIcon />}
              >
                <span> ویرایش </span>
              </Button>
            </form>
          </div>

          <div className="col-12 col-sm-7 parametercom-col9">
            {keyArray.length == 0 ? (
              <div className="parametercom-colsm9-div">
                <DotLoader
                  color="#0d6efd"
                  loading
                  size={150}
                  speedMultiplier={1}
                />
              </div>
            ) : (
              <DataTable title={"لیست ارزها :"}>
                <table
                  className={
                    !homeContext.themContext
                      ? "table table-striped  parametercom-table"
                      : "table table-striped table-dark parametercom-table"
                  }
                >
                  <thead>
                    <tr>
                      <th>شماره</th>
                      <th>عنوان </th>
                      <th>سقف ارز</th>
                      <th>ویرایش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyArrayBRevers.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.value}</td>
                        <td>{item.doubleValue.toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-info parametercom-editbut"
                            onClick={() => {
                              editHandler(
                                item.id,
                                item.value,
                                item.doubleValue,
                              );
                              window.scrollTo(0, 0);
                            }}
                          >
                            ویرایش
                          </button>
                          {/* <button
                            className="btn btn-danger parametercom-deletbut"
                            onClick={() => {
                              deleteHandler(item.id);
                            }}
                          >
                            حذف
                          </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DataTable>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
