import React, { useState, useEffect, useRef } from "react";
import PostCreator from "../components/Post/PostCreator";
import PostSkeleton from "../components/Post/PostSkeleton";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API } from "../API/API";
import Post from "../components/Post/Post";
import toast from "react-hot-toast";
import { UploadImage } from "../utils/UploadImage";
import CustomLoader from "../components/Loader/CustomLoader";
import BlockUi from "@availity/block-ui";
import { motion } from "framer-motion";
function Home() {
  const iconColor = "rgb(55 65 81)";
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [feed, setFeed] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    getMyFeed();
  }, []);

  const getMyFeed = async () => {
    const query = {
      page,
      limit,
    };
    try {
      const res = await axios.get(API.Feed.getFeed, { params: query });
      setFeed(res.data.feed)
      setTotalPages(res.data.totalPages);
      setLoadingFeed(false);
    } catch (error) {
      toast.error("Please Try Again Later !");
      setLoadingFeed(false);
    }
  };

  const createPost = async (file, title) => {
    setCreatingPost(true);
    let imageUrl = "";
    if (file) {
      try {
        imageUrl = await UploadImage(file, "fit");
      } catch (error) {
        toast.error("Please Try Again Later !");
      }
    }
    try {
      const payload = {
        title: title,
        image: imageUrl,
      };
      await axios.post(API.Posts.createNewPost, payload);
      setCreatingPost(false);
      setLoadingFeed(true);
      await getMyFeed();
      setLoadingFeed(false);
    } catch (error) {
      toast.error("Please Try Again Later !");
      setCreatingPost(false);
    }
  };

  return (
    <>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.3}} className="lg:mx-72 mx-5 mt-5">
        <BlockUi
          blocking={creatingPost}
          loader={<CustomLoader size={40} color="blue" />}
        >
          {!loadingFeed&&<PostCreator refresh={getMyFeed} createPost={createPost} />}
        </BlockUi>
        <div className="w-full flex flex-col items-center gap-8">
          {loadingFeed ? (
            <PostSkeleton />
          ) : feed.length === 0 ? (
            <div className="flex flex-col items-center lg:mt-14 mt-8 justify-center lg:p-8 p-4 py-5">
              <h1 className="lg:text-2xl text-xl font-medium text-gray-700">
                You don't have feed to view.
              </h1>
              <p className="mt-4 text-sm lg:text-base text-gray-500 text-center">
                Start creating posts or follow users.
              </p>
            </div>
          ) : (
            feed.map((post, index) => (
              <Post key={index} post={post} refresh={getMyFeed} isFeed={true} />
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}

export default Home;
