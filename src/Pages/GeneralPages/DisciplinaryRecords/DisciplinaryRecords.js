import React, { useCallback, useEffect, useRef, useState } from "react";
import './DisciplinaryRecords.css'
import { API_URL, post, get } from "../../../Utils/API.js";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import DeleteButton from '../../../Components/Buttons/DeleteButton.js'
import EditButton from '../../../Components/Buttons/EditButton.js'
import { Button, Col, Form, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import useFetch from "../../../hooks/useFetch.js";
import { AG_THEME_CLASS } from "../../../Utils/AG-Grid.js";
import { useLocation } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import EmployeeList from '../../../Components/EmployeeList/EmployeeList.js'
import DisciplinaryActionsList from '../../../Components/DisciplinaryActionsList/DisciplinaryActionsList.js'
import DisciplinaryRecordForm from "../../../Components/DisciplinaryRecordForm/DisciplinaryRecordForm.js"
export default function DisciplinaryRecords({ autoLogin }) {

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
    const [columnDefs, setColumnDefs] = useState([]);

    const [rawData, setRawData] = useState([]);

    const [formData, setFormData] = useState({
        date: "",
        employeeId: "",
        disciplinaryActionsName: "",
        suspendableDurationDays: "0",
        note: "",
    });


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

    function searchInputHandeler(e) {
        setSearchData({ ...searchData, [e.target.name]: e.target.value })

    }

    async function searchReports() {
        let response = await get(API_URL + "/getDisciplinaryRecords?token=" + localStorage.getItem("token") +
            "&org=" + thisFeaturePerms.org +
            "&employeeId=" + searchData.org +
            "&disciplinaryActionName=" + searchData.disciplinaryActionName +
            "&dateFrom=" + searchData.dateFrom +
            "&dateTo=" + searchData.dateTo)

        console.log(response)

    }


    const location = useLocation()
    const { thisFeaturePerms } = location.state

    useEffect(() => {
        autoLogin();
        // getReports();
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
                                <Button id="dr_button" onClick={() => handleShow()}>Add Record</Button>
                            </Row>
                            <Row>
                                <Button id="dr_button" onClick={() => searchReports()}>Search Record</Button>
                            </Row>
                        </div>



                    </div>
                </div>
            </div>
        </div>

        <Row>
            <div>
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


        <DisciplinaryRecordForm org={thisFeaturePerms.org} show={show} handleClose={handleClose} formData={formData} />


    </>)
}
