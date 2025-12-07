import { useState, useMemo, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Modal,
  Form,
  FormGroup,
  FormSelect,
  FormControl,
  FormLabel,
  Row,
  Col,
  Table,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "./projects.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopNav from "./TopNav";
import config from "../configLoader";
function Projects() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [PMs, setPMs] = useState([]);
  const [forminputs, setFormInputs] = useState({
    projecttitle: "",
    startdate: "",
    enddate: "",
  });
  const [errors, setErrors] = useState({});
  const [json_projects, setJsonProjects] = useState([]);
  const [editmodal, setEditModal] = useState(false);
  const [PMModal, setPMModal] = useState(false);
  const [unassignedPM, setUnassignedPM] = useState([]);
  const [formPMinputs, setFormPMInputs] = useState({});
  const [PMerror, setPMError] = useState();
  const [deletemodal, setDeleteModal] = useState({
    _id: "",
    projecttitle: "",
    show: false,
  });

  const selectauthToken = (rootstate) => rootstate.authToken;
  const authToken = useSelector(selectauthToken);
  const selectSpinner = (rootstate) => rootstate.spinner;
  const spinner = useSelector(selectSpinner);

  const editProject = (_id) => {
    dispatch({ type: "SETSPINNER", data: { display: true } });
    axios.get(`${config.BE_SERVER_URL}projects/${_id}`).then((res) => {
      if (res.data.success) {
        setFormInputs(res.data.record);
        setEditModal(true);
        setShow(true);
        dispatch({ type: "SETSPINNER", data: { display: false } });
      } else {
        dispatch({ type: "SETSPINNER", data: { display: false } });
        toast.success(res.data.message, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 3000,
        });
      }
    });
    //   let project = json_projects.filter((json) => json.id === id);
    //   project = project[0];
  };
  const handleEdit = () => {
    if (validate()) {
      let editdata = {
        projecttitle: forminputs.projecttitle,
        startdate: forminputs.startdate,
        enddate: forminputs.enddate,
      };

      dispatch({ type: "SETSPINNER", data: { display: true } });
      axios
        .put(`${config.BE_SERVER_URL}projects/${forminputs._id}`, editdata)
        .then(function (res) {
          if (res.data.success) {
            let updatedrecord = res.data.editedrecord;
            console.log(updatedrecord);
            let projects = [...json_projects];
            let status = projects.some((project, index) => {
              if (project._id === updatedrecord._id) {
                console.log("matched" + index);
                projects[index] = updatedrecord;
                setJsonProjects(projects);
                return true;
              }
            });
            console.log(status);

            setShow(false);
            dispatch({ type: "SETSPINNER", data: { display: false } });
            toast.success(res.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          } else {
            setShow(false);
            dispatch({ type: "SETSPINNER", data: { display: false } });
            toast.warning(res.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          }
        });
    }
  };

  const deleteProject = (_id, projecttitle) => {
    setDeleteModal({
      _id: _id,
      projecttitle: projecttitle,
      show: true,
    });
  };

  const handleDelete = (_id, projecttitle) => {
    dispatch({ type: "SETSPINNER", data: { display: true } });
    axios.delete(`${config.BE_SERVER_URL}projects/${_id}`).then((res) => {
      if (res.data.success) {
        let projects = [...json_projects];
        let status = projects.some((project, index) => {
          if (project._id === res.data.deletedid) {
            projects.splice(index, 1);
            setJsonProjects(projects);
            return true;
          }
        });
        console.log(status);
        setDeleteModal({ _id: "", username: "", show: false });
        dispatch({ type: "SETSPINNER", data: { display: false } });
        toast.success(res.data.message, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 3000,
        });
      } else {
        setDeleteModal({ _id: "", username: "", show: false });
        dispatch({ type: "SETSPINNER", data: { display: false } });
        toast.warning(res.data.message, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 3000,
        });
      }
    });
  };

  const getPM = (projectid) => {
    let PM = PMs.filter((PM) => PM.project === projectid);
    PM = PM[0];
    if (PM) {
      return PM.username;
    } else {
      return "";
    }
  };
  const handlePM = (projectid) => {
    setFormPMInputs({ projectid: projectid, PMid: "" });
    setPMError();
    dispatch({ type: "SETSPINNER", data: { display: true } });
    axios.get(`${config.BE_SERVER_URL}users/get-unassignedPM`).then((res) => {
      if (res.data.success) {
        setUnassignedPM(res.data.unassignedPMs);
        dispatch({ type: "SETSPINNER", data: { display: false } });
        setPMModal(true);
        if (res.data.empty) {
          toast.info(res.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        }
      } else {
        toast.warning(res.data.message, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 3000,
        });
      }
    });
  };

  const handleAddModal = () => {
    setEditModal(false);
    setFormInputs({ projecttitle: "", startdate: "", enddate: "" });
    setErrors({});
    setShow(!show);
  };

  const handlePMChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormPMInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs((values) => ({ ...values, [name]: value }));
  };
  const handlePMSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "SETSPINNER", data: { display: true } });
    axios
      .post(`${config.BE_SERVER_URL}users/assignPM`, formPMinputs)
      .then((res) => {
        if (res.data.success) {
          const newPM = res.data.newPM;

          if (newPM.username === "") {
            let pms = [...PMs];
            let status = pms.some((pm, index) => {
              if (pm.project === newPM.project) {
                pms.splice(index, 1);
                console.log(pms);
                setPMs(pms);
                return true;
              }
            });
            console.log(status);
          } else {
            let matched = false;
            let pms = [...PMs];
            for (let i = 0; i < pms.length; i++) {
              if (pms[i].project === newPM.project) {
                matched = true;
                console.log("matched assign");
                pms.splice(i, 1, newPM);
                console.log(pms);
                setPMs(pms);
                break;
              }
            }
            if (!matched) {
              console.log("in not found");
              pms.push(newPM);
              setPMs(pms);
            }
          }
          setPMModal(false);
          dispatch({ type: "SETSPINNER", data: { display: false } });
          toast.success(res.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        } else {
          setPMModal(false);
          dispatch({ type: "SETSPINNER", data: { display: false } });
          toast.warning(res.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        }
      });
  };
  const handleReset = () => {
    setFormInputs({ projecttitle: "", startdate: "", enddate: "" });
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      let data = { ...forminputs };
      console.log(data);
      dispatch({ type: "SETSPINNER", data: { display: true } });
      axios
        .post(`${config.BE_SERVER_URL}projects`, data)
        .then(function (response) {
          if (response.data.success) {
            let newrecord = response.data.addedrecord;
            let projects = [...json_projects];
            projects.push(newrecord);
            setJsonProjects(projects);
          }
          setShow(!show);
          dispatch({ type: "SETSPINNER", data: { display: false } });
          setFormInputs({ projecttitle: "", startdate: "", enddate: "" });
          setErrors({});
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          } else {
            toast.warning(response.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          }
        })
        .catch(function (error) {
          toast.warning(error.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        });
    }
  };

  const validateTitle = () => {
    let error = "";
    if (!forminputs["projecttitle"]) {
      error = "Please enter project title";
    } else {
      if (forminputs["projecttitle"].length < 3) {
        error = "Please add atleast 3 characters";
      }
    }
    setErrors((values) => ({ ...values, projecttitle: error }));
  };

  const validateStart = () => {
    let error = "";
    if (!forminputs["startdate"]) {
      error = "Please enter start date";
    }
    setErrors((values) => ({ ...values, startdate: error }));
  };

  const validateEnd = () => {
    let error = "";
    if (!forminputs["enddate"]) {
      error = "Please enter end date";
    } else if (forminputs["enddate"] && forminputs["startdate"]) {
      let startdate = new Date(forminputs["startdate"]);
      let enddate = new Date(forminputs["enddate"]);
      if (startdate > enddate) {
        error = "End date should be greater than start date";
      }
    }
    setErrors((values) => ({ ...values, enddate: error }));
  };

  const validate = () => {
    let isValid = true;
    let error = {};

    if (!forminputs["projecttitle"]) {
      isValid = false;
      error["projecttitle"] = "Please enter projecttitle";
    }

    if (typeof forminputs["projecttitle"] !== "undefined") {
      if (forminputs["projecttitle"].length < 3) {
        isValid = false;
        error["projecttitle"] = "Please add atleast 3 characters";
      }
    }

    if (!forminputs["startdate"]) {
      isValid = false;
      error["startdate"] = "Please enter start date";
    }

    if (!forminputs["enddate"]) {
      isValid = false;
      error["enddate"] = "Please enter end date";
    }
    let startdate = new Date(forminputs["startdate"]);
    let enddate = new Date(forminputs["enddate"]);

    if (startdate > enddate) {
      isValid = false;
      error["enddate"] = "End date should be greater than start date";
    }

    setErrors(error);

    return isValid;
  };

  const COLOMUNS = [
    {
      Header: "Project Name",
      accessor: "projecttitle",
    },
    {
      Header: "Project Manager",
      accessor: "pmgr",
    },
    {
      Header: "Start Date",
      accessor: "startdate",
    },

    {
      Header: "End Date",
      accessor: "enddate",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ];

  useEffect(() => {
    const fetchpro = async () => {
      dispatch({ type: "SETSPINNER", data: { display: true } });
      await axios.get(`${config.BE_SERVER_URL}projects`).then((res) => {
        if (res.data.success) {
          const projects = res.data.records;
          setJsonProjects(projects);
          dispatch({ type: "SETSPINNER", data: { display: false } });
          if (res.data.empty) {
            toast.info(res.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          }
        } else {
          dispatch({ type: "SETSPINNER", data: { display: false } });
          toast.warning(res.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        }
      });
    };
    const fetchPMs = async () => {
      dispatch({ type: "SETSPINNER", data: { display: true } });
      await axios
        .get(`${config.BE_SERVER_URL}users/get-assignedPM`)
        .then((res) => {
          if (res.data.success) {
            setPMs(res.data.assignedPMs);
            dispatch({ type: "SETSPINNER", data: { display: false } });
          } else {
            setPMs([]);
            dispatch({ type: "SETSPINNER", data: { display: false } });
            toast.warning(res.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          }
        });
    };
    fetchPMs();
    fetchpro();
  }, []);

  const columns = useMemo(() => COLOMUNS, []);
  const data = useMemo(() => {
    console.log("in data memo");
    return json_projects.map((jsonproject) => {
      return {
        projecttitle: jsonproject.projecttitle,
        pmgr: (
          <Row onClick={() => handlePM(jsonproject._id)}>
            <Col sm={9}>
              <p>{getPM(jsonproject._id)}</p>
            </Col>
            <Col sm={3}>
              <i
                style={{ color: "white", fontWeight: "1000" }}
                className="bi bi-pencil"
              ></i>
            </Col>
          </Row>
        ),
        startdate: new Date(jsonproject.startdate).toLocaleString(
          config.DATE_REGION,
          config.DATE_FORMAT_OBJECT
        ),
        enddate: new Date(jsonproject.enddate).toLocaleString(
          config.DATE_REGION,
          config.DATE_FORMAT_OBJECT
        ),
        action: (
          <>
            {" "}
            <button
              style={{ padding: "0px 7px", margin: "0px 4px" }}
              className="btn btn-warning"
              onClick={() => editProject(jsonproject._id)}
            >
              <i
                style={{ color: "white", fontSize: "150%" }}
                class="bi bi-pencil-square"
              ></i>
            </button>
            &nbsp;
            <button
              style={{ padding: "0px 7px", margin: "0px 4px" }}
              className="btn"
              onClick={() =>
                deleteProject(jsonproject._id, jsonproject.projecttitle)
              }
            >
              <i
                style={{ color: "red", fontSize: "150%" }}
                className="bi bi-trash"
              ></i>
            </button>
          </>
        ),
      };
    });
  }, [json_projects, PMs]);

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

  if (authToken.role === "ADMIN") {
    return (
      <>
        <TopNav />
        <div className="container">
          <div className="row project-head mt-4">
            <div className="col-auto me-auto">
              <h3>{config.PROJECTS_PAGE_TITLE}</h3>
            </div>
            <div className="col-auto">
              <button
                style={{ backgroundColor: "slateblue" }}
                className="btn btn-primary"
                onClick={handleAddModal}
              >
                Add Project
              </button>
            </div>
          </div>

          <Modal
            show={deletemodal.show}
            onHide={() =>
              setDeleteModal({
                id: "",
                projecttitle: "",
                show: !deletemodal.show,
              })
            }
          >
            <Modal.Body>
              <Row>
                <Col>
                  <p>
                    Are you sure to Delete project{" "}
                    <b>{deletemodal.projecttitle}</b>
                  </p>
                </Col>
              </Row>

              <Row>
                <Col sm={{ offset: 7, span: 2 }}>
                  <>
                    {spinner.display ? (
                      <Button variant="danger" disabled>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="visually-hidden">Loading...</span>
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleDelete(
                            deletemodal._id,
                            deletemodal.projecttitle
                          )
                        }
                      >
                        <i
                          style={{ color: "white", fontSize: "100%" }}
                          className="bi bi-trash"
                        ></i>
                      </Button>
                    )}
                  </>
                </Col>
                <Col sm={{ span: 3 }}>
                  <Button
                    disabled={spinner.display}
                    style={{ backgroundColor: "slateblue" }}
                    onClick={() =>
                      setDeleteModal({
                        id: "",
                        projecttitle: "",
                        show: !deletemodal.show,
                      })
                    }
                  >
                    CANCEL
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>

          <Modal show={show} onHide={() => setShow(!show)}>
            <Form horizontal onSubmit={handleSubmit}>
              {!editmodal && (
                <Modal.Header closeButton>
                  <h3>ADD PROJECT</h3>
                </Modal.Header>
              )}
              {editmodal && (
                <Modal.Header closeButton>
                  <h3>EDIT PROJECT</h3>
                </Modal.Header>
              )}
              <Modal.Body style={{ overflowY: "scroll", maxHeight: "400px" }}>
                <FormGroup controlId="formTitle">
                  <FormLabel>
                    <b>
                      Project Title <span className="text-danger">*</span>
                    </b>
                  </FormLabel>
                  <FormControl
                    onBlur={validateTitle}
                    onChange={handleChange}
                    type="text"
                    placeholder="Project Title"
                    name="projecttitle"
                    value={forminputs.projecttitle}
                  />
                  <div className="text-danger">{errors.projecttitle}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formStartdate">
                  <FormLabel>
                    <b>
                      Start Date <span className="text-danger">*</span>
                    </b>
                  </FormLabel>
                  <FormControl
                    onBlur={validateStart}
                    onChange={handleChange}
                    type="date"
                    placeholder="Start Date"
                    name="startdate"
                    value={forminputs.startdate}
                  />
                  <div className="text-danger">{errors.startdate}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formEnddate">
                  <FormLabel>
                    <b>
                      End Date <span className="text-danger">*</span>
                    </b>
                  </FormLabel>
                  <FormControl
                    onBlur={validateEnd}
                    onChange={handleChange}
                    type="date"
                    placeholder="End Date"
                    name="enddate"
                    value={forminputs.enddate}
                  />
                  <div className="text-danger">{errors.enddate}</div>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <FormGroup>
                  {!editmodal && (
                    <>
                      {spinner.display ? (
                        <Button
                          style={{ background: "slateblue" }}
                          variant="primary"
                          disabled
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="visually-hidden">Loading...</span>
                        </Button>
                      ) : (
                        <Button
                          style={{ backgroundColor: "slateblue" }}
                          type="submit"
                        >
                          Add
                        </Button>
                      )}
                    </>
                  )}
                  {editmodal && (
                    <>
                      {spinner.display ? (
                        <Button
                          style={{ background: "slateblue" }}
                          variant="primary"
                          disabled
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          <span className="visually-hidden">Loading...</span>
                        </Button>
                      ) : (
                        <Button
                          style={{ backgroundColor: "slateblue" }}
                          onClick={handleEdit}
                        >
                          Edit
                        </Button>
                      )}
                    </>
                  )}

                  <Button
                    disabled={spinner.display}
                    style={{ marginLeft: "10px", marginRight: "10px" }}
                    onClick={handleReset}
                    variant="danger"
                    type="reset"
                  >
                    Reset
                  </Button>
                </FormGroup>
              </Modal.Footer>
            </Form>
          </Modal>

          <br />
          <Modal show={PMModal} onHide={() => setPMModal(false)}>
            <Modal.Header closeButton>
              <h3>EDIT PROJECT MANAGER</h3>
            </Modal.Header>
            <Modal.Body>
              <Form horizontal onSubmit={handlePMSubmit}>
                <FormGroup controlId="formPMunassigned">
                  <FormLabel>
                    <b>Available Project managers </b>
                  </FormLabel>

                  <FormSelect
                    value={formPMinputs.PMid}
                    onChange={handlePMChange}
                    name="PMid"
                  >
                    <option value="">--Unassign--</option>
                    {unassignedPM.map((PM) => (
                      <option value={PM._id}>{PM.username}</option>
                    ))}
                  </FormSelect>
                  <div className="text-danger">{PMerror}</div>
                </FormGroup>

                <FormGroup>
                  <Row className="mt-2">
                    <Col sm={{ span: 3, offset: 6 }}>
                      <>
                        {spinner.display ? (
                          <Button
                            variant="primary"
                            style={{ backgroundColor: "slateblue" }}
                            disabled
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">Loading...</span>
                          </Button>
                        ) : (
                          <Button
                            style={{ backgroundColor: "slateblue" }}
                            type="submit"
                          >
                            EDIT
                          </Button>
                        )}
                      </>
                    </Col>
                    <Col sm={{ span: 3 }}>
                      <Button
                        disabled={spinner.display}
                        variant="danger"
                        onClick={() => setPMModal(!PMModal)}
                      >
                        CANCEL
                      </Button>
                    </Col>
                  </Row>
                </FormGroup>
              </Form>
            </Modal.Body>
          </Modal>

          <div className="row search-feild">
            <Col sm={{ span: 4, offset: 4 }} xs={{ span: 8, offset: 2 }}>
              <FormControl
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                type="search"
                placeholder="Search Projects"
              />
            </Col>
          </div>

          <div className="row projects-table mt-5 table-responsive">
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
        </div>
      </>
    );
  }
}
export default Projects;
