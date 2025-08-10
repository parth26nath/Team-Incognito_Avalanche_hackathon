export const setAuthToken = (token: any) => {
  return localStorage.setItem("token", token);
};

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token ? token : "";
};

export const setAuthUser = (user: any) => {
  setAuthToken(user?.token);
  return localStorage.setItem("user", JSON.stringify(user));
};

export const getAuthUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const removeAuthToken = () => {
  return localStorage.removeItem("token");
};

export const removeAuthUser = () => {
  removeAuthToken();
  return localStorage.removeItem("user");
};

export const setLoggedUser = (user: any) => {
  localStorage.setItem("profile", JSON.stringify(user));
  return true;
};

export const setAuthNonce = (token: any) => {
  return localStorage.setItem("nonce", token);
};

export const getAuthNonce = () => {
  return localStorage.getItem("nonce");
};

export const removeAuthNonce = () => {
  return localStorage.removeItem("nonce");
};
