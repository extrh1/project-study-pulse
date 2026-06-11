import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Forgot() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/forgot-password", { email });
            localStorage.setItem("reset_email", email);
            navigate("/forgot/verify");
        } catch (err) {
            const errorData = err.response?.data;
            const validation = errorData?.errors
              ? Object.values(errorData.errors).flat().join(" ")
              : null;
            setError(validation || errorData?.message || "Unable to send reset code.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
                <p className="text-sm text-slate-500 mb-6">Enter your account email to receive a verification code.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none text-slate-900"
                        placeholder="Enter your email"
                        required
                    />
                    <button className="w-full rounded-2xl bg-primary px-4 py-3 text-white font-semibold disabled:opacity-60" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                    {error && (
                      <div className="mt-4 text-sm text-red-600">
                        {error}
                      </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Forgot;