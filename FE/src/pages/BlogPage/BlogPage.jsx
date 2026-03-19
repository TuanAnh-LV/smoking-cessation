import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Select, Upload, Switch, message } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { BlogService } from "../../services/blog.service";
import { CategoryService } from "../../services/category.service";
import { TagService } from "../../services/tag.service";

const { TextArea } = Input;

const normalizeContent = (content = "") => content.replace(/\\n/g, "\n");

const BlogPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  const pageTitle = useMemo(
    () => (isEditMode ? "Edit Blog" : "Create New Blog"),
    [isEditMode],
  );

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          CategoryService.getAllCategories({ page: 1, limit: 100 }),
          TagService.getAllTags(),
        ]);
        setCategories(catRes?.data?.categories || []);
        setTags(tagRes?.data?.tags || []);
      } catch (error) {
        console.error("Failed to load blog options:", error);
        message.error("Failed to load categories or tags.");
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blog = await BlogService.getBlogById(id);

        form.setFieldsValue({
          title: blog.title || "",
          description: blog.description || "",
          content: normalizeContent(blog.content || ""),
          status: blog.status || "draft",
          category: blog.category?._id || undefined,
          tags: Array.isArray(blog.tags) ? blog.tags.map((tag) => tag._id) : [],
          isFeatured: Boolean(blog.isFeatured),
        });

        setFileList(
          Array.isArray(blog.images)
            ? blog.images.map((image, index) => ({
                uid: image._id || `existing-${index}`,
                name: image.public_id || `image-${index + 1}`,
                status: "done",
                url: image.url || image,
              }))
            : [],
        );
      } catch (error) {
        console.error("Failed to load blog detail:", error);
        message.error("Failed to load blog detail.");
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [form, id, isEditMode, navigate]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("content", values.content);
      formData.append("status", values.status);
      formData.append("isFeatured", String(Boolean(values.isFeatured)));

      if (values.category) {
        formData.append("category", values.category);
      }

      values.tags?.forEach((tag) => formData.append("tags", tag));

      fileList
        .filter((file) => file.originFileObj)
        .forEach((file) => formData.append("images", file.originFileObj));

      if (isEditMode) {
        await BlogService.updateBlog(id, formData);
        message.success("Blog updated successfully!");
        navigate(`/blogs/${id}`);
      } else {
        await BlogService.createBlog(formData);
        message.success("Blog created successfully!");
        form.resetFields();
        setFileList([]);
        navigate("/blogs");
      }
    } catch (error) {
      console.error("Failed to save blog:", error);
      message.error(isEditMode ? "Failed to update blog." : "Failed to create blog.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-11rem)] max-w-6xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeftOutlined />
            Back to blogs
          </button>

          <div className="mb-5">
            <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
            <p className="mt-1 text-gray-500">
              {isEditMode
                ? "Update content, metadata and media for this blog post."
                : "Publish a new article with content, metadata and images."}
            </p>
          </div>

          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{ status: "published", isFeatured: false }}
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
              <div>
                <Form.Item
                  name="title"
                  label="Blog title"
                  rules={[{ required: true, message: "Please enter a title" }]}
                >
                  <Input size="large" disabled={loading} />
                </Form.Item>

                <Form.Item name="description" label="Short description">
                  <Input size="large" disabled={loading} />
                </Form.Item>

                <Form.Item
                  name="content"
                  label="Content"
                  rules={[{ required: true, message: "Please enter content" }]}
                  className="mb-0"
                >
                  <TextArea rows={9} disabled={loading} />
                </Form.Item>
              </div>

              <div className="rounded-3xl border border-gray-100 bg-gray-50/80 p-4 md:p-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                  <Form.Item name="status" label="Status">
                    <Select
                      disabled={loading}
                      options={[
                        { label: "Published", value: "published" },
                        { label: "Draft", value: "draft" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item name="category" label="Category">
                    <Select
                      disabled={loading}
                      placeholder="Select category"
                      options={categories.map((category) => ({
                        label: category.name,
                        value: category._id,
                      }))}
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item name="tags" label="Tags">
                    <Select
                      mode="multiple"
                      disabled={loading}
                      placeholder="Select tags"
                      options={tags.map((tag) => ({
                        label: tag.name,
                        value: tag._id,
                      }))}
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item
                    name="isFeatured"
                    label="Featured post"
                    valuePropName="checked"
                  >
                    <Switch disabled={loading} />
                  </Form.Item>
                </div>

                <Form.Item
                  label={isEditMode ? "Add new images" : "Images"}
                  extra="You can upload multiple images. Existing images stay unless backend replaces them."
                  className="mb-5"
                >
                  <Upload
                    multiple
                    listType="picture"
                    fileList={fileList}
                    onChange={({ fileList: nextFileList }) =>
                      setFileList(nextFileList)
                    }
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />} disabled={loading} block>
                      Choose images
                    </Button>
                  </Upload>
                </Form.Item>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row xl:flex-col">
                  <Button
                    size="large"
                    onClick={() =>
                      navigate(isEditMode ? `/blogs/${id}` : "/blogs")
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    disabled={loading}
                  >
                    {isEditMode ? "Update blog" : "Create blog"}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
