const fetch_ = typeof fetch == `undefined` ? (await import(`node-fetch`)).default as typeof fetch : fetch

export { fetch_ as fetch, fetch_ as default }
