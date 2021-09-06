import React from "react";
import HeaderNav from "../HeaderNav";

const Layout = (props) => {
  return (
    <>
      <HeaderNav />
      <main className="container max-w-7xl mx-auto p-4">{props.children}</main>
    </>
  );
};

export default Layout;
