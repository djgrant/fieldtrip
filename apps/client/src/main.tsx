import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, store } from "./store";
import { Index } from "./pages/index";
import { Course } from "./pages/course";
import { NotFound } from "./pages/not-found";
import { RegisterNewCourse } from "./pages/registerNewCourse";
import { Announcement } from "./components/app";
import "./main.css";

ReactDOM.render(
  <Announcement message="Initialising lab..." />,
  document.getElementById("root")
);

store
  .init()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <Provider value={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="courses/:id/*" element={<Course />} />
              <Route
                path="register-new-course"
                element={<RegisterNewCourse />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  })
  .catch((err) => {
    console.info("Hey there! Something went wrong while initialising the app.");
    console.info("Maybe you can figure it out from this error:");
    console.error(err);
    ReactDOM.render(
      <Announcement message="Oh noes! Something went wrong" />,
      document.getElementById("root")
    );
  });
