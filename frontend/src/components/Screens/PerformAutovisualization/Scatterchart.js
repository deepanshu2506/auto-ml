import React from 'react';

import CanvasJSReact from "../../../assets/canvasjs.react";

const Scatterchart = (data) => {
    const { graphData } = data;
    //console.log(graphData);

    let datapointsArr = []

    var classify = graphData['classify']
    classify = classify.replace(/'/g, '"');
    classify = JSON.parse(classify);
    var ydata = graphData['y_data']
    ydata = ydata.replace(/'/g, '"');
    ydata = JSON.parse(ydata);
    var xdata = graphData['x_data']
    xdata = xdata.replace(/'/g, '"');
    xdata = JSON.parse(xdata);
    var toolTipShared = false;
    for (var i = 0; i < xdata[0].length; i++) {
        datapointsArr.push({ x: xdata[0][i], y: ydata[0][i] })
    }

    //console.log(datapointsArr);
    var dp;
    dp = [
        {
            type: "scatter",
            toolTipContent: "<b>"+graphData['x_name']+":</b>{x}<br/><b>"+graphData['y_name']+":</b>{y}",
            dataPoints: datapointsArr,
        }
    ]

    //console.log(datapointsArr);
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        title: {
            text: graphData['x_name']+"  vs  "+graphData['y_name']
        },
        animationEnabled: true,
        zoomEnabled: true,
        exportEnabled: true,
        axisX: {
            title: graphData['x_name'],
            //minimum: 790,
            //maximum: 2260
        },
        axisY: {
            title: graphData['y_name'],
            //valueFormatString: "$#,##0k"
        },
        legend: {
            cursor: "pointer",
            //itemclick: toggleDataSeries
        },
        data: dp,
    }
    return (
        <div style={{ width: "100%" }}>
            <CanvasJSChart options={options}
            />
        </div>
    );
}

export default Scatterchart;
