package portfolio

import (
	"net/http"
	"strings"
)

func getClientIP(req *http.Request) string {
	// Check X-Forwarded-For header first (for proxies/load balancers)
	xff := req.Header.Get("X-Forwarded-For")
	if xff != "" {
		// X-Forwarded-For can contain multiple IPs, take the first one
		if idx := strings.Index(xff, ","); idx > 0 {
			xff = strings.TrimSpace(xff[:idx])
		}
		return strings.TrimSpace(xff)
	}

	// Check X-Real-IP header
	xri := req.Header.Get("X-Real-IP")
	if xri != "" {
		return strings.TrimSpace(xri)
	}

	// Fall back to RemoteAddr
	ip := req.RemoteAddr
	if idx := strings.LastIndex(ip, ":"); idx > 0 {
		ip = ip[:idx]
	}
	return ip
}

func getPageViewCount() (int, error) {
	var count int
	err := getPortfolioDb().QueryRow("SELECT COUNT(*) FROM page_views").Scan(&count)
	return count, err
}

func incrementPageView(path, userAgent, referrer, ipAddress, acceptLanguage, requestMethod string) error {
	_, err := getPortfolioDb().Exec(
		`INSERT INTO page_views (timestamp, path, user_agent, referrer, ip_address, accept_language, request_method)
		 VALUES (datetime('now'), ?, ?, ?, ?, ?, ?)`,
		path, userAgent, referrer, ipAddress, acceptLanguage, requestMethod,
	)
	if err != nil {
		return err
	}

	return nil
}
