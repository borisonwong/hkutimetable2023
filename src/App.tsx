// @ts-nocheck
import { ChangeEvent, useState } from "react";
import TextInput from "./components/TextInput";
// import { data } from "./CourseInfo";
//  Ignore this line
//  Updated 2024
import Table from "./components/Table";
import OptionTable from "./components/OptionTable";
import SolutionContainer from "./components/SolutionContainer";
import TimeTable from "./components/TimeTable";
import { render } from "react-dom";

function SHA1(msg) {
  function rotate_left(n, s) {
    var t4 = (n << s) | (n >>> (32 - s));

    return t4;
  }

  function lsb_hex(val) {
    var str = "";
    var i;
    var vh;
    var vl;
    for (i = 0; i <= 6; i += 2) {
      vh = (val >>> (i * 4 + 4)) & 0x0f;
      vl = (val >>> (i * 4)) & 0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  }

  function cvt_hex(val) {
    var str = "";
    var i;
    var v;
    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xefcdab89;
  var H2 = 0x98badcfe;
  var H3 = 0x10325476;
  var H4 = 0xc3d2e1f0;
  var A, B, C, D, E;
  var temp;
  msg = Utf8Encode(msg);
  var msg_len = msg.length;
  var word_array = new Array();
  for (i = 0; i < msg_len - 3; i += 4) {
    j =
      (msg.charCodeAt(i) << 24) |
      (msg.charCodeAt(i + 1) << 16) |
      (msg.charCodeAt(i + 2) << 8) |
      msg.charCodeAt(i + 3);
    word_array.push(j);
  }
  switch (msg_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (msg.charCodeAt(msg_len - 1) << 24) | 0x0800000;
      break;
    case 2:
      i =
        (msg.charCodeAt(msg_len - 2) << 24) |
        (msg.charCodeAt(msg_len - 1) << 16) |
        0x08000;
      break;

    case 3:
      i =
        (msg.charCodeAt(msg_len - 3) << 24) |
        (msg.charCodeAt(msg_len - 2) << 16) |
        (msg.charCodeAt(msg_len - 1) << 8) |
        0x80;
      break;
  }

  word_array.push(i);
  while (word_array.length % 16 != 14) word_array.push(0);
  word_array.push(msg_len >>> 29);
  word_array.push((msg_len << 3) & 0x0ffffffff);
  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
    for (i = 16; i <= 79; i++)
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for (i = 0; i <= 19; i++) {
      temp =
        (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 20; i <= 39; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp =
        (rotate_left(A, 5) +
          ((B & C) | (B & D) | (C & D)) +
          E +
          W[i] +
          0x8f1bbcdc) &
        0x0ffffffff;

      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  var temp =
    cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
}

const color_choice = [
  "#D3F8E2",
  "#E4C1F9",
  "#F694C1",
  "#EDE7B1",
  "#A9DEF9",
  "#F5F6F6",
  "#E8D8CD",
  "#DBB19C",
  "#D49173",
  "#AED1D5",
];

function get_random_seq(num) {
  let output_seq = [];
  let choice_set = color_choice.slice();
  for (var iter = 0; iter < num; iter++) {
    if (choice_set.length == 0) {
      choice_set = color_choice.slice();
    }
    const gen_index = Math.floor(Math.random() * choice_set.length);
    output_seq.push(choice_set[gen_index]);
    choice_set.splice(gen_index, 1);
  }
  return output_seq;
}
function get_combinations(arr_in) {
  let result = [];
  for (var i = 0; i < arr_in.length; i += 1) {
    for (var j = i + 1; j < arr_in.length; j += 1) {
      result.push([arr_in[i], arr_in[j]]);
    }
  }
  return result;
}
function get_index_by_course_code(course_dict, course_code) {
  for (var index in course_dict) {
    if (course_dict[index]["COURSE CODE"] == course_code) {
      return index;
    }
  }
}

function get_course_row_list(course_dict, course_code, class_section) {
  const course_index = get_index_by_course_code(course_dict, course_code);
  return course_dict[course_index]["COURSE SECTION DICT"][class_section][
    "COURSE ROW LIST"
  ];
}

function is_time_overlap(start_1, end_1, start_2, end_2) {
  if (
    (start_2 >= start_1 && start_2 < end_1) ||
    (start_1 >= start_2 && start_1 < end_2)
  ) {
    return true;
  } else {
    return false;
  }
}
function is_overlap(time_row_dict_1, time_row_dict_2) {
  let return_bool = false;
  const day_list_1 = time_row_dict_1["RELEVANT WEEKDAYS"];
  const day_list_2 = time_row_dict_2["RELEVANT WEEKDAYS"];
  let start_time_1_list = [];
  for (var i_iter in time_row_dict_1["START TIME"].split(":")) {
    const i = time_row_dict_1["START TIME"].split(":")[i_iter];
    start_time_1_list.push(parseInt(i));
  }
  let start_time_2_list = [];
  for (var i_iter in time_row_dict_2["START TIME"].split(":")) {
    const i = time_row_dict_2["START TIME"].split(":")[i_iter];
    start_time_2_list.push(parseInt(i));
  }
  let end_time_1_list = [];
  for (var i_iter in time_row_dict_1["END TIME"].split(":")) {
    const i = time_row_dict_1["END TIME"].split(":")[i_iter];
    end_time_1_list.push(parseInt(i));
  }
  let end_time_2_list = [];
  for (var i_iter in time_row_dict_2["END TIME"].split(":")) {
    const i = time_row_dict_2["END TIME"].split(":")[i_iter];
    end_time_2_list.push(parseInt(i));
  }
  const start_time_1 = start_time_1_list[0] * 60 + start_time_1_list[1];
  const start_time_2 = start_time_2_list[0] * 60 + start_time_2_list[1];
  const end_time_1 = end_time_1_list[0] * 60 + end_time_1_list[1];
  const end_time_2 = end_time_2_list[0] * 60 + end_time_2_list[1];

  let conflict_date_list = [];
  const end_date_1_list = time_row_dict_1["END DATE"].split("-");
  let time_row_date_list_1 = [];
  const start_1_date = new Date(time_row_dict_1["START DATE"]);
  const end_1_date = new Date(time_row_dict_1["END DATE"]);
  const delta_days_1 =
    Math.abs(end_1_date - start_1_date) / (24 * 60 * 60 * 1000) + 1;
  for (var days_add = 0; days_add < delta_days_1 + 1; days_add++) {
    var tmp_date = new Date(start_1_date);
    tmp_date.setDate(tmp_date.getDate() + days_add);
    if (day_list_1.indexOf(tmp_date.getDay()) >= 0) {
      time_row_date_list_1.push(tmp_date);
    }
  }
  let time_row_date_list_2 = [];
  const start_2_date = new Date(time_row_dict_2["START DATE"]);
  const end_2_date = new Date(time_row_dict_2["END DATE"]);
  const delta_days_2 =
    Math.abs(end_2_date - start_2_date) / (24 * 60 * 60 * 1000) + 1;
  for (var days_add = 0; days_add < delta_days_2 + 1; days_add++) {
    var tmp_date = new Date(start_2_date);
    tmp_date.setDate(tmp_date.getDate() + days_add);
    if (day_list_2.indexOf(tmp_date.getDay()) >= 0) {
      time_row_date_list_2.push(tmp_date);
      var also_in_list_1 = false;
      for (var time_row_date_list_1_iter in time_row_date_list_1) {
        if (
          time_row_date_list_1[time_row_date_list_1_iter].getTime() ==
          tmp_date.getTime()
        ) {
          also_in_list_1 = true;
          break;
        }
      }
      if (also_in_list_1) {
        //  Check if the date in 2 also in list 1
        if (
          is_time_overlap(start_time_1, end_time_1, start_time_2, end_time_2)
        ) {
          const conflict_dict = {
            date: tmp_date,
            course_1: time_row_dict_1["COURSE CODE"],
            course_2: time_row_dict_2["COURSE CODE"],
            course_1_start_time: time_row_dict_1["START TIME"],
            course_2_start_time: time_row_dict_2["START TIME"],
            course_1_end_time: time_row_dict_1["END TIME"],
            course_2_end_time: time_row_dict_2["END TIME"],
          };
          conflict_date_list.push(conflict_dict);
          return_bool = true;
        }
      }
    }
  }
  return [return_bool, conflict_date_list];
}

function is_section_overlap(
  course_dict,
  course_code_1,
  course_section_1,
  course_code_2,
  course_section_2
) {
  let conflict_list_total = [];
  let return_bool = false;
  for (var time_row_1_iterate_index in get_course_row_list(
    course_dict,
    course_code_1,
    course_section_1
  )) {
    const time_row_1_iterate = get_course_row_list(
      course_dict,
      course_code_1,
      course_section_1
    )[time_row_1_iterate_index];
    for (var time_row_2_iterate_index in get_course_row_list(
      course_dict,
      course_code_2,
      course_section_2
    )) {
      const time_row_2_iterate = get_course_row_list(
        course_dict,
        course_code_2,
        course_section_2
      )[time_row_2_iterate_index];
      const [overlap_bool, conflict_list] = is_overlap(
        time_row_1_iterate,
        time_row_2_iterate
      );
      if (overlap_bool) {
        conflict_list_total = conflict_list_total.concat(conflict_list);
        return_bool = true;
      }
    }
  }
  return [return_bool, conflict_list_total];
}
function get_hash_sol(solution_in) {
  let to_hash_str = "";
  for (var iter in solution_in["solution_list"]) {
    to_hash_str +=
      solution_in["solution_list"][iter]["COURSE CODE"] +
      solution_in["solution_list"][iter]["CLASS SECTION"];
  }
  return SHA1(to_hash_str);
}
function is_sol_equal(sol_1, sol_2) {
  const sol_1_list = sol_1["solution_list"];
  const sol_2_list = sol_2["solution_list"];
  for (var i in sol_1_list) {
    if (
      !(
        sol_1_list[i]["COURSE CODE"] == sol_2_list[i]["COURSE CODE"] &&
        sol_1_list[i]["CLASS SECTION"] == sol_2_list[i]["CLASS SECTION"]
      )
    ) {
      return false;
    }
  }
  return true;
}

function App(tot_data) {
  function get_timetable_size_from_solution() {
    if (solutionList.length == 0 && invalidSolutionList.length > 0) {
      return ["col-12 col-sm-12 col-md-12 col-lg-12 my-3", "col-0"];
    } else {
      return [
        "col-12 col-sm-12 col-md-12 col-lg-4 my-3",
        "col-12 col-sm-12 col-md-12 col-lg-8 my-3 overflow-auto",
      ];
    }
  }
  var algorithm_run_count = 0;
  const get_equivalent = (course_code, class_section) => {
    let tmp_list = [];
    const course_index = get_index_by_course_code(
      tot_data["tot_data"],
      course_code
    );
    for (let i_iter in tot_data["tot_data"][course_index][
      "COURSE SECTION DICT"
    ]) {
      if (
        tot_data["tot_data"][course_index]["COURSE SECTION DICT"][i_iter][
          "EQUIVALENT SECTION"
        ] == class_section
      ) {
        if (
          tot_data["tot_data"][course_index]["COURSE SECTION DICT"][i_iter][
            "EQUIVALENT SECTION"
          ] !=
          tot_data["tot_data"][course_index]["COURSE SECTION DICT"][i_iter][
            "CLASS SECTION"
          ]
        ) {
          tmp_list.push(
            tot_data["tot_data"][course_index]["COURSE SECTION DICT"][i_iter][
              "CLASS SECTION"
            ]
          );
        }
      }
    }
    return tmp_list;
  };
  const sortList = (listIn) => {
    listIn.sort((a, b) => (a["COURSE CODE"] > b["COURSE CODE"] ? 1 : -1));
  };
  const sortListGA = (listIn) => {
    listIn.sort((a, b) => (a["num_conflict"] > b["num_conflict"] ? 1 : -1));
  };
  const [showCombinationText, setShowCombinationText] = useState(false);
  function get_random_solution_dict(sem, course_code_list, course_input_list) {
    let solution_dict = { num_conflict: 0, fitness_value: 0 };
    let tmp_list = [];
    for (var j = 0; j < course_code_list.length; j++) {
      const num_choices = course_input_list[j].length;
      const random_choice = Math.floor(Math.random() * num_choices);
      tmp_list.push(course_input_list[j][random_choice]);
    }
    const combination_list = get_combinations(tmp_list);
    solution_dict["conflict_pair_list"] = [];
    solution_dict["solution_list"] = tmp_list;
    for (var pair_iter in combination_list) {
      const pair = combination_list[pair_iter];
      const course_dict = tot_data["tot_data"].slice();
      const [is_overlap_bool, conflict_list] = is_section_overlap(
        course_dict,
        pair[0]["COURSE CODE"],
        pair[0]["CLASS SECTION"],
        pair[1]["COURSE CODE"],
        pair[1]["CLASS SECTION"]
      );
      if (is_overlap_bool) {
        solution_dict["conflict_pair_list"].push(pair);
      }
      solution_dict["num_conflict"] += conflict_list.length;
    }
    if (solution_dict["num_conflict"] == 0) {
      solution_dict["fitness_value"] = 1.5;
    } else {
      solution_dict["fitness_value"] = 1 / solution_dict["num_conflict"];
    }
    solution_dict["sem"] = sem;
    return solution_dict;
  }
  function getInputForGA(
    selected_list,
    fixed_section_list_in,
    sem_1_list,
    sem_2_list
  ) {
    algorithm_run_count += 1;
    const course_dict = tot_data["tot_data"].slice();
    let output_course_list_1 = [];
    let output_course_list_2 = [];
    let output_fixed_section_list = [];
    for (let iter in selected_list) {
      const item = selected_list[iter];
      const code = item["COURSE CODE"];
      var found = false;
      for (var iter_fixed in fixed_section_list_in) {
        const item_fixed = fixed_section_list_in[iter_fixed];
        if (item_fixed.includes(code)) {
          output_fixed_section_list.push(item_fixed.slice(9, 11));
          // output_fixed_section_list.push(item_fixed);
          found = true;
          output_course_list_1.push(item);
          break;
        }
      }
      if (!found) {
        output_course_list_2.push(item);
      }
    }
    var sem = 3;
    if (
      (sem_1_list.length == 0 && sem_2_list.length == 0) ||
      (sem_1_list.length != 0 && sem_2_list.length != 0)
    ) {
      sem = 3;
    } else {
      if (sem_1_list.length == 0) {
        sem = 2;
      }
      if (sem_2_list.length == 0) {
        sem = 1;
      }
    }
    const course_code_list = output_course_list_1.concat(output_course_list_2);
    const fixed_section_list = output_fixed_section_list.slice();
    var course_input_list = [];
    var course_count = 0;
    var generation_req = 0;
    if (sem == 3) {
      generation_req = 15;
    } else {
      generation_req = 10;
    }
    for (let course_code_iter in course_code_list) {
      const course_code = course_code_list[course_code_iter]["COURSE CODE"];
      const course_index = get_index_by_course_code(course_dict, course_code);
      let tmp_list = [];
      if (course_count < fixed_section_list.length) {
        tmp_list.push(
          course_dict[course_index]["COURSE SECTION DICT"][
            fixed_section_list[course_count]
          ]
        );
      } else {
        for (let i_iter in course_dict[course_index]["COURSE SECTION DICT"]) {
          const i = course_dict[course_index]["COURSE SECTION DICT"][i_iter];
          if (
            course_dict[course_index]["COURSE SECTION DICT"][i_iter][
              "EQUIVALENT SECTION"
            ] !=
            course_dict[course_index]["COURSE SECTION DICT"][i_iter][
              "CLASS SECTION"
            ]
          ) {
            continue;
          }
          if (sem == 3) {
            tmp_list.push(
              course_dict[course_index]["COURSE SECTION DICT"][i_iter]
            );
          } else if (
            course_dict[course_index]["COURSE SECTION DICT"][i_iter][
              "CLASS SECTION"
            ].slice(0, 1) == sem.toString()
          ) {
            tmp_list.push(
              course_dict[course_index]["COURSE SECTION DICT"][i_iter]
            );
          }
        }
      }
      course_input_list.push(tmp_list);
      if (tmp_list.length == 0) {
        setSolutionList([]);
        return [];
      }
      course_count += 1;
    }
    if (course_code_list.length == 0) {
      setSolutionList([]);
      return [];
    }
    let solution_list = [];
    for (let i = 0; i < 20; i++) {
      const generated_dict = get_random_solution_dict(
        sem,
        course_code_list,
        course_input_list
      );
      solution_list.push(generated_dict);
    }
    sortListGA(solution_list);
    for (let count = 0; count < generation_req; count++) {
      var solution_choice_list_1 = [];
      for (let i_iter in solution_list.slice(0, 20)) {
        const i = solution_list[i_iter];
        if (solution_choice_list_1.length == 0) {
          solution_choice_list_1.push(i["fitness_value"]);
        } else {
          solution_choice_list_1.push(
            i["fitness_value"] + solution_choice_list_1.slice(-1)[0]
          );
        }
      }
      for (let i = 0; i < solution_choice_list_1.length; i++) {
        solution_choice_list_1[i] =
          solution_choice_list_1[i] / solution_choice_list_1.slice(-1)[0];
        solution_choice_list_1[i] = solution_choice_list_1[i] * 100;
      }
      for (let i = 0; i < 10; i++) {
        const random_1 = Math.random() * 100;
        var index_1 = 0;
        for (let j in solution_choice_list_1) {
          if (random_1 < solution_choice_list_1[j]) {
            index_1 = j;
            break;
          } else if (j == solution_choice_list_1.length - 1) {
            index_1 = j;
          }
        }
        var solution_choice_list_2 = [];
        for (let j = 0; j < 20; j++) {
          if (j == index_1) {
            continue;
          }
          if (solution_choice_list_2.length == 0) {
            solution_choice_list_2.push(solution_list[j]["fitness_value"]);
          } else {
            solution_choice_list_2.push(
              solution_list[j]["fitness_value"] +
                solution_choice_list_2.slice(-1)[0]
            );
          }
        }
        for (let j in solution_choice_list_2) {
          solution_choice_list_2[j] /= solution_choice_list_2.slice(-1)[0];
          solution_choice_list_2[j] *= 100;
        }
        const random_2 = Math.random() * 100;
        var index_2 = 0;
        for (let j in solution_choice_list_2) {
          if (random_2 < solution_choice_list_2[j]) {
            index_2 = j;
          } else if (j == solution_choice_list_2.length - 1) {
            index_2 = j;
          }
        }
        var child_1_dict = {
          num_conflict: 0,
          fitness_value: 0,
        };
        var child_1_list = [];
        var child_2_dict = {
          num_conflict: 0,
          fitness_value: 0,
        };
        var child_2_list = [];
        for (let j in course_input_list) {
          const random_num = Math.floor(Math.random() * 2);
          if (random_num == 0) {
            child_1_list.push(solution_list[index_1]["solution_list"][j]);
            child_2_list.push(solution_list[index_2]["solution_list"][j]);
          } else {
            child_1_list.push(solution_list[index_2]["solution_list"][j]);
            child_2_list.push(solution_list[index_1]["solution_list"][j]);
          }
        }
        const combination_list_1 = get_combinations(child_1_list);
        child_1_dict["conflict_pair_list"] = [];
        child_1_dict["solution_list"] = child_1_list;
        for (var pair_iter in combination_list_1) {
          const pair = combination_list_1[pair_iter];
          const [is_overlap_bool_1, conflict_list_1] = is_section_overlap(
            course_dict,
            pair[0]["COURSE CODE"],
            pair[0]["CLASS SECTION"],
            pair[1]["COURSE CODE"],
            pair[1]["CLASS SECTION"]
          );
          child_1_dict["num_conflict"] += conflict_list_1.length;
          if (is_overlap_bool_1) {
            child_1_dict["conflict_pair_list"].push(pair);
          }
        }
        if (child_1_dict["num_conflict"] == 0) {
          child_1_dict["fitness_value"] = 1.5;
        } else {
          child_1_dict["fitness_value"] = 1 / child_1_dict["num_conflict"];
        }
        const combination_list_2 = get_combinations(child_2_list);
        child_2_dict["solution_list"] = child_2_list;
        child_2_dict["conflict_pair_list"] = [];
        for (var pair_iter in combination_list_2) {
          const pair = combination_list_1[pair_iter];
          const [is_overlap_bool_2, conflict_list_2] = is_section_overlap(
            course_dict,
            pair[0]["COURSE CODE"],
            pair[0]["CLASS SECTION"],
            pair[1]["COURSE CODE"],
            pair[1]["CLASS SECTION"]
          );
          child_2_dict["num_conflict"] += conflict_list_2.length;
          if (is_overlap_bool_2) {
            child_2_dict["conflict_pair_list"].push(pair);
          }
        }
        if (child_2_dict["num_conflict"] == 0) {
          child_2_dict["fitness_value"] = 1.5;
        } else {
          child_2_dict["fitness_value"] = 1 / child_2_dict["num_conflict"];
        }
        child_1_dict["sem"] = sem;
        child_2_dict["sem"] = sem;
        solution_list.push(child_1_dict);
        solution_list.push(child_2_dict);
      }
      sortListGA(solution_list);
      solution_list = solution_list.splice(0, 20);
      // Remove duplicated solutions
      var updated_solution_list = [];
      for (let i in solution_list) {
        let is_duplicate = false;
        if (i < solution_list.length - 1) {
          for (let j = parseInt(i) + 1; j < solution_list.length; j++) {
            if (is_sol_equal(solution_list[i], solution_list[j])) {
              is_duplicate = true;
            }
          }
        }
        if (is_duplicate == false) {
          updated_solution_list.push(solution_list[i]);
        }
      }
      solution_list = updated_solution_list.slice();
      while (solution_list.length < 20) {
        const generated_dict = get_random_solution_dict(
          sem,
          course_code_list,
          course_input_list
        );
        solution_list.push(generated_dict);
      }
    }
    var updated_solution_list = [];
    for (let i in solution_list) {
      let is_duplicate = false;
      if (i < solution_list.length - 1) {
        for (let j = parseInt(i) + 1; j < solution_list.length; j++) {
          if (is_sol_equal(solution_list[i], solution_list[j])) {
            is_duplicate = true;
          }
        }
      }
      if (is_duplicate == false) {
        updated_solution_list.push(solution_list[i]);
        solution_list[i]["sol_hash"] = get_hash_sol(solution_list[i]);
      }
    }
    sortListGA(updated_solution_list);
    let cut_index = -1;
    for (let solution_iter in updated_solution_list) {
      if (parseInt(updated_solution_list[solution_iter]["num_conflict"]) > 0) {
        cut_index = solution_iter;
        break;
      }
    }
    let invalid_solution_list = [];
    const tot_sol_count = updated_solution_list.length;
    if (cut_index > -1) {
      invalid_solution_list = updated_solution_list.slice(
        cut_index,
        tot_sol_count
      );
      updated_solution_list = updated_solution_list.slice(0, cut_index);
    } else {
      updated_solution_list = updated_solution_list.slice();
    }
    for (var iter in updated_solution_list) {
      const solution = updated_solution_list[iter];
      let all_time_row_date_list = [];
      const subclass_list = solution["solution_list"];
      const color_seq = get_random_seq(subclass_list.length);
      for (let subclass_dict_iter in subclass_list) {
        const subclass_dict = subclass_list[subclass_dict_iter];
        for (let course_row_iter in subclass_dict["COURSE ROW LIST"]) {
          const course_row = subclass_dict["COURSE ROW LIST"][course_row_iter];
          const time_row_dict_1 = course_row;
          let return_bool = false;
          const day_list_1 = time_row_dict_1["RELEVANT WEEKDAYS"];
          const start_time_1_list = time_row_dict_1["START TIME"]
            .split(":")
            .map((item) => parseInt(item));
          const end_time_1_list = time_row_dict_1["END TIME"]
            .split(":")
            .map((item) => parseInt(item));
          const start_time_1 = start_time_1_list[0] * 60 + start_time_1_list[1];
          const end_time_1 = end_time_1_list[0] * 60 + end_time_1_list[1];
          const start_date_1_list = time_row_dict_1["START DATE"]
            .split("-")
            .map((item) => parseInt(item));
          const end_date_1_list = time_row_dict_1["END DATE"]
            .split("-")
            .map((item) => parseInt(item));
          const start_1_date = new Date(
            start_date_1_list[2],
            start_date_1_list[1] - 1,
            start_date_1_list[0]
          );
          const end_1_date = new Date(
            end_date_1_list[2],
            end_date_1_list[1] - 1,
            end_date_1_list[0]
          );
          const delta_days_1 =
            (end_1_date.getTime() - start_1_date.getTime()) /
            (1000 * 24 * 3600);
          for (let days_add = 0; days_add < delta_days_1 + 1; days_add++) {
            var tmp_date = new Date(start_1_date);
            tmp_date.setDate(tmp_date.getDate() + days_add);
            if (day_list_1.indexOf(tmp_date.getDay()) >= 0) {
              let datetime_dict = {
                DATE: tmp_date,
                "COURSE CODE": time_row_dict_1["COURSE CODE"],
                "CLASS SECTION": time_row_dict_1["CLASS SECTION"],
                "START TIME": start_time_1,
                "END TIME": end_time_1,
                VENUE: time_row_dict_1["VENUE"],
                COLOR: color_seq[subclass_dict_iter],
              };
              all_time_row_date_list.push(datetime_dict);            }
          }
        }
      }
      solution["ALL TIME ROW DATE"] = all_time_row_date_list;
    }
    solution_list = updated_solution_list.slice();
    setSolutionList(solution_list);
    setInvalidSolutionList(invalid_solution_list.slice());
  }
  const useful_tot_data = tot_data["tot_data"];
  sortList(useful_tot_data);
  const [codeSearch, setCodeSearch] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [showList, setShowList] = useState(useful_tot_data);
  const [selectedList, setSelectedList] = useState([]);
  const [solutionList, setSolutionList] = useState([]);
  const [invalidSolutionList, setInvalidSolutionList] = useState([]);
  const [solSelected, setSolutionSelected] = useState(-1);
  const handleCodeSearch = (event: ChangeEvent) =>
    setCodeSearch(event.target.value);
  const handleTitleSearch = (event: ChangeEvent) =>
    setTitleSearch(event.target.value);
  const handleToggleSolution = (sol_num) => {
    if (sol_num == solSelected) {
      setSolutionSelected(-1);
    } else {
      setSolutionSelected(sol_num);
    }
  };
  const checkSelectedSolution = (sol_num) => {
    if (sol_num + 1 == solSelected) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <div className="container mx-auto my-auto py-4">
        <div className="row">
          <div className="card">
            <div className="card-body">
              <h1 className="display-6">HKU Timetable Planner</h1>
              <p className="justify">
                Welcome to this web app. To start with, search for for the
                courses and click to add them. Play with the switches to specify
                the semester for each course. You may also select a specific
                subclass for each semester. The app will automatically search
                for combinations in the whole year if you do not specify or
                courses from both semesters are selected. Meanwhile, please pay
                attention to the followings:
              </p>
              <ul>
                <li>The app generates at most 20 solutions.</li>
                <li>
                  It may take up to 20 seconds to generate the results, please
                  be patient. If your browser says the app is not responding,
                  select continue and wait.
                </li>
                <li>
                  The algorithm will not generate all possible combinations.
                  Also, each time you may obtain different results.
                </li>
                <li>
                  Whole year courses and summer semester courses are not
                  supported at the moment.
                </li>
                <li>
                  Courses with extraordinary course codes/subclass codes are
                  currently not supported.
                </li>
                <li>
                  The database is developed base on 2024/25 course timetable. (Last update: 2024-07-23)
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h1 className="display-6">Browse Courses</h1>
            <TextInput
              onChange={handleCodeSearch}
              placeholder="Course code"
              icon="#"
            ></TextInput>
            <TextInput
              onChange={handleTitleSearch}
              placeholder="Course title"
              icon="T"
            ></TextInput>
            <Table
              data_in={showList.filter((item) => {
                return codeSearch === "" && titleSearch === ""
                  ? item
                  : item["COURSE CODE"]
                      .toLowerCase()
                      .includes(codeSearch.toLowerCase()) &&
                      item["COURSE TITLE"]
                        .toLowerCase()
                        .includes(titleSearch.toLowerCase());
              })}
              header_in={["Course Code", "Course Title"]}
              onClick={(item_in: string) => {
                var sh_list = [...showList];
                var sel_list = [...selectedList];
                const pos_index = sh_list.findIndex(
                  (item) => item["COURSE CODE"] == item_in
                );
                const chosen_item = sh_list[pos_index];
                sel_list = [...sel_list, chosen_item];
                sortList(sel_list);
                setSelectedList(sel_list);
                sh_list.splice(pos_index, 1);
                sortList(sh_list);
                setShowList(sh_list);
              }}
              showMax={5}
            ></Table>
          </div>
          <div className="col">
            <h1 className="display-6">Course Selected</h1>
            <OptionTable
              data_in={selectedList}
              header_in={["Course Code", "Course Title", "S1", "S2", "Remove"]}
              showMax={10}
              onClick={(item_in: string) => {
                var sh_list = [...showList];
                var sel_list = [...selectedList];
                const pos_index = sel_list.findIndex(
                  (item) => item["COURSE CODE"] == item_in
                );
                const chosen_item = sel_list[pos_index];
                sh_list = [...sh_list, chosen_item];
                sortList(sh_list);
                setShowList(sh_list);
                sel_list.splice(pos_index, 1);
                sortList(sel_list);
                setSelectedList(sel_list);
              }}
              onClickRunGA={(a, b, c, d) => {
                setSolutionSelected(-1);
                setShowCombinationText(false);
                getInputForGA(a, b, c, d);
                setShowCombinationText(true);
              }}
            ></OptionTable>
          </div>
        </div>
        <div className="row my-3">
          <div className={get_timetable_size_from_solution()[0]}>
            <SolutionContainer
              solution_list={solutionList}
              invalid_solution_list={invalidSolutionList}
              equivalent_getter={get_equivalent}
              sol_onClick={handleToggleSolution}
              sol_checkSelect={checkSelectedSolution}
              sol_noneSelected={solSelected == -1}
              sol_hashfunction={SHA1}
            ></SolutionContainer>
          </div>
          <div className={get_timetable_size_from_solution()[1]}>
            {solSelected >= 0 && (
              <TimeTable
                equivalent_getter={get_equivalent}
                solution={solutionList[solSelected - 1]}
                is_time_overlap={is_time_overlap}
                sol_num={solSelected}
                hash_func={SHA1}
              ></TimeTable>
            )}
          </div>
        </div>
      </div>
      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.025)" }}
      >
        Last update: 23rd July 2024. Version 1.0.
      </div>
    </>
  );
}

export default App;
