import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((state) => state.post);
  return (
    <div>
      {Array.isArray(posts) ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p>No posts available!!!</p>
      )}
      {/* {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))} */}
    </div>
  );
};

export default Posts;
