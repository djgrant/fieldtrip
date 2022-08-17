import type { FC, ReactNode } from "react";
import { Header } from "../app";

interface Props {
  children: ReactNode;
}

export const AppLayout: FC<Props> = ({ children }) => {
  return (
    <div className="mb-16">
      <Header />
      <main>{children}</main>
    </div>
  );
};
