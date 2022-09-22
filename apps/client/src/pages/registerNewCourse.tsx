import { useState } from "react";
import { api } from "../utils/api";
import { toaster } from "evergreen-ui";
import { AppLayout } from "../components/templates";

export const RegisterNewCourse = () => {
  const [state, setState] = useState("");

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await api.registerCourse(state);
      if (!response.ok) throw new Error(response.status.toString());
      toaster.success("Course registered successfuly!");
    } catch (err) {
      console.log(err);
      toaster.danger("Something went wrong");
    }

    /*  .then(res => res.json())
        .then(json => setState(json.user)) */
  };

  return (
    <AppLayout>
      <form
        onSubmit={submit}
        className="h-full flex flex-col items-center justify-center mt-10"
      >
        <label htmlFor="courseUrl">Course Github Link</label>
        <input
          type="url"
          name="courseUrl"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border-2"
        />
        <button
          type="submit"
          name="Submit Course"
          className="border-2 px-3 py-1 mt-5 rounded"
        >
          Submit course
        </button>
      </form>
    </AppLayout>
  );
};
