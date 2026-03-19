import { Modal } from "antd";

export default function BlogDeleteModal({
  open,
  loading,
  blogTitle,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      title="Delete blog"
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true, loading }}
      destroyOnClose
    >
      <p>
        Are you sure you want to delete{" "}
        <span className="font-semibold">{blogTitle || "this blog post"}</span>?
      </p>
    </Modal>
  );
}
