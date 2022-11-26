var x_data = [1500,1600,1700,1750,1800,1850,1900];
var y_data_1 = [86,114,106,106,107,111,133];

// globals
var activePoint = null;
var canvas = null;

// draw a line chart on the canvas context
window.onload = function () {

    // Draw a line chart with two data sets
    var ctx = document.getElementById("canvas").getContext("2d");
    canvas = document.getElementById("canvas");
    window.myChart = Chart.Line(ctx, {
        data: {
            labels: x_data,
            datasets: [
                {
                    data: y_data_1,
                    label: "Data 1",
                    borderColor: "#3e95cd",
                    fill: false
                },
            ]
        },
        options: {
            animation: {
                duration: 0
            },
            tooltips: {
                mode: 'nearest'
            }
        }
    });

    // set pointer event handlers for canvas element
    canvas.onpointerdown = down_handler;
    canvas.onpointerup = up_handler;
    canvas.onpointermove = null;
};

function down_handler(event) {
    // check for data point near event location
    const points = window.myChart.getElementAtEvent(event, {intersect: false});
    if (points.length > 0) {
        // grab nearest point, start dragging
        activePoint = points[0];
        canvas.onpointermove = move_handler;
    };
};

function up_handler(event) {
    // release grabbed point, stop dragging
    activePoint = null;
    canvas.onpointermove = null;
};

function move_handler(event)
{
    // locate grabbed point in chart data
    if (activePoint != null) {
        var data = activePoint._chart.data;
        var datasetIndex = activePoint._datasetIndex;

        // read mouse position
        const helpers = Chart.helpers;
        var position = helpers.getRelativePosition(event, myChart);

        // convert mouse position to chart y axis value 
        var chartArea = window.myChart.chartArea;
        var yAxis = window.myChart.scales["y-axis-0"];
        var yValue = map(position.y, chartArea.bottom, chartArea.top, yAxis.min, yAxis.max);

        // update y value of active data point
        data.datasets[datasetIndex].data[activePoint._index] = yValue;
        window.myChart.update();
    };
};

// map value to other coordinate system
function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
};