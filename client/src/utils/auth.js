export const setAuth = (token, owner) => {
  localStorage.setItem("token", token);
  localStorage.setItem("owner", JSON.stringify(owner));
};

export const getToken = () => localStorage.getItem("token");

export const getOwner = () => {
  const owner = localStorage.getItem("owner");
  return owner ? JSON.parse(owner) : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("owner");
};
