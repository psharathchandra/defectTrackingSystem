import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LoginForm.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import config from "../configLoader";

function LoginForm() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [json_userdetails, setJsonUserDetails] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${config.SERVER_URL}users`).then((res) => {
      const persons = res.data.records;
      setJsonUserDetails(persons);
    });
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      let count = 0;
      let backenderrors = {};
      json_userdetails.forEach((user) => {
        if (user.email === inputs["email"]) {
          count = count + 1;
          if (user.password === inputs["password"]) {
            dispatch({
              type: "SETAUTHTOKEN",
              data: {
                email: user.email,
                username: user.username,
                role: user.role,
                id: user._id,
                project: user.project,
              },
            });
          } else {
            backenderrors["password"] = "Incorrect password";
          }
        }
      });
      if (count === 0) {
        backenderrors["email"] = "No such email exists";
      }
      setErrors(backenderrors);
    }
  };
  const validateEmail = () => {
    let error = "";
    if (!inputs["email"]) {
      error = "Please enter your email address.";
    } else {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(inputs["email"])) {
        error = "Please enter valid email address.";
      }
    }
    setErrors((val) => ({ ...val, email: error }));
  };

  const validatePassword = () => {
    let error = "";
    if (!inputs["password"]) {
      error = "Please enter your password";
    } else {
      if (inputs["password"].length < 6) {
        error = "Password should be atleast 6 characters";
      }
    }
    setErrors((val) => ({ ...val, password: error }));
  };

  const validate = () => {
    let isValid = true;
    let error = {};

    if (!inputs["email"]) {
      isValid = false;
      error["email"] = "Please enter your email address";
    }

    if (typeof inputs["email"] !== "undefined") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(inputs["email"])) {
        isValid = false;
        error["email"] = "Please enter valid email address";
      }
    }

    if (!inputs["password"]) {
      isValid = false;
      error["password"] = "Please enter your password";
    }

    if (typeof inputs["password"] !== "undefined") {
      if (inputs["password"].length < 6) {
        isValid = false;
        error["password"] = "Password should be atleast 6 characters";
      }
    }

    setErrors(error);

    return isValid;
  };

  return (
    <>
      <div>
        <form className="form formlogin card" onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            <h3 className="d-flex justify-content-center">LOGIN</h3>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <b>Email Address</b> <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="email"
              value={inputs.email}
              onBlur={validateEmail}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter email"
              id="email"
            />

            <div className="text-danger">{errors.email}</div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <b>Password </b>
              <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onBlur={validatePassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
              id="password"
            />

            <div className="text-danger">{errors.password}</div>
          </div>

          <div className="form-group d-flex justify-content-between align-items-center">
            <input className="btn logbutton" type="submit" value="Login" />

            <Link
              style={{ color: "blue" }}
              className="forgot"
              to="/forgotpassword"
            >
              <h6 style={{ margin: "0px" }}>
                <small>Forgot Password ?</small>
              </h6>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
