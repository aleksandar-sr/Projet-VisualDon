var data = []


let states, tipBox
let dataX = []
d3.csv("./Video_Games_Sales_as_at_22_Dec_2016.csv", d => {
    data = d.filter(d => ['Microsoft Game Studios', "Sony Computer Entertainment", "Nintendo"].includes(d.Publisher)).sort((a, b) => parseFloat(b.Global_Sales) - parseFloat(a.Global_Sales))

    console.log("data data data", data)
    data = data.slice(0, 5)
    data = data.map(d =>{
        return {name: d.Name, value: parseFloat(d.Global_Sales)}
    })
    data = data.sort((a, b) => a.value - b.value)
    console.log("data data data", data)
    var margin = {
    top: 15,
    right: 40,
    bottom: 15,
    left: 200
    };

    var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#graphic").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(data, function (d) {
        return d.value;
    })]);

    var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1)
    .domain(data.map(function (d) {
        return d.name;
    }));

    var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(0)
    .orient("left");

    var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

    var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

    bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
        return y(d.name);
    })
    .attr("height", y.rangeBand())
    .attr("x", 0)
    .attr("width", function (d) {
        return x(d.value);
    });

    bars.append("text")
    .attr("class", "label")
    .attr("y", function (d) {
        return y(d.name) + y.rangeBand() / 2 + 4;
    })

    .attr("x", function (d) {
        return x(d.value) + 3;
    })
    .text(function (d) {
        return d.value;
    });
});