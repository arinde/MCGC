//#region src/lib/env.ts
function read(name) {
	const runtime = typeof process !== "undefined" ? process.env?.[name] : void 0;
	const build = Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SITE": "https://majiyagbe-convention.vercel.app",
		"SSR": true
	}, {
		ADMIN_PASSWORD: "231743",
		SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyanJwaHl1YXVoaWt6aHhreHpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzUwNDcxMSwiZXhwIjoyMTAzMDgwNzExfQ.l12FP2q2wkQrUVrCfua4-alE0XkyJJQvPNCXeEdycY0",
		SUPABASE_URL: "https://hrjrphyuauhikzhxkxzl.supabase.co",
		PUBLIC: "C:\\Users\\Public",
		_: "C:/Program Files/nodejs/node.exe"
	})[name];
	const value = runtime ?? build;
	return value && value.length > 0 ? value : void 0;
}
var env = {
	get supabaseUrl() {
		return read("SUPABASE_URL");
	},
	get supabaseServiceRoleKey() {
		return read("SUPABASE_SERVICE_ROLE_KEY");
	},
	get adminPassword() {
		return read("ADMIN_PASSWORD");
	},
	get siteUrl() {
		return read("PUBLIC_SITE_URL");
	}
};
//#endregion
export { env as t };
