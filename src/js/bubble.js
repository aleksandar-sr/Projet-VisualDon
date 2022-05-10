const d3 = window.d3version4
const d = require('../../data/Video_Games_Sales_as_at_22_Dec_2016.csv')

// Dimension svg
const width = 1100;
const height = 400;

const svgContainer = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


    function draw(h = 1983) {
      let data = [];
      // h = année courante
      let dataX = d.filter((d) => parseInt(d.Year_of_Release) == h);
      // Variables selon genre de jeux
      const Sports = dataX.filter((a) => a.Genre === "Sports");
      const Action = dataX.filter((a) => a.Genre === "Action");
      const Shooter = dataX.filter((a) => a.Genre === "Shooter");
      const Role = dataX.filter((a) => a.Genre === "Role-Playing");
      const Other = dataX.filter(
        (a) =>
          !["Action", "Sports", "Shooter", "Role-Playing"].includes(a.Genre)
      );

      // Affichage des chiffres en %
      const sportPercent = parseFloat(
        (Sports.length * 100) / dataX.length
      ).toFixed(2);
      const ActionPercent = parseFloat(
        (Action.length * 100) / dataX.length
      ).toFixed(2);
      const OtherPercent = parseFloat(
        (Other.length * 100) / dataX.length
      ).toFixed(2);
      const ShooterPercent = parseFloat(
        (Shooter.length * 100) / dataX.length
      ).toFixed(2);
      const RolePercent = parseFloat(
        (Role.length * 100) / dataX.length
      ).toFixed(2);

      // A 
      const addedConst = 100;
      const minR = 65;
      const sportobj = {
        CategoryName: "Sports: " + sportPercent,
        color: "blue",
        r: (addedConst * sportPercent) / 100 + minR,
        SkillProficiencyId: 1,
      };
      data.push(sportobj);
      const actobj = {
        CategoryName: "Action: " + ActionPercent,
        color: "red",
        r: (addedConst * ActionPercent) / 100 + minR,
        SkillProficiencyId: 2,
      };
      data.push(actobj);
      const schhoterObj = {
        CategoryName: "Shooter: " + ShooterPercent,
        color: "green",
        r: (addedConst * ShooterPercent) / 100 + minR,
        SkillProficiencyId: 4,
      };
      data.push(schhoterObj);

      const RoleObj = {
        CategoryName: "Role-Playing: " + RolePercent,
        color: "#97538D",
        r: (addedConst * RolePercent) / 100 + minR,
        SkillProficiencyId: 4,
      };
      data.push(RoleObj);
      const otherOb = {
        CategoryName: "Other: " + OtherPercent,
        color: "#4F4F4F",
        r: (addedConst * OtherPercent) / 100 + minR,
        SkillProficiencyId: 3,
      };
      data.push(otherOb);

      data = data.sort((a, b) => a.r - b.r);
      const cxBase = 205;
      const cxOffset = 100;

      var elem = svgContainer.selectAll("div");
      elem.remove();
      const cercle = d3.selectAll("circle");
      cercle.remove();
      const text = d3.selectAll(".removed");
      text.remove();

      for (let i = 0; i < data.length; i++) {
        const props = data[i];
        if (parseInt(props.r) - minR > 0) {
          var cx = cxBase * i + cxOffset;

          var elem = svgContainer.selectAll("div").data(data);

          // Enlever les cercles du DOM
          var elemEnter = elem.enter();

          // création cercle de base
          let circles = elemEnter
            .append("circle")
            .attr("cx", cx)
            .attr("cy", 200)
            .attr("r", props.r)
            .style("fill", props.color)
            .transition()
            .duration(500);

          elem.remove();

          // Textes dans les cercles
          elemEnter
            .append("text")
            .style("fill", "white")
            .attr('class', "removed")
            .attr("dy", function (d) {
              return 200;
            })
            .attr("dx", function (d) {
              return cx - props.CategoryName.length * 3.5;
            })
            .text(function (d) {
              return props.CategoryName + "%";
            })
        }
      }
    }

    draw();
    
    d3.select("body").append("div").attr("class", "bubl")

    const svg = d3
      .select(".bubl")
      .append("svg")
      .attr("width", '50%')
      .attr("height", 20).attr("class", "test")

   
 

    // Création du slider
    const slider = svg
      .append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + 100 + "," + 10 + ")");

      const sliderScale = d3
      .scaleLinear()
      .domain([1983, 2016])
      .range([0, 200])
      .clamp(true);


    slider
      .append("line")
      .attr("class", "track")
      .attr("x1", sliderScale.range()[0])
      .attr("x2", sliderScale.range()[1])
      .select(function () {
        return this.parentNode;
      })
      .append("line")
      .attr("x1", sliderScale.range()[0])
      .attr("x2", sliderScale.range()[1])
      .attr("class", "track-inset")
      .select(function () {
        return this.parentNode;
      })
      .append("line")
      .attr("x1", sliderScale.range()[0])
      .attr("x2", sliderScale.range()[1])
      .attr("class", "track-overlay")
      .call(
        d3
          .drag()
          .on("start.interrupt", function () {
            slider.interrupt();
          })
          .on("start drag", function () {
            changeYear(sliderScale.invert(d3.event.x));
          })
      );


    let handle = slider
      .insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

    // h = année
    function changeYear(h) {
      d3.select("h1").text(parseInt(h));
      draw(parseInt(h));
      handle = slider
        .insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);
      handle.attr("cx", sliderScale(h));
    }
