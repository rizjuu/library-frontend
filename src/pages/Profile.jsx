import { useEffect, useState } from "react";
import { AtSign, CheckCircle2, Loader2, Phone, Save, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function Profile({ showToast = () => {} }) {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/auth/me")
      .then((response) => {
        const currentUser = response.data.user;
        setAccount(currentUser);
        setProfile({ name: currentUser.name || "", email: currentUser.email || "", phone: currentUser.phone || "" });
        updateUser(currentUser);
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
        setAccount(user);
        setProfile({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.patch("/auth/me", profile);
      setAccount(response.data.user);
      updateUser(response.data.user);
      showToast("Profile updated successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const currentAccount = account || user || {};

  return (
    <motion.div className="dashboard-shell" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="page-title-row">
        <div>
          <h1 className="page-title"><User size={28} style={{ color: "var(--color-primary)" }} /> My Info</h1>
          <p className="page-subtitle">View and update your personal account information.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><Loader2 size={36} className="animate-spin empty-state-icon" /><h3 className="empty-state-title">Loading Profile</h3></div>
      ) : (
        <div className="addbook-wrapper">
          <div className="addbook-card">
            <div className="card-header-row" style={{ marginBottom: "20px" }}>
              <div><h3 className="card-header-title">View Profile</h3><p className="card-header-sub">Your account details and access level.</p></div>
              <ShieldCheck size={25} style={{ color: "var(--color-success)" }} />
            </div>

            <div className="form-grid-2col" style={{ marginBottom: "24px" }}>
              <div className="form-group"><label className="form-label">Username</label><div className="form-readonly">{currentAccount.username || "Not set"}</div></div>
              <div className="form-group"><label className="form-label">Role</label><div className="form-readonly">{currentAccount.role ? currentAccount.role.charAt(0).toUpperCase() + currentAccount.role.slice(1) : "User"}</div></div>
              <div className="form-group"><label className="form-label">Account Status</label><div className="form-readonly" style={{ color: "var(--color-success)" }}><CheckCircle2 size={16} /> {currentAccount.status || "Active"}</div></div>
              <div className="form-group"><label className="form-label">Account ID</label><div className="form-readonly">{currentAccount.id || currentAccount._id || "Not available"}</div></div>
            </div>

            <form onSubmit={handleSubmit}>
              <h3 className="card-header-title" style={{ marginBottom: "16px" }}>Update Profile</h3>
              <div className="form-grid-2col">
                <div className="form-group"><label className="form-label" htmlFor="profile-name"><User size={16} /> Full Name</label><input id="profile-name" className="form-input" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required /></div>
                <div className="form-group"><label className="form-label" htmlFor="profile-email"><AtSign size={16} /> Email Address</label><input id="profile-email" type="email" className="form-input" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></div>
                <div className="form-group"><label className="form-label" htmlFor="profile-phone"><Phone size={16} /> Phone Number</label><input id="profile-phone" type="tel" className="form-input" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} placeholder="Add a phone number" /></div>
              </div>
              <div className="form-actions" style={{ marginTop: "24px" }}><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Profile</>}</button></div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Profile;
