import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error("Error fetching blog:", err));
  }, [id]);

  if (!blog) return (
    <div className="flex justify-center items-center h-[60vh] text-gray-600">
      Loading...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-md rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{blog.title}</h1>

      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
        <span> Created: {new Date(blog.created_at).toLocaleDateString()}</span>
        <span> Updated: {new Date(blog.updated_at).toLocaleDateString()}</span>
        <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded">
          {blog.status.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {blog.tags.map((tag, i) => (
          <span
            key={i}
            className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-800"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="prose prose-lg max-w-none">
        {/* Render safe HTML (already sanitized on backend) */}
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      <button
            onClick={() => navigate("/")}
            className="fixed top-2 left-2 bg-blue-500 text-white text-xl px-4 py-2 rounded hover:bg-blue-800 hover:scale-110 transition"
          >
           Workspace
          </button>
    </div>
  );
};

export default BlogView;
