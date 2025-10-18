import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ChatPage = () => {
  const { user, suggestedUsers } = useSelector((state) => state.auth);
  const isOnline = true;
  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="mb-4 font-bold px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 text-gray-400" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            return (
              <div>
                <div className="flex flex-row items-center ml-4 gap-4">
                  <Avatar>
                    <AvatarImage
                      src={suggestedUser?.profilePicture}
                      alt={suggestedUser?.username}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="mt-3">
                    <span className="text-small font-medium">
                      {suggestedUser?.username}
                    </span>
                    <br />
                    <span
                      className={`font-medium text-xs ${
                        isOnline ? "text-green-500" : "text-gray-950"
                      }`}
                    >
                      online
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
