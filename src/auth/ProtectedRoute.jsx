import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ claims, children }) {
  if (claims === undefined) {
    return (
      <div>
        <h1>Loading</h1>
        <p>Checking your session...</p>
      </div>
    );
  }

  if (!claims) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
