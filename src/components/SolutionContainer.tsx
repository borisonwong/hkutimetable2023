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
}) => {
  if (solution_list.length == 0) {
    return <div className="row"></div>;
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
      {solution_list.map((item, index) => {
        if (sol_noneSelected || sol_checkSelect(index)) {
          return (
            <div className="col-12 col-sm-6 col-md-4 col-md-3">
              <div className="card border-primary mb-3">
                <h5 className={get_card_class(index, "card_header")}>
                  Solution {parseInt(index) + 1}
                  {getSemText(item["sem"])}
                </h5>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {item["solution_list"].map((item) => (
                      <li className="list-group-item">
                        {item["COURSE CODE"] + "-" + item["CLASS SECTION"]}
                        {equivalent_getter(
                          item["COURSE CODE"],
                          item["CLASS SECTION"]
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
        } else {
          return <></>;
        }
      })}
    </div>
  );
};

export default SolutionContainer;
