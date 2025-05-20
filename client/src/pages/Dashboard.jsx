// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [sortKey, setSortKey] = useState("updated_at");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://bloggerspace-yjdi.onrender.com/api/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs
    .filter((b) => (filterTag ? b.tags.includes(filterTag) : true))
    .sort((a, b) => {
      if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

  const tags = [...new Set(blogs.flatMap((b) => b.tags))];

  const totalBlogs = blogs.length;
  const draftCount = blogs.filter((b) => b.status === "draft").length;
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <button
            onClick={() => navigate("/")}
            className="fixed top-2 right-2 bg-blue-500 text-white text-xl px-4 py-2 rounded hover:bg-blue-800 hover:scale-110 transition"
          >
           Workspace
          </button>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">Total Blogs: {totalBlogs}</div>
        <div className="bg-yellow-100 p-4 rounded shadow">Drafts: {draftCount}</div>
        <div className="bg-green-100 p-4 rounded shadow">
          Recent:
          <ul className="list-disc pl-4 text-sm">
            {recentBlogs.map((b) => (
              <li key={b._id}>{b.title}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Filter + Sort */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-3 py-1 rounded-full border ${filterTag === tag ? "bg-blue-500 text-white" : "bg-white text-black"}`}
          >
            #{tag}
          </button>
        ))}
        {filterTag && (
          <button
            onClick={() => setFilterTag("")}
            className="text-sm text-red-600 ml-2"
          >
            Clear Filter
          </button>
        )}

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="ml-auto border px-2 py-1 rounded"
        >
          <option value="updated_at">Sort by Updated</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} onDelete={fetchBlogs} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
