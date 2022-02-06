import React from 'react';

import CanvasJSReact from "../../../assets/canvasjs.react";

const VisualizeChart = (data) => {
    console.log(data.data);
    const {headers,meta,values}=data.data;
    let dp=[]
    values.map((tuple) => {
      return dp.push({ label: tuple[0],  y: tuple[1]});
    });
    const chart=meta.chart_type.charAt(0).toUpperCase() + meta.chart_type.slice(1);
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        title: {
            text: chart +" Chart"
        },
        axisX:{
            title:headers[0],
            interval: 1
         },
        axisY: {
            title: headers[1]
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
            type: meta["chart_type"],
            dataPoints: dp
        }
        ]
    };
    // console.log(options);
    return (
        <div style={{width:"100%"}}>
            <CanvasJSChart options={options}
            />
        </div>
    );
}

export default VisualizeChart;
