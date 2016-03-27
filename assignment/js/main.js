// ## Variation One:
// - The user draws a shape on map
// - All points that overlap with the shape should be represented as separate
// elements in the sidebar
// - When the user clicks on an element in the sidebar, the corresponding point on
// the map should become highlighted

var userRectangle;
var userRectangle_GeoJSON;
var markerGroup;
var parsedData;

var drawControl = new L.Control.Draw({
  draw: {
    polyline: false,
    polygon: false,
    circle: false,
    marker: false,
    rectangle: true,
  }
});

map.addControl(drawControl);

var dataset = 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/master/Landmark/Public_Art/LANDMARK_PublicArt.geojson';

// Draw all the points with blue marker by default
$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    parsedData = JSON.parse(data);
    markerGroup = L.geoJson(parsedData, {
        pointToLayer: drawBlueIcon,
    }).addTo(map);
  });
});

var orangeIcon = L.icon({
    iconUrl: 'images/marker-icon-orange.png',
    iconRetinaUrl: 'images/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [-3, -41],
    shadowUrl: 'images/marker-shadow.png',
    shadowRetinaUrl: 'images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
});

var redIcon = L.icon({
    iconUrl: 'images/marker-icon-red.png',
    iconRetinaUrl: 'images/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [-3, -41],
    shadowUrl: 'images/marker-shadow.png',
    shadowRetinaUrl: 'images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
});

var blueIcon = L.icon({
    iconUrl: 'images/marker-icon.png',
    iconRetinaUrl: 'images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [-3, -41],
    shadowUrl: 'images/marker-shadow.png',
    shadowRetinaUrl: 'images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [13, 41]
});

function drawOrangeIcon(feature,latlng){
    return L.marker(latlng, {icon: orangeIcon});
}

function drawRedIcon(feature,latlng){
    return L.marker(latlng, {icon: redIcon});
}

function drawBlueIcon(feature,latlng){
    return L.marker(latlng, {icon: blueIcon});
}

function drawBlueOrRedIcon(feature,latlng){
    if(typeof userRectangle_GeoJSON !=='undefined' && turf.inside(feature, userRectangle_GeoJSON)){
        return drawRedIcon(feature,latlng);
    }
    else {
        return drawBlueIcon(feature,latlng);
    }
}

function showSelectedItemOnSidebar(feature, layer){
    if(typeof userRectangle_GeoJSON !=='undefined' && turf.inside(feature, userRectangle_GeoJSON)){
        console.log(feature);
        var artId = feature.properties.ArtID;
        var artTitle = feature.properties.Title;
        var name = feature.properties.First_Name + feature.properties.Last_Name;
        // add a div to the sidebar
        $('#shapes').append(
            '<div class="datum" id="'+artId+'" onmouseover = "mouseoverHandler(this)">'+
            '<h1>' + name + '</h1>'+
            '<h2>' + artTitle + '</h2>'+
            '</div>');

    }
}

function mouseoverHandler(e){
    console.log('mouseover');
    console.log(e.id);
}

map.on('draw:created', function (e) {
    var layer = e.layer; // The Leaflet layer for the shape
    // var id = L.stamp(layer); // The unique Leaflet ID for the layer
    if(typeof userRectangle !=='undefined')
    {
        map.removeLayer(userRectangle);
    }
    map.addLayer(layer);

    userRectangle = layer;
    // console.log(userRectangle);

    userRectangle_GeoJSON = userRectangle.toGeoJSON();
    // console.log(userRectangle_GeoJSON);

    // clear current markers
    map.removeLayer(markerGroup);
    clearSidebar();

    // Redraw all the markers
    markerGroup = L.geoJson(parsedData, {
        pointToLayer: drawBlueOrRedIcon,
        onEachFeature: showSelectedItemOnSidebar
    });
    markerGroup.addTo(map);
});

function clearSidebar(){
    $('#shapes').empty();
}
