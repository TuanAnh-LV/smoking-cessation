import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  CalendarDays,
  ChevronRight,
  Clock3,
  Eye,
  FolderOpen,
  Star,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Empty, Select, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { BlogService } from "../../services/blog.service";
import { CategoryService } from "../../services/category.service";
import { useAuth } from "../../context/authContext";
import BlogCreateModal from "../../components/Blog/BlogCreateModal";
import BlogDeleteModal from "../../components/Blog/BlogDeleteModal";
import "./BlogListPage.scss";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Featured", value: "featured" },
  { label: "Most liked", value: "mostLiked" },
];

const getImageUrl = (images = []) => {
  const firstImage = images?.[0];
  if (!firstImage) return "";
  return firstImage.url || firstImage;
};

const estimateReadingTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
};

const normalizeBlog = (blog = {}) => ({
  ...blog,
  id: blog._id || blog.id,
  imageUrl: getImageUrl(blog.images),
  readingTime: estimateReadingTime(blog.content || blog.description || ""),
  categoryName: blog.category?.name || "General",
  publishedDate: blog.published_at || blog.createdAt,
  authorName: blog.author_id?.full_name || "Anonymous",
  ratingValue: Number(blog.averageRating || 0),
  ratingCountValue: Number(blog.ratingCount || 0),
  views: Number(blog.viewCount || 0),
});

