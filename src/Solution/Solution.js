import React, { useState, useEffect } from "react";
import "./Solution.css";
import { ReactComponent as Logo } from "../assets/sops_logo.svg";
import { gql, useQuery } from "@apollo/client";

const query = gql`
  query {
    solutions {
      title
      icon {
        url
      }
    }
    solutiondetails {
      heading
      pdfname
      pdfurl {
        url
      }
      icon{
        url
      }
    }
  }
`;

function Solution() {
  const { loading, error, data } = useQuery(query);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeState, setActiveState] = useState(false);

  useEffect(() => {
    if (data && data.solutiondetails) {
      // Set "Human Resource" as the default selected department
      const defaultDept = data.solutiondetails.find(
        (dept) => dept.heading === "Human Resource"
      );
      setSelectedDepartment(defaultDept);
      setActiveState(true); // Set the default state to true for the initially selected department
    }
  }, [data]);

  const handleDepartmentClick = (dept) => {
    setSelectedDepartment(dept);
    setActiveState(true); // Activate state on department click
  };

  const handlePdfClick = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Logo />
      </div>
    );
  }
  if (error) return <p>Error fetching data: {error.message}</p>;

  const solution = data.solutions[0];

  return (
    <div className="solutions">
      <div className="container d-flex">
        <div className="col-3">
          <div className="logo">
            <Logo />
          </div>
          <div className="line">
            <hr className="border-gray-200" />
          </div>
          <div className="department">
            {data.solutiondetails.map((dept, index) => (
              <div
                key={index}
                className={`dept ${
                  selectedDepartment?.heading === dept.heading && activeState
                    ? "active"
                    : ""
                }`}
                onClick={() => handleDepartmentClick(dept)}
                style={{ cursor: "pointer" }}
              >
                <div className="dept-icon">
                  <img
                    className="w-100 iconss"
                    alt={`icon-${index}`}
                    src={dept.icon?.url}
                  />
                </div>
                <p className="heading">{dept.heading}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-8">
          <div className="pdf-container">
            {selectedDepartment && (
              <>
                <div className="h-wrap">
                  <h2>{selectedDepartment.heading}</h2>
                </div>
                <div className="pdf-files">
                  {selectedDepartment.pdfurl.map((pdf, index) => (
                    <div
                      key={index}
                      className="pdf-file d-flex"
                      onClick={() => handlePdfClick(pdf.url)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="pdf-image">
                        <img
                          className="w-100 img  "
                          alt="pdf"
                          src="https://ap-south-1.graphassets.com/cm0wescei00n507pgbljy62un/cm16fry2y0li808plputtu1z1"
                        />
                      </div>
                      <div className="word-wrap">
                        <h1 className="pdf-name">
                          {selectedDepartment.pdfname[index]}
                        </h1>
                        <div className="view-icon-wrap">
                            <img src="https://ap-south-1.graphassets.com/cm0wescei00n507pgbljy62un/cm17fssmm0c5h07pk7htz09a2"
                                alt="view-icon"
                                className="w-100"
                             />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Solution;