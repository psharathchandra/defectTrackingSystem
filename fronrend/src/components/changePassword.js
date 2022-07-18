import TopNav from "./TopNav";
import { Card, Button, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginHeader from './LoginHeader'
import LoginForm from './LoginForm'

export function ChangePassword() {
    const [inputs, setInputs] = useState({ oldPassword: "", newPassword: "" });
    const [errors, setErrors] = useState({});
    const [json_userdetails, setJsonUserDetails] = useState([]);

    const selectauthToken = (rootstate) => rootstate.authToken
    const authToken = useSelector(selectauthToken)


    useEffect(() => {
        axios.get(`http://localhost:3000/users`)
            .then(res => {
                const persons = res.data;
                setJsonUserDetails(persons);
            })

    }, []);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            let changed = json_userdetails.filter((user) => {
                return user.id === authToken.id

            });
            changed = changed[0];
            if (changed.password === inputs.oldPassword) {


                const data = { ...changed, password: inputs.newPassword }
                console.log(data)
                axios.put(`http://localhost:3000/users/${changed.id}`, data)
                    .then(res => {
                        toast.success("Password changed successfully", { position: toast.POSITION.BOTTOM_LEFT, autoClose: 3000 });
                    })
            }
            else {
                toast.warning("Incorrect old password", { position: toast.POSITION.BOTTOM_LEFT, autoClose: 3000 });
            }
        }




    }

    const validateOld = () => {
        let error = ""
        if (!inputs["oldPassword"]) {

            error = "Please enter the old password";

        }


        else {
            if (inputs["oldPassword"].length < 6) {

                error = "Password should be add atleast 6 characters";

            }
        }
        setErrors(val => ({ ...val, oldPassword: error }))

    }

    const validateNew = () => {
        let error = ""
        if (!inputs["newPassword"]) {

            error = "Please enter the new password.";

        }


        else {
            if (inputs["newPassword"].length < 6) {

                error = "Please add atleast 6 characters";
            }
        }
        setErrors(val => ({ ...val, newPassword: error }))
    }

    const validate = () => {

        let isValid = true;
        let error = {};
        if (!inputs["oldPassword"]) {
            isValid = false;
            error["oldPassword"] = "Please enter the old password";
            console.log(inputs["oldPassword"])
        }


        else {
            if (inputs["oldPassword"].length < 6) {
                isValid = false;
                error["oldPassword"] = "Password should be atleast 6 characters";

            }
        }
        if (!inputs["newPassword"]) {
            isValid = false;
            error["newPassword"] = "Please enter the new password";

        }


        else {
            if (inputs["newPassword"].length < 6) {
                isValid = false;
                error["newPassword"] = "Please add at least 6 character";
            }
        }


        setErrors(error);

        return isValid;
    }

    return (
        <>
            {authToken.id >= 0 &&<> <TopNav />
            <div className="d-flex justify-content-center mt-5 row">
                <Col sm={8} md={6} lg={4}>
                <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                    <Card.Body>
                        <Card.Title><b className="d-flex justify-content-center">Change Password</b></Card.Title>
                        <Card.Text className="mt-3">
                            <form className='form' >
                                <div class="form-group">
                                    <label for="oldpassword"><b>Old Password <span className='text-danger'>*</span></b></label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={inputs.oldPassword}
                                        onChange={handleChange}
                                        onBlur={validateOld}
                                        class="form-control"
                                        placeholder="Enter password"
                                        id="oldpassword" />

                                    <div className="text-danger">{errors.oldPassword}</div>
                                </div>
                                <div class="form-group">
                                    <label for="newpassword"><b>New Password <span className='text-danger'>*</span></b></label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={inputs.newPassword}
                                        onBlur={validateNew}
                                        onChange={handleChange}
                                        class="form-control"
                                        placeholder="Enter password"
                                        id="newpassword" />

                                    <div className="text-danger">{errors.newPassword}</div>
                                </div>
                            </form>
                        </Card.Text>
                        <Button style={{backgroundColor:"slateblue"}} onClick={handleSubmit} variant="primary" type="submit">Change</Button>
                    </Card.Body>
                </Card>
                </Col>
            </div></>}

            {authToken.id===undefined&&<>
            <LoginHeader/>
            <LoginForm/>
            </>}

            </>
    )
}
