import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import "../app-timeline.css";

interface ModalSection {
  key: string;
  content: string;
  isCode?: boolean;
}

const timelineConfig = {
  header: {
    title: "Portfolio Build Timeline",
    subtitle: "A practical path from local to production",
  },
  items: [
    {
      title: "Go HTTP server",
      meta: "Local dev · minimal endpoints",
      description:
        "Spun up a lean Go server to serve the portfolio and API hooks.",
      stack: ["Go", "REST API", "Microservices", "Unit Testing", "CI/CD"],
      modal: {
        title: "Go HTTP server",
        sections: [
          {
            key: "Highlights",
            content:
              "REST endpoints, middleware (logging, recovery), unit tests, and CI on push.",
          },
          {
            key: "Impact",
            content:
              "Reduced cold-start latency by 35% and clearer error logs.",
          },
          {
            key: "Snippet",
            content:
              "GET /health -> 200 OK<br />GET /api/projects -> JSON list",
            isCode: true,
          },
        ] as ModalSection[],
      },
    },
    {
      title: "Basic style and design",
      meta: "Design system · tokens",
      description:
        "Established a compact visual system: typography, spacing, and color tokens for a cohesive look.",
      stack: [
        "UI/UX",
        "Design System",
        "Responsive Design",
        "Accessibility (WCAG)",
        "Figma",
      ],
      modal: {
        title: "Basic style and design",
        sections: [
          {
            key: "Highlights",
            content:
              "Tokenized design system and responsive grid; WCAG AA contrast.",
          },
          {
            key: "Impact",
            content: "Cut UI iteration time by ~25% and improved consistency.",
          },
        ] as ModalSection[] as ModalSection[],
      },
    },
    {
      title: "Dockerization",
      meta: "Portable runtime",
      description:
        "Containerized the app for reproducible builds and predictable deploys.",
      stack: [
        "Docker",
        "Kubernetes-ready",
        "Infrastructure as Code",
        "DevOps",
        "Observability",
      ],
      modal: {
        title: "Dockerization",
        sections: [
          {
            key: "Highlights",
            content:
              "Multi-stage Dockerfile, smaller image, HEALTHCHECK, env-based config.",
          },
          {
            key: "Commands",
            content:
              "docker build -t portfolio:latest .<br />docker run -p 8080:8080 --env ENV=prod portfolio:latest",
            isCode: true,
          },
        ] as ModalSection[] as ModalSection[],
      },
    },
    {
      title: "Launch Vultr Server",
      meta: "Ubuntu 24.04 · small footprint",
      description: "Provisioned a minimal instance sized for the app.",
      listItems: ["1 vCPU", "1 GB RAM", "25 GB SSD"],
      stack: [
        "Linux Administration",
        "Cloud Computing",
        "IaaS",
        "Cost Optimization",
      ],
      modal: {
        title: "Launch Vultr Server",
        sections: [
          {
            key: "Provisioning",
            content: "Ubuntu 24.04 LTS with cloud-init bootstrap.",
          },
          {
            key: "Impact",
            content: "Right-sized infra for cost-effective hosting.",
          },
        ] as ModalSection[] as ModalSection[],
      },
    },
    {
      title: "SSH into server, setup Git, clone repo",
      meta: "Hardened access",
      description:
        "Configured SSH keys, set up Git, and pulled the code to the server.",
      stack: ["Git", "SSH", "Secrets Management", "GitHub Actions"],
      modal: {
        title: "SSH, Git, clone repo",
        sections: [
          {
            key: "Security",
            content: "Key-based auth, least-privilege user, optional fail2ban.",
          },
          {
            key: "Commands",
            content:
              "ssh -i ~/.ssh/key user@host<br />git clone git@github.com:me/portfolio.git",
            isCode: true,
          },
        ] as ModalSection[],
      },
    },
    {
      title: "Launch docker image from Server",
      meta: "Service up",
      description:
        "Launched the container on the host and verified health checks.",
      stack: [
        "Container Orchestration",
        "Blue/Green Deployments",
        "Health Checks",
        "Monitoring",
      ],
      modal: {
        title: "Run Docker image",
        sections: [
          {
            key: "Runtime",
            content:
              "Systemd unit with restart policy; health checks and logs.",
          },
          {
            key: "Snippet",
            content: "curl -f http://127.0.0.1:8080/health",
            isCode: true,
          },
        ] as ModalSection[] as ModalSection[],
      },
    },
    {
      title: "Setup Vultr firewall rules",
      meta: "Perimeter",
      description:
        "Opened only required ports for SSH, HTTP, and HTTPS at the cloud edge.",
      stack: ["Network Security", "Zero Trust", "Threat Modeling"],
      modal: {
        title: "Vultr firewall rules",
        sections: [
          {
            key: "Rules",
            content: "Allow 22/tcp, 80/tcp, 443/tcp from trusted sources.",
          },
          {
            key: "Impact",
            content: "Reduced attack surface at the edge.",
          },
        ] as ModalSection[] as ModalSection[],
      },
    },
    {
      title: "Setup UFW firewall rules",
      meta: "Host firewall",
      description:
        "Mirrored inbound rules at the OS level for defense-in-depth.",
      stack: ["Firewall", "Hardening", "Incident Response"],
      modal: {
        title: "UFW firewall rules",
        sections: [
          {
            key: "Commands",
            content:
              "sudo ufw allow 22/tcp<br />sudo ufw allow 80/tcp<br />sudo ufw allow 443/tcp",
            isCode: true,
          },
          {
            key: "Notes",
            content: "Rate limiting and logging enabled.",
          },
        ] as ModalSection[] as ModalSection[],
      },
    },
    {
      title: "Setup Nginx",
      meta: "Reverse proxy",
      description:
        "Set up Nginx to terminate TLS, proxy to the container, and handle gzip/caching.",
      stack: ["Nginx", "Reverse Proxy", "Performance Optimization", "Caching"],
      modal: {
        title: "Nginx",
        sections: [
          {
            key: "Features",
            content: "HTTP/2, gzip, caching, reverse proxy to container.",
          },
          {
            key: "Snippet",
            content: "location / { proxy_pass http://127.0.0.1:8080; }",
            isCode: true,
          },
        ] as ModalSection[] as ModalSection[],
      },
    },
    {
      title: "Setup certbot",
      meta: "Auto-renew",
      description:
        "Issued Let's Encrypt certificates and configured renewal hooks.",
      stack: ["SSL/TLS", "Let's Encrypt", "Security Compliance"],
      modal: {
        title: "Certbot",
        sections: [
          {
            key: "Automation",
            content: "Auto-renewal with systemd timers.",
          },
          {
            key: "Command",
            content: "certbot --nginx -d example.com -d www.example.com",
            isCode: true,
          },
        ] as ModalSection[],
      },
    },
    {
      title: "Configure DNS & enforce HTTPS (Cloudflare)",
      meta: "Edge hardening",
      description:
        "Pointed DNS to the server, enforced HTTPS, and enabled security rules at the edge.",
      stack: ["Cloudflare", "DNS", "HSTS", "WAF", "SRE Practices"],
      modal: {
        title: "Cloudflare DNS & HTTPS",
        sections: [
          {
            key: "Edge",
            content: "Proxied DNS, HSTS, WAF rules, TLS 1.2+ only.",
          },
          {
            key: "Result",
            content: "Improved TTFB and global security posture.",
          },
        ] as ModalSection[],
      },
    },
  ],
};

