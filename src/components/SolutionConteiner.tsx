// @ts-nocheck
import React from "react";

function getSemText(sem) {
  if (sem == 1) {
    return " (SEM 1)";
  } else if (sem == 2) {
    return " (SEM 2)";
  } else {
    return " (SEM 1/2)";
  }
}
const getDateTimeFromString = (dateString) => {
  const dateStringList = dateString.split("-");
  const day = parseInt(dateStringList[2]);
  const mon = parseInt(dateStringList[1]);
  const yr = parseInt(dateStringList[0]);
  const returnDate = new Date(yr, mon - 1, day);
  return returnDate;
};
const getFirstTeachingDate = (solution) => {
  const courseList = Object.keys(solution["sol"]);
  let minDate = -1;
  for (let i = 0; i < courseList.length; i++) {
    const courseCode = courseList[i];
    const courseSameSection = solution["sol"][courseCode];
    const rowList = courseSameSection[Object.keys(courseSameSection)[0]];
    for (let j = 0; j < rowList.length; j++) {
      const row = rowList[j];
      const currentDate = getDateTimeFromString(row[5]);
      if (minDate == -1) {
        minDate = currentDate;
      } else {
        if (currentDate < minDate) {
          minDate = currentDate;
        }
      }
    }
  }
  return minDate;
};
const SolutionContainer = ({
  validSolutionList,
  invalidSolutionList,
  solSelected,
  setSolSected,
  sol_hashfunction,
  solDateSetter,
}) => {
  if (validSolutionList.length == 0) {
    if (invalidSolutionList.length == 0) {
      return <></>;
    }
    return (
      <>
        <div className="alert alert-warning" role="alert">
          Sorry, no solutions are found. However, we got some solutions that
          involve timeclashes that may help you :D.
        </div>
        <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 g-3">
          {invalidSolutionList.map((solObject, solIndex) => (
            // This item refers to each solution object
            <div className="col">
              <div className="card px-0 my-1">
                <h5 className="card-header">Solution {solIndex + 1}</h5>
                <div className="card-body">
                  <div className="row no-gutters">
                    <div className="col">
                      <h6 className="card-subtitle mb-2">Course list:</h6>
                      <ul className="list-group">
                        {Object.keys(solObject["sol"]).map((courseCode) => (
                          <li
                            className="list-group-item"
                            key={sol_hashfunction(
                              JSON.stringify(solObject) +
                                JSON.stringify(solObject["sol"][courseCode])
                            )}
                          >
                            {courseCode + "-"}
                            {Object.keys(solObject["sol"][courseCode]).map(
                              (subClass, subClassIndex) => (
                                <>
                                  {subClassIndex > 0 && "/"}
                                  {subClass}
                                </>
                              )
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col">
                      <h6 className="card-subtitle mb-2">
                        Impermissible combinations:
                      </h6>
                      <ul className="list-group">
                        {solObject["conflict"].map((conflictPair) => (
                          <li className="list-group-item border-danger">
                            {conflictPair[0] + "-"}
                            {Object.keys(solObject["sol"][conflictPair[0]]).map(
                              (section, sectionIndex) => (
                                <>
                                  {sectionIndex > 0 && "/"}
                                  {section}
                                </>
                              )
                            )}
                            {" and "}
                            {conflictPair[1] + "-"}
                            {Object.keys(solObject["sol"][conflictPair[1]]).map(
                              (section, sectionIndex) => (
                                <>
                                  {sectionIndex > 0 && "/"}
                                  {section}
                                </>
                              )
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
    return <></>;
  }
  function get_card_class(sol, layer) {
    if (layer == "card_header") {
      if (sol == solSelected) {
        return "card-header text-white bg-primary";
      } else {
        return "card-header";
      }
    }
    if (layer == "button_txt") {
      if (sol == solSelected) {
        return "Unselect";
      } else {
        return "Select";
      }
    }
  }
  function handleOnClick(sol) {
    if (sol == solSelected) {
      setSolSected(-1);
    } else {
      setSolSected(sol);
      solDateSetter(getFirstTeachingDate(sol));
    }
  }
  return (
    <div className="row">
      <h5 className="display-6">
        {validSolutionList.length.toString() + " Possibilities found"}
      </h5>
      <div className="container card-group overflow-auto solution-menu-bar">
        {validSolutionList.map((solObject, solIndex) => {
          return (
            <div
              className="col-12 col-sm-12 col-md-6 col-lg-12 px-2"
              key={sol_hashfunction(JSON.stringify(solObject))}
            >
              <div className="card border-primary mb-3">
                <h5 className={get_card_class(solObject, "card_header")}>
                  Solution {parseInt(solIndex) + 1}
                </h5>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {Object.keys(solObject["sol"]).map((courseCode) => (
                      <li
                        className="list-group-item"
                        key={sol_hashfunction(
                          JSON.stringify(solObject) +
                            JSON.stringify(solObject["sol"][courseCode])
                        )}
                      >
                        {courseCode + "-"}
                        {Object.keys(solObject["sol"][courseCode]).map(
                          (subClass, subClassIndex) => (
                            <>
                              {subClassIndex > 0 && "/"}
                              {subClass}
                            </>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOnClick(solObject)}
                  >
                    {get_card_class(solObject, "button_txt")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SolutionContainer;
