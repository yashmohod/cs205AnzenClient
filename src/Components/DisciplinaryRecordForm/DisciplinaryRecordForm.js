import { useState, React, useEffect } from "react";
import { API_URL, post, get } from "../../Utils/API";
import Modal from 'react-bootstrap/Modal';
import EmployeeList from '../EmployeeList/EmployeeList.js';
import DisciplinaryActionsList from "../DisciplinaryActionsList/DisciplinaryActionsList.js"
import { Button, Col, Form, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

export default function DisciplinaryRecordForm({ org, show, handleClose, editable, prvformData, reSearchReports, viewable, fullVersion, getUserSpecificRecord }) {



    const [formData, setFormData] = useState({
        date: "",
        employeeId: "",
        disciplinaryActionsName: "",
        suspendableDurationDays: "",
        note: "",
        org: org,
    });

    function reportInputChangeHandler(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function reportChangeSubmit() {
        let response = {
            status: 0,
            message: "Unable to connect to server!"
        };
        console.log(formData);
        console.log(viewable || editable)
        if (editable) {
            response = await post(API_URL + "/editDisciplinaryRecord", {
                token: localStorage.getItem("token"), EditedRecord: formData
            })

        } else {
            console.log("here")
            response = await post(API_URL + "/enterDisciplinaryRecord", {
                token: localStorage.getItem("token"), DisciplinaryRecord: formData

            })
        }
        if (response.status == 200) {
            if (fullVersion) {
                reSearchReports();
            } else {
                getUserSpecificRecord();
            }
            toast.success(response.message);
            handleClose();
            setFormData({
                date: "",
                employeeId: "",
                disciplinaryActionsName: "",
                suspendableDurationDays: "",
                org: org,
                note: "",
            });
        } else {
            toast.warning(response.message)
        }

    }


    function handleCloseAndclear() {
        setFormData({
            date: "",
            employeeId: "",
            disciplinaryActionsName: "",
            suspendableDurationDays: "",
            org: org,
            note: "",
        });
        handleClose();
    }


    useEffect(() => {
        if (viewable || editable || !fullVersion) {

            if (editable) {
                let date = prvformData.date
                if (date) {
                    date = date.toString().split("/")
                    prvformData.date = date[2] + "-" + date[0] + "-" + date[1]
                }
            }

            setFormData(prvformData);
        }
    }, [prvformData])

    return (
        <>
            {/* <ToastContainer /> */}
            <Modal
                show={show}
                onHide={handleCloseAndclear}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    {editable ? <Modal.Title>Report Edit</Modal.Title> : null}
                    {viewable ? <Modal.Title>Report View</Modal.Title> : null}
                    {(!viewable && !editable) ? <Modal.Title>Add Report</Modal.Title> : null}

                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="register-form">

                            <Form.Label className=" d-flex justify-content-start">Disciplinary Action</Form.Label>

                            {viewable ?
                                <Form.Control type="input" placeholder="" value={formData.disciplinaryActionsName} readOnly />
                                :
                                <Form.Select aria-label="Default select example" name="disciplinaryActionsName" onChange={(e) => reportInputChangeHandler(e)}>
                                    <DisciplinaryActionsList selected={formData.disciplinaryActionsName} org={org} />
                                </Form.Select>
                            }

                            <Form.Label className=" d-flex justify-content-start">Date </Form.Label>
                            {viewable ?
                                <Form.Control type="input" placeholder="" value={formData.date} readOnly />
                                :
                                <Form.Control type="date" value={formData.date} name="date" onChange={(e) => reportInputChangeHandler(e)} />
                            }
                            {fullVersion ? <>
                                <Form.Label className=" d-flex justify-content-start">Employee</Form.Label>
                                {editable || viewable ?
                                    <Form.Control type="input" placeholder="" value={formData.reportedOfName} readOnly />
                                    :
                                    <Form.Select aria-label="Default select example" name="employeeId" onChange={(e) => reportInputChangeHandler(e)}>
                                        <EmployeeList org={org} selected={formData.reportedOfID} />
                                    </Form.Select>
                                }</>
                                : null}

                            <Form.Label className=" d-flex justify-content-start">Number of days for Suspension</Form.Label>
                            {viewable ?
                                <Form.Control type="input" placeholder="" value={formData.suspendableDurationDays} readOnly />
                                :
                                <Form.Control type="number" placeholder="" value={formData.suspendableDurationDays} name="suspendableDurationDays" onChange={(e) => reportInputChangeHandler(e)} />
                            }


                            <Form.Label className=" d-flex justify-content-start">Summary</Form.Label>
                            {viewable ?
                                <Form.Control as="textarea" placeholder="" value={formData.note} name="note" readOnly />
                                :
                                <Form.Control as="textarea" placeholder="" value={formData.note} name="note" onChange={(e) => reportInputChangeHandler(e)} />
                            }
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {!viewable ?
                        <Button variant="primary" onClick={() => reportChangeSubmit()}>Submit</Button>
                        : null}
                </Modal.Footer>
            </Modal>
        </>
    )
}