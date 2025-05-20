import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://bloggerspace-yjdi.onrender.com/api/blogs").then((res) => {
      console.log("Fetched Blogs:", res.data);
      setBlogs(res.data);
    });
  }, []);

  const drafts = blogs.filter((b) => b.status === "draft");
  const published = blogs.filter((b) => b.status === "published");

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 border-r shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-600"> Blog WorkSpace</h2>
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/editor")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + New Blog
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Dashboard
            </button>
          </nav>
        </div>
        <p className="text-xs text-gray-400 mt-6">© 2025 BloggerSpace by AS</p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📝 Drafts</h3>
          {drafts.length === 0 ? (
            <p className="text-sm text-gray-400">No drafts found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((b) => (
                <div
                  key={b._id}
                  className="p-4 bg-white rounded-lg shadow border hover:shadow-lg hover:scale-105 transition"
                >
                  <h4 className="text-md font-semibold mb-2 truncate">
                    {b.title || "Untitled Draft"}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {b.tags?.join(", ") || "No tags"}
                  </p>
                  <Link
                    to={`/editor/${b._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ✏️ Edit Draft
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📚 Published Blogs</h3>
          {published.length === 0 ? (
            <p className="text-sm text-gray-400">No published blogs yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {published.map((b) => (
                <div
                  key={b._id}
                  className="p-4 bg-white rounded-lg shadow border hover:shadow-lg hover:scale-105 transition"
                >
                  <h4 className="text-md font-semibold mb-2 truncate">
                    {b.title || "Untitled Post"}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {b.tags?.join(", ") || "No tags"}
                  </p>
                  <Link
                    to={`/view/${b._id}`}
                    className="text-sm text-green-700 hover:underline"
                  >
                     🔍 View Blog
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
