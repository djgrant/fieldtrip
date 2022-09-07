import * as yup from "yup";

const schema = yup.object().shape({
  id: yup.string().required(),
  repo: yup.string().required(),
  title: yup.string().required(),
  module: yup.string().required(),
  summary: yup.string().required(),
  stages: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        key: yup.string().required(),
        label: yup.string().required(),
        summary: yup.string().required(),
        actions: yup.array(),
        milestones: yup.array(),
        hooks: yup.array(),
      })
    ),
});

export default schema;
