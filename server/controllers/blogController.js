const Blog = require("../models/Blog");

exports.saveDraft = async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;

    let blog;
    if (id) {
      blog = await Blog.findByIdAndUpdate(
        id,
        {
          title,
          content,
          tags,
          status: "draft",
          updated_at: Date.now(),
        },
        { new: true }
      );
    } else {
      blog = await Blog.create({
        title,
        content,
        tags,
        status: "draft",
      });
    }

    res.json(blog);
  } catch (error) {
    console.error("Save Draft Error:", error);
    res.status(500).json({ error: "Failed to save draft." });
  }
};

exports.publishBlog = async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;

    let blog;
    if (id) {
      blog = await Blog.findByIdAndUpdate(
        id,
        {
          title,
          content,
          tags,
          status: "published",
          updated_at: Date.now(),
        },
        { new: true }
      );
    } else {
      blog = await Blog.create({
        title,
        content,
        tags,
        status: "published",
      });
    }

    res.json(blog);
  } catch (error) {
    console.error("Publish Error:", error);
    res.status(500).json({ error: "Failed to publish blog." });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ updated_at: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    res.status(500).json({ error: "Failed to fetch blogs." });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
  } catch (error) {
    console.error("Fetch Blog By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch blog." });
  }
};
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
};
