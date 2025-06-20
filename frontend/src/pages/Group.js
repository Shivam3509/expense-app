import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";
import { jwtDecode } from "jwt-decode";


const API_BASE = "http://localhost:8000/expense";

export default function CreateGroupPage() {

  const [currentUsername, setCurrentUsername] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const username = `${decoded.username}`; // depends on your token payload
        setCurrentUsername(username);
        setMembers([username]); // default member input with logged-in user
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  // Fetch all users from backend
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(`${API_BASE}/users/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        setAllUsers(res.data); // assuming res.data is array of users with username property
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }
    fetchUsers();
  }, []);

  // Add selected user to members list
    const addMember = () => {
    const newMembers = selectedUser.filter(
        (user) => !members.includes(user)
    );
    setMembers([...members, ...newMembers]);
    setSelectedUser([]); // clear selection
    };

  // Remove member from members list
  const removeMember = (username) => {
    setMembers(members.filter((m) => m !== username));
  };

  const createGroup = async () => {
    try {
      await axios.post(
        `${API_BASE}/groups/`,
        {
          name,
          description,
          member_usernames: members,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setMessage("Group created successfully!");
      setName("");
      setDescription("");
      setMembers([currentUsername]);
    } catch (error) {
      setMessage("Failed to create group: " + (error.response?.data || error.message));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Create Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <textarea
        placeholder="Group Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <h3>Add Members</h3>
      <select
        multiple
        value={selectedUser}
        onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedUser(selected);
        }}
        style={{ width: "100%", padding: 8, marginBottom: 10, height: 120 }}
        >
        {allUsers
            .filter((user) => !members.includes(user.username))
            .map((user) => (
            <option key={user.username} value={user.username}>
                {user.username}
            </option>
            ))}
      </select>
      <button
        onClick={addMember}
        disabled={!selectedUser}
        style={{ marginBottom: 20, padding: "8px 12px", cursor: "pointer" }}
      >
        Add Member
      </button>

      <h4>Members</h4>
      <ul>
        {members.map((member) => (
          <li key={member} style={{ marginBottom: 6 }}>
            {member}
            {member !== currentUsername && (
              <button
                onClick={() => removeMember(member)}
                style={{
                  marginLeft: 10,
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 6px",
                }}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={createGroup}
        style={{ padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}
      >
        Create Group
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}