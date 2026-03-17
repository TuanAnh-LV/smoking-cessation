import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, DollarSign, Download } from "lucide-react";
import { PaymentService } from "../../../services/payment.service";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TransactionsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    PaymentService.getTransactionSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu tổng kết:", err));

    PaymentService.getAllTransactions()
      .then((res) => {
        const data = res.data;
        if (!Array.isArray(data)) {
          console.error("Kết quả trả về không phải mảng:", data);
          return;
        }

        const mapped = data.map((txn) => ({
          id: txn._id,
          userId: txn.user_id?._id || "N/A",
          userName: txn.user_id?.username || "-",
          amount: txn.amount,
          type: txn.type === "membership_payment" ? "Membership" : txn.type,
          status:
            txn.status === "success"
              ? "Completed"
              : txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
          paymentMethod: txn.related_payment_id?.payment_method || "-",
          date: txn.created_at,
          description: txn.description || "",
        }));

        setTransactions(mapped);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách giao dịch:", err));
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const term = searchTerm.toLowerCase();
    return (
      transaction.userName?.toLowerCase().includes(term) ||
      transaction.id?.toLowerCase().includes(term) ||
      transaction.type?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Membership":
        return "bg-purple-100 text-purple-800";
      case "Coaching":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const handleExport = () => {
    const exportData = transactions.map((txn) => ({
      "Transaction ID": txn.id,
      "User ID": txn.userId,
      Username: txn.userName,
      Amount: txn.amount,
      Type: txn.type,
      Status: txn.status,
      "Payment Method": txn.paymentMethod,
      Date: formatDate(txn.date),
      Description: txn.description,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "transactions.xlsx");
  };
  const exportSingleTransaction = (txn) => {
    const exportData = [
      {
        "Transaction ID": txn.id,
        "User ID": txn.userId,
        Username: txn.userName,
        Amount: txn.amount,
        Type: txn.type,
        Status: txn.status,
        "Payment Method": txn.paymentMethod,
        Date: formatDate(txn.date),
        Description: txn.description,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `transaction_${txn.id}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions Management</h1>
          <p className="text-gray-500">
            Monitor and manage all financial transactions
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1 bg-black text-white rounded h-[40px] px-3 py-1 cursor-pointer hover:bg-gray-800"
        >
          <Download className="h-4 w-4 mr-1" /> Export Data
        </button>
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Total Revenue</span>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">
              {typeof summary.totalRevenue === "number"
                ? summary.totalRevenue.toLocaleString("vi-VN") + "₫"
                : "0₫"}
            </div>
            <p className="text-xs text-gray-500">Doanh thu đã xác nhận</p>
          </div>

          <div className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Success</span>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{summary.success ?? 0}</div>
            <p className="text-xs text-gray-500">Giao dịch thành công</p>
          </div>

          <div className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Pending</span>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{summary.pending ?? 0}</div>
            <p className="text-xs text-gray-500">Chờ xử lý</p>
          </div>

          <div className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Failed</span>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">{summary.failed ?? 0}</div>
            <p className="text-xs text-gray-500">Đã thất bại</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-7">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              All Transactions
            </h2>
            <p className="text-sm text-gray-500">
              A complete list of all financial transactions
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded pl-10 h-[40px] w-[300px] pr-2 py-1 text-sm"
              />
            </div>
            <button className="flex items-center border rounded px-2 py-1 text-sm hover:bg-gray-100 h-[40px]">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </button>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead className="border-b border-b-gray-200">
            <tr>
              <th className="p-2 text-left">Transaction ID</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Payment Method</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((txn) => (
              <tr key={txn.id} className="border-b border-b-gray-200">
                <td className="p-2 font-medium">{txn.id}</td>
                <td className="p-2">
                  <div className="font-medium">{txn.userName}</div>
                </td>
                <td className="p-2 font-medium">
                  {formatCurrency(txn.amount)}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${getTypeColor(
                      txn.type
                    )}`}
                  >
                    {txn.type}
                  </span>
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                      txn.status
                    )}`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="p-2">{txn.paymentMethod}</td>
                <td className="p-2">{formatDate(txn.date)}</td>
                <td className="p-2 text-right">
                  <div className="inline-flex gap-1">
                    <button className="px-1 hover:bg-gray-100">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="px-1 hover:bg-gray-100"
                      onClick={() => exportSingleTransaction(txn)}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-1">
            <button
              className={`border rounded-3xl px-2 py-1 text-sm ${
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`border rounded-2xl px-2 py-1 text-sm ${
                  currentPage === i + 1 ? "bg-blue-100" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={`border rounded-3xl px-2 py-1 text-sm ${
                currentPage === totalPages
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
