import { useEffect, useState } from "react";
import { FormName, FormType } from "../interfaces/FormType.interface";
import { UserRequest, UserRequestErrors } from "../interfaces/User.interface";

function BaseForm({ formType }: FormName): JSX.Element {
  useEffect(() => {
    document.title = formType.valueOf();
  }, [formType]);

  const [req, setReq] = useState<UserRequest>({ email: "", password: "" });
  const [errors, setErrors] = useState<UserRequestErrors>({});

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReq({ ...req, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: UserRequestErrors = {};

    if (!req.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(req.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!req.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
        credentials: "include",
      });

      if (response.ok) {
        const uid = response.headers.get("X-Uid");
        const email = response.headers.get("X-Email");

        if (uid && email) {
          sessionStorage.setItem("_uid", uid);
          sessionStorage.setItem("_ue", email);
        }

        setReq({ email: "", password: "" });
      } else {
        const data = await response.json();
        console.log("Error:", data);
        setErrors({ form: data.message });
      }
    } catch (error) {
      setErrors({ form: "An error occurred while submitting the form" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center max-w-sm p-8 rounded-lg shadow-lg w-80 bg-zinc-200">
        <h2 className="mb-6 text-2xl font-bold text-center text-slate-500">
          {formType.valueOf()}
        </h2>
        <form
          className="flex flex-col items-center"
          onSubmit={handleFormSubmit}
        >
          {["email", "password"].map((field: string) => (
            <div key={field} className="mb-4 w-60">
              <input
                className={`rounded-md form-input outline-slate-500 px-2 w-full ${
                  errors[field] ? "border-red-400" : ""
                }`}
                type={field === "email" ? "text" : "password"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={req[field as keyof typeof req]}
                onChange={handleFormChange}
              />
              {errors[field as keyof typeof errors] && (
                <p className="mt-1 text-xs text-red-400">
                  {errors[field as keyof typeof errors]}
                </p>
              )}
            </div>
          ))}
          <button
            className="w-40 p-2 mb-4 text-white rounded-md bg-slate-700"
            type="submit"
          >
            Submit
          </button>
        </form>
        <a
          href={`/${formType === FormType.Register ? "login" : "register"}`}
          className="text-sm text-slate-500"
        >
          {formType === FormType.Register ? "Login" : "Register"} Here
        </a>
        {errors.form && (
          <p className="mt-4 text-sm text-red-400">{errors.form}</p>
        )}
      </div>
    </div>
  );
}

export default BaseForm;
