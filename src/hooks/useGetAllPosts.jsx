import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "@/redux/postSlice";
const useGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/post/all",
          { withCredentials: true }
        );
        if (response.data.success === true) {
          dispatch(setPosts(response.data.posts));
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    getAllPosts();
  }, []);
};

export default useGetAllPosts;
