// Définition des paramètres du graphique
var largeur = 600,
  hauteur = 200,
  marge_gauche = 200;

// Définition des données
var donnees = [
  { type: "Entire home/apt", count: 3000 },
  { type: "Private room", count: 1000 },
  { type: "Shared room", count: 500 },
];

// Définition des 3 échelles
// - X : [0, sum(count)] -> [marge_gauche, largeur]
// - Y : [type] -> [0, largeur]
// - M : [type] -> couleurs choisies
var echelleX = d3
    .scaleLinear()
    .domain([0, d3.sum(donnees, (d) => d.count)])
    .range([0, largeur - marge_gauche]),
  echelleY = d3
    .scaleBand()
    .domain(d3.map(donnees, (d) => d.type))
    .range([0, hauteur]),
  echelleM = d3
    .scaleOrdinal(["slateblue", "indianred", "olive"])
    .domain(echelleY.domain());

// Sélection de la div cible, vidage du contenu (utile si plusieurs exécutions du code et ajout du SVG
var svg = d3
  .select("#exemple3")
  .html("")
  .append("svg")
  .attr("width", largeur)
  .attr("height", hauteur)
  .style("border", "solid 1px black");

// Ajout des barres
svg
  .selectAll("rect")
  .data(donnees)
  .enter()
  .append("rect")
  .attr("x", marge_gauche)
  .attr("y", (d) => echelleY(d.type))
  .attr("width", (d) => echelleX(d.count))
  .attr("height", echelleY.bandwidth())
  .style("fill", (d) => echelleM(d.type));

// Ajout des modalités pour la légende
svg
  .selectAll("text")
  .data(donnees)
  .enter()
  .append("text")
  .attr("x", marge_gauche)
  .attr("y", (d) => echelleY(d.type) + echelleY.bandwidth() / 2)
  .style("text-anchor", "end")
  .attr("dx", -10)
  .html((d) => d.type);
