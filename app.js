var map = L.map("map").setView([42.3235, -71.0865], 12);
var geojson;
var trashDays = {
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
        "color": "#be6a5b",
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

// TODO: figure out a way to show the best area in a visually appealing way
var daysOfWeek = [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday",
    "saturday"
];
var today = new Date().getDay();
var bestArea = (today + 1) % 7
var nextBestArea = (today + 2) % 7
for (var trashDay in trashDays) {
    bestAreaLabel = daysOfWeek[bestArea];
    if (trashDays[trashDay].label.includes(bestAreaLabel)) {
        trashDays[trashDay].isBestArea = true;
    }
    nextBestAreaLabel = daysOfWeek[nextBestArea];
    if (trashDays[trashDay].label.includes(nextBestAreaLabel)) {
        trashDays[trashDay].isNextBestArea = true;
    }
}

L.tileLayer("http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg", {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.'
}).addTo(map);

var geojson = L.geoJSON(geo, {
    style: function(feature) {
        var trashDayInfo = trashDays[feature.properties.TRASHDAY];
        //console.log(trashDayInfo.label, trashDayInfo.isBestArea);
        return {
            fillColor: trashDayInfo.color,
            weight: 2,
            opacity: 1,
            color: "#ffffff",
            dashArray: "3",
            fillOpacity: 0.6
        };
    },
    onEachFeature: function(feature, layer) {
        layer.on({
            mouseover: function(e) {
                var trashDay = e.target.feature.properties.TRASHDAY;

                select(trashDay);

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
            },
            mouseout: function(e) {
                var trashDay = e.target.feature.properties.TRASHDAY;

                deselect(trashDay);
            },
            click: function(e) {
                console.log(e.target);
            }
        })
    }
});

function select(trashDay) {
    var layers = geojson.getLayers();
    for (var i = 0; i < layers.length; i++) {
        var poly = layers[i];
        if (poly.feature.properties.TRASHDAY == trashDay) {
            poly.setStyle({
                color: trashDays[trashDay].color,
                fillOpacity: 0.7
            });
        }
    }

    document.getElementById(trashDay).setAttribute(
        "class", "legend-item legend-mouseover"
    );
}

function deselect(trashDay) {
    var layers = geojson.getLayers();
    for (var i = 0; i < layers.length; i++) {
        var poly = layers[i];
        if (poly.feature.properties.TRASHDAY == trashDay) {
            geojson.resetStyle(poly);
        }
    }

    document.getElementById(trashDay).setAttribute(
        "class", "legend-item"
    );
}

for (var trashDay in trashDays) {
    var newDiv = document.createElement("div");

    newDiv.innerHTML = "█▎ " + trashDays[trashDay].label;
    newDiv.setAttribute("style", "color: " + trashDays[trashDay].color);
    newDiv.setAttribute("class", "legend-item");
    newDiv.setAttribute("id", trashDay);

    document.getElementById("key").appendChild(newDiv);

    (function(trashDay) {
        newDiv.addEventListener("mouseover", function(e) {
            select(trashDay);
        });
        newDiv.addEventListener("mouseout", function(e) {
            deselect(trashDay);
        });
    })(trashDay);
}
geojson.addTo(map);
