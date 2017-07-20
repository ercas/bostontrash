var map = L.map("map").setView([42.3235, -71.0865], 12);
var geojson;
var trashdays = {
    "M": {
        "color": "#a56b7a",
        "label": "monday"
    },
    "T": {
        "color": "#a29986",
        "label": "tuesday"
    },
    "W": {
        "color": "#74655e",
        "label": "wednesday"
    },
    "TH": {
        "color": "#cf9766",
        "label": "thursday"
    },
    "F": {
        "color": "#be805b",
        "label": "friday"
    },

    "MF": {
        "color": "#b79da0",
        "label": "monday & friday"
    },
    "TF": {
        "color": "#758f9d",
        "label": "tuesday & friday"
    },
    "MTH": {
        "color": "#383731",
        "label": "monday & thursday"
    },
}

L.tileLayer("http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg", {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.'
}).addTo(map);

geojson = L.geoJSON(geo, {
    style: function(feature) {
        return {
            fillColor: trashdays[feature.properties.TRASHDAY].color,
            weight: 2,
            opacity: 1,
            color: "lightgrey",
            dashArray: "4",
            fillOpacity: 0.7
        };
    },
    onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: function(e) {
                var trashday = e.target.feature.properties.TRASHDAY;

                e.target.setStyle({
                    color: trashdays[trashday].color
                });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }

                document.getElementById(trashday).setAttribute(
                    "class", "legend-item legend-mouseover"
                );
            },
            mouseout: function(e) {
                geojson.resetStyle(e.target);

                document.getElementById(e.target.feature.properties.TRASHDAY)
                        .setAttribute(
                            "class", "legend-item"
                        );
            },
            click: function(e) {
                console.log(e.target);
            }
        })
    }
});
geojson.addTo(map);

for (var key in trashdays) {
    var newDiv = document.createElement("div");
    newDiv.innerHTML = "█▎ " + trashdays[key].label;
    newDiv.setAttribute("style", "color: " + trashdays[key].color);
    newDiv.setAttribute("class", "legend-item");
    newDiv.setAttribute("id", key);
    document.getElementById("key").appendChild(newDiv);
}
