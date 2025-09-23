import React, { useState } from "react";
import "./ComplaintBox.css";

export default function ComplaintBox() {
  // state variables
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    complaint: "",
    anonymous: true,
  });

  // handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Complaint submitted:", formData);

     setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      complaint: "",
      anonymous: true,
    });
   
    alert("Complaint submitted successfully!");
  };

  return (
    <div className="content">
      {/* Left Column */}
      <aside className="left-col">
        <h2>Complaint Box</h2>
        <p className="subtitle">
          Contact wardens anytime between <strong>8pm to 10pm</strong>
        </p>

        <div className="contact-info">
          <div className="ci">
            <span className="icon">
              <i style={{ color: "white" }} className="fa-solid fa-phone-volume"></i>
            </span>
            +91 123454545
          </div>
          <div className="ci">
            <span className="icon">
              <i style={{ color: "white" }} className="fa-solid fa-message"></i>
            </span>
            adwaith@iiitkottayam.ac.in
          </div>
          <div className="ci">
            <span className="icon">
              <i style={{ color: "white" }} className="fa-solid fa-location-dot"></i>
            </span>
            Room Number BB213 and AA 100
          </div>
        </div>

        <div className="big-circles" aria-hidden="true">
          <div className="circle circle--big" />
          <div className="circle circle--med" />
        </div>
      </aside>

      {/* Right Column - Form */}
      <section className="right-col">
        <form className="form" onSubmit={handleSubmit}>
          <div className="two-col">
            <div className="field">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="two-col">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label>Select Subject?</label>
            <div className="radio-row">
              {["General Inquiry", "Network Issue", "Electrical Issue", "Water Issue"].map((subj) => (
                <label key={subj}>
                  <input
                    type="radio"
                    name="subject"
                    value={subj}
                    checked={formData.subject === subj}
                    onChange={handleChange}
                  />
                  {subj}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Complaint</label>
            <textarea
              name="complaint"
              placeholder="Write your complaint..."
              value={formData.complaint}
              onChange={handleChange}
            />
          </div>

          <div className="form-bottom">
            <label className="anon">
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
              />
              Keep your name anonymous
            </label>
            <button className="submit-btn" type="submit">
              File Complaint
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
