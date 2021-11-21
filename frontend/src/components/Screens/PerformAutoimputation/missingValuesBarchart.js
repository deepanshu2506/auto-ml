import React from 'react';

import CanvasJSReact from "../../../assets/canvasjs.react";

const MissingValuesBarchart = (data) => {
    const {result,tuple_count,columns}=data;
    let dp=[]
    let obj={}
    result.data.map((column) => {
        obj[column.col_name]=column.imputed_count
    });
    columns.map((column) => {
        if(column.column_name in obj){
            dp.push({ label: column.column_name,  y: (obj[column.column_name]/tuple_count)*100});
        }
        else{
            dp.push({ label: column.column_name,  y:0});
        }
    });
 
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        title: {
            text: "Imputation count %"
        },
        axisX:{
            interval: 1
         },
        axisY: {
            title: "% of imputed count",
            //minimum: 0,
		    //maximum: 100
        },
        exportEnabled: true,
        animationEnabled: true,
        showInLegend: true, 
		legendMarkerColor: "grey",
		legendText: "Column names",
        data: [
        {
            type: "column",
            dataPoints: dp
        }
        ]
    }
    return (
        <div style={{width:"100%"}}>
            <CanvasJSChart options={options}
            />
        </div>
    );
}

export default MissingValuesBarchart;
