import React, { useState, useEffect, useRef } from "react";
import arrowIcon from "../../assets/images/arrowIcon.png";
import "./PaginationHandler.scss";

const PaginationHandler = ({
  apiFetchStatus,
  apiData,
  updateApiDisplayData,
}) => {
  const paginationPointer = useRef({
    lower: 0,
    upper: 10,
  });
  const [displayLimitValue, setDisplayLimitValue] = useState(10);

  const fetchDisplayData = (moveDirection) => {
    const {
      lower, upper
    } = paginationPointer.current;

    if (apiFetchStatus !== "loading") {
      switch (moveDirection) {
        case "prev":
          if (lower > 0) {
            paginationPointer.current = {
              upper: lower,
              lower: lower - displayLimitValue < 0 ? 0 : lower-displayLimitValue,
            }
          }
          break;
        
        case "next":
          if (upper < apiData.length) {
            paginationPointer.current = {
              lower: upper,
              upper: upper + displayLimitValue > apiData.length
                ? apiData.length : upper+displayLimitValue,
            }
          }
          break;

        default:
          break;
      }

      updateApiDisplayData(apiData.slice(
        paginationPointer.current.lower, 
        paginationPointer.current.upper
      ));
    }
  };

  const setPaginationLimit = (e) => {
    const { value } = e.target;
    if (!isNaN(Number(value)) && !value.includes("e")) {
      setDisplayLimitValue(Number(value));
      paginationPointer.current.lower = 0;
      paginationPointer.current.upper = Number(value) > apiData.length
        ? apiData.length : Number(value);
      fetchDisplayData();
    }
  };

  useEffect(() => {
    setPaginationLimit({ target: { value: `${displayLimitValue}`}});
  }, [apiFetchStatus, apiData]);

  return (
    <div className="pagination_container">
      Rows per page:{" "}
      <input 
        className="pagination_input_container" 
        value={displayLimitValue}
        type="number"
        onChange={setPaginationLimit}
        disabled={apiFetchStatus === "loading"}
      />
      <img 
        src={arrowIcon} 
        alt="Previous"
        className="left_arrow"
        onClick={() => {fetchDisplayData("prev")}}
      />
      <p className="text-center">
        {paginationPointer.current.upper !== 0 ? (
          <>
            {paginationPointer.current.lower + 1}-{paginationPointer.current.upper}
          </>
        ) : (
          <>__</>
        )}
        {" "}of {apiData.length}</p>
      <img 
        src={arrowIcon} 
        alt="Next" 
        className="right_arrow"
        onClick={() => { fetchDisplayData("next") }}
      />
    </div>
  );
};

export default PaginationHandler;
