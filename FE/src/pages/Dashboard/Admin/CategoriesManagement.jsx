import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  FolderTree,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { message } from "antd";
import { CategoryService } from "../../../services/category.service";
import {
  CategoryFormModal,
  createCategoryFormData,
  initialFormData,
} from "../../../components/admin/CategoryFormModal";
import { CategoryDeleteConfirmModal } from "../../../components/admin/CategoryDeleteConfirmModal";

const normalizeCategory = (category = {}) => ({
  id: category._id || category.id,
  name: category.name || "",
  slug: category.slug || "",
  description: category.description || "",
  createdAt: category.createdAt || category.created_at || "",
  updatedAt: category.updatedAt || category.updated_at || "",
});

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });
  const [modalMode, setModalMode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const normalizedSearch = searchInput.trim().toLowerCase();
    const filteredCategories = normalizedSearch
      ? allCategories.filter((category) =>
          [category.name, category.slug, category.description].some((field) =>
            field?.toLowerCase().includes(normalizedSearch),
          ),
        )
      : allCategories;

    const total = filteredCategories.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, pages);
    const startIndex = (safePage - 1) * limit;
    const paginatedCategories = filteredCategories.slice(
      startIndex,
      startIndex + limit,
    );

    if (page !== safePage) {
      setPage(safePage);
      return;
    }

    setCategories(paginatedCategories);
    setPagination({
      total,
      page: safePage,
      pages,
    });
  }, [allCategories, searchInput, page, limit]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await CategoryService.getAllCategories({
        page: 1,
        limit: 1000,
      });
      const payload = res?.data || {};
      setAllCategories(
        Array.isArray(payload.categories)
          ? payload.categories.map(normalizeCategory)
          : [],
      );
    } catch (error) {
      console.error("Failed to load categories:", error);
      setAllCategories([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCategory(null);
    setFormData(initialFormData);
  };

  const openCreateModal = () => {
    setFormData(createCategoryFormData());
    setSelectedCategory(null);
    setModalMode("create");
  };

  const openViewModal = async (id) => {
    try {
      const res = await CategoryService.getCategoryById(id);
      const category = normalizeCategory(res?.data?.category || {});
      setSelectedCategory(category);
      setFormData(createCategoryFormData(category));
      setModalMode("view");
    } catch (error) {
      console.error("Failed to load category details:", error);
      message.error("Failed to load category details");
    }
  };

  const openEditModal = async (id) => {
    try {
      const res = await CategoryService.getCategoryById(id);
      const category = normalizeCategory(res?.data?.category || {});
      setSelectedCategory(category);
      setFormData(createCategoryFormData(category));
      setModalMode("edit");
    } catch (error) {
      console.error("Failed to load category:", error);
      message.error("Failed to load category");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
    };

    if (!payload.name || !payload.slug) {
      message.error("Name and slug are required");
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await CategoryService.createCategory(payload);
        message.success("Category created successfully");
        if (page !== 1) {
          setPage(1);
        } else {
          fetchCategories();
        }
      }

      if (modalMode === "edit" && selectedCategory?.id) {
        await CategoryService.updateCategory(selectedCategory.id, payload);
        message.success("Category updated successfully");
        fetchCategories();
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save category:", error);
      message.error("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory?.id) return;

    setDeleting(true);
    try {
      await CategoryService.deleteCategory(selectedCategory.id);
      message.success("Category deleted successfully");

      const shouldGoPrevPage = categories.length === 1 && page > 1;
      if (shouldGoPrevPage) {
        setPage((prev) => prev - 1);
      } else {
        fetchCategories();
      }
      closeModal();
    } catch (error) {
      console.error("Failed to delete category:", error);
      message.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-gray-500 mt-1">
            Manage blog categories for the admin dashboard
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1 bg-black text-white rounded h-[40px] px-3 py-1 cursor-pointer hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" /> Create Category
        </button>
      </div>

      <div className="bg-white rounded shadow p-7">
        <div className="flex justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              All Categories
            </h2>
            <p className="text-sm text-gray-500">
              Search, create and manage your category collection
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchInput}
                onChange={(e) => {
                  setPage(1);
                  setSearchInput(e.target.value);
                }}
                className="border rounded pl-10 h-[40px] w-[300px] pr-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center border rounded h-[40px] px-3 text-sm text-gray-600 gap-2">
              <Filter className="h-4 w-4" />
              <span>Per page</span>
              <select
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                className="outline-none bg-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Loading categories...
          </div>
        ) : (
          <>
            <table className="w-full text-sm border-collapse">
              <thead className="border-b border-b-gray-200">
                <tr>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Slug</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Updated At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-b-gray-200"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FolderTree className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{category.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{category.slug}</td>
                      <td className="p-4 text-gray-500 max-w-[320px]">
                        <p className="truncate">
                          {category.description || "-"}
                        </p>
                      </td>
                      <td className="p-4 text-gray-500">
                        {category.updatedAt
                          ? new Date(category.updatedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            className="px-2 py-1 rounded hover:bg-gray-100"
                            onClick={() => openViewModal(category.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="px-2 py-1 rounded hover:bg-gray-100"
                            onClick={() => openEditModal(category.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="px-2 py-1 rounded text-red-600 hover:bg-gray-100"
                            onClick={() => {
                              setSelectedCategory(category);
                              setModalMode("delete");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-5 gap-4 flex-wrap">
              <p className="text-sm text-gray-500">
                Showing page {pagination.page} of {pagination.pages} with{" "}
                {pagination.total} categories
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="w-10 h-10 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 min-w-[72px] text-center">
                  Page {page}
                </span>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, pagination.pages))
                  }
                  className="w-10 h-10 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CategoryFormModal
        open={["create", "edit", "view"].includes(modalMode)}
        mode={modalMode}
        formData={formData}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
        setFormData={setFormData}
      />

      <CategoryDeleteConfirmModal
        open={modalMode === "delete"}
        deleting={deleting}
        category={selectedCategory}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
