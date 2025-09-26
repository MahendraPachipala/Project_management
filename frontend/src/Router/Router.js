import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProjectDetails from "../pages/ProjectDetails";
const Router = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path = "/" element = {<Navigate to = "/dashboard" replace/>}/>
                <Route path="/dashboard" element = {<Dashboard/>}/>
                <Route path="/login" element ={<Login/>} />
                <Route path = "/register" element = {<Register/>}/>
                <Route path = "/:project_id" element = {<ProjectDetails/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;