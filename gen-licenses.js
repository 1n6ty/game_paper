import checker from "license-checker";
import fs from "fs";

const config = {
  production: true,
  start: process.cwd(),
  direct: false,
  excludePrivatePackages: true,
  unknown: true
};

checker.init(config, (err, packages) => {
  if (err) {
    console.error("Error running license-checker:", err);
    process.exit(1);
  }

  if (!packages || Object.keys(packages).length === 0) {
    console.error("No packages found. Check your project dependencies.");
    process.exit(1);
  }

  try {
    let mdContent = "# Third-Party Licenses\n\n";
    mdContent += "| Package | Version | License | Repository |\n";
    mdContent += "|---------|---------|---------|------------|\n";

    Object.entries(packages).forEach(([fullName, data]) => {
      const nameParts = fullName.split("@");
      const pkgName = nameParts.slice(0, -1).join("@") || fullName;
      const version = nameParts[nameParts.length - 1] || "unknown";
      const license = data?.licenses || "UNKNOWN";
      const repo = data?.repository || "-";

      mdContent += `| ${pkgName} | ${version} | ${license} | ${repo} |\n`;
    });

    fs.writeFileSync("THIRD-PARTY-LICENSES.md", mdContent);
    console.log("Successfully generated THIRD-PARTY-LICENSES.md");
  } catch (e) {
    console.error("Error generating license file:", e);
    process.exit(1);
  }
});