import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="zz-footer">
      <div>
        © <span id="y" /> Matthew
      </div>
      <nav className="zz-footerNav">
        <Link to="/posts" className="zz-footerLink">Posts</Link>
        <Link to="/docs" className="zz-footerLink">Docs</Link>
      </nav>
    </footer>
  );
}
