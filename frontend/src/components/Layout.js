// src/components/Layout.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Layout = ({ children }) => {

    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username);

            // Fetch groups
            fetch("http://localhost:8000/expense/groups/", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => res.json())
              .then((data) => setGroups(data))
              .catch((err) => console.error("Failed to fetch groups", err));
          } catch (err) {
            console.error("Failed to decode token", err);
          }
        }
      }, []);

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username);
        } catch (err) {
            console.error("Failed to decode token", err);
        }
        }
    }, [username]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 250, backgroundColor: "#f8f8f8", color: "#333", padding: 20, borderRight: "1px solid #ddd" }}>
        <h2 style={{ color: "#1abc9c", marginBottom: 30 }}>Splitwise</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: 15 }}>
              <Link to="/" style={{ color: "#333", textDecoration: "none" }}>🏠 Dashboard</Link>
            </li>
            <li style={{ marginBottom: 15 }}>
              <Link to="/activity" style={{ color: "#333", textDecoration: "none" }}>🚩 Recent activity</Link>
            </li>
            <li style={{ marginBottom: 15 }}>
              <Link to="/expenses" style={{ color: "#333", textDecoration: "none" }}>📋 All expenses</Link>
            </li>
          </ul>

          {/* Groups Section */}
          <div style={{ marginTop: 30 }}>
            <div style={{ fontWeight: "bold", fontSize: 12, color: "#999", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              GROUPS{" "}
              <button
                onClick={() => navigate("/")}
                style={{ background: "none", border: "none", color: "#1abc9c", fontSize: 16, cursor: "pointer" }}
              >
                + add
              </button>
            </div>
            <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 10 }}>
                {groups.map((group) => (
                  <li key={group.id}>
                    <Link to={`/groups/${group.id}`} style={{ color: "#1abc9c", textDecoration: "none" }}>
                      🏷 {group.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Friends Section */}
          <div style={{ marginTop: 30 }}>
            <div style={{ fontWeight: "bold", fontSize: 12, color: "#999", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              FRIENDS <button onClick={() => alert("Add friend clicked")} style={{ background: "none", border: "none", color: "#1abc9c", fontSize: 16, cursor: "pointer" }}>+ add</button>
            </div>
            <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 10 }}>
              <li>👤 ddf</li>
              <li>👤 fff</li>
              <li>👤 tinku</li>
            </ul>
          </div>
        </nav>
      </aside>


      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        {/* Navbar */}
        <header style={{ backgroundColor: "#f0f0f0", padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
          <h2>Dashboard</h2>
          <div style={{ fontWeight: "bold", color: "#333" }}>
            {username ? `Welcome, ${username}` : "Not logged in"}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: 20 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
