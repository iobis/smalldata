import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import L from 'leaflet'
import React, { useState } from 'react'
import shadowUrlUrl from 'leaflet/dist/images/marker-shadow.png'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

// This part of code relates to issue with react-leaflet. Please update the code when issues is fixed. Refer
// to https://github.com/PaulLeCam/react-leaflet/issues/453 for more details
const DefaultIcon = L.icon({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl:       iconUrl,
  shadowUrl:     shadowUrlUrl
})

L.Marker.prototype.options.icon = DefaultIcon

export default function LocationPicker() {
  const [latitude, setLatitude] = useState(51.505)
  const [longitude, setLongitude] = useState(-0.09)
  const coordinates = [latitude, longitude]
  const [zoom, setZoom] = useState(12)
  const [searchString, setSearchString] = useState('')

  function handleClick({ latlng }) {
    setLatitude(latlng.lat)
    setLongitude(latlng.lng)
  }

  return (
    <div className="location-picker section is-fluid">
      <div className="columns">
        <div className="column is-half">
          <h1 className="title">Don't know the exact coordinates?</h1>
          <p>Find location by name</p>
          <input
            className="input"
            onChange={(e) => setSearchString(e.target.value)}
            type="text"
            value={searchString}/>
          <h1 className="title">Results</h1>
          <p>No search results yet</p>
          <p>Have you tried entering an address in the geocoding box?</p>
        </div>
        <div className="column is-half">
          <Map center={coordinates} onClick={handleClick} onZoomEnd={(e) => setZoom(e.target.getZoom())} zoom={zoom}>
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={coordinates}>
              <Popup>
                <div>latitude: {latitude}</div>
                <div>longitude: {longitude}</div>
              </Popup>
            </Marker>
          </Map>
        </div>
      </div>
    </div>
  )
}
