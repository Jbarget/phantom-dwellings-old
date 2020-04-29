//map frame dimensions
var width = 960;
var height = 640;
const jungleGreen = "rgb(41, 168, 165)";
const grey = "ccc";

const toggleHighlight = (context) => {
  var nextColor = context.style.fill === jungleGreen ? grey : jungleGreen;
  d3.select(context).style("fill", nextColor);
};

function onAusClick() {
  toggleHighlight(this);
  setTimeout(() => {
    d3.json("./detailed.json", renderMap("queensland"));
    toggleHighlight(this);
  }, 1000);

  setTimeout(() => {
    d3.selectAll(".queensland-line").style("opacity", 1);
  }, 1200);
}

function onQueenslandClick() {
  toggleHighlight(this);
}

const renderMap = (key) => (error, geoData) => {
  if (error) console.error("ahhhh");

  //add geometry to map
  const geoJson = topojson.feature(geoData, geoData.objects[key]);

  //create projection
  var projection = d3
    .geoMercator()
    .center([0, -27])
    .rotate([-130, 0])
    .scale(Math.min(height * 1.2, width * 0.8))
    .translate([width / 2, height / 2])
    .precision(0.1);

  //create svg path generator using the projection
  var path = d3.geoPath().projection(projection);
  const opacity = key === "states" ? 1 : 0;
  const onClick = key === "states" ? onAusClick : onQueenslandClick;

  svg
    .selectAll("path")
    .data(geoJson.features)
    .enter() //create elements
    .append("path") //append elements to svg
    .attr("d", path) //project data as geometry in svg
    .attr("class", `${key}-line`) //project data as geometry in svg
    .style("fill", "ccc")
    .style("opacity", opacity)
    .on("click", onClick);

  // add locations to map
  svg
    .selectAll(".label")
    .data(places)
    .enter()
    .append("circle")
    .attr("r", 4)
    .style("fill", "#68b2a1")
    .attr("transform", function (d) {
      return (
        "translate(" +
        projection([d.location.longitude, d.location.latitude]) +
        ")"
      );
    })
    .attr("dy", function (d) {
      return d.position.dy;
    })
    .attr("dx", function (d) {
      return d.position.dx;
    })
    .text(function (d) {
      return d.name;
    });
};
// render map
d3.json("./aus.json", renderMap("states"));

//create a new svg element with the above dimensions
var svg = d3
  .select("body")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .call(
    d3.zoom().on("zoom", function () {
      svg.attr("transform", d3.event.transform);
    })
  )
  .append("g");

// locations to render
var places = [
  {
    name: "Dunk Island",
    location: { latitude: -17.9477107, longitude: 146.1399148 },
    position: { dy: ".35em", dx: "-4.75em" },
  },
  {
    name: "Mission Beach",
    location: { latitude: -17.8632551, longitude: 146.0888141 },
    position: { dy: ".35em", dx: "-4.75em" },
  },
];
//   {
//     name: "Brisbane",
//     location: { latitude: -34.47, longitude: 153.02 },
//     position: { dy: ".35em", dx: ".75em" },
//   },
//   {
//     name: "Canberra",
//     location: { latitude: -35.3, longitude: 149.13 },
//     position: { dy: ".35em", dx: ".75em" },
//   },
//   {
//     name: "Darwin",
//     location: { latitude: -12.45, longitude: 130.83 },
//     position: { dy: ".35em", dx: "-4em" },
//   },
//   {
//     name: "Hobart",
//     location: { latitude: -42.88, longitude: 147.32 },
//     position: { dy: ".35em", dx: ".75em" },
//   },
//   {
//     name: "Melbourne",
//     location: { latitude: -37.82, longitude: 144.97 },
//     position: { dy: ".35em", dx: ".75em" },
//   },
//   {
//     name: "Perth",
//     location: { latitude: -31.95, longitude: 115.85 },
//     position: { dy: ".35em", dx: "-3.25em" },
//   },
//   {
//     name: "Sydney",
//     location: { latitude: -33.87, longitude: 151.2 },
//     position: { dy: ".35em", dx: ".75em" },
//   },
// ];
