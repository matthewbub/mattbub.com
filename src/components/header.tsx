import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="zz-masthead">
      <div className="zz-topline">
        <Link to="/" className="zz-brand zz-sansFont">
          Matthew
        </Link>
        <nav className="zz-navigation">
          <a href="/#projects" className="zz-navLink zz-sansFont">
            Projects
          </a>
          <a href="/blog" className="zz-navLink zz-sansFont">
            Posts
          </a>
          <a href="/second-brain" className="zz-navLink zz-sansFont">
            Second Brain
          </a>
        </nav>
      </div>
    </header>
  );
}
