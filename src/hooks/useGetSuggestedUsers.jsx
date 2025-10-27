import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setSuggestedUsers } from "@/redux/authSlice";
const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getAllSuggestedUsers = async () => {
      // import.meta.env.VITE_BACKEND_URL
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/suggested`,
          { withCredentials: true }
        );
        if (response.data.success === true) {
          dispatch(setSuggestedUsers(response.data.suggestedUsers));
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    getAllSuggestedUsers();
  }, []);
};

export default useGetSuggestedUsers;
