import React, { useEffect, useState } from 'react';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const service = new window.google.maps.DistanceMatrixService();

function Address({ setCoordinates, panTo, address, origin, coordinates, setAddress }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        cache: 24 * 60 * 60,
        requestOptions: {
            location: { lat: () => 10.7760195, lng: () => 106.6652137 },
            radius: 0
        }
    });
    const [show, setShow] = useState(true)
    useEffect(() => {
        if (address) {
            setValue(address)
            CheckDistance(coordinates, address)
            setShow(false)
        }
    }, [address])



    const handleSelect = async (value) => {
        setValue(value)
    };

    const CheckDistance = (destinate, value) => {
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destinate],
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.IMPERIAL, // miles and feet.
                avoidHighways: false,
                avoidTolls: false
            }, (response, status) => {
                if (status !== "OK") {
                    alert("Error was: " + status);
                } else {
                    var origin = response.originAddresses;

                    if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                        alert(`Địa chỉ ${value} quá xa so với shop`);
                    } else {
                        var distance = response.rows[0].elements[0].distance;
                        var duration = response.rows[0].elements[0].duration;
                        var distance_in_kilo = distance.value / 1000; // the kilo meter
                        console.log(distance_in_kilo)

                    }

                }
            })
    }

    const handleChange = e => {
        setValue(e.target.value)
        setShow(true);
    }

    return (
        <div className="checkout-form-list">
            <label htmlFor="address">Address</label>
            <Combobox onSelect={handleSelect} aria-labelledby="demo">
                <ComboboxInput value={value} onChange={(e) => handleChange(e)} disabled={!ready} id="address" placeholder="Enter an address" />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" && show &&
                            data.map(({ place_id, description }) => (
                                <ComboboxOption key={place_id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}

export default Address;