import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import L from 'leaflet'
import React from 'react'
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
  const coordinates = [51.505, -0.09]
  const zoom = 12

  return (
    <div className="location-picker">
      <Map center={coordinates} zoom={zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <Marker position={coordinates}>
          <Popup>
            <span>
              A pretty CSS3 popup. <br/> Easily customizable.
            </span>
          </Popup>
        </Marker>
      </Map>
    </div>
  )
}
