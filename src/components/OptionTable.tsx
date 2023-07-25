// @ts-nocheck
import { useState } from "react";

//  rafce
interface Props {
  data_in;
  header_in: string[];
  onClick: (item: string) => void;
  showMax: int;
  onClickRunGA;
}
function getWidth(item) {
  switch (item) {
    case "Course Code":
      return "w-25";
    case "Course Title":
      return "w-50";
    default:
      return "";
  }
}

const Table = ({
  data_in,
  header_in,
  onClick,
  showMax,
  onClickRunGA,
}: Props) => {
  const [shownCourseSem1, setShownCourseSem1] = useState([]);
  const [shownCourseSem2, setShownCourseSem2] = useState([]);
  const [subClassSelected, setSubClassSelected] = useState([]);
  const toggleSubclass = (courseCode: string, subclassCode: string) => {
    const currentSubClassSelected = subClassSelected.slice();
    for (var iter = 0; iter < currentSubClassSelected.length; iter++) {
      if (
        currentSubClassSelected[iter].slice(0, 8) == courseCode &&
        currentSubClassSelected[iter] != courseCode + "-" + subclassCode
      ) {
        currentSubClassSelected.splice(iter, 1);
        break;
      }
    }
    const index = currentSubClassSelected.indexOf(
      courseCode + "-" + subclassCode
    );
    if (index >= 0) {
      currentSubClassSelected.splice(index, 1);
      setSubClassSelected(currentSubClassSelected);
    } else {
      currentSubClassSelected.push(courseCode + "-" + subclassCode);
      setSubClassSelected(currentSubClassSelected);
    }
  };
  const toggleShownSem1 = (courseCode: string) => {
    const currentSubClassSelected = subClassSelected.slice();
    var prev_pos = 0;
    var prev_found = false;
    for (var iter = 0; iter < currentSubClassSelected.length; iter++) {
      if (currentSubClassSelected[iter].slice(0, 8) == courseCode) {
        prev_pos = iter;
        prev_found = true;
        break;
      }
    }
    const shownCourseSem1State = shownCourseSem1.slice();
    const index = shownCourseSem1State.indexOf(courseCode);
    if (index >= 0) {
      shownCourseSem1State.splice(index, 1);
      setShownCourseSem1(shownCourseSem1State);
      if (prev_found && currentSubClassSelected[prev_pos].slice(9, 10) == "1") {
        currentSubClassSelected.splice(prev_pos, 1);
        setSubClassSelected(currentSubClassSelected);
      }
    } else {
      shownCourseSem1State.push(courseCode);
      setShownCourseSem1(shownCourseSem1State);
    }
  };
  const toggleShownSem2 = (courseCode: string) => {
    const currentSubClassSelected = subClassSelected.slice();
    var prev_pos = 0;
    var prev_found = false;
    for (var iter = 0; iter < currentSubClassSelected.length; iter++) {
      if (currentSubClassSelected[iter].slice(0, 8) == courseCode) {
        prev_pos = iter;
        prev_found = true;
        break;
      }
    }
    const shownCourseSem2State = shownCourseSem2.slice();
    const index = shownCourseSem2State.indexOf(courseCode);
    if (index >= 0) {
      shownCourseSem2State.splice(index, 1);
      setShownCourseSem2(shownCourseSem2State);
      if (prev_found && currentSubClassSelected[prev_pos].slice(9, 10) == "2") {
        currentSubClassSelected.splice(prev_pos, 1);
        setSubClassSelected(currentSubClassSelected);
      }
    } else {
      shownCourseSem2State.push(courseCode);
      setShownCourseSem2(shownCourseSem2State);
    }
  };
  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            {header_in.map((item) => (
              <th className={getWidth(item)} key={item}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-striped">
          {data_in
            .filter((item, index) => index < showMax && item)
            .map((item, index) => (
              <tr key={item["COURSE CODE"]}>
                <td>
                  {item["COURSE CODE"]}
                  <br />
                  {Object.keys(item["COURSE SECTION DICT"]).map(
                    (keyName, value) => {
                      if (
                        (item["COURSE SECTION DICT"][keyName][
                          "CLASS SECTION"
                        ].slice(0, 1) == "1" &&
                          shownCourseSem1.indexOf(item["COURSE CODE"]) >= 0) ||
                        (item["COURSE SECTION DICT"][keyName][
                          "CLASS SECTION"
                        ].slice(0, 1) == "2" &&
                          shownCourseSem2.indexOf(item["COURSE CODE"]) >= 0)
                      ) {
                        return (
                          <span
                            className={
                              subClassSelected.indexOf(
                                item["COURSE CODE"] +
                                  "-" +
                                  item["COURSE SECTION DICT"][keyName][
                                    "CLASS SECTION"
                                  ]
                              ) >= 0
                                ? "badge rounded-pill text-bg-primary"
                                : "badge rounded-pill text-bg-secondary"
                            }
                            key={
                              item["COURSE SECTION DICT"][keyName][
                                "COURSE CODE"
                              ] +
                              "-" +
                              item["COURSE SECTION DICT"][keyName][
                                "CLASS SECTION"
                              ]
                            }
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              toggleSubclass(
                                item["COURSE SECTION DICT"][keyName][
                                  "COURSE CODE"
                                ],
                                item["COURSE SECTION DICT"][keyName][
                                  "CLASS SECTION"
                                ]
                              )
                            }
                          >
                            {
                              item["COURSE SECTION DICT"][keyName][
                                "CLASS SECTION"
                              ]
                            }
                          </span>
                        );
                      }
                    }
                  )}
                </td>
                <td>{item["COURSE TITLE"]}</td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      onClick={() => toggleShownSem1(item["COURSE CODE"])}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      onClick={() => toggleShownSem2(item["COURSE CODE"])}
                    />
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      const index_1 = shownCourseSem1.indexOf(
                        item["COURSE CODE"]
                      );
                      const index_2 = shownCourseSem2.indexOf(
                        item["COURSE CODE"]
                      );
                      if (index_1 >= 0) {
                        const shownCourseSem1State = shownCourseSem1.slice();
                        shownCourseSem1State.splice(index_1, 1);
                        setShownCourseSem1(shownCourseSem1State);
                      }
                      if (index_2 >= 0) {
                        const shownCourseSem2State = shownCourseSem2.slice();
                        shownCourseSem2State.splice(index_2, 1);
                        setShownCourseSem2(shownCourseSem2State);
                      }
                      onClick(item["COURSE CODE"]);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot></tfoot>
      </table>
      <div>
        <button
          type="button"
          className="btn btn-primary btn-lg btn-block"
          onClick={() => {
            onClickRunGA(
              data_in,
              subClassSelected,
              shownCourseSem1,
              shownCourseSem2
            );
          }}
        >
          Find possible combinations
        </button>
      </div>
    </>
  );
};

export default Table;
