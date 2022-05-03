import * as d3 from "d3";

import file from "../data/vgsales.csv";

import histogram from "./histogram.js";

const data = file;

console.log(data[0]);

const histogames = histogram;
console.log(histogames);

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

/*

/*Interactive line chart 

// List of groups (here I have one group per column)
var allGroup = ["valueA", "valueB", "valueC"]

// add the options to the button
d3.select("#selectButton")
  .selectAll('myOptions')
   .data(allGroup)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

// A color scale: one color for each group
var myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet2);

// Add X axis --> it is a date format
var x = d3.scaleLinear()
  .domain([0,10])
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain( [0,20])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

// Initialize line with group a
var line = svg
  .append('g')
  .append("path")
    .datum(data)
    .attr("d", d3.line()
      .x(function(d) { return x(+d.time) })
      .y(function(d) { return y(+d.valueA) })
    )
    .attr("stroke", function(d){ return myColor("valueA") })
    .style("stroke-width", 4)
    .style("fill", "none")

// A function that update the chart
function update(selectedGroup) {

  // Create new data with the selection?
  var dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })

  // Give these new data to update line
  line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(+d.time) })
        .y(function(d) { return y(+d.value) })
      )
      .attr("stroke", function(d){ return myColor(selectedGroup) })
}

// When the button is changed, run the updateChart function
d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption)
}) */

//Line chart

const sumstat = d3.group(data, (d) => d.name); // nest function allows to group the calculation per level of a factor

// Add X axis
const x = d3
  .scaleLinear()
  .domain(
    d3.extent(data, function (d) {
      return d.Year;
    })
  )
  .range([0, width]);
svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(5));

// Add Y axis
const y = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function (d) {
      return +d.Global_Sales;
    }),
  ])
  .range([height, 0]);
svg.append("g").call(d3.axisLeft(y));

// Draw the line
svg
  .selectAll(".line")
  .data(sumstat)
  .attr("fill", "none")
  .attr("stroke", function (d) {
    return color(d[0]);
  })
  .attr("stroke-width", 1.5)
  .attr("d", function (d) {
    return d3
      .line()
      .x(function (d) {
        return x(d.year);
      })
      .y(function (d) {
        return y(+d.n);
      })(d[1]);
  });

/*
Exemple
const margin = { top: 10, right: 40, bottom: 10, left: 40 },
  width = 450 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  
const svg = d3.select("svg")
svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleLinear().domain([0, 100]).range([0, width]);

svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

svg.append("g").call(d3.axisLeft(y));

svg
  .append("circle")
  .attr("cx", x(10))
  .attr("cy", y(60))
  .attr("r", 40)
  .style("fill", "blue");
svg
  .append("circle")
  .attr("cx", x(50))
  .attr("cy", y(60))
  .attr("r", 40)
  .style("fill", "red");
svg
  .append("circle")
  .attr("cx", x(100))
  .attr("cy", y(60))
  .attr("r", 40)
  .style("fill", "green");

  */

// Bar chart
/*
const svg = d3.select("svg"),
  margin = 200,
  width = svg.attr("width") - margin,
  height = svg.attr("height") - margin;

svg
  .append("text")
  .attr("transform", "translate(100,0)")
  .attr("x", 50)
  .attr("y", 50)
  .attr("font-size", "24px")
  .text("Ventes jeux");

const xScale = d3.scaleBand().range([0, width]).padding(0.4),
  yScale = d3.scaleLinear().range([height, 0]);

const g = svg
  .append("g")
  .attr("transform", "translate(" + 100 + "," + 100 + ")");

xScale.domain(
  data.map(function (d) {
    return d.Year;
  })
);
yScale.domain([
  0,
  d3.max(data, function (d) {
    return d.NA_Sales;
  }),
]);

g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .append("text")
  .attr("y", height - 250)
  .attr("x", width - 100)
  .attr("text-anchor", "end")
  .attr("stroke", "black")
  .text("Année");

g.append("g")
  .call(
    d3
      .axisLeft(yScale)
      .tickFormat(function (d) {
        return d;
      })
      .ticks(10)
  )
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "-5.1em")
  .attr("text-anchor", "end")
  .attr("stroke", "black")
  .text("Plateforme");

g.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function (d) {
    return xScale(d.Year);
  })
  .attr("y", function (d) {
    return yScale(d.NA_Sales);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", function (d) {
    return height;
  });

// Bubble
/*
const svg = d3.select("svg").attr("width", 500).attr("height", 500);

svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return d.x;
  })
  .attr("cy", function (d) {
    return d.y;
  })
  .attr("r", function (d) {
    return Math.sqrt(d.NA_Sales) / Math.PI;
  })
  .attr("fill", function (d) {
    return d.color;
  });

  svg.selectAll("text")
      .data(data).enter()
      .append("text")
      .attr("x", function(d) {return d.x+(Math.sqrt(d.NA_Sales)/Math.PI)})
      .attr("y", function(d) {return d.y+4})
      .text(function(d) {return d.Platform})
      .style("font-family", "arial")
      .style("font-size", "12px")
*/
