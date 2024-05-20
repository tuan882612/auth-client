import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./assets/styles/index.css";
import BaseForm from "./components/Form.tsx";
import { FormType } from "./interfaces/FormType.interface";
import NotFound from "./pages/NotFound.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<BaseForm {...{ formType: FormType.Login }} />} />
        <Route
          path="register"
          element={<BaseForm {...{ formType: FormType.Register }} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
