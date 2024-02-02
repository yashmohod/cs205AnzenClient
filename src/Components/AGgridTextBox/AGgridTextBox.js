import { useEffect } from "react"
import './AGgridTextBox.css'

export default function AGgridTextBox(props) {



    useEffect(() => {
        console.log(props);
    }, [])

    return (
        //<textarea className="" value={props.data.summary} rows={1} cols={20}/>
        <section>
            <p className="resize">
                {props.data.summary}
            </p>
        </section>


    )
}
