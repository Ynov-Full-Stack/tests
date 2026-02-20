import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useUsers} from "../context/UserContext";
import {validatePostCode, validateEmail, validateIdentity} from "../validator";
import cityValidator from "../validator/cityValidator";

function RegistrationForm() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        city: "",
        postalCode: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        username: "",
        email: "",
        city: "",
        postalCode: "",
    });

    const [touched, setTouched] = useState({
        name: false,
        username: false,
        email: false,
        city: false,
        postalCode: false,
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const {addUser} = useUsers();
    const navigate = useNavigate();

    const validateField = (fieldName, value) => {
        if (!value || value.trim() === "") {
            const label =
                fieldName === "postalCode"
                    ? "PostalCode"
                    : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            return `${label} must not be empty`;
        }

        try {
            switch (fieldName) {
                case "username":
                case "name":
                    validateIdentity(value, value);
                    return "";
                case "email":
                    validateEmail(value);
                    return "";
                case "city":
                    cityValidator(value);
                    return "";
                case "postalCode":
                    validatePostCode(value);
                    return "";
                default:
                    return "";
            }
        } catch (err) {
            return err.message;
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value || ""}));
        if (touched[name]) {
            setErrors((prev) => ({...prev, [name]: validateField(name, value)}));
        }
    };

    const handleBlur = (e) => {
        const {name, value} = e.target;
        setTouched((prev) => ({...prev, [name]: true}));
        setErrors((prev) => ({...prev, [name]: validateField(name, value)}));
    };

    const isFormValid = () => {
        const allFilled = Object.values(form).every((v) => v.trim() !== "");
        if (!allFilled) return false;
        try {
            validateIdentity(form.username, form.name);
            validateEmail(form.email);
            validatePostCode(form.postalCode);
            cityValidator(form.city);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const newErrors = {};
        Object.keys(form).forEach((field) => {
            newErrors[field] = validateField(field, form[field]);
        });
        setTouched({username: true, name: true, email: true, city: true, postalCode: true,});
        setErrors(newErrors);

        if (Object.values(newErrors).some((msg) => msg)) return;

        const formattedUser = {
            name: form.name,
            username: form.username,
            email: form.email,
            address: {
                city: form.city,
                zipcode: form.postalCode,
            },
        };
        try {
            const result = await addUser(formattedUser);

            if (result.success) {
                setSuccess(true);
                setForm({name: "", username: "", email: "", city: "", postalCode: "",});
                setErrors({name: "", username: "", email: "", city: "", postalCode: "",});
                setTouched({name: false, username: false, email: false, city: false, postalCode: false,});
                setTimeout(() => navigate("/tests"), 2000);
            } else {
                setError(result.error?.message || "Erreur serveur, veuillez réessayer");
            }
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data?.message || "Cet email est déjà utilisé");
            } else {
                setError("Erreur serveur, veuillez réessayer plus tard");
            }
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            data-testid="form"
            className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
            {["username", "name", "email", "city", "postalCode"].map((field) => (
                <div key={field}>
                    <input
                        name={field}
                        type="text"
                        placeholder={
                            field === "postalCode"
                                ? "PostalCode"
                                : field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={form[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}>Submit
            </button>

            {success && (
                <div className="bg-green-500 text-white p-2 rounded">
                    User saved successfully!
                </div>
            )}

            {error && (
                <p role="alert" className="text-red-500 mt-2">
                    {error}
                </p>
            )}
        </form>
    );
}

export default RegistrationForm;
