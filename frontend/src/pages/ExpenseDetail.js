import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ExpenseDetails() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return;

    fetch(`http://localhost:8000/expense/expenses/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setExpense(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expense", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!expense) return <p>Expense not found.</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: 10 }}>💸 Expense Details</h2>
      <div style={{ marginBottom: 20 }}>
        <p><strong>Description:</strong> {expense.description}</p>
        <p><strong>Amount:</strong> <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>₹{expense.amount}</span></p>
        <p><strong>Paid by:</strong> {expense.paid_by.username}</p>
        <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
      </div>

      <h3 style={{ marginBottom: 10, fontSize: 18 }}>👥 Shares</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {expense.shares.map((share) => (
          <li
            key={share.user.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 15px',
              borderBottom: '1px solid #eee',
              backgroundColor: '#fafafa',
              borderRadius: 5,
              marginBottom: 8,
            }}
          >
            <div>
              <strong style={{ fontSize: 16 }}>{share.user.username}</strong>
              <div style={{ fontSize: 13, color: '#777' }}>
                owes <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>₹{share.share}</span>
              </div>
            </div>
            <span style={{ fontSize: 12, color: '#999' }}>
              {share.user.username} pays {expense.paid_by.username}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
