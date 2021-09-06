import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calcRemainingTime = (expirationTime) => {
  const currTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjExpirationTime - currTime;
  return remainingTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("authToken");
  const storedExpirationDate = localStorage.getItem("expiresIn");

  const remainingTime = calcRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    //1 min
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiresIn");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiresIn");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("expiresIn", expirationTime);
    const remainingTime = calcRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
