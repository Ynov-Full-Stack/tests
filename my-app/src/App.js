import RegistrationForm from "./components/RegistrationForm";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100 to-sky-100/70 text-slate-900">
          <nav className="border-b border-slate-800/70 bg-slate-950 text-slate-100 shadow-lg">
            <ul className="mx-auto flex w-full max-w-5xl list-none items-center justify-center gap-8 px-4 py-3 text-sm font-semibold tracking-wide">
              <li>
                <Link className="rounded-full px-3 py-1 transition hover:bg-slate-800 hover:text-sky-300" to="/tests">
                  Accueil
                </Link>
              </li>
              <li>
                <Link className="rounded-full px-3 py-1 transition hover:bg-slate-800 hover:text-sky-300" to="/register">
                  Inscription
                </Link>
              </li>
              {/* <li>
                            <Link to="/users">Users</Link>
                        </li>*/}
            </ul>
          </nav>

          <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-10">
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
