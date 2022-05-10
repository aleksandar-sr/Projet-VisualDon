const d3 = window.d3version4
const d = require('./Video_Games_Sales_as_at_22_Dec_2016.csv')


const margin = { top: 40, right: 120, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const x = d3.scaleLinear().domain([1983, 2020]).range([0, width]);
const y = d3.scaleLinear().domain([0, 250]).range([height, 0]);
const line = d3
  .line()
  .x((d) => x(d.year))
  .y((d) => y(d.value));

const chart = d3
  .select("svg")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const tooltip = d3.select("#tooltip");
const tooltipLine = chart.append("line");

const xAxis = d3.axisBottom(x).tickFormat(d3.format(".4"));
const yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));
chart.append("g").call(yAxis);
chart
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
chart.append("text").html("Vente par année").attr("x", 200);

let states, tipBox, data;
let dataX = [];

    states = d;
    data = d;
    data = data
      .filter((d) =>
        [
          "Microsoft Game Studios",
          "Sony Computer Entertainment",
          "Nintendo",
        ].includes(d.Publisher)
      )
      .sort(
        (a, b) => parseInt(b.Year_of_Release) > parseInt(a.Year_of_Release)
      );

    let obx = {};
    for (let i = 0; i < data.length; i++) {
      const elt = data[i];
      let sub = obx[elt.Year_of_Release] || [];
      sub.push(elt);
      obx[elt.Year_of_Release] = sub;
    }

    data = [];
    for (const [key, value] of Object.entries(obx)) {
      let subObj = {
        Year_of_Release: key,
        Sony_Computer_Entertainment: 0,
        Nintendo: 0,
        Microsoft_Game_Studios: 0,
      };

      for (let j = 0; j < value.length; j++) {
        const elt = value[j];
        subObj[elt.Publisher.split(" ").join("_")] = parseFloat(
          subObj[elt.Publisher.split(" ").join("_")]
        )
          ? parseFloat(subObj[elt.Publisher.split(" ").join("_")]) +
          parseFloat(elt.Global_Sales)
          : parseFloat(elt.Global_Sales);
        subObj["Name__" + elt.Publisher.split(" ").join("_")] = elt.Name;
      }
      data.push(subObj);
    }

    let company = data;
    const Sony_Computer_Entertainment = {
      color: "red",
      positionTile: 200,
      name: "Sony",
      show: true,
      history: [],
    };
    const Nintendo = {
      color: "green",
      positionTile: 100,
      name: "Nintendo",
      show: true,
      history: [],
    };
    const Microsoft_Game_Studios = {
      color: "#008AD3",
      positionTile: 5,
      name: "Microsoft",
      show: true,
      history: [],
    };

    for (let d = 0; d < company.length; d++) {
      const elt = company[d];
      Microsoft_Game_Studios.history.push({
        value: elt.Microsoft_Game_Studios,
        year: parseInt(elt.Year_of_Release),
        sortie: elt["Name__Microsoft_Game_Studios"],
      });
      Nintendo.history.push({
        value: elt.Nintendo,
        year: parseInt(elt.Year_of_Release),
        sortie: elt["Name__Nintendo"],
      });
      Sony_Computer_Entertainment.history.push({
        value: elt.Sony_Computer_Entertainment,
        year: parseInt(elt.Year_of_Release),
        sortie: elt["Name__Sony_Computer_Entertainment"],
      });
    }

    // Tri des années
    Sony_Computer_Entertainment.history.sort((a, b) => a.year - b.year);
    Nintendo.history.sort((a, b) => a.year - b.year);
    Microsoft_Game_Studios.history.sort((a, b) => a.year - b.year);

    // dataX = les couleurs
    dataX.push(Sony_Computer_Entertainment);
    dataX.push(Nintendo);
    dataX.push(Microsoft_Game_Studios);

    chart
      .selectAll()
      .data(dataX)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .datum((d) => d.history)
      .attr("d", line);

    chart
      .selectAll()
      .data(dataX)
      .enter()
      .append("text")
      .html((d) => d.name)
      .attr("fill", (d) => d.color)
      .attr("alignment-baseline", "middle")
      .attr("x", width)
      .attr("dx", ".5em")
      .attr("y", (d) => y(d.positionTile));

    // Création du petit rectangle pour les données
    tipBox = chart
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("opacity", 0)
      .on("mousemove", drawTooltip)
      .on("mouseout", removeTooltip);


function removeTooltip() {
  if (tooltip) tooltip.style("display", "none");
  if (tooltipLine) tooltipLine.attr("stroke", "none");
}

// On affiche les données dans un petit rectangle
function drawTooltip() {
  const year = Math.floor(x.invert(d3.mouse(tipBox.node())[0]));
  dataX.sort((a, b) => {
    return (
      b.history.find((h) => h.year == year).value -
      a.history.find((h) => h.year == year).value
    );
  });

  tooltipLine
    .attr("stroke", "black")
    .attr("x1", x(year))
    .attr("x2", x(year))
    .attr("y1", 0)
    .attr("y2", height);

    console.log(d3.event.pageX, d3.event.pageY)
  tooltip
    .html(year)
    .style("display", "block")
    .style("left", d3.event.pageX + 20+"px")
    .style("top", d3.event.pageY - 20 +"px")
    .selectAll()
    .data(dataX)
    .enter()
    .append("div")
    .style("color", (d) => d.color)
    .html(
      (d) =>
        d.name +
        ": " +
        parseFloat(d.history.find((h) => h.year == year).value).toFixed(2) +
        (parseInt(d.history.find((h) => h.year == year).value) != 0
          ? ", Sortie jeu: " + d.history.find((h) => h.year == year).sortie
          : "")
    );
}
