import React, { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/auth-context";

const AuthForm = () => {
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const emailRef = useRef();
  const passwordRef = useRef();

  const authContext = useContext(AuthContext);
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    setIsLoading(true);
    let url;
    if (isLogin) {
      // login
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    } else {
      // signup
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMsg = "Authentication failed";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }

            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        setError();
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authContext.login(data.idToken, expirationTime.toISOString());
        history.replace("/");
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  return (
    <section>
      <h1 className="text-5xl text-center">{isLogin ? "Login" : "Sign Up"}</h1>
      <form
        className="mt-5 container max-w-xl mx-auto flex flex-col"
        onSubmit={submitHandler}
      >
        {error && (
          <div className="mb-2 rounded-lg bg-red-400 p-2 text-gray-200">
            {error}
          </div>
        )}
        <div className="mb-2">
          <label htmlFor="email" className="text-gray-600">
            Your Email
          </label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-600 focus:ring-0 focus:border-black"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="text-gray-600">
            Your Password
          </label>
          <input
            ref={passwordRef}
            type="password"
            id="password"
            className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-600 focus:ring-0 focus:border-black"
            required
          />
        </div>
        <div className="flex flex-row justify-between gap-x-4">
          {!isLoading && (
            <button className="bg-blue-600 hover:bg-blue-400 text-gray-100 p-2 rounded-lg w-full">
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
          {isLoading && <p className="w-full">Please wait...</p>}
          <button
            type="button"
            className="text-gray-600 p-2 w-full hover:underline"
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
