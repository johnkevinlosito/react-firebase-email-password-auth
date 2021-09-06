import React from "react";
import ProfileForm from "./ProfileForm";

const UserProfile = () => {
  return (
    <section className="container mx-auto max-w-xl">
      <h1 className="text-5xl text-center">Profile</h1>
      <ProfileForm />
    </section>
  );
};

export default UserProfile;
