import { useState } from "react";
import { api } from "../utils/api";
import { toaster } from "evergreen-ui";

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
    <form onSubmit={submit}>
      <label htmlFor="courseUrl">Course Github Link</label>
      <input
        type="url"
        name="courseUrl"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      {/*  {state.errors.name && <p>{state.errors.name}</p>} */}

      <button type="submit" name="Submit Course">
        Submit course
      </button>
    </form>
  );
};
