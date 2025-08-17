package portfolio

func getPageViewCount() (int, error) {
	var count int
	err := getPortfolioDb().QueryRow("SELECT COUNT(*) FROM page_views").Scan(&count)
	return count, err
}

func incrementPageView(path, userAgent, referrer string) error {
	_, err := getPortfolioDb().Exec(
		`INSERT INTO page_views (timestamp, path, user_agent, referrer) VALUES (datetime('now'), ?, ?, ?)`,
		path, userAgent, referrer,
	)
	if err != nil {
		return err
	}

	return nil
}
