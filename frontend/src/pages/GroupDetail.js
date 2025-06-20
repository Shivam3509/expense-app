import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch(`http://localhost:8000/expense/groups/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch group details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!group) return <div>Group not found.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ccc",
          padding: "20px 0",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>{group.name}</h2>
          <p style={{ color: "gray", margin: 0 }}>{group.members.length} people</p>
          <div style={{ fontSize: "0.9rem", color: "#555", marginTop: 5 }}>
            {group.members.map((member) => member.username).join(", ")}
          </div>
        </div>
        <div>
          <button style={{ backgroundColor: "#ff652f", color: "white", padding: "10px 15px", marginRight: 10, border: "none", borderRadius: 5 }}><Link to="/expense" style={{ color: "#333", textDecoration: "none" }}>Add an expense</Link></button>
          <button style={{ backgroundColor: "#20c997", color: "white", padding: "10px 15px", border: "none", borderRadius: 5 }}>
            Settle up
          </button>
        </div>
      </div>

      {/* <div style={{ padding: "10px 0", borderBottom: "1px solid #eee", color: "#666" }}>
        <strong>Invite Code:</strong> {group.invite_code}
      </div> */}

      <div style={{ marginTop: 20 }}>
      <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: 10 }}>Expenses</h3>
      {group.expenses.length === 0 ? (
        <p>No expenses in this group.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {group.expenses.map((expense) => (
            <li key={expense.id} style={{ marginBottom: 10 }}>
              <Link
                to={`/expenses/${expense.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  backgroundColor: "#f9f9f9",
                  padding: 15,
                  borderRadius: 6,
                  border: "1px solid #eee",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong style={{ fontSize: 16 }}>{expense.description}</strong>
                    <div style={{ fontSize: 14, color: "#666" }}>
                      {new Date(expense.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>
                      <span style={{ fontWeight: "bold" }}>₹{expense.amount}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#777" }}>
                      Paid by <strong>{expense.paid_by.username}</strong>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default GroupDetail;
