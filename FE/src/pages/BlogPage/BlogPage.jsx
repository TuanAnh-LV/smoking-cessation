// coming up next: BlogPage UI with form to create full blog (title, content, category, tags, images)
// Will include CategoryService and TagService call to populate the dropdowns

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Upload, Switch, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BlogService } from "../../services/blog.service";
import { CategoryService } from "../../services/category.service";
import { TagService } from "../../services/tag.service";

const { TextArea } = Input;

const BlogPage = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          CategoryService.getAllCategories(),
          TagService.getAllTags(),
        ]);
        setCategories(catRes?.data?.categories || []);
        setTags(tagRes?.data?.tags || []);
      } catch (err) {
        message.error("Không thể tải danh mục hoặc tags.");
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("content", values.content);
      formData.append("status", values.status);
      formData.append("isFeatured", values.isFeatured);
      if (values.category) formData.append("category", values.category);
      values.tags?.forEach((tag) => formData.append("tags", tag));
      fileList.forEach((file) => formData.append("images", file.originFileObj));

      await BlogService.createBlog(formData);
      message.success("Đăng blog thành công!");
      form.resetFields();
      setFileList([]);
    } catch (err) {
      message.error("Lỗi khi đăng blog.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Tạo Blog Mới</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ status: "published", isFeatured: false }}
      >
        <Form.Item name="title" label="Tiêu đề blog" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Mô tả ngắn">
          <Input />
        </Form.Item>

        <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}> 
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái">
          <Select options={[{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }]} />
        </Form.Item>

        <Form.Item name="category" label="Danh mục">
          <Select
            placeholder="Chọn danh mục"
            options={categories.map((c) => ({ label: c.name, value: c._id }))}
            allowClear
          />
        </Form.Item>

        <Form.Item name="tags" label="Thẻ tag">
          <Select
            mode="multiple"
            placeholder="Chọn tags"
            options={tags.map((t) => ({ label: t.name, value: t._id }))}
          />
        </Form.Item>

        <Form.Item name="isFeatured" label="Nổi bật" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Upload
            multiple
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Đăng blog
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BlogPage;
