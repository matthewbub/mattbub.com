import { Link, useLocation } from "@tanstack/react-router";

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/experience", label: "Experience" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="masthead">
      <div className="topline">
        <Link to="/" className="brand">
          Matt
        </Link>
        <nav>
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={
                isActive(path) ? "zz-navLink zz-navLinkActive" : "zz-navLink"
              }
              aria-current={isActive(path) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
