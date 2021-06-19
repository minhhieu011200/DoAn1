import React, { useState, useCallback, useRef } from 'react';


import { GoogleMap,useLoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const libraries = ["places"]

const containerStyle = {
    height: '500px', width: '650px'
};

const center = {
    lat: 10.7760195,
    lng: 106.6674024
};


const directionsService = new window.google.maps.DirectionsService();
const geocoder = new window.google.maps.Geocoder();
const service = new window.google.maps.DistanceMatrixService();

function Map({ handleCheckDistance }) {
    const [address, setAddress] = useState('')
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null })
    const [open, setOpen] = useState(false)
    const [directions, setDirections] = useState()
    const [error, setError] = useState('')
    const [kilo, setKiLo] = useState()
    const [fee, setFee] = useState()
    const [loadCheckout, setLoadCheckOut] = useState(false)
    const delaySearchTextTimeOut = useRef(null)
    
//         const { isLoaded, loadError } = useLoadScript({
//         googleMapsApiKey: "AIzaSyA-68B07fWPLkgCuEge2f8GWu2YFPsQ7BI",
//         libraries
//     })

    const onMapClick = useCallback((event) => {
        setFee()
        setKiLo()
        setLoadCheckOut(false)
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        const latlng = {
            lat: lat,
            lng: lng,
        };
        setCoordinates(latlng)

        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    setAddress(results[0].formatted_address)
                }
            }
        });
        setDirections()

    })


    const mapRef = useRef()

    const onMapLoad = useCallback((map) => {
        mapRef.current = map
    }, [])

    const panTo = useCallback(({ lat, lng }, zoom) => {
        mapRef.current.panTo({ lat, lng })
        mapRef.current.setZoom(zoom);
    }, [])

    const CheckDistance = (coordinates) => {
        if (address === "") {
            setFee()
            setKiLo()
            setDirections()
            panTo({ lat: 10.776028658502982, lng: 106.66740206051449 }, 16)
            return setError("Địa chỉ không được để trống")
        }
        if (!directions) {
            CheckDistanceService(coordinates)
        }

        CheckDistanceMaxtrix(coordinates, address)

        if (loadCheckout && handleCheckDistance) {

            handleCheckDistance(address, fee)
        }
        setLoadCheckOut(true)
    }


    const handleSelect = async (value) => {
        try {
            setAddress(value)
            const result = await geocodeByAddress(value)
            const { lat, lng } = await getLatLng(result[0])
            const destinate = {
                lat: lat,
                lng: lng
            };
            setCoordinates(destinate)
            CheckDistanceService(destinate)


        }
        catch (error) {
            console.log(error)
        }
    };

    const CheckDistanceService = (coordinates) => {
        directionsService.route(
            {
                origin: center,
                destination: coordinates,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result)
                    panTo(coordinates, 14)
                } else {
                    setFee()
                    setKiLo()
                    panTo({ lat: 10.776028658502982, lng: 106.66740206051449 }, 16)
                    setError("Địa chỉ không phù hợp")
                    setDirections()
                    setAddress("")
                    return;
                }
            }
        );

    }

    const CheckDistanceMaxtrix = (destinate, value) => {
        service.getDistanceMatrix(
            {
                origins: [center],
                destinations: [destinate],
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.IMPERIAL, // miles and feet.
                avoidHighways: false,
                avoidTolls: false
            }, (response, status) => {
                if (status !== "OK") {
                    setError("Error was: " + status)
                } else {
                    const origin = response.originAddresses;
                    if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                        panTo({ lat: 10.776028658502982, lng: 106.66740206051449 }, 16)
                        setDirections()
                        setError("Địa chỉ không phù hợp")
                        setAddress("")
                    } else {
                        const distance = response.rows[0].elements[0].distance;
                        let distance_in_kilo = distance.value / 1000;
                        console.log(distance_in_kilo)
                        distance_in_kilo = (Math.round(distance_in_kilo * 10) / 10)
                        if (distance_in_kilo > 1800) {
                            panTo({ lat: 10.776028658502982, lng: 106.66740206051449 }, 16)
                            setDirections()
                            setError("Địa chỉ không phù hợp")
                            setAddress("")
                            return
                        }
                        else {
                            if (distance_in_kilo <= 40) {

                                setKiLo(distance_in_kilo)
                                setFee(20000)
                            } else if (distance_in_kilo > 50) {
                                setKiLo(distance_in_kilo)
                                setFee(30000)
                            }
                        }
                    }

                }
            })
    }

    const onChangeAddress = (value) => {
        setFee()
        setKiLo()
        setLoadCheckOut(false)
        setAddress(value)
        setError("")

        if (delaySearchTextTimeOut.current) {
            clearTimeout(delaySearchTextTimeOut.current)
        }

        delaySearchTextTimeOut.current = setTimeout(async () => {
            const result = await geocodeByAddress(value)
            const { lat, lng } = await getLatLng(result[0])
            const destinate = {
                lat: lat,
                lng: lng
            };
            setCoordinates(destinate)
        }, 300)

    }
    

    return (

        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div className="row">
                <div className="col-lg-6 col-12 pb-5">
                    <div className="checkbox-form">
                        <h3>Check Distance</h3>
                        <div className="row">
                            <div className="col-md-12">
                                <PlacesAutocomplete placeholder="Enter A Location" value={address} onChange={(value) => onChangeAddress(value)} onSelect={handleSelect}>
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
                                    (
                                        <div className="checkout-form-list">
                                            <label htmlFor="address">Address</label>
                                            <input {...getInputProps({ placeholder: "Enter A Location", id: "address", name: "address" })} />

                                            {suggestions.map((suggestion, index) => {
                                                return (
                                                    <div key={index} {...getSuggestionItemProps(suggestion)}>
                                                        <input type="text" name="from"
                                                            id="from_places"
                                                            disabled
                                                            value={suggestion.description} />
                                                    </div>
                                                );
                                            })}
                                            <p className="form-text text-danger">{error}</p>
                                        </div>
                                    )}
                                </PlacesAutocomplete>
                            </div>

                            {
                                kilo && fee &&
                                (

                                    <div className="col-md-12">
                                        <div id="result" className="hide">
                                            <div>
                                                <label htmlFor="Kilometers">Kilometers: </label>&nbsp;
                                                <label id="in_kilo">{kilo}</label>
                                            </div>
                                            <div>
                                                <label htmlFor="Price">Shipping: </label>&nbsp;
                                                <label id="price_shipping">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(fee) + 'VNĐ'}</label>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="col-md-12">
                                <div className="order-button-payment">
                                    <input value="CHECKING" type="submit" id="distance_form" onClick={() => CheckDistance(coordinates)} />
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
                            zoom={16}
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
