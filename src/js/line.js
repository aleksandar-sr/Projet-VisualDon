// La version qu'on veut utiliser de d3 (ici la v4)
const d3 = window.d3v4;
// d pour data
import * as d from "../../data/Video_Games_Sales_as_at_22_Dec_2016.csv";


/*----------- Dimension graphe ----------- */
const margin = { top: 40, right: 120, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

/*----------- Echelles des axes x et y -----------*/
const x = d3.scaleLinear().domain([1983, 2018]).range([0, width]);
const y = d3.scaleLinear().domain([0, 250]).range([height, 0]);
const line = d3
  .line()
  .x((d) => x(d.year))
  .y((d) => y(d.value));

const chart = d3
  .select("svg")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xAxis = d3.axisBottom(x).tickFormat(d3.format(".5"));
const yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));
chart.append("g").call(yAxis);
chart
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
  

// On prend uniquement les données qui nous intéresse, 
// filtrées pour prendre en compte que les grands constructeurs
let data = d;
data 
  .filter((d) =>
    [
      "Microsoft Game Studios",
      "Sony Computer Entertainment",
      "Nintendo",
    ].includes(d.Publisher)
  )
  .sort((a, b) => parseInt(b.Year_of_Release) > parseInt(a.Year_of_Release));


// Pour chaque élément, regrouper par année
// sub = sous-objet
let editorObjects = {};
for (let i = 0; i < data.length; i++) {
  const elt = data[i];
  let sub = editorObjects[elt.Year_of_Release] || [];
  sub.push(elt);
  editorObjects[elt.Year_of_Release] = sub;
}


// Paire clé/valeur avec année en clé, tableau d'objets en valeur
data = []
for (const [key, value] of Object.entries(editorObjects)) {
  let yearEditors = {
    Year_of_Release: key,
    Sony_Computer_Entertainment: 0,
    Nintendo: 0,
    Microsoft_Game_Studios: 0,
  };


  // Avec cette boucle, on obtient les ventes des constructeur par année
  for (let j = 0; j < value.length; j++) {
    const elt = value[j];
    yearEditors[elt.Publisher.split(" ").join("_")] = parseFloat(
      yearEditors[elt.Publisher.split(" ").join("_")]
    )
      ? parseFloat(yearEditors[elt.Publisher.split(" ").join("_")]) +
        parseFloat(elt.Global_Sales)
      : parseFloat(elt.Global_Sales);
    yearEditors["Name__" + elt.Publisher.split(" ").join("_")] = elt.Name;
  }
  data.push(yearEditors);
}

// On regroupe pour les 3 grands constructeurs
const company = data
const Sony_Computer_Entertainment = {
  color: "blue",
  positionTile: 175,
  name: "Sony",
  history: [], 
};
const Nintendo = {
  color: "red",
  positionTile: 200,
  name: "Nintendo",
  history: [],
};
const Microsoft_Game_Studios = {
  color: "green",
  positionTile: 150,
  name: "Microsoft",
  history: [],
};


// Cette boucle permet d'insérer les objets contenant la valeur, l'année et le jeu phare pour chaque constructeur
// dans le tableau history
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

// Tri des jeux par année
Sony_Computer_Entertainment.history.sort((a, b) => a.year - b.year);
Nintendo.history.sort((a, b) => a.year - b.year);
Microsoft_Game_Studios.history.sort((a, b) => a.year - b.year);

// DataX est un tableau qui regroupe 3 objets
// Chaque objet contient les champs color, position, name et history
let dataX = [];
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



/*----------- Tooltip -----------*/

const tooltip = d3.select("#tooltip");
const tooltipLine = chart.append("line");

// Création du petit rectangle (tip box) pour les données
let tipBox = chart
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("opacity", 0)
  .on("mousemove", drawTooltip)
  .on("mouseout", removeTooltip);

// On affiche les données dans un petit rectangle
//-----pointer au lieu de mouse
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

  // insérer dynamiquement les contenus dans le tooltip
  tooltip
    .html(year)
    .style("display", "block")
    .style("left", d3.event.pageX + 20 + "px")
    .style("top", d3.event.pageY - 20 + "px")
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

// Tooltip disparait quand on est plus entre les axes
function removeTooltip() {
  if (tooltip) tooltip.style("display", "none");
  if (tooltipLine) tooltipLine.attr("stroke", "none");
}