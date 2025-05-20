import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // code block style

const Editor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [draftId, setDraftId] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`https://bloggerspace-yjdi.onrender.com/api/blogs/${id}`).then((res) => {
        const blog = res.data;
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags.join(", "));
        setDraftId(blog._id);
      });
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, content, tags]);

  const autoSave = async () => {
    if (!title && !content) return;

    try {
      const res = await axios.post("https://bloggerspace-yjdi.onrender.com/api/blogs/save-draft", {
        id: draftId,
        title,
        content,
        tags: tags.split(",").map((t) => t.trim()),
      });

      if (!draftId && res.data._id) {
        setDraftId(res.data._id);
      }

      toast.success("Draft auto-saved");
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  const handlePublish = async () => {
    try {
      await axios.post("https://bloggerspace-yjdi.onrender.com/api/blogs/publish", {
        id: draftId,
        title,
        content,
        tags: tags.split(",").map((t) => t.trim()),
      });

      toast.success("Blog published!");
      navigate("/");
    } catch (err) {
      console.error("Publish failed:", err);
      toast.error("Failed to publish blog.");
    }
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200); // avg 200 wpm

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Markdown Blog Editor</h2>

      <input
        type="text"
        placeholder="Blog Title"
        className="w-full p-3 mb-4 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        className="w-full p-3 mb-4 border rounded"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="text-sm text-blue-600 underline"
        >
          {isPreview ? "Edit Mode" : "Preview Mode"}
        </button>
        <p className="text-sm text-gray-500">
          {wordCount} words • {readTime} min read
        </p>
      </div>

      {isPreview ? (
        <div className="prose max-w-none border p-4 rounded bg-gray-50">
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          />
        </div>
      ) : (
        <textarea
          rows="16"
          placeholder="Write your blog in **Markdown**..."
          className="w-full p-3 mb-4 border rounded resize-y"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}

      <div className="flex gap-4">
        <button
          onClick={autoSave}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Save Draft
        </button>
        <button
          onClick={handlePublish}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default Editor;
