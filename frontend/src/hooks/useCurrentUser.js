// frontend/src/hooks/useCurrentUser.js
// -------------------------------------------------------
// Drop-in replacement for any existing manual ID passing.
//
// Usage in existing pages — BEFORE (what you had):
//   const storeId = "some-hardcoded-uuid";
//   fetch(`/inventory?store_id=${storeId}`)
//
// AFTER (no more manual IDs):
//   const { storeId, authFetch } = useCurrentUser();
//   authFetch(`/inventory?store_id=${storeId}`)
// -------------------------------------------------------

import { useAuth } from "../context/AuthContext";

export function useCurrentUser() {
  const { user, token, authFetch } = useAuth();

  return {
    user,
    token,
    authFetch,

    // Convenience getters — undefined when not applicable
    userId:   user?.id,
    role:     user?.role,
    storeId:  user?.store_id,   // kirana_owner only
    truckId:  user?.truck_id,   // driver only

    // Boolean role checks
    isKiranaOwner: user?.role === "kirana_owner",
    isDriver:      user?.role === "driver",
    isShipper:     user?.role === "shipper",
    isAdmin:       user?.role === "admin",
  };
}
