import fs from "node:fs";
import path from "node:path";

const srcDir = "src";
const registrySourceDir = "registry/source";

const filesToCopy = [
  { src: "components/auth", dest: "" },
  { src: "components/auth/forms", dest: "forms" },
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
      const files = fs.readdirSync(fullSrcPath);
      files.forEach((file) => {
        if (
          fs.statSync(path.join(fullSrcPath, file)).isFile() &&
          (file.endsWith(".tsx") || file.endsWith(".ts"))
        ) {
          copyFile(
            path.join(fullSrcPath, file),
            path.join(fullDestPath, file),
            dest,
          );
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

  // Apply transformations based on destination category
  if (destCategory === "") {
    // Top level components (auth-form.tsx, etc.)
    content = content.replace(/\.\.\/\.\.\/lib/g, "./lib");
    content = content.replace(/\.\.\/\.\.\/hooks/g, "./hooks");
    content = content.replace(/\.\.\/\.\.\/types/g, "./types");
    content = content.replace(/\.\.\/\.\.\/localization/g, "./localization");
  } else if (destCategory === "forms") {
    content = content.replace(/\.\.\/\.\.\/\.\.\/lib/g, "../lib");
    content = content.replace(/\.\.\/\.\.\/\.\.\/hooks/g, "../hooks");
    content = content.replace(/\.\.\/\.\.\/\.\.\/types/g, "../types");
    content = content.replace(
      /\.\.\/\.\.\/\.\.\/localization/g,
      "../localization",
    );
    content = content.replace(/\.\.\/\.\.\/captcha/g, "../captcha");
    content = content.replace(
      /\.\.\/\.\.\/password-input/g,
      "../password-input",
    );
  } else if (destCategory === "captcha") {
    content = content.replace(/\.\.\/\.\.\/lib/g, "../lib");
  }

  // Global transformations for shadcn UI components
  content = content.replace(
    /from ["']\.\.\/ui\/?([^"']*)["']/g,
    'from "@/components/ui/$1"',
  );
  content = content.replace(
    /from ["']\.\/ui\/?([^"']*)["']/g,
    'from "@/components/ui/$1"',
  );

  fs.writeFileSync(dest, content);
}

copyAndTransform();
