import './App.css';
import RegistrationForm from "./components/RegistrationForm";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import Homepage from "./Homepage";

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Accueil</Link>
                        </li>
                        <li>
                            <Link to="/register">Inscription</Link>
                        </li>
                       {/* <li>
                            <Link to="/users">Users</Link>
                        </li>*/}
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/register" element={<RegistrationForm />} />

                    {/*     <Route path="/users">
                        <Users />
                    </Route>*/}
                </Routes>

            </div>
        </Router>
    )
}

export default App;
