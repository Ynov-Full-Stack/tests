import RegistrationForm from "./components/RegistrationForm";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <nav className="border-b border-slate-800 bg-slate-900 text-slate-100">
            <ul className="mx-auto flex w-full max-w-5xl list-none gap-6 px-4 py-3 text-sm font-semibold">
              <li>
                <Link className="transition hover:text-sky-300" to="/tests">
                  Accueil
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-sky-300" to="/register">
                  Inscription
                </Link>
              </li>
              {/* <li>
                            <Link to="/users">Users</Link>
                        </li>*/}
            </ul>
          </nav>

          <main className="mx-auto w-full max-w-5xl px-4 py-6">
            <Routes>
              <Route path="/tests" element={<Homepage />} />
              <Route path="/register" element={<RegistrationForm />} />

              {/*     <Route path="/users">
                        <Users />
                    </Route>*/}
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
