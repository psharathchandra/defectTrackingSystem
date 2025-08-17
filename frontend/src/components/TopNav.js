import { NavLink, Link } from 'react-router-dom';
import { NavDropdown,Container,Navbar,Nav,Dropdown } from 'react-bootstrap';
import './topnav.css'
import { useSelector } from 'react-redux';
function TopNav() {

  const selectauthToken = (rootstate) => rootstate.authToken
  const authToken = useSelector(selectauthToken)
  return (
    <>


      <Navbar style={{backgroundColor:"slateblue",padding:"5px"}} collapseOnSelect expand="md" >
        <Container fluid style={{padding:"0px 40px"}}>
          <NavLink style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })} to="/"><Navbar.Brand >Defect Tracking System</Navbar.Brand></NavLink>
          <Navbar.Toggle  aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav style={{paddingTop:"15px"}} className="me-auto  ">
            <ul className='top-nav-ul'>  
            {authToken.role === "ADMIN" &&
          
              <li ><NavLink style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })} to="/users">Users</NavLink></li> }
              {authToken.role === "ADMIN" &&
              <li><NavLink style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })} to="/projects">Projects</NavLink></li>}
              {authToken.role !== "EMPLOYEE" &&
              <li><NavLink style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })} to="/defects">Defects</NavLink></li>}
              <li><NavLink style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })} to="/reports">Reports</NavLink></li>
              </ul>
            </Nav>
            <Nav>
            {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown"> */}
            <Dropdown>
                  <Dropdown.Toggle style={{border:"none", padding:"0px"}}>
                  <small style={{fontSize:'20px', verticalAlign:"text-top"}}>{authToken.role}&nbsp;<i className="bi bi-person-fill"></i></small>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                  <Dropdown.Item style={{color:"black", padding:"5px 10px", fontSize:"15px"}}>
                    <p>{authToken.email}</p>
                    {authToken.project.toString()?(<p><small>project ID:{authToken.project}</small></p>):("")}
                    </Dropdown.Item>
 
                    <Dropdown.Item style={{padding:"5px 10px"}}><Link  style={{color:"black", textDecoration:"none", fontSize:"15px"}} to="/changepassword">Change Password</Link></Dropdown.Item>

                  <Dropdown.Divider/>
                    <Dropdown.Item style={{color:"black", padding:"5px 10px"}} href="/">Logout &nbsp;<i class="bi bi-box-arrow-right"></i></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              {/* </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <div className="container-fluid">
        <div className="row top-navbar">

          <div className="col-sm-3" >
            <ul className="top-nav-ul">
              <li><NavLink to="/"  style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })}>Defect Tracking System</NavLink></li>
            </ul>
          </div>

          <div className="col-sm-6">
            <ul className="top-nav-ul">
              {authToken.role === "ADMIN" &&
                <li><NavLink to="/users" style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })} >Users</NavLink></li>}

              {authToken.role === "ADMIN" &&
                <li><NavLink to="/projects" style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })}>Projects</NavLink></li>}
              {authToken.role !== "EMPLOYEE" &&
                <li><NavLink to="/defects" style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })}>Defects</NavLink></li>}
              <li><NavLink to="/reports" style={({ isActive }) => (isActive ? { textDecoration: "underline", textUnderlineOffset: "6px" } : { textDecoration: "none" })}>Reports</NavLink></li>
            </ul>
          </div>

          <div className="col-sm-3 d-flex justify-content-center">
            <ul className="top-nav-ul">
              <li>
                
                <Dropdown>
                  <Dropdown.Toggle style={{border:"none", paddingTop:"0px"}}>
                  <small style={{fontSize:'20px', verticalAlign:"text-top"}}>{authToken.role}&nbsp;<i className="bi bi-person-fill"></i></small>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                  <Dropdown.Item style={{color:"black", padding:"5px 10px", fontSize:"15px"}}>
                    <p>{authToken.email}</p>
                    {authToken.project.toString()?(<p><small>project ID:{authToken.project}</small></p>):("")}
                    </Dropdown.Item>
 
                    <Dropdown.Item style={{padding:"0px"}}><Link  style={{color:"black", textDecoration:"none", fontSize:"15px"}} to="/changepassword">Change Password</Link></Dropdown.Item>

                  <Dropdown.Divider/>
                    <Dropdown.Item style={{color:"black", padding:"5px 10px"}} href="/">Logout &nbsp;<i class="bi bi-box-arrow-right"></i></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default TopNav;