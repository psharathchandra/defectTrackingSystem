import {
  FormGroup,
  FormControl,
  Col,
  Row,
  Container,
  FormLabel,
  Table,
  Button,
} from "react-bootstrap";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import TopNav from "./TopNav";
import "./Reports.css";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CSVLink } from "react-csv";
import config from "../configLoader";
import Spinner from "react-bootstrap/Spinner";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
function Reports() {
  const dispatch = useDispatch();

  const selectauthToken = (rootstate) => rootstate.authToken;
  const authToken = useSelector(selectauthToken);
  const selectSpinner = (rootstate) => rootstate.spinner;
  const spinner = useSelector(selectSpinner);

  const [jsonbugs, setJsonBugs] = useState([]);
  const [forminputs, setFormInputs] = useState({ startdate: "", enddate: "" });
  const [filterdates, setFilterDates] = useState({
    startdate: "",
    enddate: "",
  });
  const [errors, setErrors] = useState({});

  const validateStart = () => {
    let error = "";
    if (!forminputs["startdate"] && forminputs["enddate"]) {
      error = "please enter start date";
    }
    if (!forminputs["startdate"] && !forminputs["enddate"]) {
      setErrors({});
    }
    setErrors((values) => ({ ...values, startdate: error }));
  };

  const validateEnd = () => {
    let error = "";
    if (!forminputs["enddate"] && forminputs["startdate"]) {
      error = "please enter end date";
    }
    if (!forminputs["startdate"] && !forminputs["enddate"]) {
      setErrors({});
    } else if (forminputs["enddate"] && forminputs["startdate"]) {
      let startdate = new Date(forminputs["startdate"]);
      let enddate = new Date(forminputs["enddate"]);
      if (startdate > enddate) {
        error = "end date should be greater than start date";
      }
    }
    setErrors((values) => ({ ...values, enddate: error }));
  };

  const validate = () => {
    validateStart();
    validateEnd();
    if (errors.startdate || errors.enddate) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      setFilterDates({
        startdate: forminputs.startdate,
        enddate: forminputs.enddate,
      });
    }
  };

  const handleCSV = () => {
    if (validate()) {
      setFilterDates({
        startdate: forminputs.startdate,
        enddate: forminputs.enddate,
      });
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs((values) => ({ ...values, [name]: value }));
  };

  const CSVHeaders = [
    { label: "Defect ID", key: "_id" },
    { label: "Summary", key: "bugsummary" },
    { label: "Description", key: "bugdescription" },
    { label: "Project", key: "projectdetails" },
    { label: "Assignee", key: "assigneedetails" },
    { label: "Type", key: "bugtype" },
    { label: "Severity", key: "bugseverity" },

    { label: "Status", key: "bugstatus" },
  ];

  const CSVData = useMemo(() => {
    let csvarr = jsonbugs.map((json) => {
      if (authToken.role === "ADMIN") {
        if (filterdates.startdate === "" || filterdates.enddate === "") {
          let csvcol = {
            _id: json._id.slice(18),
            bugsummary: json.bugsummary,
            bugdescription: json.bugdescription,
            projectdetails: json.projectdetails,
            assigneedetails: json.assigneedetails,
            bugtype: json.bugtype,
            bugseverity: json.bugseverity,
            createddAt: new Date(json.createdAt).toLocaleString(
              config.DATE_REGION,
              config.DATE_FORMAT_OBJECT
            ),
            bugstatus: json.bugstatus,
          };
          console.log(csvcol);
          return csvcol;
        } else {
          let stdate = new Date(filterdates.startdate);
          let endate = new Date(filterdates.enddate);
          stdate.setMinutes(0);
          stdate.setHours(0);
          stdate.setSeconds(0);
          endate.setMinutes(59);
          endate.setHours(23);
          endate.setSeconds(59);
          let date = new Date(json.createdAt);
          if (date >= stdate && date <= endate) {
            let rdata = {
              _id: json._id.slice(18),
              bugsummary: json.bugsummary,
              bugdescription: json.bugdescription,
              projectdetails: json.projectdetails,
              assigneedetails: json.assigneedetails,
              bugtype: json.bugtype,
              bugseverity: json.bugseverity,
              createdAt: new Date(json.createdAt).toLocaleString(
                config.DATE_REGION,
                config.DATE_FORMAT_OBJECT
              ),
              bugstatus: json.bugstatus,
            };

            return rdata;
          }
        }
      }
      if (authToken.role === "PROJECTMANAGER") {
        if (json.bugproject === authToken.project.toString()) {
          if (filterdates.startdate === "" || filterdates.enddate === "") {
            return {
              id: json._id.slice(18),
              bugsummary: json.bugsummary,
              bugdescription: json.bugdescription,
              bugproject: json.bugproject,
              bugassignedto: json.bugassignedto,
              bugtype: json.bugtype,
              bugseverity: json.bugseverity,
              createdAt: new Date(json.createdAt).toLocaleString(
                config.DATE_REGION,
                config["DATE_FORMAT_OBJECT"]
              ),
              bugstatus: json.bugstatus,
            };
          } else {
            let stdate = new Date(filterdates.startdate);
            let endate = new Date(filterdates.enddate);
            stdate.setMinutes(0);
            stdate.setHours(0);
            stdate.setSeconds(0);
            endate.setMinutes(59);
            endate.setHours(23);
            endate.setSeconds(59);
            let date = new Date(json.createdAt);
            if (date >= stdate && date <= endate) {
              return {
                id: json._id.slice(18),
                bugsummary: json.bugsummary,
                bugdescription: json.bugdescription,
                bugproject: json.bugproject,
                bugassignedto: json.bugassignedto,
                bugtype: json.bugtype,
                bugseverity: json.bugseverity,
                createdAt: new Date(json.createdAt).toLocaleString(
                  config.DATE_REGION,
                  config["DATE_FORMAT_OBJECT"]
                ),
                bugstatus: json.bugstatus,
              };
            }
          }
        }
      }
      if (authToken.role === "EMPLOYEE") {
        if (json.bugassignedto === authToken.id.toString()) {
          if (filterdates.startdate === "" || filterdates.enddate === "") {
            return {
              id: json._id.slice(18),
              bugsummary: json.bugsummary,
              bugdescription: json.bugdescription,
              bugproject: json.bugproject,
              bugassignedto: json.bugassignedto,
              bugtype: json.bugtype,
              bugseverity: json.bugseverity,
              createdAt: new Date(json.createdAt).toLocaleString(
                config.DATE_REGION,
                config["DATE_FORMAT_OBJECT"]
              ),
              bugstatus: json.bugstatus,
            };
          } else {
            let stdate = new Date(filterdates.startdate);
            let endate = new Date(filterdates.enddate);
            stdate.setMinutes(0);
            stdate.setHours(0);
            stdate.setSeconds(0);
            endate.setMinutes(59);
            endate.setHours(23);
            endate.setSeconds(59);
            let date = new Date(json.createdAt);
            if (date >= stdate && date <= endate) {
              return {
                id: json._id.slice(18),
                bugsummary: json.bugsummary,
                bugdescription: json.bugdescription,
                bugproject: json.bugproject,
                bugassignedto: json.bugassignedto,
                bugtype: json.bugtype,
                bugseverity: json.bugseverity,
                createdAt: new Date(json.createdAt).toLocaleString(
                  config.DATE_REGION,
                  config["DATE_FORMAT_OBJECT"]
                ),
                bugstatus: json.bugstatus,
              };
            }
          }
        }
      }
    });
    csvarr = csvarr.filter((row) => (row ? true : false));
    return csvarr;
  }, [filterdates, jsonbugs]);

  const csvReport = {
    data: CSVData,
    headers: CSVHeaders,
    filename:
      filterdates.startdate || filterdates.enddate
        ? filterdates.startdate + " " + "to" + " " + filterdates.enddate
        : "all bugs",
  };

  const COLOMUNS = [
    {
      Header: "Defect ID",
      accessor: "_id",
    },
    {
      Header: "Summary",
      accessor: "bugsummary",
    },
    {
      Header: "Description",
      accessor: "bugdescription",
    },
    {
      Header: "Assignee",
      accessor: "assigneedetails",
    },

    {
      Header: "Created Date",
      accessor: "createdAt",
    },
    {
      Header: "Status",
      accessor: "bugstatus",
    },
  ];

  useEffect(() => {
    const fetchbug = async () => {
      dispatch({ type: "SETSPINNER", data: { display: true } });
      await axios.get(`${config.BE_SERVER_URL}bugs`).then((res) => {
        if (res.data.success) {
          const bugs = res.data.records;
          console.log(bugs);
          setJsonBugs(bugs);
          if (res.data.empty) {
            // console.log(res.data.empty)
            toast.info(res.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          }
        } else {
          setJsonBugs([]);
          toast.warning(res.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        }
        dispatch({ type: "SETSPINNER", data: { display: false } });
      });
    };
    // const fetchAssignee=async()=>{
    //   await axios.get(`${config.BE_SERVER_URL}getAssignee`)
    //   .then((res)=>{

    //   })
    // }

    fetchbug();
  }, []);

  const columns = useMemo(() => COLOMUNS, []);
  const data = useMemo(() => {
    let tbldata = jsonbugs.map((json) => {
      if (authToken.role === "ADMIN") {
        if (filterdates.startdate === "" || filterdates.enddate === "") {
          return {
            _id: json._id.slice(18),
            bugsummary: (
              <div title={json.bugsummary}>
                {json.bugsummary < 15
                  ? json.bugsummary
                  : json.bugsummary.slice(0, 12) + "..."}
              </div>
            ),
            bugdescription: (
              <div title={json.bugdescription}>
                {json.bugdescription < 15
                  ? json.bugdescription
                  : json.bugdescription.slice(0, 12) + "..."}
              </div>
            ),
            assigneedetails: json.assigneedetails,
            createdAt: new Date(json.createdAt).toLocaleString(
              config.DATE_REGION,
              config["DATE_FORMAT_OBJECT"]
            ),
            bugstatus: json.bugstatus,
          }; //<tr><td>{json.id}</td><td title={json.bugsummary}>{json.bugsummary <15 ?json.bugsummary:json.bugsummary.slice(0,12)+"..."}</td><td title={json.bugdescription}>{json.bugdescription <15 ?json.bugdescription:json.bugdescription.slice(0,12)+"..."}</td><td>{json.bugassignedto}</td><td>{json.bugstatus}</td></tr>)
        } else {
          let stdate = new Date(filterdates.startdate);
          let endate = new Date(filterdates.enddate);
          stdate.setMinutes(0);
          stdate.setHours(0);
          stdate.setSeconds(0);
          endate.setMinutes(59);
          endate.setHours(23);
          endate.setSeconds(59);
          let date = new Date(json.createdAt);
          if (date >= stdate && date <= endate) {
            let rdata = {
              _id: json._id.slice(18),
              bugsummary: (
                <div title={json.bugsummary}>
                  {json.bugsummary < 15
                    ? json.bugsummary
                    : json.bugsummary.slice(0, 12) + "..."}
                </div>
              ),
              bugdescription: (
                <div title={json.bugdescription}>
                  {json.bugdescription < 15
                    ? json.bugdescription
                    : json.bugdescription.slice(0, 12) + "..."}
                </div>
              ),
              assigneedetails: json.assigneedetails,
              createdAt: new Date(json.createdAt).toLocaleString(
                config.DATE_REGION,
                config["DATE_FORMAT_OBJECT"]
              ),
              bugstatus: json.bugstatus,
            };

            return rdata;
          }
        }
      }
      if (authToken.role === "PROJECTMANAGER") {
        if (json.bugproject === authToken.project.toString()) {
          if (filterdates.startdate === "" || filterdates.enddate === "") {
            return {
              _id: json._id.slice(18),
              bugsummary: (
                <div title={json.bugsummary}>
                  {json.bugsummary < 15
                    ? json.bugsummary
                    : json.bugsummary.slice(0, 12) + "..."}
                </div>
              ),
              bugdescription: (
                <div title={json.bugdescription}>
                  {json.bugdescription < 15
                    ? json.bugdescription
                    : json.bugdescription.slice(0, 12) + "..."}
                </div>
              ),
              bugassignedto: json.bugassignedto,
              createdAt: new Date(json.createdAt).toLocaleString(
                config.DATE_REGION,
                config["DATE_FORMAT_OBJECT"]
              ),
              bugstatus: json.bugstatus,
            };
          } else {
            let stdate = new Date(filterdates.startdate);
            let endate = new Date(filterdates.enddate);
            stdate.setMinutes(0);
            stdate.setHours(0);
            stdate.setSeconds(0);
            endate.setMinutes(59);
            endate.setHours(23);
            endate.setSeconds(59);
            let date = new Date(json.createdAt);
            if (date >= stdate && date <= endate) {
              return {
                _id: json._id.slice(18),
                bugsummary: (
                  <div title={json.bugsummary}>
                    {json.bugsummary < 15
                      ? json.bugsummary
                      : json.bugsummary.slice(0, 12) + "..."}
                  </div>
                ),
                bugdescription: (
                  <div title={json.bugdescription}>
                    {json.bugdescription < 15
                      ? json.bugdescription
                      : json.bugdescription.slice(0, 12) + "..."}
                  </div>
                ),
                bugassignedto: json.bugassignedto,
                createdAt: new Date(json.createdAt).toLocaleString(
                  config.DATE_REGION,
                  config["DATE_FORMAT_OBJECT"]
                ),
                bugstatus: json.bugstatus,
              };
            }
          }
        }
      }
      if (authToken.role === "EMPLOYEE") {
        if (json.bugassignedto === authToken.id.toString()) {
          if (filterdates.startdate === "" || filterdates.enddate === "") {
            return {
              _id: json._id.slice(18),
              bugsummary: (
                <div title={json.bugsummary}>
                  {json.bugsummary < 15
                    ? json.bugsummary
                    : json.bugsummary.slice(0, 12) + "..."}
                </div>
              ),
              bugdescription: (
                <div title={json.bugdescription}>
                  {json.bugdescription < 15
                    ? json.bugdescription
                    : json.bugdescription.slice(0, 12) + "..."}
                </div>
              ),
              bugassignedto: json.bugassignedto,
              createdAt: new Date(json.createdAt).toLocaleString(
                config.DATE_REGION,
                config["DATE_FORMAT_OBJECT"]
              ),
              bugstatus: json.bugstatus,
            };
          } else {
            let stdate = new Date(filterdates.startdate);
            let endate = new Date(filterdates.enddate);
            stdate.setMinutes(0);
            stdate.setHours(0);
            stdate.setSeconds(0);
            endate.setMinutes(59);
            endate.setHours(23);
            endate.setSeconds(59);
            let date = new Date(json.createdAt);
            if (date >= stdate && date <= endate) {
              return {
                _id: json._id.slice(18),
                bugsummary: (
                  <div title={json.bugsummary}>
                    {json.bugsummary < 15
                      ? json.bugsummary
                      : json.bugsummary.slice(0, 12) + "..."}
                  </div>
                ),
                bugdescription: (
                  <div title={json.bugdescription}>
                    {json.bugdescription < 15
                      ? json.bugdescription
                      : json.bugdescription.slice(0, 12) + "..."}
                  </div>
                ),
                bugassignedto: json.bugassignedto,
                createdAt: new Date(json.createdAt).toLocaleString(
                  config.DATE_REGION,
                  config["DATE_FORMAT_OBJECT"]
                ),
                bugstatus: json.bugstatus,
              };
            }
          }
        }
      }
    });
    tbldata = tbldata.filter((row) => (row ? true : false));
    return tbldata;
  }, [filterdates, jsonbugs]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    setGlobalFilter,
    pageCount,
    setPageSize,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <>
      <TopNav />
      <Container>
        <Row className="mt-4">
          <Col sm={2}>
            <h3>{config.REPORTS_PAGE_TITLE}</h3>
          </Col>
        </Row>

        <Row className="justify-content-end mt-3">
          <Col sm={4}>
            <FormGroup controlId="reportstartdate">
              <Row>
                <Col
                  sm={4}
                  style={{ paddingRight: "10px" }}
                  className="d-flex justify-content-end align-items-center"
                >
                  <FormLabel style={{ marginBottom: "0px" }}>
                    <b>Start Date :</b>
                  </FormLabel>
                </Col>
                <Col
                  sm={{ span: 8 }}
                  style={{ paddingLeft: "2px" }}
                  className="d-flex justify-content-start"
                >
                  <FormControl
                    onBlur={validateStart}
                    onChange={handleChange}
                    name="startdate"
                    type="date"
                    placeholder="Start Date"
                  />
                </Col>
              </Row>
              <Row>
                <Col className="text-danger" sm={{ span: 8, offset: 4 }}>
                  {errors.startdate}
                </Col>
              </Row>
            </FormGroup>
          </Col>

          <Col sm={4}>
            <FormGroup controlId="reportenddate">
              <Row>
                <Col
                  sm={4}
                  style={{ paddingRight: "10px" }}
                  className="d-flex justify-content-end align-items-center"
                >
                  <FormLabel style={{ marginBottom: "0px" }}>
                    <b>End Date :</b>
                  </FormLabel>
                </Col>
                <Col
                  sm={8}
                  style={{ paddingLeft: "2px" }}
                  className="d-flex justify-content-start"
                >
                  <FormControl
                    onBlur={validateEnd}
                    onChange={handleChange}
                    name="enddate"
                    type="date"
                    placeholder="End Date"
                  />
                </Col>
              </Row>

              <Row>
                <Col className="text-danger" sm={{ span: 8, offset: 4 }}>
                  {errors.enddate}
                </Col>
              </Row>
            </FormGroup>
          </Col>
          <Col sm={2}>
            <button
              style={{
                backgroundColor: "slateblue",
                color: "white",
                fontWeight: "bold",
                width: "100%",
              }}
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Get Report
            </button>
          </Col>
          <Col sm={2}>
            <Row>
              <Button onClick={handleCSV} variant="warning">
                <CSVLink
                  style={{ textDecoration: "none", color: "black" }}
                  {...csvReport}
                >
                  Export to CSV
                </CSVLink>
              </Button>
            </Row>
          </Col>
        </Row>

        <div className="user-table row mt-5">
          <Table {...getTableProps()}>
            <thead style={{ backgroundColor: "slateblue" }}>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              style={{ backgroundColor: "rgb(205, 193, 233)" }}
              {...getTableBodyProps()}
            >
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div>
          <Row className="justify-content-end">
            <Col className="d-flex justify-content-end">
              <Button
                style={{ marginRight: "5px" }}
                variant="secondary"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Previous
              </Button>
              <span>
                <p style={{ margin: "20% 0% 0% 0%" }}>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{" "}
                </p>
              </span>
              <select
                style={{ marginLeft: "5px" }}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[2, 5, 10, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
              <Button
                style={{ marginLeft: "5px" }}
                variant="secondary"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}
export default Reports;
