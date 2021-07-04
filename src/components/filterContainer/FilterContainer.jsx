import React, { useState, useEffect } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import fetchBankData from "../../utils/fetchBankData";
import searchIcon from "../../assets/images/searchIcon.png";
import whiteArrowIcon from "../../assets/images/whiteArrowIcon.png"
import "./FilterContainer.scss";

const cities = [
  "MUMBAI",
  "DELHI",
  "LUCKNOW",
  "BANGALORE",
  "HYDERABAD",
];

const categories = [
  "ifsc",
  "branch",
  "bank_name",
];

const FilterContainer = ({ 
  apiFetchStatus, 
  locationData, 
  updateApiStatus, 
}) => {
  const [selectedCity, setSelectedCity] = useState("MUMBAI");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentApiData, setCurrentApiData] = useState([]);

  const handleCityDropdownSelect = async (eventKey) => {
    updateApiStatus("loading");
    const fetchResponse = await fetchBankData(
      locationData,
      eventKey
    );
    setSelectedCity(eventKey);
    setSearchQuery("");
    setCurrentApiData(fetchResponse.data);
    updateApiStatus(fetchResponse.status, fetchResponse.data);
  }

  const handleCategoryDropdownSelect = (eventKey) => {
    setSelectedCategory(eventKey);
    setSearchQuery("");
  }

  const handleSearch = (e) => {
    const { value } = e.target;
    const searchBanksList = [];

    setSearchQuery(value);
    for (let bankDetails of currentApiData) {
      if (bankDetails[selectedCategory]
        .toLowerCase().includes(value.toLowerCase())
      ) {
        searchBanksList.push(bankDetails);
      }
    }
    updateApiStatus("success", searchBanksList);
  }

  useEffect(() => {
    const fetchInitialBankData = async () => {
      updateApiStatus("loading");
      const fetchResponse = await fetchBankData(
        locationData,
      );
      setCurrentApiData(fetchResponse.data);
      updateApiStatus(fetchResponse.status, fetchResponse.data);
    }
    fetchInitialBankData();
  }, [locationData.pathname]);

  return (
    <div className="filter_outer_container">
      <div className="pagelink_container">
        <Link to={`${locationData.pathname === "/all-banks" ? "/favorites" : "/all-banks"}`}>
          <Button className="button_container" variant="">
            {locationData.pathname === "/all-banks" ? (
              <>
              Favorites
              </>
            ) : (
              <>
              <img src={whiteArrowIcon} alt="" />
              {" "}All Banks
              </>
            )}
          </Button>
        </Link>
      </div>
      <div className="filter_container">
        {locationData.pathname !== "/favorites" && (
          <Dropdown className="dropdown_container">
            <Dropdown.Toggle disabled={apiFetchStatus === "loading"} variant="">
              {selectedCity[0] + selectedCity.substring(1).toLowerCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {cities.map((city, index) => (
                <Dropdown.Item
                  key={index}
                  active={selectedCity === city}
                  eventKey={city}
                  onSelect={handleCityDropdownSelect}
                >
                  {city[0] + city.substring(1).toLowerCase()}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}

        <Dropdown className="dropdown_container">
          <Dropdown.Toggle disabled={apiFetchStatus === "loading"} variant="">
            {selectedCategory === "" ? "Select Category" 
            : selectedCategory[0].toUpperCase() 
            + selectedCategory.split("_").join(" ").substring(1)}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {categories.map((category, index) => (
              <Dropdown.Item
                key={index}
                active={selectedCategory === category}
                eventKey={category}
                onSelect={handleCategoryDropdownSelect}
              >
                {category[0].toUpperCase() 
                + category.split("_").join(" ").substring(1)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <div className="search_outer_container">
          <img src={searchIcon} alt="Search" />
          <input
            className="search_container"
            type="search"
            placeholder={`${selectedCategory === "" 
              ? "(Please select category)" 
              : "Search"}`
            }
            value={searchQuery}
            onChange={handleSearch}
            disabled={selectedCategory === "" || apiFetchStatus === "loading"}
          />
        </div>
      </div>
    </div>
  )
};

export default FilterContainer;
