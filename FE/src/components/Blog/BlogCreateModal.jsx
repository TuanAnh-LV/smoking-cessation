import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Switch, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BlogService } from "../../services/blog.service";
import { CategoryService } from "../../services/category.service";
import { TagService } from "../../services/tag.service";

const { TextArea } = Input;

export default function BlogCreateModal({ open, onClose, onCreated }) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const [categoryRes, tagRes] = await Promise.all([
          CategoryService.getAllCategories({ page: 1, limit: 100 }),
          TagService.getAllTags(),
        ]);
        setCategories(categoryRes?.data?.categories || []);
        setTags(tagRes?.data?.tags || []);
      } catch (error) {
        console.error("Failed to load blog modal options:", error);
        message.error("Failed to load categories or tags.");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [open]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

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

      await BlogService.createBlog(formData);
      message.success("Blog created successfully!");
      form.resetFields();
      setFileList([]);
      onCreated?.();
      onClose();
    } catch (error) {
      console.error("Failed to create blog:", error);
      message.error("Failed to create blog.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create blog"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={840}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ status: "published", isFeatured: false }}
      >
        <Form.Item
          name="title"
          label="Blog title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input size="large" disabled={loadingOptions || submitting} />
        </Form.Item>

        <Form.Item name="description" label="Short description">
          <Input size="large" disabled={loadingOptions || submitting} />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please enter content" }]}
        >
          <TextArea rows={10} disabled={loadingOptions || submitting} />
        </Form.Item>

        <div className="grid md:grid-cols-2 gap-4">
          <Form.Item name="status" label="Status">
            <Select
              disabled={loadingOptions || submitting}
              options={[
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
              ]}
            />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Select
              disabled={loadingOptions || submitting}
              placeholder="Select category"
              options={categories.map((category) => ({
                label: category.name,
                value: category._id,
              }))}
              allowClear
            />
          </Form.Item>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Form.Item name="tags" label="Tags">
            <Select
              mode="multiple"
              disabled={loadingOptions || submitting}
              placeholder="Select tags"
              options={tags.map((tag) => ({
                label: tag.name,
                value: tag._id,
              }))}
              allowClear
            />
          </Form.Item>

          <Form.Item name="isFeatured" label="Featured post" valuePropName="checked">
            <Switch disabled={loadingOptions || submitting} />
          </Form.Item>
        </div>

        <Form.Item label="Images">
          <Upload
            multiple
            listType="picture"
            fileList={fileList}
            onChange={({ fileList: nextFileList }) => setFileList(nextFileList)}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />} disabled={loadingOptions || submitting}>
              Choose images
            </Button>
          </Upload>
        </Form.Item>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Create blog
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
