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
  const [semOneList, setSemOneList] = useState([]);
  const [semTwoList, setSemTwoList] = useState([]);
  const [sameSectionList, setSameSectionList] = useState([]);
  const deleteSectionBySemester = (courseCode, semNum) => {
    let sameSectionListNew = [];
    for (let i = 0; i < sameSectionList.length; i++) {
      const sameSection = sameSectionList[i];
      const firstTimeData = sameSection[Object.keys(sameSection)[0]][0];
      const courseCodeIter = firstTimeData[2];
      const courseSemIter = firstTimeData[3].slice(0, 1);
      console.log(courseCodeIter + "; " + courseSemIter);
      if (courseCode != courseCodeIter || semNum != courseSemIter) {
        sameSectionListNew.push(sameSection);
      }
    }
    setSameSectionList(sameSectionListNew);
  };
  const deleteSectionAllSemester = (courseCode) => {
    let sameSectionListNew = [];
    for (let i = 0; i < sameSectionList.length; i++) {
      const sameSection = sameSectionList[i];
      const firstTimeData = sameSection[Object.keys(sameSection)[0]][0];
      const courseCodeIter = firstTimeData[2];
      if (courseCode != courseCodeIter) {
        sameSectionListNew.push(sameSection);
      }
    }
    setSameSectionList(sameSectionListNew);
  };
  const toggleSem = (courseCode, semNum) => {
    let semOneListCopy = semOneList.slice();
    let semTwoListCopy = semTwoList.slice();
    if (semNum == 1) {
      const semOneListPos = semOneListCopy.indexOf(courseCode);
      if (semOneListPos < 0) {
        semOneListCopy.push(courseCode);
      } else {
        semOneListCopy.splice(semOneListPos, 1);
      }
      setSemOneList(semOneListCopy);
    }
    if (semNum == 2) {
      const semTwoListPos = semTwoListCopy.indexOf(courseCode);
      if (semTwoListPos < 0) {
        semTwoListCopy.push(courseCode);
      } else {
        semTwoListCopy.splice(semTwoListPos, 1);
      }
      setSemTwoList(semTwoListCopy);
    }
    if (semOneListCopy.indexOf(courseCode) < 0) {
      deleteSectionBySemester(courseCode, 1);
    }
    if (semTwoListCopy.indexOf(courseCode) < 0) {
      deleteSectionBySemester(courseCode, 2);
    }
  };
  const deleteSem = (courseCode) => {
    let semOneListCopy = semOneList.slice();
    let semTwoListCopy = semTwoList.slice();
    const semOneListPos = semOneListCopy.indexOf(courseCode);
    const semTwoListPos = semTwoListCopy.indexOf(courseCode);
    if (semOneListPos >= 0) {
      semOneListCopy.splice(semOneListPos, 1);
    }
    if (semTwoListPos >= 0) {
      semTwoListCopy.splice(semTwoListPos, 1);
    }
    deleteSectionAllSemester(courseCode);
    setSemOneList(semOneListCopy);
    setSemTwoList(semTwoListCopy);
  };
  const toggleSameSection = (sameSection) => {
    let sameSectionListCopy = sameSectionList.slice();
    const sameSectionIndex = sameSectionListCopy.indexOf(sameSection);
    if (sameSectionIndex < 0) {
      sameSectionListCopy.push(sameSection);
    } else {
      sameSectionListCopy.splice(sameSectionIndex, 1);
    }
    setSameSectionList(sameSectionListCopy);
  };
  const getGAInput = () => {
    let returnDict = {};
    for (let i = 0; i < sameSectionList.length; i++) {
      const courseCode =
        sameSectionList[i][Object.keys(sameSectionList[i])[0]][0][2];
      if (Object.keys(returnDict).indexOf(courseCode) == -1) {
        returnDict[courseCode] = [sameSectionList[i]];
      } else {
        returnDict[courseCode].push(sameSectionList[i]);
      }
    }
    for (let i = 0; i < data_in.length; i++) {
      const courseCode = data_in[i]["COURSE CODE"];
      const course = data_in[i];
      if (Object.keys(returnDict).indexOf(courseCode) == -1) {
        //  No specified course section
        const inSemOneList = semOneList.indexOf(courseCode) >= 0;
        const inSemTwoList = semTwoList.indexOf(courseCode) >= 0;
        returnDict[courseCode] = [];
        for (let j = 0; j < course["SAME SECTION"].length; j++) {
          const sameSection = course["SAME SECTION"][j];
          const sem = Object.keys(sameSection)[0].slice(0, 1);
          if (
            (inSemOneList && sem == 1) ||
            (inSemTwoList && sem == 2) ||
            (!inSemOneList && !inSemTwoList)
          ) {
            returnDict[courseCode].push(sameSection);
          }
        }
      }
    }
    return returnDict;
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
            .map((item, course_index) => (
              <tr key={item["COURSE CODE"]}>
                <td>
                  {item["COURSE CODE"]}
                  <br />
                  {item["SAME SECTION"]
                    .filter(
                      (sameSectionItem, sameSectionIndex) =>
                        (Object.keys(sameSectionItem)[0].slice(0, 1) == 1 &&
                          semOneList.indexOf(item["COURSE CODE"]) >= 0) ||
                        (Object.keys(sameSectionItem)[0].slice(0, 1) == 2 &&
                          semTwoList.indexOf(item["COURSE CODE"]) >= 0) ||
                        (semOneList.indexOf(item["COURSE CODE"]) < 0 &&
                          semTwoList.indexOf(item["COURSE CODE"])) < 0
                    )
                    .map((sameSectionItem, sameSectionIndex) => (
                      <span
                        className={
                          sameSectionList.indexOf(sameSectionItem) < 0
                            ? "badge rounded-pill text-bg-secondary me-1"
                            : "badge rounded-pill text-bg-primary me-1"
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleSameSection(sameSectionItem)}
                      >
                        {Object.keys(sameSectionItem).map(
                          (sameSubclassOption, sameSubclassOptionIndex) => (
                            <>
                              {(sameSubclassOptionIndex > 0 ? "/" : "") +
                                sameSubclassOption}
                            </>
                          )
                        )}
                      </span>
                    ))}
                </td>
                <td>{item["COURSE TITLE"]}</td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      onClick={() => toggleSem(item["COURSE CODE"], 1)}
                    />
                  </div>
                </td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      onClick={() => toggleSem(item["COURSE CODE"], 2)}
                    />
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      deleteSem(item["COURSE CODE"]);
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
          className="btn btn-primary"
          // onClick={() => {
          //   onClickRunGA(
          //     data_in,
          //     subClassSelected,
          //     shownCourseSem1,
          //     shownCourseSem2
          //   );
          // }}
          onClick={() => {
            const GAInput = getGAInput();
            onClickRunGA(GAInput);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Table;
