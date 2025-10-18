import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { AtSign, Badge, Heart, MessageCircle } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  (store) => store.auth;
  const isLoggedInUserProfile = userProfile?._id === user?._id;

  const isFollowing = user?.following?.includes(userProfile?._id) || false;
  console.log("Is following: ", isFollowing);
  const displayPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
  const followOrUnfollow = async () => {
    try {
      const token = Cookies.get("token");
      console.log("Token:", token);
      if (!token) {
        toast.error("Token not found.");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/follow-or-unfollow/${
          userProfile?._id
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data.success === true) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="flex max-w-4xl justify-center mx-auto">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt={userProfile?.bio}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to={"/account/edit"}>
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      onClick={followOrUnfollow}
                      variant="secondary"
                      className="h-8 cursor-pointer"
                    >
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={followOrUnfollow}
                    className="h-8 bg-[#0095F6] hover:bg-[#3192D2] cursor-pointer"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-bold">{userProfile?.posts.length}</span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-bold">
                    {userProfile?.followers.length}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-bold">
                    {userProfile?.following.length}
                  </span>{" "}
                  followings
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "Bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 text-sm cursor-pointer ${
                activeTab == "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 text-sm cursor-pointer ${
                activeTab == "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 text-sm cursor-pointer ${
                activeTab == "" ? "font-bold" : ""
              }`}
            >
              REELS
            </span>
            <span
              className={`py-3 text-sm cursor-pointer ${
                activeTab == "" ? "font-bold" : ""
              }`}
            >
              TAGS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayPost?.map((post) => {
              return (
                <div key={post._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                    alt="post-image"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post.comments?.length}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
