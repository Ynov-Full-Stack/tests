import React, { useState } from "react";
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

    /**
     * Get every change
     * @param e
     */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        try {
            validateIdentity(form.lastname, form.firstname);
        } catch (err) {
            newErrors.identity = err.message;
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

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            localStorage.setItem("user", JSON.stringify(form));
        }
    };

    return (
        <form onSubmit={handleSubmit} data-testid="form" className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
            <input name="firstname" placeholder="Firstname" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
            <input name="lastname" placeholder="Lastname" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
            <input name="email" placeholder="Email" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
            <input name="birth" type="date"   data-testid="birth" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
            <input name="city" placeholder="City" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
            <input name="postalCode" placeholder="Postal Code" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>

            {Object.values(errors).map((err, index) => (
                <p key={index}>{err}</p>
            ))}

            <button type="submit"className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >Submit</button>
        </form>
    );
}

export default RegistrationForm;
