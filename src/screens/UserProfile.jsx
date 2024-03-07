import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../API/API";
import axios from "axios";
import Post from "../components/Post";
import no_user from "../assets/no_user.png";
import Skeleton from "react-loading-skeleton";
import NoPostsUser from "../components/NoPostsUser";
import PostSkeleton from "../components/PostSkeleton";
import Modal from "../components/Modal";
import UserListItem from "../components/UserListItem";
import { useParams } from "react-router-dom";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function UserProfile() {
  const { token } = useAuth();
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [title, setTitle] = useState("");
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    getUserProfile();
    getMyProfile();
    getAllPosts();
  }, []);
  const getUserProfile = async () => {
    try {
      const URI = API.Profile.userProfile.replace(":userId", userId);
      const res = await axios.get(URI);
      setUserProfile(res.data.profile);
    } catch (error) {
      toast.error("Please Try Again Later !");
    }
  };
  const getAllPosts = async () => {
    let URI = API.Posts.allPosts.replace(":userId", userId);
    try {
      const res = await axios.get(URI);
      setPosts(res.data.posts);
      setLoadingPosts(false);
    } catch (error) {
      toast.error("Please Try Again Later !");
    }
  };
  const getMyProfile = async () => {
    try {
      const res = await axios.get(API.Profile.myProfile);
      setMyProfile(res.data.myProfile);
    } catch (error) {
      toast.error("Please Try Again Later !");
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const openModal = (title) => {
    setTitle(title);
    setShowModal(true);
  };
  const isFollowing = (id) => {
    if (
      myProfile.following.filter((user) => {
        return user._id === id;
      }).length
    ) {
      return true;
    }
    return false;
  };
  const followUser = async (id) => {
    try {
      setLoading(true);
      let URI = API.Profile.follow.replace(":userId", id);
      await axios.patch(URI);
      await getUserProfile();
      await getMyProfile();
      setLoading(false);
      toast.success(`Started Following ${userProfile.user_name}`);
    } catch (error) {
      toast.error("Please Try Again Later !");
    }
  };
  const unfollowUser = async (id) => {
    try {
      setLoading(true);
      let URI = API.Profile.unfollow.replace(":userId", id);
      await axios.patch(URI);
      await getUserProfile();
      await getMyProfile();
      setLoading(false);
      toast.info(`Removed ${userProfile.user_name}`);
    } catch (error) {
      toast.error("Please Try Again Later !");
    }
  };
  const handleLikePost = async (postId) => {
    const URI = API.Posts.like.replace(":postId", postId);
    try {
      await axios.post(URI);
      await getAllPosts();
    } catch (error) {
      toast.error("Please Try Again Later !");
    }
  };
  const handleUnlikePost = async (postId) => {
    const URI = API.Posts.like.replace(":postId", postId);
    try {
      await axios.delete(URI);
      await getAllPosts();
    } catch (error) {
      toast.error("Please Try Again Later !");
    }
  };
  return (
    <div className="layout scroll-smooth">
      {/* Followers/Following Modal */}
      <ToastContainer position="bottom-center" autoClose={3000} newestOnTop />
      <Modal title={title} isOpen={showModal} onClose={closeModal}>
        {<BlockUi blocking={loading} tag="div">
          <div>
            {title==="Followers"&&!userProfile.followers.length?<p className="text-center font-medium mt-5 lg:text-lg text-base text-gray-500">No Followers</p>:"" }
            {title==="Following"&&!userProfile.following.length?<p className="text-center font-medium mt-5 lg:text-lg text-base text-gray-500">Following No One</p>:"" }
            {title === "Followers" &&
              userProfile.followers.map((user) => {
                return (
                  <UserListItem
                    key={user.user_name}
                    followUser={followUser}
                    unfollowUser={unfollowUser}
                    user={user}
                    isFollowing={isFollowing}
                  />
                );
              })}
            {title === "Following" &&
              userProfile.following.map((user) => {
                return (
                  <UserListItem
                    key={user.user_name}
                    followUser={followUser}
                    unfollowUser={unfollowUser}
                    user={user}
                    isFollowing={isFollowing}
                  />
                );
              })}
          </div>
        </BlockUi>}
      </Modal>
      {/* profile */}
      <BlockUi blocking={loading} tag="div">
        <div className="box lg:mx-72 mx:20 lg:mt-12 mt-5">
          <div className="info flex items-center gap-5 mx-5">
            <div className="avatar">
              {userProfile ? (
                <img
                  draggable="false"
                  alt="avatar"
                  src={userProfile.avatar ? userProfile.avatar : no_user}
                  className={`lg:w-24 w-16 rounded-full ${
                    !userProfile.avatar && "opacity-60"
                  }`}
                />
              ) : (
                <Skeleton circle width={100} height={100} />
              )}
            </div>
            <div className="name">
              <p className="font-medium text-xl lg:text-2xl mb-.5">
                {userProfile ? (
                  userProfile.name
                ) : (
                  <Skeleton style={{ width: "150px" }} />
                )}
              </p>
              <p className="font-medium text-gray-500 text-md lg:text-lg">
                {userProfile ? "@" + userProfile.user_name : <Skeleton />}
              </p>
            </div>
          </div>
          <div
            className={`stats flex justify-between lg:gap-16 lg:mx-10 mx-12 text-center mt-5 lg:absolute lg:right-80 lg:top-28 ${
              loading && "invisible"
            }`}
          >
            <div className="p-1">
              <p className="lg:text-2xl text-xl font-medium">
                {userProfile ? userProfile.total_posts : <Skeleton />}
              </p>
              <p className="lg:text-lg text-base text-gray-600 font-medium">
                Posts
              </p>
            </div>
            <div
              onClick={() => openModal("Followers")}
              className="p-1 lg:ml-4 ml-7 cursor-pointer"
            >
              <p className="lg:text-2xl text-xl font-medium">
                {userProfile ? userProfile.followers.length : <Skeleton />}
              </p>
              <p className="lg:text-lg text-base text-gray-600 font-medium">
                Followers
              </p>
            </div>
            <div
              onClick={() => openModal("Following")}
              className="p-1 cursor-pointer"
            >
              <p className="lg:text-2xl text-xl font-medium">
                {userProfile ? userProfile.following.length : <Skeleton />}
              </p>
              <p className="lg:text-lg text-base text-gray-600 font-medium">
                Following
              </p>
            </div>
          </div>
          {userProfile && (
            <div className="lg:ml-5 lg:block w-full lg:w-auto flex justify-center lg:mt-6 mt-4">
              {myProfile && !isFollowing(userProfile._id) ? (
                <button
                  onClick={() => followUser(userId)}
                  className="bg-blue-600 hover:bg-blue-700 text-md text-white font-semibold px-6 py-1.5 rounded-lg border border-blue-700 w-11/12 lg:w-auto"
                >
                  Follow
                </button>
              ) : (
                <button
                  onClick={() => unfollowUser(userId)}
                  className="bg-gray-200 hover:bg-gray-300 text-md font-semibold px-6 py-1.5 rounded-lg border border-gray-300 w-11/12 lg:w-auto"
                >
                  Unfollow
                </button>
              )}
            </div>
          )}
          <div className="about mx-6 lg:mt-8 mt-4">
            <p className="text-base font-medium">About Me</p>
            <div className="lg:w-11/12 w-full">
              <p className="text-base text-gray-500">
                {userProfile ? userProfile.bio : <Skeleton />}
              </p>
            </div>
          </div>
          {/* Posts */}
          <div className="posts mt-10 mx-5">
            <p className="text-2xl mb-5 font-medium text-gray-700">Posts</p>
            <div className="w-full flex flex-col items-center gap-10">
              {loadingPosts ? (
                <PostSkeleton />
              ) : posts.length === 0 ? (
                <NoPostsUser />
              ) : (
                posts.map((post) => (
                  <Post
                    key={post.title}
                    post={post}
                    handleLikePost={handleLikePost}
                    handleUnlikePost={handleUnlikePost}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </BlockUi>
    </div>
  );
}

export default UserProfile;