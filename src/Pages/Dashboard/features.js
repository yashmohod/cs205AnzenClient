import React, { useEffect, useState } from "react";
import { API_URL, post } from "../../Utils/API";
import { Link } from "react-router-dom";
import Card from "../../Components/Card/Card";


export function Features(props) {

    // let accessLevel= null
    let accessLevel= null
    const[sortedFeatures,setSortedFeatures] = useState([])
    

    function setFeatures(){
           /*  
        Sasp access level

        Probationary Member =0
        Junior Member =1
        Senior Member =2
        Executive Board Member =3
        admin = 4

        */

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
                        <div className="row w-50">
                            <Link to={item.url} className="feature-url" >
                                <Card title={item.title} description={item.description} />
                            </Link>
                        </div>
                    )
                    
                })}
        </>
    )}