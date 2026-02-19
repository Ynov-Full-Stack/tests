import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import {
    validatePostCode,
    validateEmail,
    validateIdentity,
} from "../validator";
import { calculateAge } from "../module";

function RegistrationForm() {
    const [form, setForm] = useState({
        lastname: "",
        firstname: "",
        email: "",
        birth: "",
        city: "",
        postalCode: "",
    });

    const [errors, setErrors] = useState({
        lastname: "",
        firstname: "",
        email: "",
        birth: "",
        city: "",
        postalCode: "",
    });

    const [touched, setTouched] = useState({
        lastname: false,
        firstname: false,
        email: false,
        birth: false,
        city: false,
        postalCode: false,
    });

    const [success, setSuccess] = useState(false);
    const { users, setUsers } = useUsers();
    const navigate = useNavigate();

    /**
     * Validation d'un champ individuel avec les 3 fonctions importées
     */
    const validateField = (fieldName, value) => {
        // TOUS les champs vides → erreur explicite
        if (!value || value.trim() === "") {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(0)} must not be empty`;
        }

        try {
            switch (fieldName) {
                case "firstname":
                case "lastname":
                    validateIdentity(value, value);
                    return "";
                case "email":
                    validateEmail(value);
                    return "";
                case "postalCode":
                    validatePostCode(value);
                    return "";
                case "birth":
                    calculateAge({ birth: new Date(value) });
                    return "";
                case "city":
                    validateIdentity(value, value);
                    return "";
                default:
                    return "";
            }
        } catch (err) {
            return err.message;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value || "",
        }));

        if (touched[name]) {
            const errorMessage = validateField(name, value);
            setErrors((prev) => ({ ...prev, [name]: errorMessage }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const errorMessage = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    };

    /**
     * Formulaire globalement valide avec les 3 fonctions
     */
    const isFormValid = () => {
        const allFilled = Object.values(form).every((v) => v.trim() !== "");
        if (!allFilled) return false;

        try {
            validateIdentity(form.firstname, form.lastname);
            validateEmail(form.email);
            validatePostCode(form.postalCode);
            calculateAge({ birth: new Date(form.birth) });
            if (!form.city || form.city.trim() === "") {
                return false;
            }
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation complète de tous les champs
        const newErrors = {
            firstname: validateField("firstname", form.firstname),
            lastname: validateField("lastname", form.lastname),
            email: validateField("email", form.email),
            birth: validateField("birth", form.birth),
            city: validateField("city", form.city),
            postalCode: validateField("postalCode", form.postalCode),
        };

        setTouched({
            firstname: true,
            lastname: true,
            email: true,
            birth: true,
            city: true,
            postalCode: true,
        });

        setErrors(newErrors);

        if (Object.values(newErrors).some((msg) => msg)) return;

        // Succès : sauvegarde
        setUsers([...users, form]);
        setSuccess(true);

        // Reset
        setForm({
            lastname: "",
            firstname: "",
            email: "",
            birth: "",
            city: "",
            postalCode: "",
        });
        setErrors({
            lastname: "",
            firstname: "",
            email: "",
            birth: "",
            city: "",
            postalCode: "",
        });
        setTouched({
            lastname: false,
            firstname: false,
            email: false,
            birth: false,
            city: false,
            postalCode: false,
        });

        setTimeout(() => {
            navigate("/");
        }, 2000);
    };

    return (
        <form
            onSubmit={handleSubmit}
            data-testid="form"
            className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
            {["firstname", "lastname", "email", "birth", "city", "postalCode"].map((field) => (
                <div key={field}>
                    <input
                        name={field}
                        type={field === "birth" ? "date" : "text"}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={form[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        data-testid={field === "birth" ? "birth" : undefined}
                        className={`w-full px-4 py-2 border rounded-lg ${
                            errors[field] && touched[field]
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errors[field] && touched[field] && (
                        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                    )}
                </div>
            ))}

            <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-2 rounded-lg font-semibold transition ${
                    isFormValid()
                        ? "bg-blue-600 text-white"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
            >
                Submit
            </button>

            {success && (
                <div className="bg-green-500 text-white p-2 rounded">
                    User saved successfully!
                </div>
            )}
        </form>
    );
}

export default RegistrationForm;
