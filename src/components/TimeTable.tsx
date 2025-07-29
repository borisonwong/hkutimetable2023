// @ts-nocheck
import React from "react";
import { ChangeEvent, useState } from "react";
import "../App.css";

const TimeTable = ({
  solution,
  is_time_overlap,
  equivalent_getter,
  sol_num,
  hash_func,
}) => {
  const all_time_row_date_list = solution["ALL TIME ROW DATE"];
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
  const [startTimetableIndex, setStartTimetableIndex] = useState(0);
  const [endTimetableIndex, setEndTimetableIndex] = useState(
    time_list.length - 1
  );

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

    const padding0 = (n: number): string =>
      n < 10 ? '0' + n : String(n);
    return (
      padding0(hour_start) +
      ":" +
      padding0(min_start) +
      " - " +
      padding0(hour_end) +
      ":" +
      padding0(min_end)
    );
  }
  function getCellDisplay(start_date, delta_day, time_range_str) {
    var check_date = new Date(start_date);
    check_date.setDate(check_date.getDate() + delta_day);
    const table_start_time =
      parseInt(time_range_str.split("-")[0].trim().split(":")[0]) * 60 +
      parseInt(time_range_str.split("-")[0].trim().split(":")[1]);
    const table_end_time = table_start_time + 30;
    const current_timeslot_index = (table_start_time / 60 - 8) * 2;
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
        (!is_prev_overlap ||
          (is_prev_overlap && current_timeslot_index == startTimetableIndex))
      ) {
        const equiv_subclass = equivalent_getter(
          k["COURSE CODE"],
          k["CLASS SECTION"]
        );
        let equiv_subclass_text = "";
        for (var equiv_subclass_iter in equiv_subclass) {
          equiv_subclass_text += "/" + equiv_subclass[equiv_subclass_iter];
        }
        return [
          k["COURSE CODE"] + "-" + k["CLASS SECTION"] + equiv_subclass_text,
          k["COLOR"],
          getTimePeriodFromNum(k["START TIME"], k["END TIME"]),
          k["VENUE"],
        ];
      }
    }
    return "";
  }
  function getRowSpan(start_date, delta_day, time_range_str) {
    var check_date = new Date(start_date);
    check_date.setDate(check_date.getDate() + delta_day);
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
      const current_timeslot_index = (table_start_time / 60 - 8) * 2;
      if (k["DATE"].getTime() == check_date.getTime() && is_overlap) {
        var row_count = 1;
        var iter_timeslot_index = current_timeslot_index;
        var is_after_overlap = true;
        while (is_after_overlap && iter_timeslot_index < endTimetableIndex) {
          is_after_overlap = is_time_overlap(
            table_start_time + row_count * 30,
            table_end_time + row_count * 30,
            k["START TIME"],
            k["END TIME"]
          );
          if (is_after_overlap) {
            row_count++;
          }
          iter_timeslot_index++;
        }
        return row_count;
      }
    }
    return 1;
  }
  function getNeedDisplay(start_date, delta_day, time_range_str) {
    var check_date = new Date(start_date);
    check_date.setDate(check_date.getDate() + delta_day);
    const table_start_time =
      parseInt(time_range_str.split("-")[0].trim().split(":")[0]) * 60 +
      parseInt(time_range_str.split("-")[0].trim().split(":")[1]);
    const table_end_time = table_start_time + 30;
    const current_timeslot_index = (table_start_time / 60 - 8) * 2;
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
        is_prev_overlap &&
        current_timeslot_index != startTimetableIndex
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
  return (
    <div>
      <h5 className="display-6">Timetable for solution {sol_num}</h5>
      <div className="container-fluid px-0 d-flex">
        <div className="input-group mb-3">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={(event) => handleWeekChange("left")}
          >
            {<>{"<<" + " Previous week"}</>}
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
            {<>{"Next week " + ">>"}</>}
          </button>
        </div>
      </div>
      <div className="container-fluid px-0 d-flex">
        <div className="input-group mb-3">
          <span className="input-group-text">Showing timetable from</span>
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {time_list[startTimetableIndex]}
          </button>
          <ul
            className="dropdown-menu overflow-auto"
            style={{ height: "200px" }}
          >
            {time_list.map((item, index) => {
              if (index < endTimetableIndex) {
                return (
                  <li key={hash_func("start" + item)}>
                    <button
                      className="dropdown-item"
                      onClick={() => setStartTimetableIndex(index)}
                      // href="#"
                    >
                      {item}
                    </button>
                  </li>
                );
              }
            })}
          </ul>
          <span className="input-group-text">to</span>
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {time_list[endTimetableIndex]}
          </button>
          <ul
            className="dropdown-menu overflow-auto"
            style={{ height: "200px" }}
          >
            {time_list.map((item, index) => {
              if (index > startTimetableIndex) {
                return (
                  <li key={hash_func("end" + item)}>
                    <button
                      className="dropdown-item"
                      onClick={() => setEndTimetableIndex(index)}
                      // href="#"
                    >
                      {item}
                    </button>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
      <table className="table table-bordered  fs-6 table-sm timetable">
        <thead>
          <tr style={{ backgroundColor: "#f7f7f7" }} className="timetable-row">
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
          {time_list.map((item_time, index) => {
            if (index >= startTimetableIndex && index <= endTimetableIndex) {
              return (
                <tr className="timetable-row">
                  <td
                    style={{ width: "16%", whiteSpace: "nowrap" }}
                    className="align-middle timetable-cell"
                  >
                    {item_time}
                  </td>
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
                      const venue_text = returnFromCellDisplay[3];
                      return (
                        <td
                          rowSpan={getRowSpan(startDate, index, item_time)}
                          style={{
                            width: "12%",
                            backgroundColor: returnFromCellDisplay[1],
                          }}
                          className={
                            "align-middle text-center timetable-cell" +
                            add_to_class
                          }
                        >
                          {text}
                          {returnFromCellDisplay != "" ? <br /> : <></>}
                          {time_text}
                          {returnFromCellDisplay != "" ? <br /> : <></>}
                          {venue_text}
                        </td>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </tr>
              );
            } else {
              return <></>;
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
