import React from "react";
import { useAuth } from "../../context/AuthContext";

export const TestUserLogin: React.FC = () => {
  const { loginAsTestUser, isAuthenticated, role, name } = useAuth();

  if (isAuthenticated) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          background: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "12px",
          zIndex: 9999,
          fontSize: "12px",
          maxWidth: "200px",
        }}
      >
        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
          Logged in as: <span style={{ color: "#2563eb" }}>{role}</span>
        </div>
        <div style={{ marginBottom: "12px", fontSize: "11px" }}>{name}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <button
            onClick={() => loginAsTestUser("client")}
            style={{
              padding: "6px 8px",
              fontSize: "11px",
              backgroundColor: role === "Client" ? "#2563eb" : "#e5e7eb",
              color: role === "Client" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Switch to Client
          </button>
          <button
            onClick={() => loginAsTestUser("admin")}
            style={{
              padding: "6px 8px",
              fontSize: "11px",
              backgroundColor: role === "Admin" ? "#2563eb" : "#e5e7eb",
              color: role === "Admin" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Switch to Admin
          </button>
          <button
            onClick={() => loginAsTestUser("driver")}
            style={{
              padding: "6px 8px",
              fontSize: "11px",
              backgroundColor: role === "Driver" ? "#2563eb" : "#e5e7eb",
              color: role === "Driver" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Switch to Driver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        background: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        zIndex: 9999,
        fontSize: "12px",
        maxWidth: "200px",
      }}
    >
      <div style={{ marginBottom: "12px", fontWeight: "bold" }}>Test Users</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          onClick={() => loginAsTestUser("client")}
          style={{
            padding: "8px 12px",
            fontSize: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login as Client
        </button>
        <button
          onClick={() => loginAsTestUser("admin")}
          style={{
            padding: "8px 12px",
            fontSize: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login as Admin
        </button>
        <button
          onClick={() => loginAsTestUser("driver")}
          style={{
            padding: "8px 12px",
            fontSize: "12px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login as Driver
        </button>
      </div>
    </div>
  );
};
