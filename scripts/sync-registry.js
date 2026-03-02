import fs from "node:fs";
import path from "node:path";

const srcDir = "src";
const registrySourceDir = "registry/source";

const filesToCopy = [
  { src: "components/auth", dest: "" },
  { src: "components/auth/forms", dest: "forms" },
  { src: "components/organization", dest: "organization" },
  { src: "components/account", dest: "account" },
  { src: "components/settings", dest: "settings" },
  { src: "lib", dest: "lib" },
  { src: "hooks", dest: "hooks" },
  { src: "types", dest: "types" },
  { src: "localization", dest: "localization" },
  { src: "components/captcha", dest: "captcha" },
  { src: "components/auth-loading.tsx", dest: "auth-loading.tsx" },
  { src: "components/form-error.tsx", dest: "form-error.tsx" },
  { src: "components/password-input.tsx", dest: "password-input.tsx" },
  { src: "components/provider-icons.tsx", dest: "provider-icons.tsx" },
  {
    src: "components/redirect-to-sign-in.tsx",
    dest: "redirect-to-sign-in.tsx",
  },
  {
    src: "components/redirect-to-sign-up.tsx",
    dest: "redirect-to-sign-up.tsx",
  },
  { src: "components/signed-in.tsx", dest: "signed-in.tsx" },
  { src: "components/signed-out.tsx", dest: "signed-out.tsx" },
  { src: "components/user-avatar.tsx", dest: "user-avatar.tsx" },
  { src: "components/user-button.tsx", dest: "user-button.tsx" },
  { src: "components/user-view.tsx", dest: "user-view.tsx" },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyAndTransform() {
  console.log("Syncing registry source files...");

  filesToCopy.forEach(({ src, dest }) => {
    const fullSrcPath = path.join(srcDir, src);
    const fullDestPath = path.join(registrySourceDir, dest);

    if (!fs.existsSync(fullSrcPath)) {
      console.warn(`Source path does not exist: ${fullSrcPath}`);
      return;
    }

    if (fs.statSync(fullSrcPath).isDirectory()) {
      ensureDir(fullDestPath);
      const files = fs.readdirSync(fullSrcPath, { recursive: true });
      files.forEach((file) => {
        const srcFile = path.join(fullSrcPath, file);
        if (
          fs.statSync(srcFile).isFile() &&
          (file.endsWith(".tsx") || file.endsWith(".ts"))
        ) {
          const destFile = path.join(fullDestPath, file);
          ensureDir(path.dirname(destFile));

          // Calculate category for transformation
          const relativeDir = path.dirname(file);
          const category =
            dest === ""
              ? relativeDir === "."
                ? ""
                : relativeDir
              : path.join(dest, relativeDir).replace(/\\/g, "/");

          copyFile(srcFile, destFile, category);
        }
      });
    } else {
      ensureDir(path.dirname(fullDestPath));
      copyFile(
        fullSrcPath,
        fullDestPath,
        path.dirname(dest) === "." ? "" : path.dirname(dest),
      );
    }
  });

  console.log("Registry sync complete.");
}

function copyFile(src, dest, destCategory) {
  let content = fs.readFileSync(src, "utf8");

  // Global transformations for internal project structure
  // We use aliases to support placing files in root folders while maintaining DX
  content = content.replace(
    /from ["'](\.\.\/)*hooks\/([^"']*)["']/g,
    'from "@/hooks/auth/$2"',
  );
  content = content.replace(
    /from ["'](\.\.\/)*lib\/([^"']*)["']/g,
    'from "@/lib/auth/$2"',
  );
  content = content.replace(
    /from ["'](\.\.\/)*types\/([^"']*)["']/g,
    'from "@/lib/auth/types/$2"',
  );
  content = content.replace(
    /from ["'](\.\.\/)*localization\/([^"']*)["']/g,
    'from "@/lib/auth/localization/$2"',
  );

  // Components transformations
  content = content.replace(
    /from ["'](\.\.\/)*auth\/([^"']*)["']/g,
    'from "@/components/auth/$2"',
  );
  content = content.replace(
    /from ["'](\.\.\/)*organization\/([^"']*)["']/g,
    'from "@/components/organization/$2"',
  );
  content = content.replace(
    /from ["'](\.\.\/)*account\/([^"']*)["']/g,
    'from "@/components/account/$2"',
  );
  content = content.replace(
    /from ["'](\.\.\/)*settings\/([^"']*)["']/g,
    'from "@/components/settings/$2"',
  );
  content = content.replace(
    /from ["'](\.\.\/)*captcha\/([^"']*)["']/g,
    'from "@/components/captcha/$2"',
  );

  // Global transformations for shadcn UI components
  content = content.replace(
    /from ["'](\.\.\/)*ui\/?([^"']*)["']/g,
    'from "@/components/ui/$2"',
  );

  fs.writeFileSync(dest, content);
}

copyAndTransform();
