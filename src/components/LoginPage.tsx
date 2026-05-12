import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // UI-only screen for now; authentication will be wired once backend is ready.
    event.preventDefault();
  };

  return (
    <div className="ml-page ml-login-page" data-nav-scrolled="true">
      <div className="ml-bg-layer ml-bg-glow" aria-hidden />
      <div className="ml-bg-layer ml-bg-grid" aria-hidden />
      <div className="ml-bg-layer ml-bg-vignette" aria-hidden />

      <header className="ml-nav-wrap ml-login-nav-wrap">
        <div className="ml-nav-shell">
          <Link to="/" className="ml-brand" aria-label="MAD LABS home">
            <img src="/brand/asset-7-custom-2x.png" alt="" className="ml-brand-mark" />
            <img src="/brand/asset-1-wordmark-2x.png" alt="MAD LABS" className="ml-brand-wordmark" />
          </Link>
          <nav className="ml-nav-links" aria-label="Login links">
            <a href="#signin" className="ml-nav-link">
              Sign In
            </a>
          </nav>
          <Link to="/" className="ml-nav-cta">
            Back Home
          </Link>
        </div>
      </header>

      <main className="ml-login-main">
        <section className="ml-login-shell" aria-labelledby="ml-login-title">
          <div className="ml-login-intro">
            <p className="ml-login-kicker">Account Access</p>
            <h1 id="ml-login-title" className="ml-login-title">
              Welcome back to your control center.
            </h1>
            <p className="ml-login-copy">
              Continue managing projects, launch pipelines, and platform operations from one place.
            </p>
            <div className="ml-login-pills">
              {['Project Tracking', 'Team Workspaces', 'Release Timeline', 'Performance Metrics'].map((item) => (
                <p key={item} className="ml-login-pill">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="ml-login-card-wrap" id="signin">
            <div className="ml-login-card">
              <p className="ml-login-kicker">Login</p>
              <h2 className="ml-login-card-title">Account Sign In</h2>
              <p className="ml-login-card-copy">UI only for now. Authentication will be connected once backend is ready.</p>

              <form className="ml-login-form" onSubmit={handleSubmit}>
                <label htmlFor="email" className="ml-login-label">
                  Email address
                </label>
                <input id="email" type="email" placeholder="name@madlabs.com" className="ml-login-input" required />

                <label htmlFor="password" className="ml-login-label">
                  Password
                </label>
                <div className="ml-login-password-row">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="ml-login-input"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="ml-login-toggle">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <button type="submit" className="ml-btn ml-btn-primary ml-login-submit">
                  Sign In
                </button>
              </form>

              <p className="ml-login-note">
                New here? <a href="#">Create an account</a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
