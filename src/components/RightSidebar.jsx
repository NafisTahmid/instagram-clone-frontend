import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-fit my-10 pr-32">
      <Link to={`/profile/${user?._id}`}>
        <Avatar>
          <AvatarImage src={user?.profilePicture} alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      <Link to={`/profile/${user?._id}`}>
        <h1 className="font-semibold text-sm">{user?.username}</h1>
      </Link>
      <span className="text-sm">{user?.bio || "Bio here..."}</span>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
