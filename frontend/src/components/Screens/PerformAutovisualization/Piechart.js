import React from 'react';

import CanvasJSReact from "../../../assets/canvasjs.react";

const Piechart = (data) => {
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

    for (var i = 0; i < xdata[0].length; i++) {
        datapointsArr.push({ name: xdata[0][i], y: ydata[0][i] })
    }

    //console.log(datapointsArr);
    var dp;
    dp = [
        {
            type: "pie",
            showInLegend: true,
            toolTipContent: "{name}: <strong>{y}</strong>",
            indexLabel: "{name} - {y}",
            dataPoints: datapointsArr,
        }
    ]

    console.log(datapointsArr);
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        title: {
            text: graphData['x_name']+"  vs  "+graphData['y_name']
        },
        animationEnabled: true,
        zoomEnabled: true,
        exportEnabled: true,
        legend: {
            cursor: "pointer",
            itemclick: explodePie
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

function explodePie (e) {
	if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
	} else {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
	}
	e.chart.render();

}

export default Piechart;
