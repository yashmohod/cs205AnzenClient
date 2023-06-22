import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { Dropdown } from 'rsuite';
import CSV from "./csv.png"
import PDF from "./pdf.png"

export default function Exporter({gridRef, rowData, columnHeaders, keys}) {

    function SaveAsCSV() {
        if (gridRef !== null) {
            gridRef.current.api.exportDataAsCsv()
        }
    }

    function SaveAsPDF() {
        const doc = new jsPDF({orientation: "landscape",});
        var bodyData = []
        rowData.forEach((row) => {
            var line = []
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
            <Dropdown title="Export" className="m-2" style={{color: "black"}}>
                <Dropdown.Item onClick={()=> SaveAsCSV()} className="">
                    <p>&nbsp;Export as CSV</p>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => SaveAsPDF()} className="">
                    <p>&nbsp;Export as PDF</p>
                </Dropdown.Item> 
            </Dropdown>
    </div>
    )
}