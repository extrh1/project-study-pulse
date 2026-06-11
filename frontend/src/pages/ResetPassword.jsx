import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("reset_email");
    const storedCode = localStorage.getItem("reset_code");

    if (!storedEmail) {
      navigate("/forgot");
      return;
    }

    setEmail(storedEmail);
    if (storedCode) {
      setCode(storedCode);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/reset-password", {
        email,
        code,
        password,
        password_confirmation: confirmPassword,
      });
      localStorage.removeItem("reset_email");
      localStorage.removeItem("reset_code");
      alert("Password reset successfully. Please login.");
      navigate("/login");
    } catch (err) {
      const errorData = err.response?.data;
      const validation = errorData?.errors
        ? Object.values(errorData.errors).flat().join(" ")
        : null;
      setError(validation || errorData?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter a new password for <strong>{email}</strong>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none text-slate-900"
            placeholder="Reset code"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none text-slate-900"
            placeholder="New password"
            minLength={8}
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none text-slate-900"
            placeholder="Confirm password"
            minLength={8}
            required
          />
          <button
            className="w-full rounded-2xl bg-primary px-4 py-3 text-white font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
