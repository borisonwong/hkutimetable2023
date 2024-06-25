import React, {ChangeEvent,useState, useEffect} from 'react'
import axios from 'axios'
import TextInput from "./components/TextInput.tsx"
import Table from "./components/Table.tsx";
import OptionTable from "./components/OptionTable.tsx";
import SolutionContainer from './components/SolutionConteiner.tsx';
import TimeTable from './components/TimeTable.tsx';
import DatePicker from './components/DatePicker.tsx';

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
function App() {
  const [data, setData] = useState([])
  const [file, setFile] = useState(null)
  const [showList, setShowList] = useState(data);
  const [selectedList, setSelectedList] = useState([]);
  const [solSelected, setSolutionSelected] = useState(-1);
  const [validSolutionList, setValidSolutionList] = useState([]);
  const [invalidSolutionList, setInvalidSolutionList] = useState([]);
  const [timetableDate, setTimetableDate] = useState(new Date(2023,8,1));
  const getTimeslotList = (start=8,end=22) => {
    let returnList = [];
    for (let i = start; i <= end; i++) {
      returnList.push(i.toString().padStart(2, 0) + ":00");
      returnList.push(i.toString().padStart(2, 0) + ":30");
    }
    return returnList;
  };
  const [timeSlotList, setTimeSlotList] = useState(getTimeslotList());
  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file){
      alert("Please select a file first")
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await axios.post('https://borisonwong.pythonanywhere.com/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setData(res.data);
        setShowList(res.data);
        setSelectedList([]);
        setSolutionSelected(-1)
        setValidSolutionList([])
        setInvalidSolutionList([])
    } catch (err) {
        console.error('Error uploading file:', err);
    }
  }
  const handleGASearch = async (GAInputDict) => {
    try{
      const res = await axios.post('https://borisonwong.pythonanywhere.com//solveGA',GAInputDict,{
        headers: {
          'Content-Type': 'application/json',
        }
      })
      setValidSolutionList(res.data[0])
      setInvalidSolutionList(res.data[1])
    } catch (err) {
      console.error('Error handling GA', err);
    }
  }
  const addCourse = (courseCode) => {
    let showListCopy = showList.slice();
    let selectedListCopy = selectedList.slice();
    let courseCodeIndexShowList = 0;
    for (let i = 0; i < showListCopy.length; i++){
      if (showListCopy[i]["COURSE CODE"] == courseCode){
        courseCodeIndexShowList = i;
        selectedListCopy.push(showListCopy[i]);
        showListCopy.splice(courseCodeIndexShowList, 1);
        break;
      }
    }
    setShowList(showListCopy);
    setSelectedList(selectedListCopy);
  }
  const dropCourse = (courseCode) => {
    let showListCopy = showList.slice();
    let selectedListCopy = selectedList.slice();
    let courseCodeIndexSelectedList = 0;
    for (let i = 0; i < showListCopy.length; i++){
      if (selectedListCopy[i]["COURSE CODE"] == courseCode){
        courseCodeIndexSelectedList = i;
        showListCopy.push(selectedListCopy[i]);
        selectedListCopy.splice(courseCodeIndexSelectedList, 1);
        break;
      }
    }
    setShowList(showListCopy);
    setSelectedList(selectedListCopy);
  }
  const getClass = (elementType) => {
    if(validSolutionList.length > 0){
      if(elementType == 'solutionContainer'){
        return "col-12 col-sm-12 col-md-12 col-lg-4 my-3";
      }
      if(elementType == 'timetable'){
        return "col-12 col-sm-12 col-md-12 col-lg-8 my-3 overflow-auto"
      }
    }else{
      return ""
    }
  }
  const [codeSearch, setCodeSearch] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const handleCodeSearch = (event: ChangeEvent) =>{
    setCodeSearch(event.target.value)};
  const handleTitleSearch = (event: ChangeEvent) =>
    setTitleSearch(event.target.value);
  return (
    <>
      <div className="container mx-auto my-auto py-4">
        <div className='row mb-3'>
          <div className='card'>
          <form onSubmit={handleSubmit}>
            <div className='row my-3'>
                  <div className='col'><input className='form-control form-control-sm' type='file' onChange={handleFileChange}/></div>
                  <div className='col'><button className='btn btn-primary btn-sm' type="submit">Upload</button></div>
                </div>
              </form>
          </div>
        </div>
        <div className="row">
          <div className="card">
            <div className="card-body">
              <h1 className="display-6">HKU Timetable Planner</h1>
              <p className="justify">
                Welcome to this web app. To start with, upload the .xlsx file which you
                can download <a href="https://intraweb.hku.hk/reserved_1/sis_student/sis/SIS-class-timetable.html" target='_blank' class="link-primary">here</a> (HKU portal account required). Search for for the
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
                  It may take up to 40 seconds to load the excel file, please
                  be patient. When loading is finished, available courses will be listed.
                </li>
                <li>
                  The algorithm will not generate all possible combinations.
                  Also, each time you may obtain different results.
                </li>
                <li>
                  Whole year courses and summer semester courses are supported, make sure you have not selected any semesters for that course.
                </li>
                <li>
                  Bugs are expected for courses with extraordinary course codes or class sections.
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
                  // Here data in the form {'ACCT1101':{'COURSE CODE':'ACCT1101','COURSE TITLE':'Intro...','SAMESECTION_1':{},...}}
                  : item["COURSE CODE"]
                      .toLowerCase()
                      .includes(codeSearch.toLowerCase()) &&
                      item["COURSE TITLE"]
                        .toLowerCase()
                        .includes(titleSearch.toLowerCase())
                        // && showList.indexOf(item) == -1;
              })}
              header_in={["Course Code", "Course Title"]}
              onClick={(item_in: string) => {
                addCourse(item_in);
              }}
              showMax={5}
            ></Table>
          </div>
          <div className="col">
            <h1 className="display-6">Course Selected</h1>
            <OptionTable
              data_in={selectedList}
              header_in={["Course Code", "Course Title", "S1", "S2", "Remove"]}
              showMax={10000}
              onClick={(item_in: string) => {
                dropCourse(item_in);
              }}
              onClickRunGA={
                (GAInput) => {handleGASearch(GAInput);setSolutionSelected(-1);}
              }
            ></OptionTable>
          </div>
        </div>
        <div className="row my-3">
          <div className={getClass('solutionContainer')}>
            <SolutionContainer
              validSolutionList={validSolutionList}
              invalidSolutionList={invalidSolutionList}
              solSelected={solSelected}
              setSolSected={(sol) => setSolutionSelected(sol)}
              sol_hashfunction={SHA1}
              solDateSetter={(val) => setTimetableDate(val)}
            ></SolutionContainer>
          </div>
          <div className={getClass('timetable')}>
            {solSelected != -1 && (
              <>
                <DatePicker dateIn={timetableDate} setDate={(target)=>setTimetableDate(target)} solution={solSelected} getTimeslotList={(start, end) => getTimeslotList(start, end)} setTimeSlotList={(listIn) => setTimeSlotList(listIn)} timeSlotList={timeSlotList}></DatePicker>
                <TimeTable
                  solution={solSelected}
                  sol_num={validSolutionList.indexOf(solSelected)}
                  earliestDate={timetableDate}
                  timeSlotList={timeSlotList}
                ></TimeTable>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.025)" }}
      >
        Last update: 25th June 2024. Version 2.0.
      </div>
    </>
  )
}

export default App