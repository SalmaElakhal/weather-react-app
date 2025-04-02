import { Button, Form } from "react-bootstrap";
import styles from "./SearchBar.module.scss";
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

export const SearchBar = () => {
  const [cities, setCities] = useState([]);
  const [geoLocation, setGeoLocation] = useState(undefined);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);

  const GEO_API_KEY = process.env.REACT_APP_GEO_API_KEY;
  const WEATHER_API_KEY = process.env.RACT_APP_WEATHER_API;

  const handleInputChange = (e) => {
    const { value } = e.currentTarget;
    fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&type=city&format=json&apiKey=${GEO_API_KEY}`
    )
      .then((response) => response.json())
      .then((json) => setCities(json.results));
  };

  const handleAutocompleteSelect = (e, value) => {
    if (value !== null) {
      const { lon, lat } = value;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
      )
        .then((response) => response.json())
        .then((json) =>
          setCities(
            json.results?.map((data) => {
              const { lat, lon, city, country, formatted } = data;
              return { lat, lon, city, country, formatted };
            })
          )
        );

      setIsCurrentLocation(false);
      setGeoLocation({
        lon,
        lat,
      });
    } else {
    }
  };

  return (
    <>
      <Form>
        <Form.Group className={styles.searchContainer}>
          <Autocomplete
            className={styles.searchInput}
            clearOnBlur={false}
            onChange={handleAutocompleteSelect}
            getOptionLabel={(option) => option.formatted}
            renderInput={(params) => (
              <TextField
                onChange={handleInputChange}
                {...params}
                label={"Enter your city ..."}
              />
            )}
            options={cities || []}
          />
          <Button size="sm" variant="primary">
            Search
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};
