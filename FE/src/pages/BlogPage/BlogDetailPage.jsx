import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogService } from "../../services/blog.service";
import BlogPost from "../../components/Blog/BlogPost";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    BlogService.getBlogById(id).then((res) => {
      setPost(res);
    });
  }, [id]);

  if (!post) return <p>Đang tải...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
      <BlogPost post={post} />
    </div>
  );
};

export default BlogDetailPage;
