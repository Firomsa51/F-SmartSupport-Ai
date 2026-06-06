import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 rounded-xl border border-border bg-card">
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot password</h1>
        {sent ? (
          <p className="text-center text-muted-foreground mt-4">
            Check your email for a reset link.
          </p>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6 text-center">
              Enter your email and we'll send you a reset link.
            </p>
            {error && <p className="text-destructive text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                  required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
