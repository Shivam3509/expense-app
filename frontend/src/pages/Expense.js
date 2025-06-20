import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";

const API_BASE = "http://localhost:8000/expense";

export default function CreateExpensePage() {
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [allUsers, setAllUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [customShares, setCustomShares] = useState({});
  const [message, setMessage] = useState("");

  // Load groups and users
  useEffect(() => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_BASE}/groups/`, { headers })
      .then(res => setGroups(res.data));

    axios.get(`${API_BASE}/users/`, { headers })
      .then(res => setAllUsers(res.data));
  }, []);

  useEffect(() => {
    if (!groupId) {
      setGroupMembers([]);
      setSelectedUsers([]);
      return;
    }

    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_BASE}/groups/${groupId}/`, { headers })
      .then(res => {
        setGroupMembers(res.data.members);
        setSelectedUsers([]);  // reset selected users when group changes
      })
      .catch(console.error);
  }, [groupId]);

  const handleCustomShareChange = (userId, value) => {
    setCustomShares({
      ...customShares,
      [userId]: value
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      group: groupId,
      description,
      amount: parseFloat(amount),
      split_type: splitType,
      split_between: selectedUsers,
    };

    if (splitType === "custom") {
      payload.custom_shares = {};
      selectedUsers.forEach(userId => {
        payload.custom_shares[userId] = parseFloat(customShares[userId] || 0);
      });
    }

    try {
      await axios.post(`${API_BASE}/expenses/`, payload, { headers });
      setMessage("Expense created successfully!");
      setDescription("");
      setAmount("");
      setSelectedUsers([]);
      setCustomShares({});
    } catch (err) {
      setMessage("Error creating expense: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Create Expense</h2>

      <label>Group</label>
       <select
        value={groupId}
        onChange={e => setGroupId(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      >
        <option value="">-- Select Group --</option>
        {groups.map(group => (
          <option key={group.id} value={group.id}>{group.name}</option>
        ))}
      </select>

      <label>Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <label>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <label>Split Type</label>
      <select
        value={splitType}
        onChange={(e) => setSplitType(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      >
        <option value="equal">Equal</option>
        <option value="custom">Custom</option>
      </select>

      <label>Select Users</label>
      <select
        multiple
        value={selectedUsers}
        onChange={(e) => {
          const values = Array.from(e.target.selectedOptions, opt => opt.value);
          setSelectedUsers(values);
        }}
        style={{ width: "100%", padding: 8, marginBottom: 10, height: 100 }}
      >
        {groupMembers.map(user => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      {splitType === "custom" && (
        <div>
          <h4>Custom Share Per User</h4>
          {selectedUsers.map(userId => {
            const user = allUsers.find(u => u.id.toString() === userId.toString());
            return (
              <div key={userId} style={{ marginBottom: 8 }}>
                <label>{user?.username}</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={customShares[userId] || ""}
                  onChange={(e) => handleCustomShareChange(userId, e.target.value)}
                  style={{ width: "100%", padding: 6 }}
                />
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Create Expense
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}