//map frame dimensions
var width = 960;
var height = 640;
const jungleGreen = "rgb(41, 168, 165)";

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
  );

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

// locations to render
var places = [
  {
    name: "Adelaide",
    location: { latitude: -34.93, longitude: 138.6 },
    position: { dy: ".35em", dx: "-4.75em" },
  },
  {
    name: "Brisbane",
    location: { latitude: -34.47, longitude: 153.02 },
    position: { dy: ".35em", dx: ".75em" },
  },
  {
    name: "Canberra",
    location: { latitude: -35.3, longitude: 149.13 },
    position: { dy: ".35em", dx: ".75em" },
  },
  {
    name: "Darwin",
    location: { latitude: -12.45, longitude: 130.83 },
    position: { dy: ".35em", dx: "-4em" },
  },
  {
    name: "Hobart",
    location: { latitude: -42.88, longitude: 147.32 },
    position: { dy: ".35em", dx: ".75em" },
  },
  {
    name: "Melbourne",
    location: { latitude: -37.82, longitude: 144.97 },
    position: { dy: ".35em", dx: ".75em" },
  },
  {
    name: "Perth",
    location: { latitude: -31.95, longitude: 115.85 },
    position: { dy: ".35em", dx: "-3.25em" },
  },
  {
    name: "Sydney",
    location: { latitude: -33.87, longitude: 151.2 },
    position: { dy: ".35em", dx: ".75em" },
  },
];

const toggleHighlight = (context) => {
  var nextColor = context.style.fill == jungleGreen ? "white" : jungleGreen;
  d3.select(context).style("fill", nextColor);
};
function onClick() {
  console.log("cliked", this.style.fill);
  toggleHighlight(this);
}

const renderMap = (key) => (error, geoData) => {
  if (error) console.error("ahhhh");
  //add geometry to map
  console.log(geoData);
  const geoJson = topojson.feature(geoData, geoData.objects[key]);

  svg
    .selectAll("path")
    .data(geoJson.features)
    .enter() //create elements
    .append("path") //append elements to svg
    .attr("d", path) //project data as geometry in svg
    .style("fill", "transparent")
    .on("click", onClick);

  // add locations to map
  var cities = svg
    .selectAll(".label")
    .data(places)
    .enter()
    .append("text", ".label")
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
// d3.json("./aus.json", renderMap("states"));
d3.json("./detailed.json", renderMap("queensland"));
// d3.json("./queensland.json", renderMap("QLD_LOCALITY_POLYGON_shp"));
