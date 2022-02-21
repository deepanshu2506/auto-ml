import React from 'react';

import CanvasJSReact from "../../../assets/canvasjs.react";

const Linechart = (data) => {
    const { graphData } = data;
    console.log(graphData);

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

    console.log(datapointsArr);
    var dp;
    dp = [
        {
            type: "line",
            color: "#F08080",
            //markerType: "square",
            //toolTipContent: "<b>"+graphData['x_name']+":</b>{x}<br/><b>"+graphData['y_name']+":</b>{y}",
            dataPoints: datapointsArr,
        }
    ]

    console.log(datapointsArr);
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        title: {
            text: graphData['describe']
        },
        animationEnabled: true,
        zoomEnabled: true,
        exportEnabled: true,
        axisX: {
            title: graphData['x_name'],
        },
        axisY: {
            title: graphData['y_name'],
        },
        toolTip: {
            shared: toolTipShared
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            itemclick: toggleDataSeries
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

function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}

export default Linechart;
