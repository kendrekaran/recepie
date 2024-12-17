import React, { useState } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setShowError(true);
      return;
    }

    const Email = email.toLowerCase();

    try {
      const [localResponse, renderResponse] = await Promise.all([
        fetch("https://recipeapp-oqhr.onrender.com/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: Email, password }),
        }),
        fetch("https://recipe-app-mern.onrender.com/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: Email, password }),
        }),
      ]);

      const responses = await Promise.all([localResponse.json(), renderResponse.json()]);

      if (responses[0].error) {
        toast.warn("User already exists in local API. Try with a different email");
      } else {
        // toast.success("yoho.");
        localStorage.setItem("token", responses[0].token);
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      }

      if (responses[1].error) {
        toast.warn("User already exists in Render API. Try with a different email");
      } else {
        toast.success("Registration successfull.");
        localStorage.setItem("token", responses[1].token);
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      }
    } catch (error) {
      toast.error("An error occurred while registering user:", error);
    }
  };

  return (
    <div className="SignupContainer">
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <h2>SignUp</h2>
        <input
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {showError && (
        <span className="fill-fields-error">Please Fill all the fields</span>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
