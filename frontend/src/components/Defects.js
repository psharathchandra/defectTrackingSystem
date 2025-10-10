import TopNav from "./TopNav";
import "./defects.css";
import {
  Container,
  FormControl,
  Button,
  Modal,
  Form,
  FormGroup,
  FormLabel,
  FormSelect,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config.json";
import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";

function Defects() {
  const dispatch = useDispatch();
  const selectauthToken = (rootstate) => rootstate.authToken;
  const authToken = useSelector(selectauthToken);
  const selectSpinner = (rootstate) => rootstate.spinner;
  const spinner = useSelector(selectSpinner);

  const [show, setShow] = useState(false);
  const [forminputs, setFormInputs] = useState({
    bugsummary: "",
    bugdescription: "",
    bugtype: "",
    bugseverity: "",
    bugproject: "",
    bugassignedto: "",
    bugstatus: "",
  });
  const [editmodal, setEditModal] = useState(false);
  const [json_projects, setJsonProjects] = useState([]);
  const [json_users, setJsonUsers] = useState([]);
  const [projectfilteredusers, setProjectFilteredUsers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [jsonbugs, setJsonBugs] = useState([]);
  const [searchinput, setSearchInput] = useState("");



  useEffect(() => {
    const fetchb = async () => {
      dispatch({ type: "SETSPINNER", data: { display: true } });
      await axios
        .get(`${config.BE_SERVER_URL}bugs`)
        .then((res) => {
          if (res.data.success) {
            setJsonBugs(res.data.records);
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
        })
        .catch(() => {
          dispatch({ type: "SETSPINNER", data: { display: false } });
          toast.warning("Unable to fetch defects", {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        });
    };
    fetchb();

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${config.SERVER_URL}users`);
        const persons = res.data.records;

        if (authToken.role === "PROJECTMANAGER") {
          let projectstring = authToken.project.toString();
          console.log(persons); // Log the fetched users
          console.log(projectstring);
          let resPMUsers = persons.filter(
            (json_user) => json_user.project === projectstring && projectstring
          );
          setProjectFilteredUsers(resPMUsers);
          setFormInputs((values) => ({
            ...values,
            bugproject: authToken.project.toString(),
          }));
        }
      } catch (error) {
        toast.warning("Unable to fetch users", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 3000,
        });
      }
    };

    fetchUsers();
  }, []);

  const findAssignee = (id) => {
    let assignee = json_users.filter((json) => json.id.toString() === id);

    assignee = assignee[0];
    if (assignee) {
      return assignee.username;
    } else {
      return "UnAssigned";
    }
  };

  const editBug = (bugid) => {
    setFormInputs({});
    setErrors({});
    setEditModal(true);

    if (authToken.role == "ADMIN") {
      dispatch({ type: "SETSPINNER", data: { display: true } });
      axios.get(`${config.BE_SERVER_URL}bugs/${bugid}`).then((response) => {
        if (response.data.success) {
          setFormInputs(response.data.record);

          axios.get(`${config.BE_SERVER_URL}projects`).then((res) => {
            if (res.data.success) {
              const projects = res.data.records;
              setJsonProjects(projects);
              if (res.data.empty) {
                toast.info(res.data.message, {
                  position: toast.POSITION.BOTTOM_LEFT,
                  autoClose: 3000,
                });
              }

              axios
                .get(
                  `${config.BE_SERVER_URL}users/projectemployees/${response.data.record.bugproject}`
                )
                .then((res) => {
                  setFormInputs((val) => ({
                    ...val,
                    bugassignedto: response.data.record.bugassignedto,
                  }));
                  setProjectFilteredUsers(res.data.employees);
                  setShow(true);
                  dispatch({ type: "SETSPINNER", data: { display: false } });
                  if (!res.data.success) {
                    toast.warning(res.data.message, {
                      position: toast.POSITION.BOTTOM_LEFT,
                      autoClose: 3000,
                    });
                  }
                });
            } else {
              dispatch({ type: "SETSPINNER", data: { display: false } });
              toast.warning(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: 3000,
              });
            }
          });
        } else {
          dispatch({ type: "SETSPINNER", data: { display: false } });
          toast.warning(response.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        }
      });
    } else setShow(true);

    // setEditModal(true);
    // let result = json_users.filter(
    //   (json_user) => json_user.project === bug.bugproject
    // );
    // setProjectFilteredUsers(result);
    // setShow(!show);
  };
  const handleEdit = () => {
    if (validate()) {
      let data = { ...forminputs };

      axios
        .put(`${config.BE_SERVER_URL}bugs/${forminputs._id}`, data)
        .then(function (response) {
          if (response.data.success) {
            let editedbug = response.data.editedbug;

            let bugs = [...jsonbugs];

            for (let i = 0; i < bugs.length; i++) {
              console.log("in for loop");
              if (bugs[i]._id === editedbug._id) {
                bugs[i] = editedbug;

                break;
              }
            }
            setJsonBugs(bugs);
            setShow(false);
          } else {
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleAddModal = () => {
    setEditModal(false);
    setFormInputs({});
    setErrors({});
    if (authToken.role == "ADMIN") {
      dispatch({ type: "SETSPINNER", data: { display: true } });
      axios.get(`${config.BE_SERVER_URL}projects`).then((res) => {
        if (res.data.success) {
          const projects = res.data.records;
          setJsonProjects(projects);
          dispatch({ type: "SETSPINNER", data: { display: false } });
          setShow(true);
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
    } else setShow(true);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs((values) => ({ ...values, [name]: value }));
  };

  const handleProjectChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs((values) => ({ ...values, [name]: value }));

    dispatch({ type: "SETSPINNER", data: { display: true } });
    axios
      .get(`${config.BE_SERVER_URL}users/projectemployees/${value}`)
      .then((res) => {
        setFormInputs((val) => ({ ...val, bugassignedto: "" }));
        setProjectFilteredUsers(res.data.employees);
        dispatch({ type: "SETSPINNER", data: { display: false } });
        if (!res.data.success) {
          toast.warning(res.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        }
      });
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleReset = () => {
    setFormInputs({
      bugsummary: "",
      bugdescription: "",
      bugtype: "",
      bugseverity: "",
      bugproject: "",
      bugassignedto: "",
      bugstatus: "",
    });
    setErrors({});
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      let data = { ...forminputs };
      dispatch({ type: "SETSPINNER", data: { display: true } });
      axios
        .post(`${config.BE_SERVER_URL}bugs`, data)
        .then(function (response) {
          if (response.data.success) {
            let newrecord = response.data.addedbug;
            let bugs = [...jsonbugs];
            bugs.push(newrecord);
            setJsonBugs(bugs);
          }
          setShow(!show);
          setErrors({});
          dispatch({ type: "SETSPINNER", data: { display: false } });
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
          dispatch({ type: "SETSPINNER", data: { display: false } });
          toast.warning("Unable to add bug", {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        });
    }
  };

  const validateSummary = () => {
    let error = "";
    if (!forminputs["bugsummary"]) {
      error = "Please enter bug summary";
    } else {
      if (forminputs["bugsummary"].length < 6) {
        error = "Please enter atleast 6 charecters.";
      }
    }
    setErrors((values) => ({ ...values, bugsummary: error }));
  };

  const validateDescription = () => {
    let error = "";
    if (!forminputs["bugdescription"]) {
      error = "Please descibe the bug.";
    } else {
      if (forminputs["bugdescription"].length < 15) {
        error = "Please enter atleast 15 charecters";
      }
    }
    setErrors((values) => ({ ...values, bugdescription: error }));
  };

  const validateType = () => {
    let error = "";
    if (!forminputs["bugtype"]) {
      error = "Please select bug type";
    }
    setErrors((values) => ({ ...values, bugtype: error }));
  };

  const validateseverity = () => {
    let error = "";
    if (!forminputs["bugseverity"]) {
      error = "Please select bugseverity";
    }
    setErrors((values) => ({ ...values, bugseverity: error }));
  };

  const validateProject = () => {
    let error = "";
    if (!forminputs["bugproject"] && authToken.role === "ADMIN") {
      error = "Please select bug project";
    }
    setErrors((values) => ({ ...values, bugproject: error }));
  };

  const validateAssignedTo = () => {
    let error = "";
    if (!forminputs["bugassignedto"]) {
      error = "Please select bug assigned to";
    }
    setErrors((values) => ({ ...values, bugassignedto: error }));
  };

  const validateStatus = () => {
    let error = "";
    if (!forminputs["bugstatus"]) {
      error = "Please select bug status";
    }
    setErrors((values) => ({ ...values, bugstatus: error }));
  };

  const validate = () => {
    let isValid = true;
    let error = {};

    if (!forminputs["bugsummary"]) {
      isValid = false;
      error["bugsummary"] = "Please enter bug summary";
    } else {
      if (forminputs["bugsummary"].length < 6) {
        isValid = false;
        error["bugsummary"] = "Please enter atleast 6 charecters.";
      }
    }

    if (!forminputs["bugdescription"]) {
      isValid = false;
      error["bugdescription"] = "Please descibe the bug.";
    } else {
      if (forminputs["bugdescription"].length < 15) {
        isValid = false;
        error["bugdescription"] = "Please enter atleast 15 charecters";
      }
    }

    if (!forminputs["bugtype"]) {
      isValid = false;
      error["bugtype"] = "Please select bug type";
    }

    if (!forminputs["bugseverity"]) {
      isValid = false;
      error["bugseverity"] = "Please select bugseverity";
    }

    if (!forminputs["bugproject"] && authToken.role === "ADMIN") {
      isValid = false;
      error["bugproject"] = "Please select bug project";
    }

    if (!forminputs["bugassignedto"]) {
      isValid = false;
      error["bugassignedto"] = "Please select bug assigned to";
    }

    if (!forminputs["bugstatus"]) {
      isValid = false;
      error["bugstatus"] = "Please select bug status";
    }

    setErrors(error);
    console.log(errors);

    return isValid;
  };

  if (authToken.role === "ADMIN" || authToken.role === "PROJECTMANAGER")
    return (
      <>
        <TopNav />
        <Container>
          <Row className="mt-4">
            <Col md={4} className="mb-2">
              <h3>{config.DEFECTS_PAGE_TITLE}</h3>
            </Col>

            <Col md={3} className="mb-3">
              <FormControl
                name="search"
                onChange={handleSearchChange}
                value={searchinput}
                type="search"
                placeholder="Search Bugs"
              />
            </Col>

            <Col xs={{ span: 6 }} md={{ span: 3, offset: 0 }}>
              <button
                onClick={handleAddModal}
                style={{ backgroundColor: "slateblue", width: "100%" }}
                className="btn btn-primary"
              >
                Add New Bug
              </button>
            </Col>

            <Col xs={{ span: 6 }} md={{ span: 2 }}>
              <button
                style={{ backgroundColor: "slateblue", width: "100%" }}
                className="btn btn-primary"
              >
                Refresh
              </button>
            </Col>
          </Row>

          <Modal show={show} onHide={() => setShow(false)}>
            <Form horizontal onSubmit={handleSubmit}>
              {!editmodal && (
                <Modal.Header closeButton>
                  <h4>Add Bug</h4>
                </Modal.Header>
              )}
              {editmodal && (
                <Modal.Header closeButton>
                  <h4>Edit Bug</h4>
                </Modal.Header>
              )}
              <Modal.Body style={{ overflowY: "scroll", maxHeight: "400px" }}>
                <FormGroup controlId="formsummary">
                  <FormLabel>
                    <b>
                      Summary <span className="text-danger">*</span>
                    </b>
                  </FormLabel>
                  <FormControl
                    onBlur={validateSummary}
                    value={forminputs.bugsummary}
                    name="bugsummary"
                    onChange={handleChange}
                    type="text"
                    placeholder="Summary"
                  />
                  <div className="text-danger">{errors.bugsummary}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formdescription">
                  <FormLabel>
                    <b>
                      Description <span className="text-danger">*</span>
                    </b>
                  </FormLabel>
                  <FormControl
                    onBlur={validateDescription}
                    as="textarea"
                    row={3}
                    value={forminputs.bugdescription}
                    name="bugdescription"
                    onChange={handleChange}
                    placeholder="Description"
                  />
                  <div className="text-danger">{errors.bugdescription}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formselecttype">
                  <FormLabel>
                    <b>
                      Type <span className="text-danger">*</span>
                    </b>
                  </FormLabel>
                  <FormSelect
                    onBlur={validateType}
                    value={forminputs.bugtype}
                    onChange={handleChange}
                    name="bugtype"
                  >
                    <option value="">--Select--</option>
                    <option value="BUG">Bug</option>
                    <option value="TASK">Task</option>
                    <option value="STORY">Story</option>
                  </FormSelect>
                  <div className="text-danger">{errors.bugtype}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formselectseverity">
                  <FormLabel>
                    <b>
                      Severity <span className="text-danger">*</span>
                    </b>
                  </FormLabel>
                  <FormSelect
                    onBlur={validateseverity}
                    value={forminputs.bugseverity}
                    onChange={handleChange}
                    name="bugseverity"
                  >
                    <option value="">--Select--</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </FormSelect>
                  <div className="text-danger">{errors.bugseverity}</div>
                </FormGroup>
                <br />

                {authToken.role === "ADMIN" && (
                  <>
                    <FormGroup controlId="formbugproject">
                      <FormLabel>
                        <b>
                          Project <span className="text-danger">*</span>
                        </b>
                      </FormLabel>

                      <FormSelect
                        onBlur={validateProject}
                        value={forminputs.bugproject}
                        onChange={handleProjectChange}
                        name="bugproject"
                      >
                        <option value="">--Select--</option>
                        {json_projects.map((json_project) => (
                          <option value={json_project._id}>
                            {json_project.projecttitle}
                          </option>
                        ))}
                      </FormSelect>
                      <div className="text-danger">{errors.bugproject}</div>
                    </FormGroup>
                    <br />
                  </>
                )}

                <FormGroup controlId="formassigned">
                  <FormLabel>
                    <b>
                      Assigned To <span className="text-danger">*</span>
                    </b>
                  </FormLabel>
                  <FormSelect
                    onBlur={validateAssignedTo}
                    value={forminputs.bugassignedto}
                    onChange={handleChange}
                    name="bugassignedto"
                  >
                    <option value="">--Select--</option>
                    {projectfilteredusers.map((filteredusers) => (
                      <option value={filteredusers._id}>
                        {filteredusers.username}
                      </option>
                    ))}
                  </FormSelect>
                  <div className="text-danger">{errors.bugassignedto}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formselectstatus">
                  <FormLabel>
                    <b>
                      Status <span className="text-danger">*</span>
                    </b>
                  </FormLabel>

                  <FormSelect
                    onBlur={validateStatus}
                    value={forminputs.bugstatus}
                    onChange={handleChange}
                    name="bugstatus"
                  >
                    <option value="">--Select--</option>
                    <option value="TO DO">To Do</option>
                    <option value="IN PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </FormSelect>
                  <div className="text-danger">{errors.bugstatus}</div>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <FormGroup>
                  {!editmodal && (
                    <Button
                      style={{ backgroundColor: "slateblue" }}
                      type="submit"
                    >
                      Add
                    </Button>
                  )}
                  {editmodal && (
                    <Button
                      style={{ backgroundColor: "slateblue" }}
                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                  )}

                  <Button
                    style={{ marginLeft: "10px", marginRight: "10px" }}
                    variant="danger"
                    type="reset"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </FormGroup>
              </Modal.Footer>
            </Form>
          </Modal>

          {authToken.role === "ADMIN" && (
            <Row className="mt-4 ">
              <Col sm={4} className="defectcols">
                <div className="d-flex justify-content-center">
                  <div
                    style={{
                      border: "1px solid black",
                      width: "50%",
                      marginTop: "15px",
                    }}
                    className="d-flex justify-content-center"
                  >
                    <h6 style={{ margin: "0px" }}>TODO</h6>
                  </div>
                </div>
                {jsonbugs.map((jsonbug) => {
                  if (jsonbug.bugstatus === "TO DO") {
                    if (
                      searchinput === "" ||
                      jsonbug.bugsummary.search(searchinput) >= 0 ||
                      jsonbug.bugdescription.search(searchinput) >= 0
                    ) {
                      return (
                        <>
                          <Card
                            onClick={() => editBug(jsonbug._id)}
                            style={{
                              margin: "3px",
                              marginTop: "15px",
                              border: "1px solid slateblue",
                              boxShadow: "2px 3px 6px slateblue",
                            }}
                          >
                            <Card.Body>
                              <Row>
                                <div className="col-auto me-auto">
                                  <h4 title={jsonbug.bugsummary}>
                                    {jsonbug.bugsummary.length < 20
                                      ? jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1)
                                      : jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1, 17) +
                                        "..."}
                                  </h4>
                                </div>
                                <div
                                  title={jsonbug.assigneedetails}
                                  style={{
                                    backgroundColor: "#e0cc70",
                                    border: "2px solid black",
                                    borderRadius: "50%",
                                    verticalAlign: "center",
                                    marginRight: "8px",
                                  }}
                                  className="col-auto"
                                >
                                  <h6
                                    style={{
                                      padding: "0px",
                                      paddingTop: "5px",
                                      margin: "0px",
                                    }}
                                  >
                                    {jsonbug.assigneedetails
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </h6>
                                </div>
                              </Row>

                              <Row className="mt-3">
                                <Col style={{ minHeight: "60px" }}>
                                  <p
                                    style={{ fontSize: "15px" }}
                                    title={jsonbug.bugdescription}
                                  >
                                    {jsonbug.bugdescription.length < 75
                                      ? jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1)
                                      : jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1, 72) +
                                        "..."}
                                  </p>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={9}>
                                  <Row>
                                    <Col xs={2}>
                                      {jsonbug.bugseverity === "HIGH" && (
                                        <b
                                          title="High Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-arrow-up-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "LOW" && (
                                        <b
                                          title="Low Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i className="bi bi-arrow-down-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "MEDIUM" && (
                                        <b
                                          title="Medium Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#b3a31b",
                                          }}
                                        >
                                          <i className="bi bi-dash-circle-fill"></i>
                                        </b>
                                      )}
                                    </Col>

                                    <Col xs={2}>
                                      {jsonbug.bugtype === "BUG" && (
                                        <b
                                          title="BUG"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-bug"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "TASK" && (
                                        <b
                                          title="TASK"
                                          style={{
                                            fontSize: "20px",
                                            color: "#e8d31c",
                                          }}
                                        >
                                          <i class="bi bi-activity"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "STORY" && (
                                        <b
                                          title="STORY"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i class="bi bi-journal-richtext"></i>
                                        </b>
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={3}>
                                  <p
                                    style={{ margin: "0px" }}
                                    className="text-muted"
                                  >
                                    DEF-{jsonbug.id}
                                  </p>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </>
                      );
                    }
                    // else if((jsonbug.bugsummary).search(searchinput)>=0){

                    // }
                  }
                })}
              </Col>

              <Col sm={4} className="defectcols">
                <div className="d-flex justify-content-center">
                  <div
                    style={{
                      border: "1px solid black",
                      width: "50%",
                      marginTop: "15px",
                    }}
                    className="d-flex justify-content-center"
                  >
                    <h6 style={{ margin: "0px" }}>IN PROGRESS</h6>
                  </div>
                </div>
                {jsonbugs.map((jsonbug) => {
                  if (jsonbug.bugstatus === "IN PROGRESS") {
                    if (
                      searchinput === "" ||
                      jsonbug.bugsummary.search(searchinput) >= 0 ||
                      jsonbug.bugdescription.search(searchinput) >= 0
                    ) {
                      return (
                        <>
                          <Card
                            onClick={() => editBug(jsonbug._id)}
                            style={{
                              margin: "3px",
                              marginTop: "15px",
                              border: "1px solid slateblue",
                              boxShadow: "2px 3px 6px slateblue",
                            }}
                          >
                            <Card.Body>
                              <Row>
                                <div className="col-auto me-auto">
                                  <h4 title={jsonbug.bugsummary}>
                                    {jsonbug.bugsummary.length < 20
                                      ? jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1)
                                      : jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1, 17) +
                                        "..."}
                                  </h4>
                                </div>
                                <div
                                  title={jsonbug.assigneedetails}
                                  style={{
                                    backgroundColor: "#e0cc70",
                                    border: "2px solid black",
                                    borderRadius: "50%",
                                    verticalAlign: "center",
                                    marginRight: "8px",
                                  }}
                                  className="col-auto"
                                >
                                  <h6
                                    style={{
                                      padding: "0px",
                                      paddingTop: "5px",
                                      margin: "0px",
                                    }}
                                  >
                                    {jsonbug.assigneedetails
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </h6>
                                </div>
                              </Row>

                              <Row className="mt-3">
                                <Col style={{ minHeight: "60px" }}>
                                  <p
                                    style={{ fontSize: "15px" }}
                                    title={jsonbug.bugdescription}
                                  >
                                    {jsonbug.bugdescription.length < 75
                                      ? jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1)
                                      : jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1, 72) +
                                        "..."}
                                  </p>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={9}>
                                  <Row>
                                    <Col xs={2}>
                                      {jsonbug.bugseverity === "HIGH" && (
                                        <b
                                          title="High Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-arrow-up-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "LOW" && (
                                        <b
                                          title="Low Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i className="bi bi-arrow-down-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "MEDIUM" && (
                                        <b
                                          title="Medium Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#b3a31b",
                                          }}
                                        >
                                          <i className="bi bi-dash-circle-fill"></i>
                                        </b>
                                      )}
                                    </Col>

                                    <Col xs={2}>
                                      {jsonbug.bugtype === "BUG" && (
                                        <b
                                          title="BUG"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-bug"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "TASK" && (
                                        <b
                                          title="TASK"
                                          style={{
                                            fontSize: "20px",
                                            color: "#e8d31c",
                                          }}
                                        >
                                          <i class="bi bi-activity"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "STORY" && (
                                        <b
                                          title="STORY"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i class="bi bi-journal-richtext"></i>
                                        </b>
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={3}>
                                  <p
                                    style={{ margin: "0px" }}
                                    className="text-muted"
                                  >
                                    DEF-{jsonbug.id}
                                  </p>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </>
                      );
                    }
                  }
                })}
              </Col>

              <Col sm={4}>
                <div className="d-flex justify-content-center">
                  <div
                    style={{
                      border: "1px solid black",
                      width: "50%",
                      marginTop: "15px",
                    }}
                    className="d-flex justify-content-center"
                  >
                    <h6 style={{ margin: "0px" }}>COMPLETED</h6>
                  </div>
                </div>
                {jsonbugs.map((jsonbug) => {
                  if (jsonbug.bugstatus === "COMPLETED") {
                    if (
                      searchinput === "" ||
                      jsonbug.bugsummary.search(searchinput) >= 0 ||
                      jsonbug.bugdescription.search(searchinput) >= 0
                    ) {
                      return (
                        <>
                          <Card
                            onClick={() => editBug(jsonbug._id)}
                            style={{
                              margin: "3px",
                              marginTop: "15px",
                              border: "1px solid slateblue",
                              boxShadow: "2px 3px 6px slateblue",
                            }}
                          >
                            <Card.Body>
                              <Row>
                                <div className="col-auto me-auto">
                                  <h4 title={jsonbug.bugsummary}>
                                    {jsonbug.bugsummary.length < 20
                                      ? jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1)
                                      : jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1, 17) +
                                        "..."}
                                  </h4>
                                </div>
                                <div
                                  title={jsonbug.assigneedetails}
                                  style={{
                                    backgroundColor: "#e0cc70",
                                    border: "2px solid black",
                                    borderRadius: "50%",
                                    verticalAlign: "center",
                                    marginRight: "8px",
                                  }}
                                  className="col-auto"
                                >
                                  <h6
                                    style={{
                                      padding: "0px",
                                      paddingTop: "5px",
                                      margin: "0px",
                                    }}
                                  >
                                    {jsonbug.assigneedetails
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </h6>
                                </div>
                              </Row>

                              <Row className="mt-3">
                                <Col style={{ minHeight: "60px" }}>
                                  <p
                                    style={{ fontSize: "15px" }}
                                    title={jsonbug.bugdescription}
                                  >
                                    {jsonbug.bugdescription.length < 75
                                      ? jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1)
                                      : jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1, 72) +
                                        "..."}
                                  </p>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={9}>
                                  <Row>
                                    <Col xs={2}>
                                      {jsonbug.bugseverity === "HIGH" && (
                                        <b
                                          title="High Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-arrow-up-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "LOW" && (
                                        <b
                                          title="Low Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i className="bi bi-arrow-down-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "MEDIUM" && (
                                        <b
                                          title="Medium Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#b3a31b",
                                          }}
                                        >
                                          <i className="bi bi-dash-circle-fill"></i>
                                        </b>
                                      )}
                                    </Col>

                                    <Col xs={2}>
                                      {jsonbug.bugtype === "BUG" && (
                                        <b
                                          title="BUG"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-bug"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "TASK" && (
                                        <b
                                          title="TASK"
                                          style={{
                                            fontSize: "20px",
                                            color: "#e8d31c",
                                          }}
                                        >
                                          <i class="bi bi-activity"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "STORY" && (
                                        <b
                                          title="STORY"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i class="bi bi-journal-richtext"></i>
                                        </b>
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={3}>
                                  <p
                                    style={{ margin: "0px" }}
                                    className="text-muted"
                                  >
                                    DEF-{jsonbug.id}
                                  </p>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </>
                      );
                    }
                  }
                })}
              </Col>
            </Row>
          )}

          {authToken.role === "PROJECTMANAGER" && (
            <Row className="mt-4 ">
              <Col sm={4} className="defectcols">
                <div className="d-flex justify-content-center">
                  <div
                    style={{
                      border: "1px solid black",
                      width: "50%",
                      marginTop: "15px",
                    }}
                    className="d-flex justify-content-center"
                  >
                    <h6 style={{ margin: "0px" }}>TO DO</h6>
                  </div>
                </div>

                {jsonbugs.map((jsonbug) => {
                  if (
                    jsonbug.bugstatus === "TO DO" &&
                    jsonbug.bugproject === authToken.project.toString()
                  ) {
                    if (
                      searchinput === "" ||
                      jsonbug.bugsummary.search(searchinput) >= 0 ||
                      jsonbug.bugdescription.search(searchinput) >= 0
                    ) {
                      return (
                        <>
                          <Card
                            onClick={() => editBug(jsonbug._id)}
                            style={{
                              margin: "3px",
                              marginTop: "15px",
                              border: "1px solid slateblue",
                              boxShadow: "2px 3px 6px slateblue",
                            }}
                          >
                            <Card.Body>
                              <Row>
                                <div className="col-auto me-auto">
                                  <h4 title={jsonbug.bugsummary}>
                                    {jsonbug.bugsummary.length < 20
                                      ? jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1)
                                      : jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1, 17) +
                                        "..."}
                                  </h4>
                                </div>
                                <div
                                  title={jsonbug.assigneedetails}
                                  style={{
                                    backgroundColor: "#e0cc70",
                                    border: "2px solid black",
                                    borderRadius: "50%",
                                    verticalAlign: "center",
                                    marginRight: "8px",
                                  }}
                                  className="col-auto"
                                >
                                  <h6
                                    style={{
                                      padding: "0px",
                                      paddingTop: "5px",
                                      margin: "0px",
                                    }}
                                  >
                                    {jsonbug.assigneedetails
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </h6>
                                </div>
                              </Row>

                              <Row className="mt-3">
                                <Col style={{ minHeight: "60px" }}>
                                  <p
                                    style={{ fontSize: "15px" }}
                                    title={jsonbug.bugdescription}
                                  >
                                    {jsonbug.bugdescription.length < 75
                                      ? jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1)
                                      : jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1, 72) +
                                        "..."}
                                  </p>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={9}>
                                  <Row>
                                    <Col xs={2}>
                                      {jsonbug.bugseverity === "HIGH" && (
                                        <b
                                          title="High Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-arrow-up-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "LOW" && (
                                        <b
                                          title="Low Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i className="bi bi-arrow-down-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "MEDIUM" && (
                                        <b
                                          title="Medium Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#b3a31b",
                                          }}
                                        >
                                          <i className="bi bi-dash-circle-fill"></i>
                                        </b>
                                      )}
                                    </Col>

                                    <Col xs={2}>
                                      {jsonbug.bugtype === "BUG" && (
                                        <b
                                          title="BUG"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-bug"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "TASK" && (
                                        <b
                                          title="TASK"
                                          style={{
                                            fontSize: "20px",
                                            color: "#e8d31c",
                                          }}
                                        >
                                          <i class="bi bi-activity"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "STORY" && (
                                        <b
                                          title="STORY"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i class="bi bi-journal-richtext"></i>
                                        </b>
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={3}>
                                  <p
                                    style={{ margin: "0px" }}
                                    className="text-muted"
                                  >
                                    DEF-{jsonbug.id}
                                  </p>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </>
                      );
                    }
                  }
                })}
              </Col>

              <Col sm={4} className="defectcols">
                <div className="d-flex justify-content-center">
                  <div
                    style={{
                      border: "1px solid black",
                      width: "50%",
                      marginTop: "15px",
                    }}
                    className="d-flex justify-content-center"
                  >
                    <h6 style={{ margin: "0px" }}>IN PROGRESS</h6>
                  </div>
                </div>
                {jsonbugs.map((jsonbug) => {
                  if (
                    jsonbug.bugstatus === "IN PROGRESS" &&
                    jsonbug.bugproject === authToken.project.toString()
                  ) {
                    if (
                      searchinput === "" ||
                      jsonbug.bugsummary.search(searchinput) >= 0 ||
                      jsonbug.bugdescription.search(searchinput) >= 0
                    ) {
                      return (
                        <>
                          <Card
                            onClick={() => editBug(jsonbug._id)}
                            style={{
                              margin: "3px",
                              marginTop: "15px",
                              border: "1px solid slateblue",
                              boxShadow: "2px 3px 6px slateblue",
                            }}
                          >
                            <Card.Body>
                              <Row>
                                <div className="col-auto me-auto">
                                  <h4 title={jsonbug.bugsummary}>
                                    {jsonbug.bugsummary.length < 20
                                      ? jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1)
                                      : jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1, 17) +
                                        "..."}
                                  </h4>
                                </div>
                                <div
                                  title={jsonbug.assigneedetails}
                                  style={{
                                    backgroundColor: "#e0cc70",
                                    border: "2px solid black",
                                    borderRadius: "50%",
                                    verticalAlign: "center",
                                    marginRight: "8px",
                                  }}
                                  className="col-auto"
                                >
                                  <h6
                                    style={{
                                      padding: "0px",
                                      paddingTop: "5px",
                                      margin: "0px",
                                    }}
                                  >
                                    {jsonbug.assigneedetails
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </h6>
                                </div>
                              </Row>

                              <Row className="mt-3">
                                <Col style={{ minHeight: "60px" }}>
                                  <p
                                    style={{ fontSize: "15px" }}
                                    title={jsonbug.bugdescription}
                                  >
                                    {jsonbug.bugdescription.length < 75
                                      ? jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1)
                                      : jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1, 72) +
                                        "..."}
                                  </p>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={9}>
                                  <Row>
                                    <Col xs={2}>
                                      {jsonbug.bugseverity === "HIGH" && (
                                        <b
                                          title="High Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-arrow-up-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "LOW" && (
                                        <b
                                          title="Low Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i className="bi bi-arrow-down-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "MEDIUM" && (
                                        <b
                                          title="Medium Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#b3a31b",
                                          }}
                                        >
                                          <i className="bi bi-dash-circle-fill"></i>
                                        </b>
                                      )}
                                    </Col>

                                    <Col xs={2}>
                                      {jsonbug.bugtype === "BUG" && (
                                        <b
                                          title="BUG"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-bug"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "TASK" && (
                                        <b
                                          title="TASK"
                                          style={{
                                            fontSize: "20px",
                                            color: "#e8d31c",
                                          }}
                                        >
                                          <i class="bi bi-activity"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "STORY" && (
                                        <b
                                          title="STORY"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i class="bi bi-journal-richtext"></i>
                                        </b>
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={3}>
                                  <p
                                    style={{ margin: "0px" }}
                                    className="text-muted"
                                  >
                                    DEF-{jsonbug.id}
                                  </p>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </>
                      );
                    }
                  }
                })}
              </Col>

              <Col sm={4}>
                <div className="d-flex justify-content-center">
                  <div
                    style={{
                      border: "1px solid black",
                      width: "50%",
                      marginTop: "15px",
                    }}
                    className="d-flex justify-content-center"
                  >
                    <h6 style={{ margin: "0px" }}>COMPLETED</h6>
                  </div>
                </div>
                {jsonbugs.map((jsonbug) => {
                  if (
                    jsonbug.bugstatus === "COMPLETED" &&
                    jsonbug.bugproject === authToken.project.toString()
                  ) {
                    if (
                      searchinput === "" ||
                      jsonbug.bugsummary.search(searchinput) >= 0 ||
                      jsonbug.bugdescription.search(searchinput) >= 0
                    ) {
                      return (
                        <>
                          <Card
                            onClick={() => editBug(jsonbug._id)}
                            style={{
                              margin: "3px",
                              marginTop: "15px",
                              border: "1px solid slateblue",
                              boxShadow: "2px 3px 6px slateblue",
                            }}
                          >
                            <Card.Body>
                              <Row>
                                <div className="col-auto me-auto">
                                  <h4 title={jsonbug.bugsummary}>
                                    {jsonbug.bugsummary.length < 20
                                      ? jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1)
                                      : jsonbug.bugsummary[0].toUpperCase() +
                                        jsonbug.bugsummary.slice(1, 17) +
                                        "..."}
                                  </h4>
                                </div>
                                <div
                                  title={jsonbug.assigneedetails}
                                  style={{
                                    backgroundColor: "#e0cc70",
                                    border: "2px solid black",
                                    borderRadius: "50%",
                                    verticalAlign: "center",
                                    marginRight: "8px",
                                  }}
                                  className="col-auto"
                                >
                                  <h6
                                    style={{
                                      padding: "0px",
                                      paddingTop: "5px",
                                      margin: "0px",
                                    }}
                                  >
                                    {jsonbug.assigneedetails
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </h6>
                                </div>
                              </Row>

                              <Row className="mt-3">
                                <Col style={{ minHeight: "60px" }}>
                                  <p
                                    style={{ fontSize: "15px" }}
                                    title={jsonbug.bugdescription}
                                  >
                                    {jsonbug.bugdescription.length < 75
                                      ? jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1)
                                      : jsonbug.bugdescription[0].toUpperCase() +
                                        jsonbug.bugdescription.slice(1, 72) +
                                        "..."}
                                  </p>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={9}>
                                  <Row>
                                    <Col xs={2}>
                                      {jsonbug.bugseverity === "HIGH" && (
                                        <b
                                          title="High Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-arrow-up-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "LOW" && (
                                        <b
                                          title="Low Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i className="bi bi-arrow-down-circle-fill"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugseverity === "MEDIUM" && (
                                        <b
                                          title="Medium Severity"
                                          style={{
                                            fontSize: "20px",
                                            color: "#b3a31b",
                                          }}
                                        >
                                          <i className="bi bi-dash-circle-fill"></i>
                                        </b>
                                      )}
                                    </Col>

                                    <Col xs={2}>
                                      {jsonbug.bugtype === "BUG" && (
                                        <b
                                          title="BUG"
                                          style={{
                                            fontSize: "20px",
                                            color: "#bf0202",
                                          }}
                                        >
                                          <i className="bi bi-bug"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "TASK" && (
                                        <b
                                          title="TASK"
                                          style={{
                                            fontSize: "20px",
                                            color: "#e8d31c",
                                          }}
                                        >
                                          <i class="bi bi-activity"></i>
                                        </b>
                                      )}
                                      {jsonbug.bugtype === "STORY" && (
                                        <b
                                          title="STORY"
                                          style={{
                                            fontSize: "20px",
                                            color: "#57c702",
                                          }}
                                        >
                                          <i class="bi bi-journal-richtext"></i>
                                        </b>
                                      )}
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={3}>
                                  <p
                                    style={{ margin: "0px" }}
                                    className="text-muted"
                                  >
                                    DEF-{jsonbug.id}
                                  </p>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        </>
                      );
                    }
                  }
                })}
              </Col>
            </Row>
          )}
        </Container>
      </>
    );
}
export default Defects;
