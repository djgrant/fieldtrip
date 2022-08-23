#!/usr/bin/env node

import fs from "fs";

fs.cpSync("packages/", "dist/packages/", { recursive: true });

console.log("Added workspace packages to dist/ directory");
