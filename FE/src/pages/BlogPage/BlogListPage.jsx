import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Checkbox,
  Typography,
  Row,
  Col,
  Pagination,
  Spin,
} from "antd";
import { BlogService } from "../../services/blog.service";
import { CategoryService } from "../../services/category.service";
import { TagService } from "../../services/tag.service";
import BlogPost from "../../components/Blog/BlogPost";
import { CommentService } from "../../services/comment.service";
import "./BlogListPage.scss";

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({});
  const [replyOpen, setReplyOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    category: undefined,
    tags: [],
    isFeatured: false,
    sort: "newest",
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const pageSize = 5;

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [filters, currentPage]);

  const fetchCategoriesAndTags = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        CategoryService.getAllCategories(),
        TagService.getAllTags(),
      ]);
      setCategories(catRes?.data?.categories || []);
      setTags(tagRes?.data?.tags || []);
    } catch (err) {
      console.error("Error loading filters:", err);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await BlogService.getAllBlogs({
        page: currentPage,
        limit: pageSize,
        search: filters.search,
        category: filters.category,
        tag: filters.tags,
        isFeatured: filters.isFeatured,
        sort: filters.sort,
        status: "published",
      });

      const blogList = res.data.blogs || [];
      setTotal(res.data.total || 0);

      const commentMap = {};
      await Promise.all(
        blogList.map(async (post) => {
          try {
            const res = await CommentService.getCommentsByBlog(post._id);
            commentMap[post._id] = res.data?.comments || [];
          } catch {
            commentMap[post._id] = [];
          }
        })
      );

      setPosts(blogList);
      setComments(commentMap);
    } catch (err) {
      console.error("Error loading blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeFilter = (field, value) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddComment = async (postId) => {
    const content = (newComment[postId] || "").trim();
    if (!content) return;
    try {
      await CommentService.createComment(postId, content);
      const res = await CommentService.getCommentsByBlog(postId);
      setComments((prev) => ({ ...prev, [postId]: res.data?.comments || [] }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleReplyComment = async (postId, parentId, replyContent) => {
    const content = replyContent.trim();
    if (!content) return;
    try {
      await CommentService.replyComment(parentId, content);
      const res = await CommentService.getCommentsByBlog(postId);
      setComments((prev) => ({ ...prev, [postId]: res.data?.comments || [] }));
      setNewComment((prev) => ({ ...prev, [`${postId}_${parentId}`]: "" }));
    } catch (err) {
      console.error("Error replying to comment:", err);
    }
  };

  const handleToggleLike = async (postId, isLiked) => {
    try {
      if (isLiked) await BlogService.unlikeBlog(postId);
      else await BlogService.likeBlog(postId);
      fetchBlogs();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleToggleCommentLike = async (commentId, isLiked, blogId) => {
    try {
      if (isLiked) await CommentService.unlikeComment(commentId);
      else await CommentService.likeComment(commentId);
      const res = await CommentService.getCommentsByBlog(blogId);
      setComments((prev) => ({ ...prev, [blogId]: res.data?.comments || [] }));
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleToggleReply = (commentId) => {
    setReplyOpen((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div className="blog-list-page">
      <Typography.Title level={2}>Tất cả bài viết</Typography.Title>

      <div className="blog-filter">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="Tìm kiếm bài viết..."
              onSearch={(val) => handleChangeFilter("search", val)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn danh mục"
              onChange={(val) => handleChangeFilter("category", val)}
              value={filters.category}
              allowClear
              style={{ width: "100%" }}
            >
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              mode="multiple"
              placeholder="Chọn tags"
              onChange={(val) => handleChangeFilter("tags", val)}
              value={filters.tags}
              allowClear
              style={{ width: "100%" }}
            >
              {tags.map((tag) => (
                <Select.Option key={tag._id} value={tag._id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Checkbox
              checked={filters.isFeatured}
              onChange={(e) => handleChangeFilter("isFeatured", e.target.checked)}
            >
              Bài nổi bật
            </Checkbox>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={filters.sort}
              onChange={(val) => handleChangeFilter("sort", val)}
              style={{ width: "100%" }}
            >
              <Select.Option value="newest">Mới nhất</Select.Option>
              <Select.Option value="oldest">Cũ nhất</Select.Option>
              <Select.Option value="mostLiked">Nhiều like</Select.Option>
              <Select.Option value="featured">Nổi bật</Select.Option>
            </Select>
          </Col>
        </Row>
      </div>

      <div className="blog-list">
        {loading ? (
          <Spin />
        ) : (
          posts.map((post) => (
            <BlogPost
              key={post._id}
              post={post}
              comments={comments[post._id]}
              newComment={newComment}
              setNewComment={setNewComment}
              onAddComment={handleAddComment}
              onReplyComment={handleReplyComment}
              onToggleLike={handleToggleLike}
              onToggleCommentLike={handleToggleCommentLike}
              onToggleReply={handleToggleReply}
              replyOpen={replyOpen}
            />
          ))
        )}
      </div>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20, textAlign: "center" }}
      />
    </div>
  );
};

export default BlogListPage;
