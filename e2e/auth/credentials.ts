function requireEnv(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(
			`Missing required env var "${name}". Copy .env.example to .env and fill in the E2E test credentials.`,
		);
	}

	return value;
}

export const CYCLIST_CREDENTIALS = {
	email: requireEnv('E2E_CYCLIST_EMAIL'),
	password: requireEnv('E2E_CYCLIST_PASSWORD'),
};

export const MONITOR_CREDENTIALS = {
	email: requireEnv('E2E_MONITOR_EMAIL'),
	password: requireEnv('E2E_MONITOR_PASSWORD'),
};
