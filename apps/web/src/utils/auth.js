export const getUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const u = localStorage.getItem("ce_user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ce_token");
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ce_token");
  localStorage.removeItem("ce_user");
  window.location.href = "/auth/login";
};

export const requireAuth = (allowedRoles = []) => {
  if (typeof window === "undefined") return null;
  const user = getUser();
  if (!user) {
    window.location.href = "/auth/login";
    return null;
  }
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role) &&
    user.role !== "superadmin"
  ) {
    const dash =
      user.role === "superadmin"
        ? "/admin"
        : user.role === "fournisseur"
          ? "/supplier"
          : "/dashboard";
    
    // If already on the correct dashboard but role still doesn't match, avoid loop
    if (window.location.pathname === dash) {
       window.location.href = "/";
    } else {
       window.location.href = dash;
    }
    return null;
  }
  return user;
};
