import React, { useState, useCallback, useRef } from 'react';
import Address from './Address'

import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import Geocode from "react-geocode";

const containerStyle = {
    height: '500px', width: '650px'
};
const libraries = ["places"]
const language = ["en"]
const region = ["vn"]

const center = {
    lat: 10.7760195,
    lng: 106.6674024
};


const directionsService = new window.google.maps.DirectionsService();

function Map(props) {
    const [from, set_from] = useState('155 Sư Vạn Hạnh, Phường 13, District 10, Ho Chi Minh City, Vietnam')
    const [address, setAddress] = useState('')
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null })
    const [open, setOpen] = useState(false)
    const [directions, setDirections] = useState()
    Geocode.setApiKey("AIzaSyA66KwUrjxcFG5u0exynlJ45CrbrNe3hEc");

    // const { isLoaded } = useJsApiLoader({
    //     googleMapsApiKey: "AIzaSyA66KwUrjxcFG5u0exynlJ45CrbrNe3hEc",
    //     libraries,
    //     language,
    //     region,
    // })

    const onMapClick = useCallback((event) => {
        console.log(event.latLng.lat())
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        setCoordinates({ lat, lng })

        Geocode.fromLatLng(lat, lng).then(
            response => {
                setAddress(response.results[0].formatted_address)
            },
            error => {
                console.log(error);
            }
        );
    })

    const mapRef = useRef()

    const onMapLoad = useCallback((map) => {
        mapRef.current = map
    }, [])

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng })
        mapRef.current.setZoom(14);
    }, [])

    const CheckDistance = () => {

        directionsService.route(
            {
                origin: center,
                destination: coordinates,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result)

                } else {
                    setAddress("")
                    alert("Địa chỉ không phù hợp")

                }
            }
        );
    }

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div className="row">
                <div className="col-lg-6 col-12 pb-5">
                    <div className="checkbox-form">
                        <h3>Check Distance</h3>
                        <div className="row">
                            <div className="col-md-12">
                                <Address coordinates={coordinates} setCoordinates={setCoordinates} panTo={panTo} address={address} origin={center} />
                            </div>

                            <div className="col-md-12">
                                <div id="result" className="hide">
                                    <div>
                                        <label htmlFor="Kilometers">Kilometers: </label>&nbsp;
                                    <label id="in_kilo"></label>
                                    </div>
                                    <div>
                                        <label htmlFor="Duration">Duration: </label>&nbsp;
                                    <label id="duration_text"></label>
                                    </div>
                                    <div>
                                        <label htmlFor="Price">Shipping Cost: </label>&nbsp;
                                    <label id="price_shipping"></label>
                                        <label>$</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="order-button-payment">
                                    <input value="CHECKING" type="submit" id="distance_form" onClick={CheckDistance} />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="d-flex justify-content-end">
                                    <div className="order-button-payment">
                                        <input value="Next" id="distance_next" type="submit" style={{ padding: '.4rem 1.6rem' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-12">
                    {

                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={15}
                            onClick={onMapClick}
                            onLoad={onMapLoad}
                        >
                            <Marker position={{ lat: 10.776028658502982, lng: 106.66740206051449 }} onClick={() => setOpen(true)}>
                                {
                                    open &&
                                    <InfoWindow onCloseClick={() => setOpen(false)}>
                                        <span>Something</span>
                                    </InfoWindow>
                                }
                            </Marker>
                            {coordinates.lat !== null && <Marker position={coordinates} />}
                            {directions && <DirectionsRenderer directions={directions} />}
                        </GoogleMap>

                    }

                </div>
            </div>
        </div>
    );
}

export default Map;