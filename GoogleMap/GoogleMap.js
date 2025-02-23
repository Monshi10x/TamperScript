var googleMapContainer;
var googleMap;
var googleMapProp;
var googleMapGeocoder;
var GOOGLE_MAP_WORK_ADDRESS;
var GOOGLE_MAP_API_KEY = "AIzaSyBLoog0dEaokzNnjuk-uxDGu25QlOouOZ8";
var googleMapMarkers = [];
var googleDirectionsRenderer;
var googleDirectionsService;
var GOOGLE_MAP_WORK_ADDRESS_STRING = "8 Ferguson St, Underwood, QLD, 4119, Australia";

/**
 * Called by Main.js
 */
window.initMap = function() {
      googleMapContainer = document.getElementById('map');
      googleMapContainer.style = "width:200px;height:200px;display:block;";
      googleMapContainer.setAttribute("visible", false);

      googleMapProp = {
            center: new google.maps.LatLng(-27.6115076, 153.1144851),
            zoom: 20,
            mapId: "DEMO_MAP_ID",
            options: {
                  gestureHandling: 'greedy'
            }
      };
      googleMap = new google.maps.Map(googleMapContainer, googleMapProp);

      googleMapGeocoder = new google.maps.Geocoder();
      googleDirectionsRenderer = new google.maps.DirectionsRenderer();
      googleDirectionsService = new google.maps.DirectionsService();

      GOOGLE_MAP_WORK_ADDRESS = new google.maps.LatLng(-27.6115076, 153.1144851);
      GoogleMap.setHomeMarker();

      document.dispatchEvent(new Event("googleMapLoaded"));

};

/**
 * Singleton
 */
class GoogleMap {

      static borrowGoogleMap(parentToAppendTo) {
            parentToAppendTo.appendChild(googleMapContainer);

            googleMapContainer.setAttribute("visibile", true);
      }

      static async geocode(addressString) {
            let resultArr = null;
            await googleMapGeocoder.geocode({'address': addressString}, async function(results, status) {
                  if(status == 'OK') {
                        resultArr = results;
                  } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                  }
            });
            return resultArr;
      }

      static async findPlaces(name) {
            const {Place} = await google.maps.importLibrary("places");
            const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
            const request = {
                  textQuery: name,
                  fields: ["displayName", "location", "businessStatus"],
                  locationBias: GOOGLE_MAP_WORK_ADDRESS,
                  isOpenNow: false,
                  language: "en-US",
                  maxResultCount: 30,
                  minRating: 3.2,
                  region: "au",
                  useStrictTypeFiltering: false,
            };

            const {places} = await Place.searchByText(request);

            if(places.length) {
                  console.log(places);

                  const {LatLngBounds} = await google.maps.importLibrary("core");
                  const bounds = new LatLngBounds();

                  places.forEach((place) => {
                        const markerView = new AdvancedMarkerElement({
                              map: googleMap,
                              position: place.location,
                              title: place.displayName,
                        });

                        bounds.extend(place.location);
                  });
                  googleMap.fitBounds(bounds);
            } else {
                  console.log("No results");
            }
      }

      static createInfoWindow(marker, contentString) {
            const infoWindow = new google.maps.InfoWindow({
                  content: contentString
            });

            google.maps.event.addListener(marker, "click", () => {
                  infoWindow.open({
                        anchor: marker,
                        googleMap,
                  });
            });
      }

      static setHomeMarker() {
            const svgMarker = {
                  path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                  fillColor: "blue",
                  fillOpacity: 1,
                  strokeWeight: 0,
                  rotation: 0,
                  scale: 2,
                  anchor: new google.maps.Point(0, 20),
            };

            var marker = new google.maps.Marker({
                  position: GOOGLE_MAP_WORK_ADDRESS,
                  title: "Signarama Springwood",
                  icon: svgMarker
            });

            marker.setMap(googleMap);
      }

      static deleteAllMapMarkers() {
            googleMapMarkers.forEach((marker) => {
                  marker.setMap(null);
            });
      }

      static createMarker(position, optionalText) {
            const marker = new google.maps.Marker({
                  googleMap,
                  position: position,
            });

            GoogleMap.createInfoWindow(marker, optionalText);

            marker.setMap(googleMap);
            googleMapMarkers.push(marker);
      }

      static async getTravelStats(destinationAddress) {
            const service = new google.maps.DistanceMatrixService();

            const request = {
                  origins: [GOOGLE_MAP_WORK_ADDRESS],
                  destinations: [destinationAddress],
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC,
                  avoidHighways: false,
                  avoidTolls: false,
            };

            let returnObject = {
                  distance: 0,
                  duration: 0
            };

            await service.getDistanceMatrix(request).then((response) => {
                  returnObject.distance = response.rows[0].elements[0].distance.value;
                  returnObject.duration = response.rows[0].elements[0].duration.value;
            });

            return returnObject;
      }

      static async showDirections(destinationAddress) {
            if(!destinationAddress) return;
            googleDirectionsRenderer.setMap(googleMap);

            const selectedMode = "DRIVING";

            googleDirectionsService
                  .route({
                        origin: GOOGLE_MAP_WORK_ADDRESS,
                        destination: destinationAddress,
                        travelMode: google.maps.TravelMode[selectedMode],
                  })
                  .then((response) => {
                        googleDirectionsRenderer.setDirections(response);
                  })
                  .catch((e) => console.log("Directions request failed due to ", e));
      }

      static deleteAllDirections() {
            googleDirectionsRenderer.setMap(null);
      }

      static createURLString_Directions(originAddress, destinationAddress) {
            let _originAddress = originAddress.replaceAll(" ", "+");
            let _destinationAddress = destinationAddress.replaceAll(" ", "+");
            return "https://www.google.com/maps/dir/?api=1&origin=" + _originAddress + "&destination=" + _destinationAddress + "&travelmode=driving";
      }
}
