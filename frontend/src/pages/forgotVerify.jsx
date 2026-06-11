import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ForgotVerify() {

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("reset_email");
        if (!storedEmail) {
            navigate("/forgot");
            return;
        }
        setEmail(storedEmail);
    }, [navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/verify-code", { email, code });
            localStorage.setItem("reset_code", code);
            navigate("/reset-password");
        } catch (err) {
            const errorData = err.response?.data;
            const validation = errorData?.errors
              ? Object.values(errorData.errors).flat().join(" ")
              : null;
            setError(validation || errorData?.message || "Verification failed.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <h1 className="text-2xl font-bold mb-4">Verify Reset Code</h1>
                <p className="text-sm text-slate-500 mb-6">Enter the code sent to your email to continue.</p>
                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none text-slate-900"
                        placeholder="Enter verification code"
                        required
                    />

                    <button className="w-full rounded-2xl bg-primary px-4 py-3 text-white font-semibold disabled:opacity-60" disabled={loading}>
                        {loading ? "Verifying..." : "Verify Code"}
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

export default ForgotVerify;