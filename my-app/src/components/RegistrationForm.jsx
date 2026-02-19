import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from '../context/UserContext';
import { validatePostCode, validateEmail, validateIdentity } from "../validator";
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

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [success, setSuccess] = useState(false);
    const { users, setUsers } = useUsers();
    const navigate = useNavigate();

    const validateField = (value, fieldName) => {
        const updatedForm = { ...form, [fieldName]: value };
        try {
            switch (fieldName) {
                case "lastname":
                case "firstname":
                    validateIdentity(updatedForm.lastname, updatedForm.firstname);
                    break;
                case "email":
                    validateEmail(value);
                    break;
                case "postalCode":
                    validatePostCode(value);
                    break;
                case "birth":
                    calculateAge({ birth: new Date(value) });
                    break;
                default:
                    break;
            }
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: undefined }));
        } catch (err) {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: err.message }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (touched[name]) {
            validateField(value, name);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(value, name);
    };

    const isFormValid =
        Object.values(errors).every((e) => !e) &&
        Object.values(form).every((v) => v !== "");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        try {
            validateIdentity(form.lastname, form.firstname);
        } catch (err) {
            newErrors.firstname = err.message;
            newErrors.lastname = err.message;
        }
        try {
            validateEmail(form.email);
        } catch (err) {
            newErrors.email = err.message;
        }
        try {
            validatePostCode(form.postalCode);
        } catch (err) {
            newErrors.postalCode = err.message;
        }
        try {
            calculateAge({ birth: new Date(form.birth) });
        } catch (err) {
            newErrors.birth = err.message;
        }

        setTouched({
            firstname: true,
            lastname: true,
            email: true,
            birth: true,
            city: true,
            postalCode: true,
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setUsers([...users, form]);

        setSuccess(true);
        setForm({
            lastname: "",
            firstname: "",
            email: "",
            birth: "",
            city: "",
            postalCode: "",
        });
        setTouched({});
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
                            errors[field] ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors[field] && (
                        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                    )}
                </div>
            ))}

            <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-2 rounded-lg font-semibold transition ${
                    isFormValid ? "bg-blue-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
            >
                Submit
            </button>

            {success && <div className="bg-green-500 text-white p-2 rounded">User saved successfully!</div>}
        </form>
    );
}

export default RegistrationForm;
