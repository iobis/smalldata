import 'leaflet/dist/leaflet.css'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import L from 'leaflet'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import shadowUrlUrl from 'leaflet/dist/images/marker-shadow.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { useDebounce } from '../../../../hooks/hooks'
import { useTranslation } from 'react-i18next'

// This part of code relates to issue with react-leaflet. Please update the code when issues is fixed. Refer
// to https://github.com/PaulLeCam/react-leaflet/issues/453 for more details
const DefaultIcon = L.icon({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl:       iconUrl,
  shadowUrl:     shadowUrlUrl
})

L.Marker.prototype.options.icon = DefaultIcon

export default function LocationPicker({ onChange }) {
  const { t } = useTranslation()
  const mapRef = useRef()
  const [latitude, setLatitude] = useState(51.505)
  const [longitude, setLongitude] = useState(-0.09)
  const coordinates = [latitude, longitude]
  const [zoom, setZoom] = useState(12)
  const [searchString, setSearchString] = useState('')
  const [suggestions, setSuggestions] = useState([])

  function setMarkerCoordinates(latlng) {
    setLatitude(latlng.lat)
    setLongitude(latlng.lng)
    onChange({ latitude: latlng.lat, longitude: latlng.lng })
  }

  const debouncedSearch = useDebounce(searchString, 500)

  useEffect(() => {
    const fetchSuggestions = async() => {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchString}`)
      const suggestions = await response.json()
      setSuggestions(suggestions)
    }

    if (debouncedSearch) fetchSuggestions()
  }, [debouncedSearch])

  useEffect(() => {
    mapRef.current.leafletElement.invalidateSize(true)
  })

  function handleClearClick() {
    setSuggestions([])
    setSearchString('')
  }

  function handleSearchStringChange(newSearchString) {
    setSearchString(newSearchString)
    if (!newSearchString) setSuggestions([])
  }

  return (
    <div className="location-picker section is-fluid">
      <div className="columns">
        <div className="column is-half">
          <div className="location-search field">
            <div className="control has-icons-left has-icons-right">
              <input
                className="input"
                onChange={(e) => handleSearchStringChange(e.target.value)}
                placeholder={t('occurrenceForm.locationData.locationPicker.searchTip')}
                type="text"
                value={searchString}/>
              <span className="icon is-left">
                <FontAwesomeIcon className="search" icon="search"/>
              </span>
              <span className="clear icon is-small is-right">
                <FontAwesomeIcon className="times-circle" icon="times-circle" onClick={handleClearClick}/>
              </span>
            </div>
          </div>
          <h4 className="result title is-4">{t('occurrenceForm.locationData.locationPicker.resultsTitle')}</h4>
          {suggestions.length > 0
            ? <SuggestionsResult onClick={setMarkerCoordinates} suggestions={suggestions}/>
            : <SuggestionsResultEmpty/>}
        </div>
        <div className="column is-half">
          <Map
            center={coordinates}
            onClick={(e) => setMarkerCoordinates(e.latlng)}
            onZoomEnd={(e) => setZoom(e.target.getZoom())}
            ref={mapRef}
            zoom={zoom}>
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker
              draggable={true}
              onDragend={(e) => setMarkerCoordinates(e.target.getLatLng())}
              position={coordinates}>
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

LocationPicker.propTypes = {
  onChange: PropTypes.func.isRequired
}

function SuggestionsResult({ suggestions, onClick }) {
  const { t } = useTranslation()

  return (
    <table className="table is-fullwidth is-striped is-hoverable">
      <thead>
      <tr>
        <th>{t('common.type')}</th>
        <th>{t('common.name')}</th>
        <th>{t('common.longitude')}</th>
        <th>{t('common.latitude')}</th>
      </tr>
      </thead>
      <tbody>
      {suggestions.map(suggestion => (
        <tr
          className="suggestion-row fieldrow"
          key={suggestion.place_id}
          onClick={() => onClick({ lat: suggestion.lat, lng: suggestion.lon })}>
          <td className="type">
            {suggestion.type}
          </td>
          <td className="name">
            {suggestion.display_name}
          </td>
          <td className="longitude">
            {suggestion.lon}
          </td>
          <td className="latitude">
            {suggestion.lat}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

SuggestionsResult.propTypes = {
  onClick:     PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired
}

function SuggestionsResultEmpty() {
  const { t } = useTranslation()

  return (
    <>
      <p>{t('occurrenceForm.locationData.locationPicker.emptyResult')}</p>
      <p>{t('occurrenceForm.locationData.locationPicker.emptyResultTip')}</p>
    </>
  )
}
