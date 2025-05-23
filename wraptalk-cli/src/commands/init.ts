import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Detects if the project is using TypeScript or JavaScript.
 */

function detectProjectType(): string[] {
  const hasTsConfig = fs.existsSync(path.join(process.cwd(), "tsconfig.json"));
  return hasTsConfig ? ["ts", "tsx"] : ["js", "jsx"];
}

export function initCommand() {
  console.log("Installing wraptalk-react...");

  try {
    execSync("npm install wraptalk-react", { stdio: "inherit" });
  } catch (error) {
    console.error("Failed to install wraptalk-react.");
    console.error(error);
    process.exit(1);
  }

  const srcPath = path.join(process.cwd(), "src");

  if (!fs.existsSync(srcPath)) {
    console.error("src directory not found.");
    console.error("Please create a 'src' directory and re-run the command.");
    process.exit(1);
  }

  // console.log("Found src directory. Creating config files...");

  try {
    const translationsPath = path.join(srcPath, "wraptalk.translations.json");
    fs.writeFileSync(translationsPath, JSON.stringify({}, null, 2), "utf-8");
    console.log("Created wraptalk.translations.json in 'src' folder");

    const configPath = path.join(process.cwd(), "wraptalk.config.json");
    const configData = { fileExtensions: detectProjectType(), languages: [], appLanguage: "english"};
    
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), "utf-8");
    console.log("Created wraptalk.config.json in the root folder");

    console.log("Initialization complete!.");
  } catch (error) {
    console.error("Error creating configuration files:", error);
    process.exit(1);
  }
}