export default function BlogCategoryListPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const canCreateBlog = Boolean(userInfo?._id);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryRes, blogRes] = await Promise.all([
          CategoryService.getAllCategories({ page: 1, limit: 100 }),
          BlogService.getAllBlogs({ page: 1, limit: 100, status: "published" }),
        ]);

        setCategories(categoryRes?.data?.categories || []);
        setBlogs(
          Array.isArray(blogRes?.data?.blogs)
            ? blogRes.data.blogs.map(normalizeBlog)
            : [],
        );
      } catch (error) {
        console.error("Failed to load blog feed:", error);
        setBlogs([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const nextBlogs = blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === "all" || blog.category?._id === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        [blog.title, blog.description, blog.content, blog.category?.name]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });

    const sortedBlogs = [...nextBlogs];
    sortedBlogs.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === "mostLiked") {
        return (b.likeCount || 0) - (a.likeCount || 0);
      }

      if (sortBy === "featured") {
        if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
          return a.isFeatured ? -1 : 1;
        }
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sortedBlogs;
  }, [blogs, searchTerm, selectedCategory, sortBy]);

  const categoryOptions = [{ _id: "all", name: "All posts" }, ...categories];
  const featuredPosts = blogs.filter((post) => post.isFeatured).slice(0, 3);

  const handleDeleteBlog = async (blogId) => {
    try {
      setDeletingId(blogId);
      await BlogService.deleteBlog(blogId);
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
      message.success("Blog deleted successfully");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      message.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  const refreshBlogs = async () => {
    try {
      setLoading(true);
      const blogRes = await BlogService.getAllBlogs({
        page: 1,
        limit: 100,
        status: "published",
      });
      setBlogs(
        Array.isArray(blogRes?.data?.blogs)
          ? blogRes.data.blogs.map(normalizeBlog)
          : [],
      );
    } catch (error) {
      console.error("Failed to refresh blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-feed">
      <div className="blog-feed__shell">
        <section className="blog-feed__composer">
          <div className="blog-feed__composer-main">
            <div className="blog-feed__avatar">
              {(userInfo?.full_name || userInfo?.username || "B")
                .charAt(0)
                .toUpperCase()}
            </div>
            <button
              type="button"
              className="blog-feed__composer-button"
              onClick={() => {
                if (canCreateBlog) {
                  setCreateModalOpen(true);
                } else {
                  navigate("/login");
                }
              }}
            >
              {canCreateBlog
                ? "Write something useful for the community..."
                : "Browse the latest quit-smoking stories..."}
            </button>
          </div>

          <div className="blog-feed__composer-actions">
            <div className="blog-feed__search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions.map((category) => ({
                label: category.name,
                value: category._id,
              }))}
              className="blog-feed__select"
            />

            <Select
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              className="blog-feed__select"
            />
          </div>
        </section>

        <div className="blog-feed__layout">
          <div className="blog-feed__main">
            {loading ? (
              <div className="blog-feed__state">
                <Spin size="large" />
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="blog-feed__state">
                <Empty description="No blog posts found" />
              </div>
            ) : (
              <div className="blog-feed__list">
                {filteredBlogs.map((post) => (
                  <article key={post.id} className="feed-post">
                    {(() => {
                      const canEditOrDelete =
                        userInfo?.role === "admin" ||
                        userInfo?._id === post.author_id?._id;

                      return (
                        <>
                          <div className="feed-post__header">
                            <div className="feed-post__author-avatar">
                              {(post.authorName || "A").charAt(0).toUpperCase()}
                            </div>
                            <div className="feed-post__header-text">
                              <strong>{post.authorName}</strong>
                              <div className="feed-post__meta">
                                <span>
                                  {dayjs(post.publishedDate).format(
                                    "DD/MM/YYYY",
                                  )}
                                </span>
                              </div>
                            </div>
                            {canEditOrDelete && (
                              <div className="feed-post__admin-actions">
                                <button
                                  type="button"
                                  className="feed-post__icon-button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    navigate(`/blogs/${post.id}/edit`);
                                  }}
                                  aria-label="Edit blog"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="feed-post__icon-button feed-post__icon-button--danger"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedBlog(post);
                                  }}
                                  aria-label="Delete blog"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>

                          <div
                            className="feed-post__body"
                            onClick={() => navigate(`/blogs/${post.id}`)}
                          >
                            <h2>{post.title}</h2>
                            {(post.description || post.content) && (
                              <p>
                                {(post.description || post.content || "").slice(
                                  0,
                                  220,
                                )}
                                {(post.description || post.content || "")
                                  .length > 220
                                  ? "..."
                                  : ""}
                              </p>
                            )}
                            {post.imageUrl && (
                              <div className="feed-post__image">
                                <img src={post.imageUrl} alt={post.title} />
                              </div>
                            )}
                          </div>

                          <div className="feed-post__stats">
                            <span>{post.likeCount || 0} likes</span>
                            <span>{post.commentCount || 0} comments</span>
                            <span>{post.views} views</span>
                          </div>

                          <div className="feed-post__actions">
                            <div className="feed-post__info">
                              <span>
                                <Eye size={14} />
                                {post.views} views
                              </span>
                              <span>
                                <CalendarDays size={14} />
                                Published{" "}
                                {dayjs(post.publishedDate).format("DD/MM/YYYY")}
                              </span>
                              <span>
                                <Star size={14} />
                                {post.ratingValue.toFixed(1)} rating
                              </span>
                            </div>

                            <button
                              type="button"
                              className="feed-post__read-more"
                              onClick={() => navigate(`/blogs/${post.id}`)}
                            >
                              Read more
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="blog-feed__sidebar">
            <div className="feed-sidecard">
              <h3>Blog overview</h3>
              <div className="feed-sidecard__stats">
                <div>
                  <strong>{blogs.length}</strong>
                  <span>Posts</span>
                </div>
                <div>
                  <strong>{categories.length}</strong>
                  <span>Categories</span>
                </div>
                <div>
                  <strong>{featuredPosts.length}</strong>
                  <span>Featured</span>
                </div>
              </div>
            </div>

            <div className="feed-sidecard">
              <h3>Categories</h3>
              <div className="feed-sidecard__topics">
                {categoryOptions.slice(1, 7).map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    className="feed-sidecard__topic"
                    onClick={() => setSelectedCategory(category._id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="feed-sidecard">
              <h3>Featured picks</h3>
              <div className="feed-sidecard__list">
                {featuredPosts.length === 0 ? (
                  <p className="feed-sidecard__empty">No featured posts yet.</p>
                ) : (
                  featuredPosts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      className="feed-sidecard__item"
                      onClick={() => navigate(`/blogs/${post.id}`)}
                    >
                      <strong>{post.title}</strong>
                      <span>{post.categoryName}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
        <BlogCreateModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreated={refreshBlogs}
        />
        <BlogDeleteModal
          open={Boolean(selectedBlog)}
          loading={deletingId === selectedBlog?.id}
          blogTitle={selectedBlog?.title}
          onCancel={() => setSelectedBlog(null)}
          onConfirm={async () => {
            if (!selectedBlog?.id) return;
            await handleDeleteBlog(selectedBlog.id);
            setSelectedBlog(null);
          }}
        />
      </div>
    </div>
  );
}
