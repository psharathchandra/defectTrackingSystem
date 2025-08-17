import LoginForm from './LoginForm.js';
function Login() {
    return(
    <>
    <div className="container-fluid">
        <div className="row top-navbar pb-3">
            <div className="col" >
                <ul className="top-nav-ul">
                    <li>Defect Tracking System</li>
                </ul>
            </div>
        </div>
    </div>
    <LoginForm/>
    </>
    )
}
export default Login;