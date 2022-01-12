# 02ExpressRedis

This is a simple express.js example that uses redis to temporarily store any data you provide in the `?bla=` query var
in an index request. 

Call `/get` to fetch the var. 

This also has a quick'n'dirty timeout wrapper that will kill a request after 2 seconds. 