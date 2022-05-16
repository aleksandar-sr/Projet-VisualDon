// La version qu'on veut utiliser de d3 (ici la v3)
const d3 = window.d3v3;
// d pour data
import * as d from "../../data/Video_Games_Sales_as_at_22_Dec_2016.csv";


/*----------- Manipulation des données -----------*/

// Recupère uniquement les jeux concernés sous forme de tab
// Ici, nous axons la recherche des jeux uniquement sur les 3 grands constructeurs
let data = d
  .filter((d) =>
    [
      "Microsoft Game Studios",
      "Sony Computer Entertainment",
      "Nintendo",
    ].includes(d.Publisher)
  )
  .sort((a, b) => parseFloat(b.Global_Sales) - parseFloat(a.Global_Sales)); // tri en fonction des ventes

// Nombre de jeux affichés dans l'histogramme
data = data.slice(0, 7);

// Chaque ligne formate la barre pour qu'elle ait un nom et une valeur
data = data.map((d) => {
  return { name: d.Name, value: parseFloat(d.Global_Sales) };
});
data = data.sort((a, b) => a.value - b.value);



/*----------- Dimension du graphe et des axes -----------*/
const margin = {
  top: 15,
  right: 40,
  bottom: 15,
  left: 200,
};

const width = 900 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("#histogram")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("id", "coverH")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scale
  .linear()
  .range([0, width])
  .domain([
    0,
    d3.max(data, function (d) {
      return d.value;
    }),
  ]);

const y = d3.scale
  .ordinal()
  .rangeRoundBands([height, 0], 0.3)
  .domain(
    data.map(function (d) {
      return d.name;
    })
  );

let yAxis = d3.svg.axis().scale(y).tickSize(0).orient("left");
svg.append("g").attr("class", "yAxis").call(yAxis).style("stroke", "white");

/*----------- Création des barres -----------*/
const bars = svg.selectAll(".bar").data(data).enter().append("g");

bars
  .append("rect")
  .attr("class", "bar")
  .attr("y", function (d) {
    return y(d.name);
  })
  .style("stroke", "white")
  .attr("height", y.rangeBand())
  .attr("x", 0)
  .attr("width", function (d) {
    return x(d.value);
  });

// Chiffres de vente sur la droite des barres
bars
  .append("text")
  .attr("class", "label")
  .style("stroke", "white")
  .attr("y", function (d) {
    return y(d.name) + y.rangeBand() / 2 + 4;
  })

  .attr("x", function (d) {
    return x(d.value) + 3;
  })
  .text(function (d) {
    return d.value;
  });

// Animation
svg
  .selectAll("bar")
  .transition()
  .duration(800)
  .attr("y", function (d) {
    return yAxis(d.Value);
  })
  .attr("height", function (d) {
    return height - yAxis(d.Value);
  })
  .delay(function (d, i) {
    console.log(i);
    return i * 100;
  });
