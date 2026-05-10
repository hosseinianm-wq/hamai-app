const fs = require("fs")
const path = require("path")

function readFile(p) {
  try {
    return fs.readFileSync(p, "utf8")
  } catch {
    return null
  }
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).map(f => path.join(dir, f))
}

const targets = [
  "package.json",
  "tsconfig.json",
  "tsconfig.node.json",
  "test.ts",
  "features/voice/events/voiceEvents.ts"
]

console.log("\n==== ENV ====")
console.log("Node:", process.version)

try {
  const ts = require("typescript")
  console.log("TypeScript:", ts.version)
} catch {
  console.log("TypeScript: not installed locally")
}

console.log("\n==== CORE FILES ====")

targets.forEach(file => {
  const content = readFile(file)
  if (content) {
    console.log(`\n----- ${file} -----\n`)
    console.log(content)
  }
})

console.log("\n==== VOICE ENGINES ====")

const engineDir = "features/voice/engines"
const engineFiles = listFiles(engineDir)

engineFiles.forEach(file => {
  if (file.endsWith(".ts")) {
    console.log(`\n----- ${file} -----\n`)
    console.log(readFile(file))
  }
})
