import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { store } from "./store";
import { socket } from "./socket";

import { Index } from "./pages/index";
import { Course } from "./pages/course";
import { Courses } from "./pages/courses";
import { NotFound } from "./pages/not-found";
import { RegisterNewCourse } from "./pages/registerNewCourse";
import React from "react";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <React.Fragment>
      <Route
        path="/"
        element={<Index />}
        loader={async () => {
          await store.loadUser();
        }}
      />
      <Route path="courses" element={<Courses />} />
      <Route
        path="courses/:id/*"
        element={<Course />}
        loader={async (args) => {
          await store.loadCourse(args.params.id);
          if (store.user) {
            socket.connect();
          }
        }}
      />
      <Route path="register-new-course" element={<RegisterNewCourse />} />
      <Route path="*" element={<NotFound />} />
    </React.Fragment>
  )
);
