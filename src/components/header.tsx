import { Link, useLocation } from "@tanstack/react-router";

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="zz-masthead">
      <div className="zz-topline">
        <Link to="/" className="zz-brand zz-sansFont">
          Mat
        </Link>
        <nav className="zz-navigation">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={
                isActive(path)
                  ? "zz-navLink zz-sansFont zz-navLinkActive"
                  : "zz-navLink zz-sansFont"
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
