import * as L from 'leaflet';
import {Restaurant} from './types/Restaurant';

const setMap = () => {
  const map = L.map('map').setView([60.188222, 24.829696], 12);

  console.log("Map wokrs")
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const markerLayer = L.featureGroup().addTo(map);
  return markerLayer
}

const newMarkers = (restaurants: Restaurant[], markerLayer: L.FeatureGroup<any>) =>{

  if (markerLayer) {
    markerLayer.clearLayers()
  }
  restaurants.forEach((restaurant) => {
    const markLocat = restaurant.location.coordinates.sort((a, b) => b - a) as L.PointTuple
    const marker = L.marker(markLocat);
    markerLayer.addLayer(marker)
    marker.bindPopup(`<h3>${restaurant.name}</h3><p>${restaurant.address}.</p>`)

  })

};

export {newMarkers, setMap}