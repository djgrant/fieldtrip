import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Index: FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("courses/js2");
  });
  return <div>index</div>;
};
