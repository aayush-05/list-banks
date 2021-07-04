import React, { useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import FilterContainer from "../../components/filterContainer/FilterContainer";
import PaginationHandler from "../../components/paginationHandler/PaginationHandler";
import loader from "../../assets/images/loader.svg";
import starredIcon from "../../assets/images/starredIcon.png"
import unstarredIcon from "../../assets/images/unstarredIcon.png"
import "./BanksList.scss";

const BanksList = () => {
  const currentLocationData = useLocation();
  const [apiFetchStatus, setApiFetchStatus] = useState("loading");
  const [apiData, setApiData] = useState([]);
  const [displayApiData, setDisplayApiData] = useState([]);
  const [favoriteBanksCount, setFavoriteBanksCount] = useState(0);

  const toggleFavorite = (bankIfscCode) => {
    const favoriteBanks = JSON.parse(localStorage.getItem("favorite-banks"));
    if (favoriteBanks === null) {
      localStorage.setItem("favorite-banks", JSON.stringify([bankIfscCode]));
      setFavoriteBanksCount(favoriteBanksCount + 1);
    } else {
      if (favoriteBanks.includes(bankIfscCode)) {
        const currentFavoriteBanks = favoriteBanks.filter(
          (favoriteBankIfsc) => favoriteBankIfsc !== bankIfscCode
        );
        localStorage.setItem("favorite-banks", JSON.stringify(currentFavoriteBanks));
        setFavoriteBanksCount(favoriteBanksCount - 1);
      } else {
        favoriteBanks.push(bankIfscCode);
        localStorage.setItem("favorite-banks", JSON.stringify(favoriteBanks));
        setFavoriteBanksCount(favoriteBanksCount + 1);
      }
    }
  };

  const updateApiStatus = (currentApiStatus, currentApiData) => {
    setApiFetchStatus(currentApiStatus);
    if (currentApiData !== undefined) {
      setApiData(currentApiData);
    }
  };

  const updateApiDisplayData = (currentDisplayApiData) => {
    setDisplayApiData(currentDisplayApiData);
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <FilterContainer
              apiFetchStatus={apiFetchStatus}
              locationData={currentLocationData}
              updateApiStatus={updateApiStatus}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="banks_list_container">
              {apiFetchStatus !== "success" ? (
                <>
                  {apiFetchStatus === "loading" && (
                    <div className="loader_container">
                      <img src={loader} alt="Loading" />
                    </div>
                  )}
                  {apiFetchStatus === "error" && (
                    <div className="loader_container">
                      Error fetching details. Please refresh
                    </div>
                  )}
                </>
              ) : (
                <Table borderless hover responsive="xs" size="sm">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Bank Name</th>
                      <th>IFSC</th>
                      <th span="1">Branch</th>
                      <th>Bank ID</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  {displayApiData.length === 0 ? (
                    <tbody className="no_results_container text-center">
                      <tr>
                        <td colSpan="6">No results found matching your search</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {displayApiData.map((bankData, index) => (
                        <tr key={index}>
                          <td>
                            <img 
                              src={localStorage.getItem("favorite-banks")?.includes(bankData.ifsc) 
                                ? starredIcon : unstarredIcon
                              }
                              onClick={() => { toggleFavorite(bankData.ifsc) }}
                              height="25" 
                              width="25"
                              alt=""
                            />
                          </td>
                          <td>
                            <Link to={`/bank-details/${bankData.ifsc}`}>
                              {bankData.bank_name}
                            </Link>
                          </td>
                          <td>{bankData.ifsc}</td>
                          <td>{bankData.branch}</td>
                          <td>{bankData.bank_id}</td>
                          <td>{bankData.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </Table>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <PaginationHandler 
              apiFetchStatus={apiFetchStatus}
              apiData={apiData}
              updateApiDisplayData={updateApiDisplayData}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BanksList;
