import React, { useCallback, useEffect, useRef, useState } from "react";
import './DisciplinaryRecords.css'
import { API_URL, post, get } from "../../../Utils/API.js";
import { AgGridReact } from 'ag-grid-react';
import { AG_THEME_CLASS, defineColumns } from "../../../Utils/AG-Grid";
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import DeleteButton from '../../../Components/Buttons/DeleteButton.js'
import EditButton from '../../../Components/Buttons/EditButton.js'
import { Button, Col, Form, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import useFetch from "../../../hooks/useFetch.js";
import { useLocation } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import EmployeeList from '../../../Components/EmployeeList/EmployeeList.js'
import DisciplinaryActionsList from '../../../Components/DisciplinaryActionsList/DisciplinaryActionsList.js'
import DisciplinaryRecordForm from "../../../Components/DisciplinaryRecordForm/DisciplinaryRecordForm.js"
import CommonButton from '../../../Components/Buttons/CommonButton'
import AGgridTextBox from "../../../Components/AGgridTextBox/AGgridTextBox.js";


export default function DisciplinaryRecords({ autoLogin, fullVersion, userAcc, specificOrg }) {

    // edit records 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const EmployeeDropdown = useRef(null)
    const disciplinaryActionName = useRef(null)
    const dateToChooser = useRef(null)
    const dateFromChooser = useRef(null)

    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([
        { field: 'disciplinaryActionsName', headerName: 'Disciplinary Action', cellStyle: { 'textAlign': 'center' } },
        { field: 'reportedOfName', headerName: 'Report Of', cellStyle: { 'textAlign': 'center' } },
        { field: 'reportedByName', headerName: 'Reported By', cellStyle: { 'textAlign': 'center' } },
        { field: 'date', headerName: 'Date', cellStyle: { 'textAlign': 'center' } },
        {
            field: 'id',
            headerName: '',
            cellRenderer: CommonButton,
            cellStyle: { 'textAlign': 'center' },
            cellRendererParams: {
                clicked: function (field) {
                    handelViewButton(field);
                },
                buttonText: "View details",
                variant: "outline-dark",
            }
        },
    ]);
    const Edit_column = {
        field: 'id',
        headerName: '',
        cellRenderer: EditButton,
        cellRendererParams: {
            clicked: function (field) {
                handelEditButton(field);
            }
        }
    }

    const Delete_column = {
        field: 'id',
        headerName: '',
        cellRenderer: DeleteButton,
        cellRendererParams: {
            clicked: function (field) {
                handelDeleteButton(field);
            }
        }
    }



    const [searchData, setSearchData] = useState({
        "employeeId": "",
        "disciplinaryActionName": "",
        "dateFrom": "",
        "dateTo": "",
    })
    const [previousSearchData, setPreviousSearchData] = useState({
        "employeeId": "",
        "disciplinaryActionName": "",
        "dateFrom": "",
        "dateTo": "",
    })

    const [recordID, setReportEdit] = useState("");
    const [editable, setEditable] = useState(false);
    const [viewable, setViewable] = useState(false);

    function searchInputHandeler(e) {
        setSearchData({ ...searchData, [e.target.name]: e.target.value })

    }

    async function searchReports() {
        let response = await get(API_URL + "/getDisciplinaryRecords?token=" + localStorage.getItem("token") +
            "&org=" + thisFeaturePerms.org +
            "&employeeId=" + searchData.employeeId +
            "&disciplinaryActionName=" + searchData.disciplinaryActionName +
            "&dateFrom=" + searchData.dateFrom +
            "&dateTo=" + searchData.dateTo)


        setRowData(response.DisciplinaryRecords);
        setPreviousSearchData(searchData);
    }
    async function reSearchReports() {
        let response = await get(API_URL + "/getDisciplinaryRecords?token=" + localStorage.getItem("token") +
            "&org=" + thisFeaturePerms.org +
            "&employeeId=" + previousSearchData.employeeId +
            "&disciplinaryActionName=" + previousSearchData.disciplinaryActionName +
            "&dateFrom=" + previousSearchData.dateFrom +
            "&dateTo=" + previousSearchData.dateTo)

        setRowData(response.DisciplinaryRecords);
    }
    const [formData, setFormData] = useState({
        date: "",
        employeeId: "",
        disciplinaryActionsName: "",
        suspendableDurationDays: "",
        note: "",
        org: "",
    });

    function handelEditButton(recordID_) {
        getRecord(recordID_);
        setEditable(true);
        setViewable(false);
        handleShow();
    }
    function handelViewButton(recordID_) {
        getRecord(recordID_);
        setEditable(false);
        setViewable(true);
        handleShow();
    }
    function handelAddRecord() {
        setEditable(false);
        setViewable(false);
        handleShow();
    }

    async function handelDeleteButton(recordID_) {
        let response = await post(API_URL + "/deleteDisciplinaryRecord", {
            token: localStorage.getItem("token"),
            id: recordID_
        })
        if (response.status == 200) {
            toast.success(response.message);
            reSearchReports();
        } else {
            toast.warning(response.message)
        }
    }

    async function getRecord(recordID_) {
        let response = await get(API_URL + "/getDisciplinaryRecord?token=" + localStorage.getItem("token") +
            "&org=" + thisFeaturePerms.org +
            "&reportID=" + recordID_)
        if (response.status == 200) {
            console.log(response.DisciplinaryRecord);
            setFormData({ ...response.DisciplinaryRecord, org: thisFeaturePerms.org });
        } else {
            toast.warn(response.message);
        }

    }

    async function getUserSpecificRecord() {
        let response = await get(API_URL + "/getDisciplinaryRecords?token=" + localStorage.getItem("token") +
            "&org=" + specificOrg +
            "&employeeId=" + userAcc)


        setRowData(response.DisciplinaryRecords);

    }


    const location = useLocation()
    const { thisFeaturePerms } = location.state

    useEffect(() => {
        autoLogin();
        // getReports();
        let curCols = columnDefs;
        if (thisFeaturePerms.edit) {
            curCols.push(Edit_column);
        }
        if (thisFeaturePerms.delete) {
            curCols.push(Delete_column);
        }
        setColumnDefs(curCols);

        if (!fullVersion) {
            getUserSpecificRecord();
            // console.log(specificOrg)
            // let temp = {
            //     date: "",
            //     disciplinaryActionsName: "",
            //     suspendableDurationDays: "",
            //     note: "",

            //     employeeId: userAcc,
            //     org: specificOrg
            // }
            setFormData({ ...formData, employeeId: userAcc, org: specificOrg });
        }


    }, [])

    return (<>
        <ToastContainer />
        <Row>
            <Col>
                <Row>
                    <h3>Disciplinary Records</h3>
                </Row>
            </Col>
        </Row>
        {fullVersion ? <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="row" id="location-form">

                            <div className="col" id="searchFormElement">
                                <Form.Label className=" d-flex justify-content-start">Employee</Form.Label>
                                <Form.Select aria-label="Default select example" ref={EmployeeDropdown} name="employeeId" onChange={(e) => searchInputHandeler(e)}>
                                    <EmployeeList org={thisFeaturePerms.org} />
                                </Form.Select>
                            </div>
                            <div className="col" id="searchFormElement">
                                <Form.Label className=" d-flex justify-content-start">Disciplinary Actions</Form.Label>
                                <Form.Select aria-label="Default select example" ref={disciplinaryActionName} name="disciplinaryActionName" onChange={(e) => searchInputHandeler(e)}>
                                    <DisciplinaryActionsList org={thisFeaturePerms.org} />
                                </Form.Select>
                            </div>


                            <div className="col" id="searchFormElement">
                                <Form.Label className=" d-flex justify-content-start">Date From</Form.Label>
                                <Form.Control type="date" placeholder="" ref={dateFromChooser} name="dateFrom" onChange={(e) => searchInputHandeler(e)} />
                            </div>

                            <div className="col" id="searchFormElement">
                                <Form.Label className=" d-flex justify-content-start">Date To</Form.Label>
                                <Form.Control type="date" placeholder="" name="dateTo" ref={dateToChooser} onChange={(e) => searchInputHandeler(e)} />
                            </div>

                            <div className="col" id="searchFormElement" >
                                <Row>
                                    <Button id="dr_button" onClick={() => handelAddRecord()}>Add Record</Button>
                                </Row>
                                <Row>
                                    <Button id="dr_button" onClick={() => searchReports()}>Search Record</Button>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
            :
            <Row>
                <Button id="dr_button" onClick={() => handelAddRecord()}>Add Record</Button>
            </Row>
        }
        <Row>
            <div className="tableDiv">
                {/* desktop view */}
                <div className="d-none d-xxl-block" >
                    <div className={AG_THEME_CLASS("incident-grid")}>
                        <AgGridReact
                            ref={gridRef}
                            columnDefs={columnDefs}
                            defaultColDef={{ sortable: true }}
                            rowData={rowData}
                        >
                        </AgGridReact>
                    </div>
                </div>
                {/* Mobile View */}
                {/* <div className="d-block d-xxl-none" >
                    <div className="ag-theme-alpine incident-grid">
                        <Accordion defaultActiveKey="0">
                            {showMobileViewRecordsCards()}
                        </Accordion>
                    </div>
                </div> */}
            </div>
        </Row>


        <DisciplinaryRecordForm org={thisFeaturePerms.org} show={show} handleClose={handleClose} editable={editable} prvformData={formData} reSearchReports={reSearchReports} viewable={viewable} fullVersion={fullVersion} getUserSpecificRecord={getUserSpecificRecord} />


    </>)
}
