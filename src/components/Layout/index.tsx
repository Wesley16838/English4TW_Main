import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { setUserLogout, setUserLoginSuccess } from "actions/user";
import authDeviceStorage from "services/authDeviceStorage";
import api from "services/api";
import { useQueryClient } from "react-query";

const Layout = ({ children }: any) => {
  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    const relaunchUserLogin = async () => {
      try {
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if (result) {
          const payload = JSON.parse(result);
          const token = JSON.parse(result).token;
          const hourExpire = 1000 * 60 * 60;
          if (Date.now() - payload.date > hourExpire) {
            dispatch(setUserLogout());
          } else {
            dispatch(setUserLoginSuccess());
          }
        }
      } catch (err) {}
    };
    relaunchUserLogin();
  }, [dispatch]);

  return <>{children}</>;
};

export default Layout;
