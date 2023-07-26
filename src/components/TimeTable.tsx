// @ts-nocheck
import React from "react";
import { ChangeEvent, useState } from "react";

const TimeTable = ({ solution, is_time_overlap }) => {
  const all_time_row_date_list = solution["ALL TIME ROW DATE"];
  var earliest_date = new Date();
  for (var time_row_iter in solution["ALL TIME ROW DATE"]) {
    const time_row = solution["ALL TIME ROW DATE"][time_row_iter];
    if (time_row_iter == 0) {
      earliest_date = new Date(time_row["DATE"]);
    } else if (time_row["DATE"].getTime() < earliest_date.getTime()) {
      earliest_date = new Date(time_row["DATE"]);
    }
  }
  function getTimePeriodFromNum(num_start, num_end) {
    const hour_start = Math.floor(num_start / 60);
    const min_start = num_start - hour_start * 60;
    const hour_end = Math.floor(num_end / 60);
    const min_end = num_end - hour_end * 60;
    return (
      hour_start.toString() +
      ":" +
      min_start.toString() +
      " - " +
      hour_end.toString() +
      ":" +
      min_end.toString()
    );
  }
  function getCellDisplay(start_date, delta_day, time_range_str) {
    var check_date = new Date(start_date);
    check_date.setDate(check_date.getDate() + delta_day);
    // console.log(check_date);
    const table_start_time =
      parseInt(time_range_str.split("-")[0].trim().split(":")[0]) * 60 +
      parseInt(time_range_str.split("-")[0].trim().split(":")[1]);
    const table_end_time = table_start_time + 30;
    for (var k_iter in all_time_row_date_list) {
      const k = all_time_row_date_list[k_iter];
      const is_overlap = is_time_overlap(
        table_start_time,
        table_end_time,
        k["START TIME"],
        k["END TIME"]
      );
      const is_prev_overlap = is_time_overlap(
        table_start_time - 30,
        table_end_time - 30,
        k["START TIME"],
        k["END TIME"]
      );
      if (
        k["DATE"].getTime() == check_date.getTime() &&
        is_overlap &&
        !is_prev_overlap
      ) {
        return [
          k["COURSE CODE"] + "-" + k["CLASS SECTION"],
          k["COLOR"],
          getTimePeriodFromNum(k["START TIME"], k["END TIME"]),
        ];
      }
    }
    return "";
  }
  function getRowSpan(start_date, delta_day, time_range_str) {
    var check_date = new Date(start_date);
    check_date.setDate(check_date.getDate() + delta_day);
    // console.log(check_date);
    const table_start_time =
      parseInt(time_range_str.split("-")[0].trim().split(":")[0]) * 60 +
      parseInt(time_range_str.split("-")[0].trim().split(":")[1]);
    const table_end_time = table_start_time + 30;
    for (var k_iter in all_time_row_date_list) {
      const k = all_time_row_date_list[k_iter];
      const is_overlap = is_time_overlap(
        table_start_time,
        table_end_time,
        k["START TIME"],
        k["END TIME"]
      );
      const is_prev_overlap = is_time_overlap(
        table_start_time - 30,
        table_end_time - 30,
        k["START TIME"],
        k["END TIME"]
      );
      if (
        k["DATE"].getTime() == check_date.getTime() &&
        is_overlap &&
        !is_prev_overlap
      ) {
        var row_count = 1;
        var is_after_overlap = true;
        while (is_after_overlap) {
          is_after_overlap = is_time_overlap(
            table_start_time + row_count * 30,
            table_end_time + row_count * 30,
            k["START TIME"],
            k["END TIME"]
          );
          if (is_after_overlap) {
            row_count++;
          }
        }
        return row_count;
      }
    }
    return 1;
  }
  function getNeedDisplay(start_date, delta_day, time_range_str) {
    var check_date = new Date(start_date);
    check_date.setDate(check_date.getDate() + delta_day);
    // console.log(check_date);
    const table_start_time =
      parseInt(time_range_str.split("-")[0].trim().split(":")[0]) * 60 +
      parseInt(time_range_str.split("-")[0].trim().split(":")[1]);
    const table_end_time = table_start_time + 30;
    for (var k_iter in all_time_row_date_list) {
      const k = all_time_row_date_list[k_iter];
      const is_overlap = is_time_overlap(
        table_start_time,
        table_end_time,
        k["START TIME"],
        k["END TIME"]
      );
      const is_prev_overlap = is_time_overlap(
        table_start_time - 30,
        table_end_time - 30,
        k["START TIME"],
        k["END TIME"]
      );
      if (
        k["DATE"].getTime() == check_date.getTime() &&
        is_overlap &&
        is_prev_overlap
      ) {
        return false;
      }
    }
    return true;
  }
  function getDateDisplay(date_in, pos) {
    const day = date_in.getDay();
    var start_date = new Date(date_in);
    start_date.setDate(startDate.getDate() - day);
    var check_date = new Date(start_date);
    check_date.setDate(start_date.getDate() + pos);
    return check_date.toLocaleDateString("en-UK");
  }
  const today = new Date(earliest_date);
  var init_startDate = new Date(today);
  const init_day = init_startDate.getDay();
  init_startDate.setDate(init_startDate.getDate() - init_day);
  const [searchDate, setSearchDate] = useState(today);
  const [inputYear, setInputYear] = useState();
  const [inputMonth, setInputMonth] = useState();
  const [inputDay, setInputDay] = useState();
  const [startDate, setStartDate] = useState(init_startDate);
  function updateStartDate(newDate) {
    const day = newDate.getDay();
    var startDate = new Date(newDate);
    startDate.setDate(startDate.getDate() - day);
    setStartDate(startDate);
  }
  const handleDayChange = (event: ChangeEvent) => {
    setInputDay(event.target.value);
    const newDate = new Date(
      parseInt(inputYear),
      parseInt(inputMonth) - 1,
      parseInt(event.target.value)
    );
    if (!isNaN(newDate.getTime())) {
      setSearchDate(newDate);
      updateStartDate(newDate);
    }
  };
  const handleMonthChange = (event: ChangeEvent) => {
    setInputMonth(event.target.value);
    const newDate = new Date(
      parseInt(inputYear),
      parseInt(event.target.value) - 1,
      parseInt(inputDay)
    );
    if (!isNaN(newDate.getTime())) {
      setSearchDate(newDate);
      updateStartDate(newDate);
    }
  };
  const handleYearChange = (event: ChangeEvent) => {
    setInputYear(event.target.value);
    const newDate = new Date(
      parseInt(event.target.value),
      parseInt(inputMonth) - 1,
      parseInt(inputDay)
    );
    if (!isNaN(newDate.getTime())) {
      setSearchDate(newDate);
      updateStartDate(newDate);
    }
  };
  const handleWeekChange = (direction) => {
    if (direction == "left") {
      var new_startDate = new Date(startDate);
      new_startDate.setDate(startDate.getDate() - 7);
      setStartDate(new_startDate);
    } else {
      var new_startDate = new Date(startDate);
      new_startDate.setDate(startDate.getDate() + 7);
      setStartDate(new_startDate);
    }
  };
  const day_list = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let time_list = [];
  for (let time_iter = 8; time_iter < 22; time_iter++) {
    time_list.push(
      time_iter.toString() +
        ":" +
        "00" +
        " - " +
        time_iter.toString() +
        ":" +
        "30"
    );
    time_list.push(
      time_iter.toString() +
        ":" +
        "30" +
        " - " +
        (time_iter + 1).toString() +
        ":" +
        "00"
    );
  }
  return (
    <div>
      <div className="input-group mb-3">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={(event) => handleWeekChange("left")}
        >
          <i className="bi bi-arrow-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
          </i>
        </button>
        <span className="input-group-text">Y</span>
        <input
          type="text"
          className="form-control"
          placeholder="Year"
          aria-label="Username"
          onChange={handleYearChange}
        />
        <span className="input-group-text">M</span>
        <input
          type="text"
          className="form-control"
          placeholder="Month"
          aria-label="Server"
          onChange={handleMonthChange}
        />
        <span className="input-group-text">D</span>
        <input
          type="text"
          className="form-control"
          placeholder="Date"
          aria-label="Server"
          onChange={handleDayChange}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={(event) => handleWeekChange("right")}
        >
          <i className="bi bi-arrow-right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </i>
        </button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr style={{ backgroundColor: "#f7f7f7" }}>
            <th style={{ width: "16%" }} className="align-middle">
              Time
            </th>
            {day_list.map((item, index) => (
              <th style={{ width: "12%" }} className="align-middle text-center">
                {item}
                <br />
                {getDateDisplay(startDate, index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {time_list.map((item_time) => (
            <tr>
              <td style={{ width: "16%" }}>{item_time}</td>
              {day_list.map((item, index) => {
                if (getNeedDisplay(startDate, index, item_time)) {
                  let add_to_class = "";
                  const returnFromCellDisplay = getCellDisplay(
                    startDate,
                    index,
                    item_time
                  );
                  const text = returnFromCellDisplay[0];
                  const time_text = returnFromCellDisplay[2];
                  return (
                    <td
                      rowSpan={getRowSpan(startDate, index, item_time)}
                      style={{
                        width: "12%",
                        backgroundColor: returnFromCellDisplay[1],
                      }}
                      className={"align-middle text-center " + add_to_class}
                    >
                      {text}
                      <br />
                      {time_text}
                    </td>
                  );
                } else {
                  return <></>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
