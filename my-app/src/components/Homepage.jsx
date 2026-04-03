import React from "react";
import { useUsers } from "../context/UserContext";

function Homepage() {
  const { users = [] } = useUsers();

  if (users.length === 0) {
    return (
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-300/25 backdrop-blur sm:p-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">Bienvenue sur la page d'accueil</h1>
        <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">0 utilisateur inscrit.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-5 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-300/25 backdrop-blur sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Bienvenue sur la page d'accueil</h1>
      <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
        {users.length === 1 ? `${users.length} utilisateur inscrit` : `${users.length} utilisateurs inscrits`}
      </p>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800 sm:text-xl">Liste des utilisateurs</h2>
        <ul className="space-y-4">
          {users.map((user, index) => (
            <li key={index} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm sm:p-5">
              <div>
                <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2 sm:text-[15px]">
                  <li className="truncate">
                    <strong className="font-semibold text-slate-900">Nom :</strong> {user.name}
                  </li>
                  <li className="truncate">
                    <strong className="font-semibold text-slate-900">Nom d'utilisateur :</strong> {user.username}
                  </li>
                  <li className="truncate sm:col-span-2">
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
