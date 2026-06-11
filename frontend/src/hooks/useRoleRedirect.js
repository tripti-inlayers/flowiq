// frontend/src/hooks/useRoleRedirect.js
// -------------------------------------------------------
// Call this in any component that needs to send the user
// to their home page based on role.
// -------------------------------------------------------

import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const ROLE_HOME = {
  kirana_owner: "/kirana",
  driver:       "/matches",
  shipper:      "/matches",
  admin:        "/",
};

export function useRoleRedirect() {
  const navigate = useNavigate();

  const redirectByRole = useCallback((role) => {
    navigate(ROLE_HOME[role] || "/", { replace: true });
  }, [navigate]);

  return { redirectByRole, ROLE_HOME };
}
