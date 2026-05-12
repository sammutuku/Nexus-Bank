import React, { useState, useEffect } from "react";
import "./Login.css";

const BRANCHES = [
  "HEAD OFFICE", "FORT PORTAL BRANCH", "BUNDIBUGYO BRANCH", "KASESE BRANCH",
  "HOIMA BRANCH", "KAMPALA BRANCH", "ENTEBBE BRANCH", "GULU BRANCH",
  "MBARARA BRANCH", "JINJA BRANCH",
];

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [branch, setBranch] = useState("HEAD OFFICE");
  const [loginDate, setLoginDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isCleanWindow = new URLSearchParams(window.location.search).get("clean") === "true";

  // Typing Animation
  const [displayedTitle, setDisplayedTitle] = useState("");
  const fullTitle = "PRIME CORE";

  useEffect(() => {
    if (isCleanWindow) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < fullTitle.length) {
          setDisplayedTitle(fullTitle.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }
  }, [isCleanWindow]);

  const openCleanWindow = () => {
    const width = window.screen.availWidth - 10;
    const height = window.screen.availHeight - 10;
    const features = `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no`;
    const targetUrl = `${window.location.origin}${window.location.pathname}?clean=true`;
    const newWin = window.open(targetUrl, 'CoreBanking', features);
    if (newWin) setTimeout(() => window.close(), 300);
  };

  useEffect(() => {
    if (!isCleanWindow) {
      const timer = setTimeout(openCleanWindow, 100);
      return () => clearTimeout(timer);
    }
  }, [isCleanWindow]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!userId.trim()) { setError("Operator ID is required."); return; }
    if (!password) { setError("Password is required."); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (userId === "admin" && password === "1234") {
        setSuccess("Login successful...");
        setTimeout(() => onLoginSuccess(), 800);
      } else {
        setError("Invalid credentials.");
      }
    }, 1500);
  }

  return (
    <div className="login-root">
      <div className="login-bg-grid" />
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <header className="login-topbar">
        <div className="login-logo">
          <div className="login-logo-mark">P</div>
          <div className="login-logo-text">
            <div className="login-logo-name">{displayedTitle}</div>
            <div className="login-logo-tag">BANKING SYSTEM</div>
          </div>
        </div>
      </header>

      <main className="login-main">
        <div className="login-left">
          <div className="login-live-badge">
            <span className="login-dot" />
            <span className="login-badge-text">Live — SIT Environment</span>
          </div>
          <h1 className="login-headline">Secure <em>Banking</em> Infrastructure</h1>
          <p className="login-subline">Enterprise core banking for microfinance institutions.</p>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-scanline" />
            <div className="login-card-title">Secure Login</div>
            <div className="login-card-sub">Authorized personnel only</div>

            {error && <div className="login-alert login-alert-err">{error}</div>}
            {success && <div className="login-alert login-alert-ok">{success}</div>}

            <form onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-label">BRANCH</label>
                <div className="login-input-wrapper">
                  <span className="login-icon">🏠</span>
                  <select className="login-input" value={branch} onChange={e => setBranch(e.target.value)}>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">LOGIN DATE</label>
                <div className="login-input-wrapper">
                  <span className="login-icon">📅</span>
                  <input 
                    type="date" 
                    className="login-input" 
                    value={loginDate} 
                    onChange={(e) => setLoginDate(e.target.value)} 
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">OPERATOR ID</label>
                <div className="login-input-wrapper">
                  <span className="login-icon">👤</span>
                  <input className="login-input" type="text" value={userId} onChange={e => setUserId(e.target.value)} />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">PASSWORD</label>
                <div className="login-input-wrapper">
                  <span className="login-icon">🔑</span>
                  <input 
                    className="login-input" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                </div>
              </div>

              <button type="submit" className="login-btn-login" disabled={loading}>
                {loading ? "Authenticating..." : "LOGIN →"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;