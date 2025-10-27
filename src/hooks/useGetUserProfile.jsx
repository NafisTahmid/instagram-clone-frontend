import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setUserProfile } from "@/redux/authSlice";
const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserProfile = async () => {
      console.log("Calling suggested users hook");
      // import.meta.env.VITE_BACKEND_URL
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (response.data.success === true) {
          dispatch(setUserProfile(response.data.user));
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    getUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
