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

const SolutionContainer = ({
  solution_list,
  equivalent_getter,
  sol_onClick,
  sol_checkSelect,
  sol_noneSelected,
  sol_hashfunction,
  invalid_solution_list,
}) => {
  if (solution_list.length == 0) {
    if (invalid_solution_list.length == 0) {
      return <></>;
    }
    return (
      <div className="row">
        <div className="alert alert-warning" role="alert">
          Sorry, no solutions are found. However, we got some solutions that
          involve timeclashes that may help you :D.
        </div>
        {invalid_solution_list.map((item, index) => (
          <div className="card px-0 my-3">
            <h5 className="card-header">Solution {index + 1}</h5>
            <div className="card-body">
              <div className="row no-gutters">
                <div className="col">
                  <h6 className="card-subtitle mb-2">Course list:</h6>
                  <ul className="list-group">
                    {item["solution_list"].map((item_subclass) => (
                      <li
                        className="list-group-item"
                        key={sol_hashfunction(
                          item["sol_hash"] +
                            item_subclass["COURSE CODE"] +
                            "-" +
                            item_subclass["CLASS SECTION"]
                        )}
                      >
                        {item_subclass["COURSE CODE"] +
                          "-" +
                          item_subclass["CLASS SECTION"]}
                        {equivalent_getter(
                          item_subclass["COURSE CODE"],
                          item_subclass["CLASS SECTION"]
                        ).map((item) => (
                          <>{"/" + item}</>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col">
                  <h6 className="card-subtitle mb-2">
                    Impermissible combinations:
                  </h6>
                  <ul className="list-group">
                    {item["conflict_pair_list"].map((conflict_pair) => (
                      <li className="list-group-item border-danger">
                        {conflict_pair[0]["COURSE CODE"] +
                          "-" +
                          conflict_pair[0]["CLASS SECTION"]}
                        {equivalent_getter(
                          conflict_pair[0]["COURSE CODE"],
                          conflict_pair[0]["CLASS SECTION"]
                        ).map((item) => (
                          <>{"/" + item}</>
                        ))}{" "}
                        and{" "}
                        {conflict_pair[1]["COURSE CODE"] +
                          "-" +
                          conflict_pair[1]["CLASS SECTION"]}
                        {equivalent_getter(
                          conflict_pair[1]["COURSE CODE"],
                          conflict_pair[1]["CLASS SECTION"]
                        ).map((item) => (
                          <>{"/" + item}</>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  function get_card_class(num, layer) {
    if (layer == "card_header") {
      if (sol_checkSelect(num)) {
        return "card-header text-white bg-primary";
      } else {
        return "card-header";
      }
    }
    if (layer == "button_txt") {
      if (sol_checkSelect(num)) {
        return "Unselect";
      } else {
        return "Select";
      }
    }
  }
  return (
    <div className="row">
      <h5 className="display-6">
        {solution_list.length.toString() + " Possibilities found"}
      </h5>
      <div className="container overflow-auto solution-menu-bar">
        {solution_list.map((item, index) => {
          // if (sol_noneSelected || sol_checkSelect(index)) {
          return (
            <div
              className="col-12 col-sm-12 col-md-4 col-lg-12"
              key={item["sol_hash"]}
            >
              <div className="card border-primary mb-3">
                <h5 className={get_card_class(index, "card_header")}>
                  Solution {parseInt(index) + 1}
                  {getSemText(item["sem"])}
                </h5>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {item["solution_list"].map((item_course_section) => (
                      <li
                        className="list-group-item"
                        key={sol_hashfunction(
                          item["sol_hash"] +
                            item_course_section["COURSE CODE"] +
                            "-" +
                            item_course_section["CLASS SECTION"]
                        )}
                      >
                        {item_course_section["COURSE CODE"] +
                          "-" +
                          item_course_section["CLASS SECTION"]}
                        {equivalent_getter(
                          item_course_section["COURSE CODE"],
                          item_course_section["CLASS SECTION"]
                        ).map((item) => (
                          <>{"/" + item}</>
                        ))}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-primary"
                    onClick={() => sol_onClick(index + 1)}
                  >
                    {get_card_class(index, "button_txt")}
                  </button>
                </div>
              </div>
            </div>
          );
          // } else {
          //   return <></>;
          // }
        })}
      </div>
    </div>
  );
};

export default SolutionContainer;
