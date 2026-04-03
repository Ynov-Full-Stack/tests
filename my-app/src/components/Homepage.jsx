import React from "react";
import { useUsers } from "../context/UserContext";

function Homepage() {
  const { users = [] } = useUsers();

  if (users.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Bienvenue sur la page d'accueil</h1>
        <p className="text-slate-600">0 utilisateur inscrit.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Bienvenue sur la page d'accueil</h1>
      <p className="text-slate-600">{users.length === 1 ? `${users.length} utilisateur inscrit` : `${users.length} utilisateurs inscrits`}</p>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Liste des utilisateurs</h2>
        <ul className="space-y-3">
          {users.map((user, index) => (
            <li key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>
                    <strong className="font-semibold text-slate-900">Nom :</strong> {user.name}
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900">Nom d'utilisateur :</strong> {user.username}
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900">Email :</strong> {user.email}
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900">Ville :</strong> {user.address?.city || "N/A"}
                  </li>
                  <li>
                    <strong className="font-semibold text-slate-900">Code postal :</strong> {user.address?.zipcode || "N/A"}
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Homepage;
