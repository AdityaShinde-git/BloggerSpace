// src/components/BlogCard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BlogCard = ({ blog, onDelete }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState(blog.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const likeKey = `like_${blog._id}`;
  const bookmarkKey = `bookmark_${blog._id}`;

  useEffect(() => {
    setLiked(localStorage.getItem(likeKey) === "true");
    setBookmarked(localStorage.getItem(bookmarkKey) === "true");
  }, [blog._id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await axios.delete(`https://bloggerspace-yjdi.onrender.com/api/blogs/${blog._id}`);
      onDelete();
    }
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    localStorage.setItem(likeKey, newLiked);
  };

  const handleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    localStorage.setItem(bookmarkKey, newBookmarked);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`https://bloggerspace-yjdi.onrender.com/api/blogs/${blog._id}/comment`, {
        user: "Anonymous",
        message: newComment,
      });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="border rounded p-4 shadow bg-white">
      <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            blog.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
          }`}
        >
          {blog.status}
        </span>
        <span className="text-xs text-gray-500">Last updated: {new Date(blog.updated_at).toLocaleString()}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {blog.tags.map((tag, i) => (
          <span key={i} className="bg-gray-200 text-sm px-2 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => navigate(`/editor/${blog._id}`)}
        >
          📝 Edit
        </button>
        <button
          className="text-sm text-red-600 hover:underline"
          onClick={handleDelete}
        >
          🗑 Delete
        </button>
        <button
          className="text-sm hover:text-green-600"
          onClick={handleLike}
        >
          👍 {liked ? "Liked" : "Like"}
        </button>
        <button
          className="text-sm hover:text-purple-600"
          onClick={handleBookmark}
        >
           📑 {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
        <button
          className="text-sm hover:text-gray-700"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {showComments ? "Hide" : "Show"} Comments
        </button>
      </div>

      {showComments && (
        <div className="mt-4">
          <div className="space-y-2">
            {comments.map((c, i) => (
              <div key={i} className="border rounded p-2 bg-gray-50">
                <p className="text-sm font-semibold">{c.user}</p>
                <p className="text-sm">{c.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border px-2 py-1 rounded"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
