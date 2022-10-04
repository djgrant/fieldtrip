import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Announcement } from "../components/app";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Announcement message="This page doesn't exist" />;
    }

    if (error.status === 401) {
      return <Announcement message="You aren't authorized to see this" />;
    }

    if (error.status === 503) {
      return <Announcement message="Looks like our API is down" />;
    }

    if (error.status === 418) {
      return <Announcement message="🫖" />;
    }
  }

  return <Announcement message="Something went wrong" />;
}
