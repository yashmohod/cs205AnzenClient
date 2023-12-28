import React, { useCallback, useEffect, useRef, useState } from "react";
import './DisciplinaryActions.css'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import DeleteButton from '../../../Components/Buttons/DeleteButton.js'
import EditButton from '../../../Components/Buttons/EditButton.js'
import { Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import useFetch from "../../../hooks/useFetch.js";
import { AG_THEME_CLASS } from "../../../Utils/AG-Grid.js";
import { useLocation } from 'react-router-dom'

export default function DisciplinaryActions({ autoLogin }) {
    const { REQUEST: fetcher } = useFetch()
    const [disciplinaryAction, setDisciplinaryAction] = useState("")

    async function addDisciplinaryActionHandler(e) {
        console.log(e)
        let response = await fetcher("POST", "/enterDisciplinaryActions", { disciplinaryAction: disciplinaryAction, org: thisFeaturePerms.org, token: localStorage.getItem("token") });
        if (disciplinaryAction !== "") {
            if (response.status == 200) {
                document.getElementById("disciplinaryActionInput").value = "";
                getDisciplinaryActions();
                toast.success(response.message + " : " + disciplinaryAction);
                setDisciplinaryAction("")
            } else {
                toast.warning(response.message);
            }
        } else {
            toast.warning("Empty disciplinary action was entered!")
        }
    }

    async function deleteLocationHandler(disciplinaryActionId) {
        let response = await fetcher("POST", "/deleteDisciplinaryActions", { id: disciplinaryActionId, org: thisFeaturePerms.org, token: localStorage.getItem("token") });
        if (response.status === 200) {
            toast.success(String(response["message"]));

        } else {
            toast.warning(response["message"])
        }
        getDisciplinaryActions();
    }
    async function editDisciplinaryActionHandler(disciplinaryActionId) {
        var tempDisciplinaryActions = await getDisciplinaryActions()
        let disciplinaryActionName = "";
        for (let x = 0; x < tempDisciplinaryActions.length; x++) {
            if (tempDisciplinaryActions[x].id == disciplinaryActionId) {
                disciplinaryActionName = tempDisciplinaryActions[x].disciplinaryActionName;
            }
        }
        var disciplinaryActionname = String(window.prompt("Enter the updated name", disciplinaryActionName));
        if (disciplinaryActionname != "" && disciplinaryActionname != null && disciplinaryActionname != "null") {
            let response = await fetcher("POST", "/editDisciplinaryActions", { id: disciplinaryActionId, org: thisFeaturePerms.org, editedDisciplinaryActionName: disciplinaryActionname, token: localStorage.getItem("token") });
            if (response.status === 200) {
                toast.success(String(response["message"]));

            } else {
                toast.warning(response["message"])
            }
            getDisciplinaryActions();
        }
    }



    const gridRef = useRef(null);
    const [rowData, setRowData] = useState();



    const [columnDefs, setColumnDefs] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };
    const locationPrem = useLocation()
    const { thisFeaturePerms } = locationPrem.state

    const getDisciplinaryActions = useCallback(async () => {
        let response = await fetcher("GET", "/getOrgDisciplinaryActions?token=" + localStorage.getItem("token") + "&org=" + thisFeaturePerms.org);
        console.log(response.disciplinaryActions)
        // const responseJson = JSON.parse(response.shifts)
        var editPerm = {
            field: 'id',
            headerName: '',
            cellRenderer: EditButton,
            cellRendererParams: {
                clicked: function (field) {
                    editDisciplinaryActionHandler(field);
                }
            }
        }

        var deletePerm = {
            field: 'id',
            headerName: '',
            cellRenderer: DeleteButton,
            cellRendererParams: {
                clicked: function (field) {
                    deleteLocationHandler(field)
                }
            }
        }

        var temp = [{
            field: 'disciplinaryActionName',
            headerName: 'Disciplinary Actions'
        }]

        if (thisFeaturePerms.edit) temp.push(editPerm);
        if (thisFeaturePerms.delete) temp.push(deletePerm);
        setColumnDefs(temp);
        setRowData(response.disciplinaryActions);

        return response.disciplinaryActions
    })

    useEffect(() => {
        autoLogin();
        getDisciplinaryActions();

    }, []);


    return (
        <div className="location-page">
            <ToastContainer />
            <h1>{thisFeaturePerms.org} DisciplinaryActions</h1>

            {thisFeaturePerms.create ?
                <div className="container-fluid m-5">
                    <div className="row">
                        <Form className="location-form">
                            <Form.Control type="text" placeholder="Enter new disciplinary action" onChange={(e) => setDisciplinaryAction(e.target.value)} id="disciplinaryActionInput" />
                            <Button onClick={() => addDisciplinaryActionHandler()}>Add</Button>
                        </Form>
                    </div>
                </div> : null}
            <div className="table">
                <div className={AG_THEME_CLASS("location-grid")}>
                    <AgGridReact
                        ref={gridRef}
                        columnDefs={columnDefs}
                        rowData={rowData}
                        onGridReady={onGridReady}>
                    </AgGridReact>
                </div>
            </div>
        </div>
    )
}


