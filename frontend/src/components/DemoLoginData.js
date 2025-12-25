function DemoLoginData() {
const logininfo=[
    {
        username: "admin@dts.com",
        password: "123456",
        role: "Administrator"
    },
    {
        username: "bob@dts.com",
        password:"123456",
        role:"Project Manager"
    },
    {
        username: "jaya@dts.com",
        password:"jayadevi",
        role:"Developer"
    }
];

    return (
        <div className="container mt-5 pt-5">
            <div className="row mb-3">
            <h4>Demo Logins:</h4><br/>
            </div>
            <div className="row justify-content-center">
                {logininfo.map((info, index) => (
                    <div className="col" key={index}>
                        {Object.entries(info).map(([key,value])=>(
                            <p className="text-center" key={key}><b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b> {value}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DemoLoginData;