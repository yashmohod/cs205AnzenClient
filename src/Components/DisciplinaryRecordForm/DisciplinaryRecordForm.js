import { useState, React, useEffect } from "react";
import { API_URL, post, get } from "../../Utils/API";
import Modal from 'react-bootstrap/Modal';
import EmployeeList from '../EmployeeList/EmployeeList.js';
import DisciplinaryActionsList from "../DisciplinaryActionsList/DisciplinaryActionsList.js"
import { Button, Col, Form, Row } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

export default function DisciplinaryRecordForm(props) {



    const [formData, setFormData] = useState({
        date: "",
        employeeId: "",
        disciplinaryActionsName: "",
        suspendableDurationDays: "0",
        note: "",
        org: props.org,
    });

    function reportInputChangeHandler(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function reportChangeSubmit() {
        let response = await post(API_URL + "/enterDisciplinaryRecord", {
            token: localStorage.getItem("token"), DisciplinaryRecord: formData

        })

        if (response.status == 200) {
            toast.success(response.message);
            props.handleClose();
            setFormData({
                date: "",
                employeeId: "",
                disciplinaryActionsName: "",
                suspendableDurationDays: "",
                note: "",
            });
        } else {
            toast.warning(response.message)
        }
    }



    useEffect(() => {
        setFormData(props.formData);

    }, [])

    return (
        <>
            <Modal
                show={props.show}
                onHide={props.handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Report Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="register-form">

                            <Form.Label className=" d-flex justify-content-start">Disciplinary Action</Form.Label>
                            <Form.Select aria-label="Default select example" name="disciplinaryActionsName" onChange={(e) => reportInputChangeHandler(e)}>
                                <DisciplinaryActionsList selected={formData.incident} org={props.org} />
                            </Form.Select>

                            <Form.Label className=" d-flex justify-content-start">Date </Form.Label>
                            <Form.Control type="date" value={formData.date} name="date" onChange={(e) => reportInputChangeHandler(e)} />

                            <Form.Label className=" d-flex justify-content-start">Employee</Form.Label>
                            <Form.Select aria-label="Default select example" name="employeeId" onChange={(e) => reportInputChangeHandler(e)}>
                                <EmployeeList org={props.org} selected={formData.employeeId} />
                            </Form.Select>

                            <Form.Label className=" d-flex justify-content-start">Number of days for Suspension</Form.Label>
                            <Form.Control type="number" placeholder="" value={formData.suspendableDurationDays} name="suspendableDurationDays" onChange={(e) => reportInputChangeHandler(e)} />

                            <Form.Label className=" d-flex justify-content-start">Summary</Form.Label>
                            <Form.Control as="textarea" placeholder="" value={formData.note} name="note" onChange={(e) => reportInputChangeHandler(e)} />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => reportChangeSubmit()}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}