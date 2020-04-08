md`# Earthquakes!`

topojson = require("topojson")
d3 = require("d3")

size = 500
radius = size/2

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
atlas = "https://unpkg.com/world-atlas@1/world/110m.json"

quakes = (await fetch(url)).json()

world = {
  var w = await (await fetch("https://unpkg.com/world-atlas@1/world/110m.json")).json()
  return topojson.feature(w, w.objects.countries)
}

quakeRadius = {
  const scale = d3.scaleSqrt().domain([0,100]).range([0,quakeSize])
  
  return quake => scale(Math.exp(quake.properties.mag))
}

globe = {
  var c = DOM.context2d(size, size)
  var canvas = c.canvas
  
  // Create spherical projection
  var projection = d3.geoOrthographic().scale(radius).translate([radius, radius])
  projection.rotate([hRotation, vRotation])
  var path = d3.geoPath(projection, c)
  
  // Draw the seas
  c.lineWidth = 1.5
  c.fillStyle = "aliceblue"
  
  c.beginPath()
  c.arc(radius, radius, radius, 0, 2 * Math.PI)
  c.fill()
  c.stroke()
  
  // Draw the land
  c.lineWidth = 0.35
  c.fillStyle = "mintcream"
  
  c.beginPath()
  path(world)
  c.fill()
  c.stroke()
  
  // Draw the earthquakes
  let colour = d3.color(quakeColour)
  colour.opacity = 0.25
  
  c.fillStyle = colour
  path.pointRadius(quakeRadius)
  quakes.features.forEach(quake => {
    c.beginPath()
    path(quake)
    c.fill()
  })
  
  return canvas
}

viewof hRotation = DOM.range(0,360,1)
viewof vRotation = DOM.range(-90,90,1)
viewof quakeSize = DOM.range(1,12,1)
viewof quakeColour = DOM.input("color")



