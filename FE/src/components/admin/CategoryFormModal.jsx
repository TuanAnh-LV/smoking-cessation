const initialFormData = {
  name: "",
  slug: "",
  description: "",
};

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function createCategoryFormData(category = {}) {
  return {
    ...initialFormData,
    id: category.id || category._id || "",
    name: category.name || "",
    slug: category.slug || "",
    description: category.description || "",
    createdAt: category.createdAt || category.created_at || "",
    updatedAt: category.updatedAt || category.updated_at || "",
  };
}

export function CategoryFormModal({
  open,
  mode,
  formData,
  submitting,
  onClose,
  onSubmit,
  setFormData,
}) {
  if (!open) return null;

  const isView = mode === "view";
  const title =
    mode === "create"
      ? "Create Category"
      : mode === "edit"
      ? "Edit Category"
      : "Category Details";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const nextForm = { ...prev, [name]: value };
      if (name === "name" && (!prev.slug || prev.slug === slugify(prev.name))) {
        nextForm.slug = slugify(value);
      }
      return nextForm;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isView}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-50"
                placeholder="Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                disabled={isView}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-50"
                placeholder="technology"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isView}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-50"
              placeholder="Articles about the latest technology"
            />
          </div>

          {isView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium text-gray-700">Created At:</span>{" "}
                {formData.createdAt
                  ? new Date(formData.createdAt).toLocaleString()
                  : "-"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Updated At:</span>{" "}
                {formData.updatedAt
                  ? new Date(formData.updatedAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Close
            </button>
            {!isView && (
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create"
                  : "Update"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export { initialFormData };
