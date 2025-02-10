import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router";

export default function Account() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("login changed", isLogin);
    if (isLogin) {
      if (role === "Customer") navigate("/");
      else if (role === "Manager") navigate("/management");
      else if (role === "Waiter") navigate("/waiter");
      else if (role === "Chef") navigate("/chef");
    }
  }, [isLogin]);
  return (
    <>
      <Outlet />
    </>
  );
}
