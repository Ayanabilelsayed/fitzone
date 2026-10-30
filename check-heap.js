const { spawnSync } = require("node:child_process");

const code = 'console.log(Math.round(require("node:v8").getHeapStatistics().heap_size_limit / 1024 / 1024), process.env.NODE_OPTIONS)';

const result = spawnSync(process.execPath, ["-e", code], {
  encoding: "utf8"
});

console.log("Parent NODE_OPTIONS:", process.env.NODE_OPTIONS);
console.log("Child process:", result.stdout);
console.log("Error:", result.stderr);
