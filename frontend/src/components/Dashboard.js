import { Card, Col, Row, Container } from 'react-bootstrap';
import TopNav from './TopNav';
import { useSelector } from 'react-redux'
import LoginForm from './LoginForm';
import LoginHeader from './LoginHeader';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios';
import config from "../config.json";
import './dashboard.css';

function Dashboard() {



    const [recent, setrecent] = useState([]);
    const [projects, setProjects] = useState([]);
    const [bugs, setBugs] = useState([]);
    const userstbllength = config.USERS_TABLE_LENGTH;
    const bugtbllength = config.BUGS_TABLE_LENGTH;

    const step = async () => {
        const current = await axios.get(`${config.SERVER_URL}users`)
        setrecent(current.data.records);
        console.log(current);
        //  return current;

    }
    const projectget = async () => {
        const p = await axios.get(`${config.SERVER_URL}projects`)
        setProjects(p.data.records);
        console.log(p);


    }

    const bugget = async () => {
        const p = await axios.get(`${config.SERVER_URL}bugs`)
        setBugs(p.data.records);


    }



    useEffect(() => {
        step();
        projectget();
        bugget();

    }, [])







    const selectauthToken = (rootstate) => rootstate.authToken
    const authToken = useSelector(selectauthToken)

    if (authToken.role === "ADMIN") {
        return (
            <>
                <TopNav />
                <Container fluid="lg">
                    <Row className='mt-5'>

                        <Col md={3} sm={6} className="mb-3">
                            <Link to="/users" style={{ textDecoration: "none", color: "black" }}>
                                <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                    <Card.Body>
                                        <Row className="card-content">
                                            <Col xs={4}>
                                                <i className=" card-icon bi bi-people-fill"></i>
                                            </Col>
                                            <Col xs={8}>
                                                <Card.Title>Total Users</Card.Title>
                                                <Card.Text>
                                                    <h5>{recent.length}</h5>
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>


                        <Col md={3} sm={6} className="mb-3" >
                            <Link to="/projects" style={{ textDecoration: "none", color: "black" }}>
                                <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                    <Card.Body>
                                        <Row className="card-content">
                                            <Col xs={4}>
                                                <i className=" card-icon bi bi-journal-code"></i>
                                            </Col>
                                            <Col xs={8}>
                                                <Card.Title>Total Projects</Card.Title>
                                                <Card.Text>
                                                    <h5>{projects.length}</h5>
                                                </Card.Text>
                                            </Col>
                                        </Row>

                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>

                        <Col md={3} sm={6} className="mb-3">
                            <Link to="/defects" style={{ textDecoration: "none", color: "black" }}>
                                <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                    <Card.Body >
                                        <Row className="card-content">
                                            <Col xs={4}>
                                                <i className=" card-icon bi bi-bug-fill"></i>
                                            </Col>
                                            <Col xs={8}>
                                                <Card.Title>Total Bugs</Card.Title>
                                                <Card.Text>
                                                    <h5>{bugs.length}</h5>
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>

                        <Col md={3} sm={6} className="mb-3">
                            <Link to="/defects" style={{ textDecoration: "none", color: "black" }}>
                                <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                    <Card.Body>
                                        <Row className="card-content">
                                            <Col xs={4}>
                                                <i className=" card-icon bi bi-bug"></i>
                                            </Col>
                                            <Col xs={8}>
                                                <Card.Title>Open Bugs</Card.Title>
                                                <Card.Text>
                                                    <h5>{(bugs.filter((bug) => bug.bugstatus === "TO DO" || bug.bugstatus === "IN PROGRESS")).length}</h5>
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    </Row>

                    <Row className='mt-5'>
                        <Col xs={6} sm={4}>
                            <h3>Recent Users</h3>
                        </Col>
                        <Col xs={{ span: 4, offset: 2 }} md={{ span: 2, offset: 6 }} sm={{ span: 3, offset: 5 }}>
                            <Link to="/users"><button style={{ backgroundColor: "slateblue", width: "100%" }} className="btn btn-primary">View All</button></Link>
                        </Col>
                    </Row>

                    <Row className='mt-3 p-2'>
                        <Col className="table-responsive p-0">
                            <table style={{minWidth:"768px"}}>
                                <thead>
                                    <tr>
                                        <th>User Id</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Created</th>
                                        <th>Modified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.slice(0, userstbllength).map((json) => <tr><td>{json.id}</td><td>{json.username}</td><td>{json.role}</td><td>{new Date(json.createddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td><td>{new Date(json.modifieddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td></tr>)}
                                </tbody>
                            </table>
                        </Col>
                    </Row>

                    <Row className='mt-5'>
                        <Col xs={6} sm={4}>
                            <h3>Recent Bugs</h3>
                        </Col>
                        <Col xs={{ span: 4, offset: 2 }} md={{ span: 2, offset: 6 }} sm={{ span: 3, offset: 5 }}>
                            <Link to="/reports"><button style={{ backgroundColor: "slateblue", width: "100%" }} className="btn btn-primary">View All</button></Link>
                        </Col>
                    </Row>

                    <Row className='mt-3 p-2'>
                        <Col className="table-responsive p-0">
                            <table  style={{minWidth:"768px"}}>
                                <thead>
                                    <tr>
                                        <th>Bug</th>
                                        <th>Description</th>
                                        <th>Project</th>
                                        <th>Created</th>
                                        <th>Modified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bugs.slice(0, bugtbllength).map((bug) => {
                                        return (
                                            <tr><td title={bug.bugsummary}>{bug.bugsummary.length < 15 ? bug.bugsummary : (bug.bugsummary.slice(0, 12) + "...")}</td><td title={bug.bugdescription}>{bug.bugdescription.length < 15 ? bug.bugdescription : (bug.bugdescription.slice(0, 12) + "...")}</td><td>{bug.bugproject}</td><td>{new Date(bug.createddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td><td>{new Date(bug.modifieddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td></tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </Col>
                    </Row>

                </Container>
            </>
        );
    }

    if (authToken.role === "PROJECTMANAGER") {

        return (
            <>
                <TopNav />
                <Container fluid="lg">
                    <Row className="mt-5">
                        <Col md={3}  sm={6} className="mb-3" >
                        <a href="#myteamtable" style={{ textDecoration: "none", color: "black" }}>
                            <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                <Card.Body>
                                    <Row className="card-content">
                                        <Col xs={4}>
                                            <i className="card-icon bi bi-people-fill"></i>
                                        </Col>
                                        <Col xs={8}>
                                            <Card.Title>Total Team</Card.Title>
                                            <Card.Text>
                                                <h5>{recent.filter((mem) => mem.project === authToken.project.toString() && authToken.project.toString()).length}</h5>
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            </a>
                        </Col>

                        <Col md={3}  sm={6} className="mb-3" >
                        <a style={{ textDecoration: "none", color: "black" }}>
                            <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                <Card.Body>
                                    <Row className="card-content">
                                        <Col xs={4}>
                                            <i  className="card-icon bi bi-journal-code"></i>
                                        </Col>
                                        <Col xs={8}>
                                            <Card.Title>My Project</Card.Title>
                                            <Card.Text>
                                                <h5>{authToken.project.toString() ? (projects.map((project) => {
                                                    if (project.id === authToken.project) {
                                                        return (<small>'{project.projecttitle}'</small>)
                                                    }

                                                })) : (<>'Unassigned'</>)}</h5>
                                            </Card.Text>
                                        </Col>
                                    </Row>

                                </Card.Body>
                            </Card>
                            </a>
                        </Col>

                        <Col md={3} sm={6} className="mb-3" >
                            <Link to="/defects" style={{ textDecoration: "none", color: "black" }}>
                                <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                    <Card.Body>
                                        <Row className="card-content">
                                            <Col xs={4}>
                                                <i className="card-icon bi bi-bug-fill"></i>
                                            </Col>
                                            <Col xs={8}>
                                                <Card.Title>Total Bugs</Card.Title>
                                                <Card.Text>
                                                    <h5>{bugs.filter((bug) => bug.bugproject === authToken.project.toString()).length}</h5>
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>

                        <Col md={3} sm={6} className="mb-3">
                            <Link to="/defects" style={{ textDecoration: "none", color: "black" }}>
                                <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                    <Card.Body>
                                        <Row className="card-content">
                                            <Col xs={4}>
                                                <i className="card-icon bi bi-bug"></i>
                                            </Col>
                                            <Col xs={8}>
                                                <Card.Title>Open Bugs</Card.Title>
                                                <Card.Text>
                                                    <h5>{bugs.filter((bug) => bug.bugproject === authToken.project.toString() && (bug.bugstatus === "TO DO" || bug.bugstatus === "IN PROGRESS")).length}</h5>
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    </Row>


                    <Row className='mt-5'>
                        <Col xs={6} sm={4}>
                            <h3>Recent Bugs</h3>
                        </Col>
                        <Col xs={{ span: 4, offset: 2 }} md={{ span: 2, offset: 6 }} sm={{ span: 3, offset: 5 }}>
                            <Link to="/reports"><button style={{ backgroundColor: "slateblue", width: "100%" }} className="btn btn-primary">View All</button></Link>
                        </Col>
                    </Row>

                    <Row className='mt-3 p-2'>
                        <Col className="table-responsive p-0">
                            <table style={{minWidth:"768px"}}>
                                <thead>
                                    <tr>
                                        <th>Bug</th>
                                        <th>Description</th>
                                        <th>Project</th>
                                        <th>Created</th>
                                        <th>Modified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bugs.filter((bug) => bug.bugproject === (authToken.project).toString()).slice(0, bugtbllength).map((bug) => {

                                        return (
                                            <tr><td title={bug.bugsummary}>{bug.bugsummary.length < 15 ? bug.bugsummary : (bug.bugsummary.slice(0, 12) + "...")}</td><td title={bug.bugdescription}>{bug.bugdescription.length < 15 ? bug.bugdescription : (bug.bugdescription.slice(0, 12) + "...")}</td><td>{bug.bugproject}</td><td>{new Date(bug.createddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td><td>{new Date(bug.modifieddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td></tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </table>
                        </Col>
                    </Row>

                    <Row className='mt-5'>
                        <Col xs={6} sm={4}>
                            <h3>My Team</h3>
                        </Col>
                    </Row>

                    <Row id="myteamtable" className='mt-3 p-2'>
                        <Col className="table-responsive p-0">
                            <table style={{minWidth:"768px"}}>
                                <thead>
                                    <tr>
                                        <th>User Id</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Created</th>
                                        <th>Modified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.filter((json) => json.project === authToken.project.toString() && authToken.project.toString()).slice(0, userstbllength).map((json) => <tr><td>{json.id}</td><td>{json.username}</td><td>{json.email}</td><td>{new Date(json.createddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td><td>{new Date(json.modifieddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td></tr>)}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>



            </>
        )
    }

    if (authToken.role === "EMPLOYEE") {

        return (
            <>
                <TopNav />
                <Container fluid="lg">
                    <Row className="mt-5">
                        <Col sm={4} md={4} lg={3}>
                            <Link to="/reports" style={{ textDecoration: "none", color: "black" }}>
                                <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                    <Card.Body>
                                        <Row>
                                            <Col sm={6}>
                                                <i style={{ fontSize: "300%" }} class="bi bi-box-seam"></i>
                                            </Col>
                                            <Col sm={6}>
                                                <Card.Title>My Total Bugs</Card.Title>
                                                <Card.Text>
                                                    <h5>{bugs.filter((bug) => bug.bugassignedto === authToken.id.toString()).length}</h5>
                                                </Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>

                        <Col sm={4} md={{ span: 3, offset: 1 }}>
                            <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                <Card.Body>
                                    <Row>
                                        <Col sm={6}>
                                            <i style={{ fontSize: "300%" }} class="bi bi-bug"></i>
                                        </Col>
                                        <Col sm={6}>
                                            <Card.Title>Total Open</Card.Title>
                                            <Card.Text>
                                                <h5>{bugs.filter((bug) => bug.bugassignedto === authToken.id.toString() && (bug.bugstatus === "TO DO" || (bug.bugstatus === "IN PROGRESS"))).length}</h5>
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col sm={4} md={{ span: 3, offset: 1 }}>
                            <Card style={{ border: "1px solid slateblue", boxShadow: "3px 6px 6px slateblue" }}>
                                <Card.Body>
                                    <Row>
                                        <Col sm={6}>
                                            <i style={{ fontSize: "300%" }} class="bi bi-bug-fill"></i>
                                        </Col>
                                        <Col sm={6}>
                                            <Card.Title>Total Closed</Card.Title>
                                            <Card.Text>
                                                <h5>{bugs.filter((bug) => bug.bugassignedto === authToken.id.toString() && (bug.bugstatus === "COMPLETED")).length}</h5>
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className='mt-5'>
                        <Col xs={6} sm={4}>
                            <h3>My Bugs</h3>
                        </Col>
                        <Col xs={{ span: 4, offset: 2 }} md={{ span: 2, offset: 6 }} sm={{ span: 3, offset: 5 }}>
                            <Link to="/reports"><button style={{ backgroundColor: "slateblue", width: "100%" }} className="btn btn-primary">View All</button></Link>
                        </Col>
                    </Row>

                    <Row className='mt-3 p-2'>
                        <Col className="table-responsive p-0">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Bug</th>
                                        <th>Description</th>
                                        <th>Project</th>
                                        <th>Created</th>
                                        <th>Modified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bugs.filter((bug) => bug.bugassignedto === (authToken.id).toString()).slice(0, bugtbllength).map((bug) => {

                                        return (
                                            <tr><td title={bug.bugsummary}>{bug.bugsummary.length < 15 ? bug.bugsummary : (bug.bugsummary.slice(0, 12) + "...")}</td><td title={bug.bugdescription}>{bug.bugdescription.length < 15 ? bug.bugdescription : (bug.bugdescription.slice(0, 12) + "...")}</td><td>{bug.bugproject}</td><td>{new Date(bug.createddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td><td>{new Date(bug.modifieddate).toLocaleString(config.DATE_REGION, config['DATE_FORMAT_OBJECT'])}</td></tr>
                                        )
                                    }
                                    )}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }

    return (<>
        <LoginHeader />
        <LoginForm />
    </>

    )

}
export default Dashboard;