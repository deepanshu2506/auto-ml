import React from 'react';

import CanvasJSReact from "../../../assets/canvasjs.react";

const Barchart = (data) => {
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
    var toolTipShared=false;
    if (classify.length > 0) {
        toolTipShared=true
        for (var i = 0; i < classify.length; i++) {
            let dataPoints = []
            for (var j = 0; j < ydata.length; j++) {
                dataPoints.push({ label: classify[i], y: ydata[i][j] })
            }
            datapointsArr.push(dataPoints)
        }
    }
    else {
        for (var i = 0; i < xdata[0].length; i++) {
            datapointsArr.push({ label: xdata[0][i], y: ydata[0][i] })
        }
    }


    //console.log(datapointsArr);
    if (datapointsArr.length > 0 && datapointsArr[0].length > 0) {
        datapointsArr = datapointsArr[0].map((_, colIndex) => datapointsArr.map(row => row[colIndex]));
        var dp = []
        for (var i = 0; i < xdata[0].length; i++) {
            dp.push(
                {
                    type: "column",
                    name: xdata[0][i],
                    legendText: xdata[0][i],
                    showInLegend: true,
                    dataPoints: datapointsArr[i],
                }
            )
        }
    }
    else {
        dp = [
            {
                type: "column",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "No. of units",
                dataPoints: datapointsArr,
            }
        ]
    }
    //console.log(dp)
    var CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const options = {
        title: {
            text: graphData['x_name']+"  vs  "+graphData['y_name']
        },
        animationEnabled: true,
        exportEnabled: true,
        axisY: {
            title: graphData['y_name'],
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },       
        toolTip: {
            shared: toolTipShared
        },
        legend: {
            cursor: "pointer",
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
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	e.chart.render();
}

export default Barchart;
