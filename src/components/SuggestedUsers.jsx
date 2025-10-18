import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested users:</h1>
        <span className="font-medium cursor-pointer">See all</span>
      </div>
      {suggestedUsers?.map((suggestedUser) => {
        return (
          <div
            key={suggestedUser?._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${suggestedUser?._id}`}>
                <Avatar>
                  <AvatarImage src={suggestedUser?.profilePicture} alt="User" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${suggestedUser._id}`}>
                {suggestedUser?.username}
              </Link>
            </h1>
            <span className="font-bold text-sm text-blue-500 hover:text-blue-700">
              Follow
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
