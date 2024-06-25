// @ts-nocheck
import React, { useState } from "react";
import { start } from "repl";

const getFirstDate = (dateIn: Date) => {
  return new Date(dateIn.getFullYear(), dateIn.getMonth(), 1);
};
const getLastDate = (dateIn: Date) => {
  return new Date(dateIn.getFullYear(), dateIn.getMonth() + 1, 0);
};
const getMonthDateList = (dateIn: Date) => {
  const firstDate = getFirstDate(dateIn);
  const lastDate = getLastDate(dateIn);
  let returnList = [];
  var i = 0;
  while (i < lastDate.getDate()) {
    const iterDate = new Date(firstDate);
    iterDate.setDate(iterDate.getDate() + i);
    returnList.push(iterDate);
    i += 1;
  }
  return returnList;
};
const getDeltaMonthDate = (dateIn: Date, deltaMonth) => {
  const returnDate = new Date(
    dateIn.getFullYear(),
    dateIn.getMonth() + deltaMonth,
    dateIn.getDate()
  );
  return returnDate;
};
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

const weekdayList = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const getTableArray = (monthDateList) => {
  let allTableDayIndex = [];
  let matrix = [];
  for (let i = -1 * monthDateList[0].getDay(); i < monthDateList.length; i++) {
    allTableDayIndex.push(i);
  }
  while (allTableDayIndex.length % 7 != 0) {
    allTableDayIndex.push(allTableDayIndex[allTableDayIndex.length - 1] + 1);
  }
  for (
    let rowIterIndex = 0;
    rowIterIndex < Math.floor(allTableDayIndex.length / 7);
    rowIterIndex++
  ) {
    let row = [];
    for (let i = 0; i < 7; i++) {
      if (!monthDateList[allTableDayIndex[rowIterIndex * 7 + i]]) {
        row.push("");
      } else {
        row.push(monthDateList[allTableDayIndex[rowIterIndex * 7 + i]]);
      }
    }
    matrix.push(row);
  }
  return matrix;
};
const DatePicker = ({
  dateIn,
  setDate,
  solution,
  timeSlotList,
  getTimeslotList,
  setTimeSlotList,
}) => {
  const tableArray = getTableArray(getMonthDateList(dateIn));
  const defaultTimeslotList = getTimeslotList();
  const handleOnclickStart = (timeslotItem) => {
    const newIndex = defaultTimeslotList.indexOf(timeslotItem);
    setStartTimeslotIndex(newIndex);
    setTimeSlotList(defaultTimeslotList.slice(newIndex, endTimeslotIndex));
  };
  const handleOnclickEnd = (timeslotItem) => {
    const newIndex = defaultTimeslotList.indexOf(timeslotItem);
    setEndTimeslotIndex(newIndex);
    setTimeSlotList(defaultTimeslotList.slice(startTimeslotIndex, newIndex));
  };
  const [startTimeslotIndex, setStartTimeslotIndex] = useState(0);
  const [endTimeslotIndex, setEndTimeslotIndex] = useState(
    defaultTimeslotList.length - 1
  );
  return (
    <>
      <button
        className="btn btn-primary mb-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        Configure timetable
      </button>
      <div className="collapse" id="collapseExample">
        <div className="card card-body">
          <div className="row">
            <div className="col">
              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm float-start py-0"
                    onClick={() => {
                      setDate(getDeltaMonthDate(dateIn, -1));
                    }}
                  >
                    {"<"}
                  </button>
                </div>
                <div className="col-6">
                  <h5 style={{ textAlign: "center" }}>
                    {monthList[dateIn.getMonth()] + ", " + dateIn.getFullYear()}
                  </h5>
                </div>
                <div className="col">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm float-end py-0"
                    onClick={() => {
                      setDate(getDeltaMonthDate(dateIn, 1));
                    }}
                  >
                    {">"}
                  </button>
                </div>
              </div>
              <table
                className="table table-bordered  fs-3 table-sm timetable table-hover"
                style={{ userSelect: "none" }}
              >
                <thead>
                  <tr
                    style={{ backgroundColor: "#f7f7f7" }}
                    className="timetable-row"
                  >
                    {weekdayList.map((item) => (
                      <th
                        style={{ width: "12%" }}
                        className="align-middle text-center"
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableArray.map((rowItem, rowIndex) => {
                    let styleDict = { cursor: "pointer" };
                    let isHighlight = false;
                    for (let i = 0; i < rowItem.length; i++) {
                      if (rowItem[i] == "") {
                        continue;
                      }
                      if (rowItem[i].getTime() == dateIn.getTime()) {
                        isHighlight = true;
                        break;
                      }
                    }
                    if (isHighlight) {
                      styleDict["backgroundColor"] = "#d8e2dc";
                    }
                    return (
                      <tr className="timetable-row">
                        {rowItem.map((day) => {
                          if (day == "") {
                            return (
                              <td
                                className="align-middle text-center timetable-cell"
                                style={styleDict}
                              ></td>
                            );
                          } else {
                            return (
                              <td
                                className="align-middle text-center timetable-cell"
                                style={styleDict}
                                onClick={() => setDate(day)}
                              >
                                {day.getDate()}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mb-1"
                onClick={() => {
                  setDate(getFirstTeachingDate(solution));
                }}
              >
                Go to first teaching day
              </button>
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm my-1 dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Start time {defaultTimeslotList[startTimeslotIndex]}
                </button>
                <ul
                  className="dropdown-menu overflow-auto"
                  aria-labelledby="dropdownMenuButton1"
                  style={{ maxHeight: "300px" }}
                >
                  {defaultTimeslotList.map((timeslot) => (
                    <li>
                      <button
                        className="dropdown-item "
                        onClick={() => {
                          handleOnclickStart(timeslot);
                        }}
                      >
                        <small>{timeslot}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm my-1 dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  End time {defaultTimeslotList[endTimeslotIndex]}
                </button>
                <ul
                  className="dropdown-menu overflow-auto"
                  aria-labelledby="dropdownMenuButton1"
                  style={{ maxHeight: "300px" }}
                >
                  {defaultTimeslotList.map((timeslot) => (
                    <li>
                      <button
                        className="dropdown-item "
                        onClick={() => {
                          handleOnclickEnd(timeslot);
                        }}
                      >
                        <small>{timeslot}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mb-1"
                onClick={() => {
                  setDate(getFirstTeachingDate(solution));
                  setTimeSlotList(getTimeslotList());
                  setStartTimeslotIndex(0);
                  setEndTimeslotIndex(defaultTimeslotList.length - 1);
                }}
              >
                Default settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DatePicker;
