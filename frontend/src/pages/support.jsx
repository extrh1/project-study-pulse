import React, { useState } from "react";
import "../styles/support.css";

function Support({ darkMode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      className="support-page"
      style={{
        minHeight: "calc(100vh - 64px)",
        padding: "40px 20px",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #f0f4ff 0%, #dbeafe 100%)",
        color: darkMode ? "#f8fafc" : "#0f172a",
        marginTop: "64px",
      }}
    >
      <div className="support-card">
        <h1 className="gradient-title">Support</h1>
        <p className="support-description">
          If you have any questions, feel free to send us a message!
        </p>

        {submitted && (
          <p className="success-message">
            Thank you! We will contact you soon.
          </p>
        )}

        <form className="support-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="form-control my-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="form-control my-2"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="form-control my-2"
            required
          />
          <button className="btn btn-outline-primary" type="submit">
            Send Message
          </button>
          <p className="my-2"></p>
        </form>
      </div>
    </div>
  );
}

export default Support;