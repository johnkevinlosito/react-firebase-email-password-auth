import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth-context";

const HeaderNav = () => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext.isLoggedIn;
  const logoutHandler = () => {
    authContext.logout();
  };
  return (
    <header className="bg-blue-400">
      <div className="container max-w-7xl mx-auto flex justify-between items-center p-4 text-gray-100 font-bold">
        <Link to="/">Firebase Auth</Link>
        <nav className="flex justify-center items-baseline">
          {!isLoggedIn && (
            <Link to="/auth" className="mx-2 hover:text-blue-600">
              Login
            </Link>
          )}
          {isLoggedIn && (
            <>
              <Link to="/profile" className="mx-2 hover:text-blue-600">
                Profile
              </Link>
              <button
                className="hover:bg-blue-600 p-2 rounded-lg font-bold mx-2"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderNav;
