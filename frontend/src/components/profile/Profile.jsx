import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/userSlice";
import "./Profile.css";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };
  useEffect(() => {
    if (!user.authtoken) navigate("/auth/login");
  }, [user]);
  if (!user.authtoken) return null;
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="profile-title">
          <h2>{user.name || "Guest User"}</h2>
          <span className="role-badge">{user.role}</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="info-group">
            <label>Name:</label>
            <p>{user.name || "Not provided"}</p>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <p>{user.email || "Not provided"}</p>
          </div>
          <div className="info-group">
            <label>Phone:</label>
            <p>{user.phone || "Not provided"}</p>
          </div>
          <div className="info-group">
            <label>Address:</label>
            <p>{user.address || "Not provided"}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
