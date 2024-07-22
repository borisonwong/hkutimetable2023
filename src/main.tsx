import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import { data } from "./2024-25_class_timetable_20240722";

function is_same_timeslot(timeslot_1, timeslot_2) {
  const checklist = [
    "COURSE CODE",
    "START DATE",
    "END DATE",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
    "START TIME",
    "END TIME",
  ];
  for (var i = 0; i < checklist.length; i++) {
    const keyCheck = checklist[i];
    if (timeslot_1[keyCheck] !== timeslot_2[keyCheck]) {
      return false;
    }
  }
  return true;
}

var course_section_list = [];
var course_dict = {};
var course_list = [];

function initialize() {
  for (var i = 0; i < data.length; i++) {
    var course_row_iterate = data[i];
    let tmp_list_weekday = [];
    if (course_row_iterate["MON"] == "MON") {
      tmp_list_weekday.push(1);
    }
    if (course_row_iterate["TUE"] == "TUE") {
      tmp_list_weekday.push(2);
    }
    if (course_row_iterate["WED"] == "WED") {
      tmp_list_weekday.push(3);
    }
    if (course_row_iterate["THU"] == "THU") {
      tmp_list_weekday.push(4);
    }
    if (course_row_iterate["FRI"] == "FRI") {
      tmp_list_weekday.push(5);
    }
    if (course_row_iterate["SAT"] == "SAT") {
      tmp_list_weekday.push(6);
    }
    if (course_row_iterate["SUN"] == "SUN") {
      tmp_list_weekday.push(0);
    }
    course_row_iterate["RELEVANT WEEKDAYS"] = tmp_list_weekday;
    var found = false;
    for (var j = 0; j < course_section_list.length; j++) {
      const course_section_iterate = course_section_list[j];
      if (
        course_row_iterate["COURSE CODE"] ===
          course_section_iterate["COURSE CODE"] &&
        course_row_iterate["CLASS SECTION"] ===
          course_section_iterate["CLASS SECTION"]
      ) {
        course_section_iterate["COURSE ROW LIST"].push(course_row_iterate);
        found = true;
        break;
      }
    }
    if (found === false) {
      const tmp_course_section_dict = {};
      tmp_course_section_dict["COURSE CODE"] =
        course_row_iterate["COURSE CODE"];
      tmp_course_section_dict["COURSE TITLE"] =
        course_row_iterate["COURSE TITLE"];
      tmp_course_section_dict["CLASS SECTION"] =
        course_row_iterate["CLASS SECTION"];
      tmp_course_section_dict["COURSE ROW LIST"] = [course_row_iterate];
      course_section_list.push(tmp_course_section_dict);
    }
  }
  for (var i = 0; i < course_section_list.length; i++) {
    const course_section_iterate = course_section_list[i];
    var found = false;
    for (var course_index_iterate in course_dict) {
      if (course_section_iterate["COURSE CODE"] == course_index_iterate) {
        var total_same_timeslot = false;
        for (const [previous_course_section_iterate, value] of Object.entries(
          course_dict[course_index_iterate]["COURSE SECTION DICT"]
        )) {
          if (
            course_dict[course_index_iterate]["COURSE SECTION DICT"][
              previous_course_section_iterate
            ]["EQUIVALENT SECTION"] !=
            course_dict[course_index_iterate]["COURSE SECTION DICT"][
              previous_course_section_iterate
            ]["CLASS SECTION"]
          ) {
            continue;
          }
          var same_timeslot_bool = true;
          if (
            course_dict[course_index_iterate]["COURSE SECTION DICT"][
              previous_course_section_iterate
            ]["COURSE ROW LIST"].length ==
            course_section_iterate["COURSE ROW LIST"].length
          ) {
            // if (course_index_iterate == "CENG9001") {
            //   console.log(course_section_iterate);
            // }
            const iterMax =
              course_dict[course_index_iterate]["COURSE SECTION DICT"][
                previous_course_section_iterate
              ]["COURSE ROW LIST"].length;
            // if (course_index_iterate == "CENG9001") {
            //   console.log(iterMax);
            // }
            for (
              var course_row_iterate_index = 0;
              course_row_iterate_index < iterMax;
              course_row_iterate_index++
            ) {
              if (
                is_same_timeslot(
                  course_dict[course_index_iterate]["COURSE SECTION DICT"][
                    previous_course_section_iterate
                  ]["COURSE ROW LIST"][course_row_iterate_index],
                  course_section_iterate["COURSE ROW LIST"][
                    course_row_iterate_index
                  ]
                ) == false
              ) {
                same_timeslot_bool = false;
                break;
              }
            }
          } else {
            same_timeslot_bool = false;
          }
          if (same_timeslot_bool) {
            course_section_iterate["EQUIVALENT SECTION"] =
              course_dict[course_index_iterate]["COURSE SECTION DICT"][
                previous_course_section_iterate
              ]["CLASS SECTION"];
            total_same_timeslot = true;
            break;
          }
        }
        if (total_same_timeslot == false) {
          course_section_iterate["EQUIVALENT SECTION"] =
            course_section_iterate["CLASS SECTION"];
        }
        course_dict[course_index_iterate]["COURSE SECTION DICT"][
          course_section_iterate["CLASS SECTION"]
        ] = course_section_iterate;
        found = true;
        break;
      }
    }
    if (found == false) {
      const tmp_course_dict = {};
      tmp_course_dict["COURSE CODE"] = course_section_iterate["COURSE CODE"];
      tmp_course_dict["COURSE TITLE"] = course_section_iterate["COURSE TITLE"];
      course_section_iterate["EQUIVALENT SECTION"] =
        course_section_iterate["CLASS SECTION"];
      const tmp_class_section_dict = {};
      tmp_class_section_dict[course_section_iterate["CLASS SECTION"]] =
        course_section_iterate;
      tmp_course_dict["COURSE SECTION DICT"] = tmp_class_section_dict;
      course_dict[course_section_iterate["COURSE CODE"]] = tmp_course_dict;
    }
  }
  for (const [key, value] of Object.entries(course_dict)) {
    course_list.push(value);
  }
}
initialize();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App tot_data={course_list} />
  </React.StrictMode>
);
