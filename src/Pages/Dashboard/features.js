import React, { useEffect, useState } from "react";
import { API_URL, post } from "../../Utils/API";
import { Link } from "react-router-dom";
import Card from "../../Components/Card/Card";


export function Features(props) {

    // let accessLevel= null
    let accessLevel= null
    const[sortedFeatures,setSortedFeatures] = useState([])
    const style ={
        "height": "100px",
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        "margin": "5px",
        "background-color": "#8EC5FC",
        "background-image": "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
        "border-radius": "15px",
    }
    

    function setFeatures(){
           /*  
        Sasp access level

        Probationary Member =0
        Junior Member =1
        Senior Member =2
        Executive Board Member =3
        admin = 4

        */
        localStorage.setItem("organization",props.org)
        localStorage.setItem("position",props.pos)

        if(props.org==='SASP'){
            if(props.pos === "Probationary Member"){
                accessLevel=0;
            }
            else if(props.pos === "Junior Member"){
                accessLevel=1;
            }
            else if(props.pos === "Senior Member"){
                accessLevel=2;
            }
            else if(props.pos === "Executive Board Member"){
                accessLevel=3;
            }else if(props.pos === "admin"){
                accessLevel=4;
            }else{
                accessLevel=null;
            }
        }
        // if (props.org==='RESLIFE'){
        //     accessLevel=0;

        // }

        for(const item of props.features){
            if(item.accessLevel <= accessLevel && props.org == item.org){
                setSortedFeatures(arr => [...arr, item])
            }
        }

    }

    useEffect(() => {
        setFeatures()
    }, []);
    
    
    
    return (
        <>
        {sortedFeatures.map((item) => {
                    return (
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <Link to={item.url} className="feature-url" >
                                <Card title={item.title} description={item.description} style={style}/>
                            </Link>
                        </div>
                    )
                    
                })}
        </>
    )}