export const Route = createFileRoute("/app-timeline")({
  component: AppTimeline,
});

export default function AppTimeline() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (itemTitle: string) => {
    setExpandedItem(expandedItem === itemTitle ? null : itemTitle);
  };

  return (
    <div>
      <header className="title">
        <h1>{timelineConfig.header.title}</h1>
        <div className="sub">{timelineConfig.header.subtitle}</div>
      </header>
      <section className="timeline" aria-label="Project build timeline">
        {timelineConfig.items.map((item, index) => (
          <article key={item.title} className="item">
            <div className="dot" aria-hidden="true" />
            <div className="timeline-content">
              <div
                className="card"
                tabIndex={0}
                role="button"
                onClick={() => toggleItem(item.title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(item.title);
                  }
                }}
                aria-label={`Toggle details: ${item.title}`}
                aria-expanded={expandedItem === item.title}
              >
                <div className="headline">
                  <h3>{item.title}</h3>
                  <span className="badge">Step {index + 1}</span>
                </div>
                <p className="meta">{item.meta}</p>
                <p className="desc">{item.description}</p>
                {item.listItems && (
                  <ul className="list">
                    {item.listItems.map((listItem, index) => (
                      <li key={index}>{listItem}</li>
                    ))}
                  </ul>
                )}
                <div className="stack">
                  {item.stack.map((tech, index) => (
                    <span key={index} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {expandedItem === item.title && (
                <div className="accordion-content">
                  <div className="accordion-head">
                    <h4>{item.modal.title}</h4>
                    <button
                      className="close"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedItem(null);
                      }}
                      aria-label="Close details"
                    >
                      Close
                    </button>
                  </div>
                  <div className="accordion-body">
                    {item.modal.sections.map((section, index) => (
                      <div key={index} className="kv">
                        <div className="k">{section.key}</div>
                        <div className={section.isCode ? "code" : ""}>
                          {section.isCode ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: section.content,
                              }}
                            />
                          ) : (
                            section.content
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
