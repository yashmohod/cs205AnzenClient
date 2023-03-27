import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { Dropdown } from 'rsuite';

export default function Exporter({gridRef, rowData, columnHeaders, keys}) {

    function SaveAsCSV() {
        gridRef.current.api.exportDataAsCsv()
    }

    function SaveAsPDF() {
        const doc = new jsPDF({orientation: "landscape",});
        let bodyData = []
        rowData.forEach((row) => {
            let line = []
            keys.map((key) => {
                line.push(row[key])
            })
            bodyData.push(line)
        })

        autoTable(doc, {
           head: [columnHeaders],
           body: bodyData,
        })
        doc.save("export.pdf");
    }

    return (
    <div>
            <Dropdown title="Export" className="m-2">
                <Dropdown.Item onClick={()=>SaveAsCSV()} style={{display: "flex"}} className="ps-3 pe-5">
                    <img src="https://cdn-icons-png.flaticon.com/512/6133/6133884.png" alt="" width={20} height={20}/>
                    <p>&nbsp;Export as CSV</p>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => SaveAsPDF()} style={{display: "flex"}} className="ps-3 pe-5">
                    <img src="https://cdn-icons-png.flaticon.com/512/3143/3143460.png" alt="" width={20} height={20}/>
                    <p>&nbsp;Export as PDF</p>
                </Dropdown.Item> 
            </Dropdown>
    </div>
    )
}