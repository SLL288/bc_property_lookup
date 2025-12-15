// Simple link checker for curated “official” URLs.
// Usage: npm run check:links

const urls = [
  "https://maps.vancouver.ca/zoning/",
  "https://vancouver.ca/home-property-development/zoning-and-development-bylaw.aspx",
  "https://vancouver.ca/home-property-development/get-information-on-a-property.aspx",
  "https://vancouver.ca/home-property-development/find-a-development-application-or-permit.aspx",
  "https://vancouver.ca/home-property-development/zoning-and-land-use-policies-document-library.aspx",
  "https://cd1-bylaws.vancouver.ca/"
];

async function check(url) {
  try {
    const res = await fetch(url, { redirect: "follow", method: "HEAD" });
    const ok = res.status >= 200 && res.status < 300;
    return { url, status: res.status, ok };
  } catch (err) {
    return { url, status: "error", ok: false, error: err?.message };
  }
}

(async () => {
  const results = await Promise.all(urls.map(check));
  let exit = 0;
  for (const r of results) {
    if (!r.ok) exit = 1;
    console.log(`${r.ok ? "OK " : "FAIL"} ${r.url} -> ${r.status}${r.error ? " (" + r.error + ")" : ""}`);
  }
  process.exit(exit);
})();
