import React, { useState } from "react";
import { useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import loader from "../../assets/images/loader.svg";
import whiteArrowIcon from "../../assets/images/whiteArrowIcon.png"
import fetchBankData from "../../utils/fetchBankData";
import bankIcon from "../../assets/images/bankIcon.png";
import "./BankDetails.scss";

const BankDetails = () => {
  const currentLocationData = useLocation();
  const [apiFetchStatus, setApiFetchStatus] = useState("loading");
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    setApiFetchStatus("loading");
    const currentIfscCode = currentLocationData.pathname.split("/")[2];
    const fetchBankDetails = async () => {
      const bankData = await fetchBankData(currentLocationData, currentIfscCode);
      setApiFetchStatus(bankData.status);
      setApiData(bankData.data);
    }
    fetchBankDetails();
  }, [currentLocationData.pathname])

  return (
    <>
      <Container>
        <Row>
          <Col>
            <div className="go_back_container">
              <Link to="/all-banks">
                <Button className="button_container" variant="">
                  <img src={whiteArrowIcon} alt="" />
                  {" "}All Banks
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="bank_details_container">
              {apiFetchStatus !== "success" ? (
                <>
                  {apiFetchStatus === "loading" && (
                    <div className="loader_container">
                      <img src={loader} alt="" />
                    </div>
                  )}
                  {apiFetchStatus === "error" && (
                    <div className="loader_container">
                      Error fetching details. Please refresh
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3>
                    <img src={bankIcon} alt="Bank" />
                    {apiData.bank_name}
                  </h3>
                  <br />
                  <Table borderless hover responsive="xs" size="sm">
                    <tbody>
                      <tr>
                        <td>IFSC:</td>
                        <td>{apiData.ifsc}</td>
                      </tr>
                      <tr>
                        <td>Bank ID:</td>
                        <td>{apiData.bank_id}</td>
                      </tr>
                      <tr>
                        <td>Branch:</td>
                        <td>{apiData.branch}</td>
                      </tr>
                      <tr>
                        <td>Address:</td>
                        <td>{apiData.address}</td>
                      </tr>
                      <tr>
                        <td>City:</td>
                        <td>{apiData.city}</td>
                      </tr>
                      <tr>
                        <td>District:</td>
                        <td>{apiData.district}</td>
                      </tr>
                      <tr>
                        <td>State:</td>
                        <td>{apiData.state}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BankDetails;
