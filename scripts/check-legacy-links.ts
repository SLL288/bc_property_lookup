import fs from "fs";
import path from "path";

const root = path.resolve(__dirname, "..");
const legacyPatterns: { label: string; regex: RegExp }[] = [
  { label: "/zoning/vancouver", regex: /\/zoning\/vancouver(?![a-zA-Z0-9_-])/ },
  { label: "/zoning/vancouver-zoning-map", regex: /\/zoning\/vancouver-zoning-map/ },
  { label: "/zoning/vancouver-zoning-lookup", regex: /\/zoning\/vancouver-zoning-lookup/ },
  { label: "/zoning/burnaby-zoning-lookup", regex: /\/zoning\/burnaby-zoning-lookup/ },
  { label: "/zoning/surrey-zoning-lookup", regex: /\/zoning\/surrey-zoning-lookup/ }
];

const allowlist = new Set(["public/_redirects"]);

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".git")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(ts|tsx|md|json|txt|css)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const offenders: { file: string; match: string }[] = [];

for (const file of walk(root)) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (allowlist.has(rel)) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const pattern of legacyPatterns) {
    if (pattern.regex.test(content)) {
      offenders.push({ file: rel, match: pattern.label });
    }
  }
}

if (offenders.length) {
  console.error("Legacy zoning links found:");
  offenders.forEach((o) => console.error(` - ${o.file} → ${o.match}`));
  process.exit(1);
} else {
  console.log("No legacy zoning links found.");
}
