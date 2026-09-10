/** Canonical page URLs exclude query/hash and use the site's trailing-slash policy. */
export function pageUrl(path: string, site: URL | string): URL {
  const url = new URL(path, site);
  url.search = "";
  url.hash = "";
  if (!/\.[^/]+$/.test(url.pathname)) url.pathname = url.pathname.replace(/\/+$/, "") + "/";
  return url;
}
