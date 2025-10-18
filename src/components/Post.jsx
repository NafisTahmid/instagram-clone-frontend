import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialogue from "./CommentDialogue";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [likeState, setLikeState] = useState(
    post.likes.includes(user?._id) || false
  );
  const [totalLikes, setTotalLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post?.comments);
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    const input = e.target.value;
    if (input.trim()) {
      setText(input);
    } else {
      setText("");
    }
  };
  const deleteHandler = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (response.data.success === true) {
        const updatedPosts = posts.filter(
          (postItem) => postItem._id !== post._id
        );
        dispatch(setPosts(updatedPosts));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const liked = likeState ? "dislike" : "like";
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/post/${post._id}/${liked}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const likeCounts = liked ? totalLikes - 1 : totalLikes + 1;
        setTotalLikes(likeCounts);
        setLikeState(!likeState);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes:
                  liked === "like"
                    ? [...p.likes, user._id] // Add user to likes
                    : p.likes.filter((id) => id !== user._id), // Remove user from likes
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const commentHandler = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const updatedComments = [...comments, response.data.newComment];
        setComments(updatedComments);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: updatedComments, // Update the comments in Redux
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        console.log("Comment: ", response.data.newComment);
        toast.success(response.data.message);
        setText("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const updatedPost = posts.find((p) => p._id === post._id);
    if (updatedPost) {
      setComments(updatedPost.comments);
    }
  }, [posts, post._id]);
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post?.author.profilePicture} alt="User" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post?.author.username}</h1>
          {user?._id === post?.author._id && (
            <Badge variant="secondary" className="gap-3">
              Author
            </Badge>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit font-bold">
              Add to Favorites
            </Button>
            {user && user._id === post.author._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit font-bold"
                onClick={deleteHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post.image}
        alt="post-image"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {likeState ? (
            <FaHeart
              size={"22px"}
              className="text-red-700 cursor-pointer"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
              onClick={likeOrDislikeHandler}
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600 "
          />
          <Send className="cursor-pointer hover:text-gray-600 " />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{post?.likes.length} Likes</span>
      <p className="">
        <span className="font-medium mr-2">{post?.author.username}</span>{" "}
        {post?.caption}
      </p>
      {comments.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {post.comments.length} comments
        </span>
      )}

      <CommentDialogue open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            className="cursor-pointer text-[#3BADF8]"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
