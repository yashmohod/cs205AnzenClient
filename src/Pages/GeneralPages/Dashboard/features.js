import React, { useEffect, useState } from "react";
import { API_URL, post } from "../../../Utils/API";
import { Link } from "react-router-dom";
import Card from "../../../Components/Card/Card";


export function Features(props) {

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
    
    const getClickableLink = link => {
        return link.startsWith("http://") || link.startsWith("https://") ?
          link
          : `http://${link}`;
      };


    useEffect(() => {
    }, []);
    
    
    
    return (
        <>
        {props.features.map((item) => {
            // console.log(item.title)
            // console.log(item.dashboardFeature)
                    if(item.access && item.dashboardFeature){
                        return (
                            // <>
                            // <div className="col-lg-1 col-md-1 col-sm-12"></div>
                            // <div className="col-lg-4 col-md-4 col-sm-12">
                            //     {!item.internallyManaged ?   
                            //     <a href={getClickableLink(item.external_url)} target="_blank"  rel="noopener noreferrer">
                            //         <Card title={item.title} description={item.description} style={style}/>
                            //     </a>
                            // :    <Link to={item.internal_url} state={{ thisFeaturePerms:item }}className="feature-url">
                            //         <Card title={item.title} description={item.description} style={style}/>
                            //     </Link>
                             
                            //     }
                            // </div>
                            // <div className="col-lg-1 col-md-1 col-sm-12"></div>
                            // </>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                {!item.internallyManaged ?   
                                <a href={getClickableLink(item.external_url)} target="_blank"  rel="noopener noreferrer">
                                    <Card title={item.title} description={item.description} style={style}/>
                                </a>
                            :    <Link to={item.internal_url} state={{ thisFeaturePerms:item }}className="feature-url">
                                    <Card title={item.title} description={item.description} style={style}/>
                                </Link>
                             
                                }
                            </div>
                        )
                    }    
                })}
        </>
    )}