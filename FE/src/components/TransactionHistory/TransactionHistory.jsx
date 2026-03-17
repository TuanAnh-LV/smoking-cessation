import React, { useEffect, useState } from "react";
import "./TransactionHistory.scss";
import { PaymentService } from "../../services/payment.service";
import { format } from "date-fns";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);

  useEffect(() => {
    PaymentService.getUserTransactions()
      .then((res) => {
        const data = res.data || [];
        setTransactions(data);

        const total = data.reduce(
          (sum, tx) => (tx.status === "success" ? sum + tx.amount : sum),
          0
        );
        setTotalAmount(total);

        const success = data.filter((tx) => tx.status === "success").length;
        setSuccessCount(success);
      })
      .catch((err) => console.error("Failed to fetch transactions:", err));
  }, []);

  return (
    <div className="transaction-history-container">
      {/* Header */}
      <div className="header-transaction">
        <h1>Transaction History</h1>
        <p>Track all your payment activity</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Spent</h3>
          <p>{totalAmount.toLocaleString()}VNĐ</p>
        </div>
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <p>{transactions.length}</p>
        </div>
        <div className="summary-card">
          <h3>Successful Transactions</h3>
          <p>{successCount}</p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="transaction-list">
        <h2>Transaction List</h2>
        <div className="controls">
          <input type="text" placeholder="Search transactions..." />
          <select>
            <option value="">All Statuses</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Description</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx._id.slice(-6).toUpperCase()}</td>
                <td>{format(new Date(tx.created_at), "dd/MM/yyyy")}</td>
                <td>{tx.description || "No description"}</td>
                <td>
                  {tx.type === "membership_payment" ? "Membership" : tx.type}
                </td>
                <td>{tx.amount.toLocaleString()}₫</td>
                <td>
                  {tx.status === "success"
                    ? "Success"
                    : tx.status === "pending"
                    ? "Pending"
                    : "Failed"}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory;
