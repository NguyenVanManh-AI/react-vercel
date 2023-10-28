import React, { memo, useCallback, useState } from 'react'
import {
   GoogleMap,
   Marker,
   useJsApiLoader,
   InfoBox,
} from '@react-google-maps/api'

const containerStyle = {
   width: '100%',
   height: '100%',
   borderRadius: '10px',
}

function Map({ latT, lngT, hospital_name }) {
   // eslint-disable-next-line no-unused-vars
   const [map, setMap] = useState(null)

   const center = {
      lat: latT,
      lng: lngT,
   }

   const options_marker = {
      minZoom: 8,
      maxZoom: 18,
   }
   const options_infor = { closeBoxURL: '', enableEventPropagation: true }
   const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: 'AIzaSyB_o0aJQDa945krcRzTGB0sBKGuq15RNBM',
   })
   const onLoad = useCallback(function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center)
      map.fitBounds(bounds)

      setMap(map)
   }, [])
   const onUnmount = useCallback(function callback(map) {
      setMap(null)
   }, [])

   return isLoaded ? (
      <GoogleMap
         mapContainerStyle={containerStyle}
         center={center}
         options={options_marker}
         onLoad={onLoad}
         onUnmount={onUnmount}
      >
         <Marker position={{ lat: latT, lng: lngT }} animation={2}>
            <InfoBox options={options_infor}>
               <>
                  <div
                     style={{
                        backgroundColor: 'green',
                        color: 'white',
                        borderRadius: '1em',
                        padding: '5px',
                     }}
                  >
                     {hospital_name}
                  </div>
               </>
            </InfoBox>
         </Marker>
      </GoogleMap>
   ) : (
      <></>
   )
}

export default memo(Map)
