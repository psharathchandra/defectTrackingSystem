import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

import { useTable, usePagination, useGlobalFilter } from "react-table";
import {
  Table,
  Button,
  Modal,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  FormSelect,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./users.css";
import TopNav from "./TopNav";
import config from "../config.json";
toast.configure();

function Users() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [forminputs, setFormInputs] = useState({
    username: "",
    useremail: "",
    userpassword: "",
    userrole: "EMPLOYEE",
    userproject: "",
  });
  const [errors, setErrors] = useState({});
  const [json_projects, setJsonProjects] = useState([]);
  const [json_users, setJsonUsers] = useState([]);
  const [effectrunner, setEffectRunner] = useState(false);
  const [editmodal, setEditModal] = useState(false);
  const [deletemodal, setDeleteModal] = useState({
    _id: "",
    username: "",
    show: false,
  });

  const selectauthToken = (rootstate) => rootstate.authToken;
  const authToken = useSelector(selectauthToken);
  const selectSpinner = (rootstate) => rootstate.spinner;
  const spinner = useSelector(selectSpinner);

  const handleAddModal = () => {
    setEditModal(false);
    setFormInputs({
      username: "",
      useremail: "",
      userpassword: "",
      userrole: "EMPLOYEE",
      userproject: "",
    });
    setErrors({});
    dispatch({ type: "SETSPINNER", data: { display: true } });
    axios.get(`${config.BE_SERVER_URL}projects`).then((res) => {
      if (res.data.success) {
        setJsonProjects(res.data.records);
        dispatch({ type: "SETSPINNER", data: { display: false } });
        setShow(true);
        if (res.data.empty) {
          toast.info(res.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        }
      } else {
        setJsonProjects([]);
        dispatch({ type: "SETSPINNER", data: { display: false } });
        setShow(true);
        toast.warning(res.data.message, {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 3000,
        });
      }
    });
  };

  const editUser = (_id) => {
    // let json_user = json_users.filter((json) => json._id === _id);
    // json_user = json_user[0];
    dispatch({ type: "SETSPINNER", data: { display: true } });
    axios.get(`${config.BE_SERVER_URL}users/${_id}`).then((res) => {
      if (res.data.success) {
        let json_user = res.data.record;
        setFormInputs({
          username: json_user.username,
          useremail: json_user.email,
          userpassword: json_user.password,
          userrole: json_user.role,
          userproject: json_user.project,
          _id: json_user._id,
        });

        axios.get(`${config.BE_SERVER_URL}projects`).then((res) => {
          if (res.data.success) {
            setJsonProjects(res.data.records);
            dispatch({ type: "SETSPINNER", data: { display: false } });
            setEditModal(true);
            setShow(true);
            if (res.data.empty) {
              toast.info(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: 3000,
              });
            }
          } else {
            setJsonProjects([]);
            dispatch({ type: "SETSPINNER", data: { display: false } });
            setEditModal(true);
            setShow(true);
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
  };

  const deleteUser = (_id, username) => {
    setDeleteModal({ _id: _id, username: username, show: true });
  };

  const handleDelete = (_id, username) => {
    dispatch({ type: "SETSPINNER", data: { display: true } });
    axios.delete(`${config.BE_SERVER_URL}users/${_id}`).then((res) => {
      if (res.data.success) {
        let users = [...json_users];
        users.some((user, index) => {
          if (user._id === res.data.deletedid) {
            users.splice(index, 1);
            setJsonUsers(users);
            return true;
          }
        });
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

  const handleEdit = () => {
    if (validate()) {
      let editdata = {};
      if (forminputs["userrole"] === "EMPLOYEE") {
        editdata = {
          username: forminputs.username,
          email: forminputs.useremail,
          password: forminputs.userpassword,
          role: forminputs.userrole,
          project: forminputs.userproject,
        };
      } else {
        editdata = {
          username: forminputs.username,
          email: forminputs.useremail,
          password: forminputs.userpassword,
          role: forminputs.userrole,
          project: "",
        };
      }
      console.log(editdata);
      dispatch({ type: "SETSPINNER", data: { display: true } });
      axios
        .put(`${config.BE_SERVER_URL}users/${forminputs._id}`, editdata)
        .then(function (response) {
          console.log(response);
          if (response.data.success) {
            let updatedrecord = response.data.editedrecord;
            let users = [...json_users];
            users.some((user, index) => {
              if (user._id === updatedrecord._id) {
                users[index] = updatedrecord;
                setJsonUsers(users);
                return true;
              }
            });
            setShow(false);
            dispatch({ type: "SETSPINNER", data: { display: false } });
            toast.success(response.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          } else {
            setShow(false);
            dispatch({ type: "SETSPINNER", data: { display: false } });
            toast.warning(response.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          }
        });
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs((values) => ({ ...values, [name]: value }));
  };

  const handleReset = () => {
    setFormInputs({
      username: "",
      useremail: "",
      userpassword: "",
      userrole: "EMPLOYEE",
      userproject: "",
    });
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      let data = {};
      if (forminputs["userrole"] === "EMPLOYEE") {
        data = {
          username: forminputs.username,
          email: forminputs.useremail,
          password: forminputs.userpassword,
          role: forminputs.userrole,
          project: forminputs.userproject,
        };
      } else {
        data = {
          username: forminputs.username,
          email: forminputs.useremail,
          password: forminputs.userpassword,
          role: forminputs.userrole,
          project: "",
        };
      }
      console.log(data);
      dispatch({ type: "SETSPINNER", data: { display: true } });
      axios
        .post(`${config.BE_SERVER_URL}users`, data, {
          headers: { "content-type": "application/json" },
        })
        .then(function (response) {
          setShow(!show);
          if (response.data.success === true) {
            toast.success(response.data.message, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: 3000,
            });
          }

          axios.get(`${config.BE_SERVER_URL}users`).then((res) => {
            if (res.data.success) {
              setJsonUsers(res.data.records);
            } else {
              setJsonUsers([]);
              toast.warning(res.data.message, {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: 3000,
              });
            }
            dispatch({ type: "SETSPINNER", data: { display: false } });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const validateName = () => {
    let error = "";
    if (!forminputs["username"]) {
      error = "Please enter your name";
    } else {
      if (forminputs["username"].length < 3) {
        error = "Please add atleast 3 characters";
      }
    }
    setErrors((values) => ({ ...values, username: error }));
  };

  const validateEmail = () => {
    let error = "";
    if (!forminputs["useremail"]) {
      error = "Please enter your email address";
    } else {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(forminputs["useremail"])) {
        error = "Please enter valid email address";
      }
    }
    setErrors((values) => ({ ...values, useremail: error }));
  };

  const validatePassword = () => {
    let error = "";
    if (!forminputs["userpassword"]) {
      error = "Please enter password";
    } else {
      if (forminputs["userpassword"].length < 3) {
        error = "Please add atleast 3 characters";
      }
    }
    setErrors((values) => ({ ...values, userpassword: error }));
  };

  const validateProject = () => {
    let error = "";
    if (!forminputs["userproject"] && forminputs["userrole"] === "EMPLOYEE") {
      error = "Please select project";
    }
    setErrors((values) => ({ ...values, userproject: error }));
  };

  const validate = () => {
    let isValid = true;
    let error = {};

    if (!forminputs["useremail"]) {
      isValid = false;
      error["useremail"] = "Please enter your email address";
    } else {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(forminputs["useremail"])) {
        isValid = false;
        error["useremail"] = "Please enter valid email address";
      }
    }

    if (!forminputs["userpassword"]) {
      isValid = false;
      error["userpassword"] = "Please enter your password";
    } else {
      if (forminputs["userpassword"].length < 6) {
        isValid = false;
        error["userpassword"] = "Please add atleast 6 characters";
      }
    }

    if (!forminputs["username"]) {
      isValid = false;
      error["username"] = "Please enter your name";
    } else {
      if (forminputs["username"].length < 3) {
        isValid = false;
        error["username"] = "Please add atleast 3 characters";
      }
    }

    if (!forminputs["userproject"] && forminputs["userrole"] === "EMPLOYEE") {
      isValid = false;
      error["userproject"] = "Please select project";
    }

    setErrors(error);

    return isValid;
  };

  const COLOMUNS = [
    {
      Header: "Name",
      accessor: "username",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Role",
      accessor: "role",
    },

    {
      Header: "Created",
      accessor: "createdAt",
    },
    {
      Header: "Action",
      accessor: "action",
    },
  ];

  useEffect(() => {
    const fetchTd = async () => {
      dispatch({ type: "SETSPINNER", data: { display: true } });
      await axios.get(`${config.BE_SERVER_URL}users`).then((res) => {
        if (res.data.success) {
          setJsonUsers(res.data.records);
        } else {
          setJsonUsers([]);
          toast.warning(res.data.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 3000,
          });
        }
        dispatch({ type: "SETSPINNER", data: { display: false } });
      });
    };
    fetchTd();
  }, []);

  //console.log(orders);
  const columns = useMemo(() => COLOMUNS, []);
  const data = useMemo(() => {
    console.log("in data memo");
    return json_users.map((json_user) => {
      return {
        ...json_user,
        createdAt: new Date(json_user.createdAt).toLocaleString(
          config.DATE_REGION,
          config.DATE_FORMAT_OBJECT
        ),
        action: (
          <>
            {" "}
            <button
              style={{ padding: "0px 7px", margin: "0px 4px" }}
              className="btn btn-warning"
              onClick={() => editUser(json_user._id)}
            >
              <i
                style={{ color: "white", fontSize: "150%" }}
                className="bi bi-pencil-square"
              ></i>
            </button>
            &nbsp;
            <button
              style={{ padding: "0px 7px", margin: "0px 4px" }}
              className="btn"
              onClick={() => deleteUser(json_user._id, json_user.username)}
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
  }, [json_users]);

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
        {console.log("in page")}
        <TopNav />
        <div className="container-lg">
          <div className="row user-head">
            <div className="col-auto me-auto">
              <h3>{config.USERS_PAGE_TITLE}</h3>
            </div>
            <div className="col-auto">
              <button
                style={{ backgroundColor: "slateblue" }}
                className="btn btn-primary"
                onClick={handleAddModal}
              >
                Add New User
              </button>
            </div>
          </div>

          <Modal
            show={deletemodal.show}
            onHide={() =>
              setDeleteModal({ _id: "", username: "", show: !deletemodal.show })
            }
          >
            <Modal.Body>
              <Row>
                <Col>
                  <p>
                    Are you sure to Delete user <b>{deletemodal.username}</b>
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
                          handleDelete(deletemodal._id, deletemodal.username)
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
                    style={{ backgroundColor: "slateblue" }}
                    onClick={() =>
                      setDeleteModal({
                        _id: "",
                        username: "",
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
              {editmodal && (
                <Modal.Header closeButton>
                  <h3>EDIT USER</h3>
                </Modal.Header>
              )}
              {!editmodal && (
                <Modal.Header closeButton>
                  <h3>ADD USER</h3>
                </Modal.Header>
              )}
              <Modal.Body style={{ overflowY: "scroll", maxHeight: "400px" }}>
                <FormGroup controlId="formName">
                  <FormLabel>
                    <b>Name </b>
                    <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    onBlur={validateName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Name"
                    name="username"
                    value={forminputs.username}
                  />
                  <div className="text-danger">{errors.username}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formEmail">
                  <FormLabel>
                    <b>Email </b>
                    <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    onBlur={validateEmail}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    name="useremail"
                    value={forminputs.useremail}
                  />
                  <div className="text-danger">{errors.useremail}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formPassword">
                  <FormLabel>
                    <b>Password </b>
                    <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    onBlur={validatePassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    name="userpassword"
                    value={forminputs.userpassword}
                  />
                  <div className="text-danger">{errors.userpassword}</div>
                </FormGroup>
                <br />
                <FormGroup controlId="formSelectrole">
                  <FormLabel>
                    <b>Role </b>
                    <span className="text-danger">*</span>
                  </FormLabel>

                  <FormSelect
                    value={forminputs.userrole}
                    onChange={handleChange}
                    name="userrole"
                    required
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="PROJECTMANAGER">Project Manager</option>
                    <option value="ADMIN">Admin</option>
                  </FormSelect>
                </FormGroup>

                <br />

                {forminputs.userrole === "EMPLOYEE" && (
                  <>
                    <FormGroup controlId="formSelectproject">
                      <FormLabel>
                        <b>Project </b>
                        <span className="text-danger">*</span>
                      </FormLabel>

                      <FormSelect
                        onBlur={validateProject}
                        value={forminputs.userproject}
                        onChange={handleChange}
                        name="userproject"
                      >
                        <option value="">Select</option>
                        {json_projects.map((json_project) => (
                          <option value={json_project._id}>
                            {json_project.projecttitle}
                          </option>
                        ))}
                      </FormSelect>
                      <div className="text-danger">{errors.userproject}</div>
                    </FormGroup>
                    <br />
                  </>
                )}
              </Modal.Body>

              <Modal.Footer style={{ paddingBottom: "0px" }}>
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
                    style={{ marginLeft: "10px", marginRight: "10px" }}
                    variant="danger"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </FormGroup>
              </Modal.Footer>
            </Form>
            ;
          </Modal>

          <div className="row mt-3 search-feild">
            <Col sm={{ span: 4, offset: 4 }} xs={{ span: 8, offset: 2 }}>
              <FormControl
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                type="search"
                placeholder="Search users"
              />
            </Col>
          </div>

          <div className=" users-table table-responsive">
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
                  {[5, 10, 25, 50].map((pageSize) => (
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
export default Users;
