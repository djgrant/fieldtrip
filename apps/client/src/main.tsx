import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider } from "react-router-dom";
import { Provider, store } from "./store";
import { Announcement } from "./components/app";
import { router } from "./router";
import "./main.css";

ReactDOM.render(
  <Announcement message="Initialising lab..." />,
  document.getElementById("root")
);

ReactDOM.render(
  <React.StrictMode>
    <Provider value={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
