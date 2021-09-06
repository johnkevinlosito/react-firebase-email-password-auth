import React, { useRef, useContext, useState } from "react";
import AuthContext from "../../context/auth-context";

const ProfileForm = () => {
  const passwordRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const authContext = useContext(AuthContext);
  const token = authContext.token;
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredPassword = passwordRef.current.value;

    setIsLoading(true);
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          idToken: token,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
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
        setSuccess(true);
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authContext.login(data.idToken, expirationTime.toISOString());
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  return (
    <form className="flex flex-col my-4" onSubmit={submitHandler}>
      {success && (
        <div className="mb-2 rounded-lg bg-green-400 p-2 text-white">
          Change Password success!
        </div>
      )}
      {error && (
        <div className="mb-2 rounded-lg bg-red-400 p-2 text-gray-200">
          {error}
        </div>
      )}
      <div className="mb-2">
        <label htmlFor="new-password" className="text-gray-600">
          New Password
        </label>
        <input
          ref={passwordRef}
          type="password"
          id="new-password"
          className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-600 focus:ring-0 focus:border-black"
        />
      </div>
      <div>
        {isLoading && <p className="w-full">Please wait...</p>}
        {!isLoading && (
          <button className="bg-blue-600 hover:bg-blue-400 text-gray-100 p-2 rounded-lg w-full">
            Change Password
          </button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
