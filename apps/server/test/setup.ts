import axios from "axios";
import MockAdapter from "axios-mock-adapter";

export const instance = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 1000,
  validateStatus: function (status) {
    return status !== 0;
  },
});

export const mock = new MockAdapter(axios);
