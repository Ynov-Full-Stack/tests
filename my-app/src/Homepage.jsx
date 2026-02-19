import React from 'react';
import { useUsers } from './context/UserContext';

function Homepage() {
    const { users } = useUsers();

    if (users.length === 0) {
        return (
            <div>
                <h1>Bienvenue sur la page d'accueil</h1>
                <p>0 utilisateur inscrit.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Bienvenue sur la page d'accueil</h1>
            <p>{users.length === 1 ? `${users.length} utilisateur inscrit` : `${users.length} utilisateurs inscrits`}</p>

            <div className="user-list">
                <h2>Liste des utilisateurs</h2>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>
                            <div className="user-info">
                                <h3>{user.firstname} {user.lastname}</h3>
                                <ul>
                                    <li><strong>Email :</strong> {user.email}</li>
                                    <li><strong>Date de naissance :</strong> {user.birth}</li>
                                    <li><strong>Ville :</strong> {user.city}</li>
                                    <li><strong>Code postal :</strong> {user.postalCode}</li>
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Homepage;
