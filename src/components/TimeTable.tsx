// @ts-nocheck
import React from "react";
import { ChangeEvent, useState } from "react";
import "../App.css";

const weekdayList = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const colorCodeList = [
  "#F0EBE3",
  "#BED7DC",
  "#D6DAC8",
  "#F1EAFF",
  "#F3D0D7",
  "#CDFADB",
  "#FFEFEF",
  "#F3FDE8",
];

const getDateDisplayText = (dateIn: Date) => {
  // Here startDate must be Sunday
  return (
    dateIn.getDate().toString().padStart(2, 0) +
    "-" +
    (dateIn.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    dateIn.getFullYear()
  );
};

const getDateList = (anyDate: Date) => {
  let dateList = [];
  const startDate = new Date(anyDate);
  const deltaDays = anyDate.getDay();
  startDate.setDate(startDate.getDate() - deltaDays);
  for (let i = 0; i < 7; i++) {
    const iterDate = new Date(startDate);
    iterDate.setDate(iterDate.getDate() + i);
    dateList.push(iterDate);
  }
  return dateList;
};

const getEndTime = (startTime: string) => {
  const stringArray = startTime.split(":");
  const hr = parseInt(stringArray[0]);
  const min = parseInt(stringArray[1]);
  if (min == 30) {
    return (hr + 1).toString().padStart(2, 0) + ":00";
  } else {
    return hr.toString().padStart(2, 0) + ":30";
  }
};

const getAllTimetableEntryList = (solution) => {
  let returnList = [];
  for (let i = 0; i < Object.keys(solution["sol"]).length; i++) {
    const courseSameSection = solution["sol"][Object.keys(solution["sol"])[i]];
    const timeList = courseSameSection[Object.keys(courseSameSection)[0]];
    for (let j = 0; j < timeList.length; j++) {
      returnList.push(timeList[j]);
    }
  }
  return returnList;
};

const getDateTime = (dateIn: Date, timeString: string) => {
  const date = dateIn.getDate();
  const mon = dateIn.getMonth();
  const yr = dateIn.getFullYear();
  //  timeString format hh:mm
  const timeStringList = timeString.split(":");
  const hr = parseInt(timeStringList[0]);
  const min = parseInt(timeStringList[1]);
  return new Date(yr, mon, date, hr, min);
};

const getDateString = (dateString: string) => {
  const dateStringList = dateString.split("-");
  const date = parseInt(dateStringList[2]);
  const mon = parseInt(dateStringList[1] - 1);
  const yr = parseInt(dateStringList[0]);
  return new Date(yr, mon, date);
};

const isDateInRange = (start: Date, end: Date, checkDate: Date) => {
  if (checkDate >= start && checkDate <= end) {
    return true;
  } else {
    return false;
  }
};

const getSlotData = (weekDateList, timeSlotList, timetableEntryList) => {
  let returnAllSlotData = {};
  for (let i = 0; i < weekDateList.length; i++) {
    const weekDate = weekDateList[i];
    for (let j = 0; j < timeSlotList.length; j++) {
      const timeSlotStart = timeSlotList[j];
      const startDateTime = getDateTime(weekDate, timeSlotStart);
      const endDateTime = getDateTime(weekDate, getEndTime(timeSlotStart));

      for (let k = 0; k < timetableEntryList.length; k++) {
        const timetableEntry = timetableEntryList[k];
        const entryWeekdayList = timetableEntry
          .slice(7, 14)
          .filter((element) => element != "");
        if (entryWeekdayList.indexOf(weekdayList[weekDate.getDay()]) == -1) {
          //  If current date in iteration does not match weekday requirement, skip this entry
          continue;
        }
        const entryStartDate = getDateString(timetableEntry[5]);
        const entryEndDate = getDateString(timetableEntry[6]);
        if (isDateInRange(entryStartDate, entryEndDate, weekDate) == false) {
          // If current date not in range, skip this entry
          continue;
        }
        const entryStartTimeString = timetableEntry[15];
        const entryEndTimeString = timetableEntry[16];
        const entryStartDateTime = getDateTime(weekDate, entryStartTimeString);
        const entryEndDateTime = getDateTime(weekDate, entryEndTimeString);
        if (
          Math.min(endDateTime, entryEndDateTime) -
            Math.max(startDateTime, entryStartDateTime) >
          0
        ) {
          //  Correct slot
          returnAllSlotData[startDateTime] = timetableEntry;
        }
      }
    }
  }
  return returnAllSlotData;
};

const getRowSpan = (slotData, cellDateTime) => {
  if (Object.keys(slotData).indexOf(cellDateTime.toString()) == -1) {
    return 1;
  } else {
    var iterDate = new Date(cellDateTime);
    var rowCounter = 1;
    while (Object.keys(slotData).indexOf(iterDate.toString()) >= 0) {
      iterDate = new Date(iterDate.getTime() + 30 * 60 * 1000);
      if (slotData[iterDate.toString()] != slotData[cellDateTime.toString()]) {
        break;
      }
      rowCounter += 1;
    }
    return rowCounter;
  }
};

const isCellShow = (slotData, cellDateTime) => {
  if (Object.keys(slotData).indexOf(cellDateTime.toString()) == -1) {
    return true;
  } else {
    var previousDateTime = new Date(cellDateTime - 30 * 60 * 1000);
    if (Object.keys(slotData).indexOf(previousDateTime.toString()) == -1) {
      return true;
    }
    if (
      slotData[cellDateTime.toString()] == slotData[previousDateTime.toString()]
    ) {
      return false;
    } else {
      return true;
    }
  }
};

const getBgColor = (solution, row) => {
  const courseCode = row[2];
  const courseIndex = Object.keys(solution["sol"]).indexOf(courseCode);
  const colorIndex = courseIndex % colorCodeList.length;
  return colorCodeList[colorIndex];
};

const TimeTable = ({ solution, sol_num, earliestDate, timeSlotList }) => {
  const weekDateList = getDateList(earliestDate);
  const timetableEntryList = getAllTimetableEntryList(solution);
  const slotDateDict = getSlotData(
    weekDateList,
    timeSlotList,
    timetableEntryList
  );
  return (
    <div>
      <h5 className="display-6">Timetable for solution {sol_num + 1}</h5>
      <table className="table table-bordered  fs-6 table-sm timetable">
        <thead>
          <tr style={{ backgroundColor: "#f7f7f7" }} className="timetable-row">
            <th style={{ width: "16%" }} className="align-middle">
              Time
            </th>
            {weekDateList.map((item) => (
              <th style={{ width: "12%" }} className="align-middle text-center">
                {weekdayList[item.getDay()]}
                <br />
                {getDateDisplayText(item)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlotList.map((timeSlotStart) => (
            <tr className="timetable-row">
              <td
                style={{ width: "16%", whiteSpace: "nonwrap" }}
                className="align-middle timetable-cell"
              >
                {timeSlotStart + "-" + getEndTime(timeSlotStart)}
              </td>
              {weekDateList.map((weekdate) => {
                const startDateTime = getDateTime(weekdate, timeSlotStart);
                const endDateTime = getDateTime(
                  weekdate,
                  getEndTime(timeSlotStart)
                );
                if (isCellShow(slotDateDict, startDateTime)) {
                  if (
                    Object.keys(slotDateDict).indexOf(
                      startDateTime.toString()
                    ) >= 0
                  ) {
                    return (
                      <td
                        rowSpan={getRowSpan(slotDateDict, startDateTime)}
                        className="align-middle text-center timetable-cell"
                        style={{
                          backgroundColor: getBgColor(
                            solution,
                            slotDateDict[startDateTime]
                          ),
                        }}
                      >
                        {slotDateDict[startDateTime.toString()][2]}
                        <br />
                        {Object.keys(
                          solution["sol"][
                            slotDateDict[startDateTime.toString()][2]
                          ]
                        ).map((cellSubclass, cellSubclassIndex) => (
                          <>
                            {cellSubclassIndex > 0 && "/"}
                            {cellSubclass}
                          </>
                        ))}
                        <br />
                        {slotDateDict[startDateTime.toString()][15] +
                          "-" +
                          slotDateDict[startDateTime.toString()][16]}
                      </td>
                    );
                  } else {
                    return (
                      <td
                        rowSpan={getRowSpan(slotDateDict, startDateTime)}
                      ></td>
                    );
                  }
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
