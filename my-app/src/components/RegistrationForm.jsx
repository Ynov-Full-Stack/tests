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
        <form onSubmit={handleSubmit} data-testid="form">
            <input name="firstname" placeholder="Firstname" onChange={handleChange} />
            <input name="lastname" placeholder="Lastname" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="birth" type="date"   data-testid="birth" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="postalCode" placeholder="Postal Code" onChange={handleChange} />

            {Object.values(errors).map((err, index) => (
                <p key={index}>{err}</p>
            ))}

            <button type="submit">Submit</button>
        </form>
    );
}

export default RegistrationForm;
