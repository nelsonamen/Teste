import { readFile, readdir, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const bundlePath = new URL("../dist/soccer-live-hub.bundle.js", import.meta.url);
const preferredBytes = 780 * 1024;
const maximumBytes = 850 * 1024;
const { size } = await stat(bundlePath);
const gzipBytes = gzipSync(await readFile(bundlePath), { level: 9 }).byteLength;
const distFiles = await readdir(new URL("../dist/", import.meta.url));
const unexpectedChunks = distFiles.filter(name => (
  name.endsWith(".js") && name !== "soccer-live-hub.bundle.js"
));
if (unexpectedChunks.length) {
  console.error(
    `Unexpected JavaScript chunks: ${unexpectedChunks.join(", ")}.`,
  );
  process.exitCode = 1;
}
const sizeKiB = (size / 1024).toFixed(1);
const gzipKiB = (gzipBytes / 1024).toFixed(1);

console.log(`Bundle size: ${sizeKiB} KiB / ${gzipKiB} KiB gzip.`);
