const fetch_ = (fetch || (await import(`node-fetch`)).default) as typeof fetch

export { fetch_ as fetch, fetch_ as default }
