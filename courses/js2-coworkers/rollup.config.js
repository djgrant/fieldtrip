import typescript from "@rollup/plugin-typescript";

export default {
  input: "config.ts",
  output: {
    dir: "output",
    format: "cjs",
  },
  plugins: [typescript()],
};
