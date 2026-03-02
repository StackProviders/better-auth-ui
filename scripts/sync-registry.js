import fs from "node:fs";
import path from "node:path";

const srcDir = "src";
const registrySourceDir = "registry/source";

const filesToCopy = [
  { src: "components/auth", dest: "" },
  { src: "components/organization", dest: "organization" },
  { src: "components/account", dest: "account" },
  { src: "components/settings", dest: "settings" },
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
  { src: "lib/auth-ui-provider.tsx", dest: "auth-ui-provider.tsx" },
  { src: "lib/organization-refetcher.tsx", dest: "organization-refetcher.tsx" },
  { src: "hooks", dest: "hooks" },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyAndTransform() {
  console.log("Syncing registry source files...");

  // Clean registry source to remove stale files from previous syncs
  if (fs.existsSync(registrySourceDir)) {
    const files = fs.readdirSync(registrySourceDir);
    for (const file of files) {
      const curPath = path.join(registrySourceDir, file);
      try {
        fs.rmSync(curPath, { recursive: true, force: true });
      } catch (e) {
        console.warn(`Could not remove ${curPath}: ${e.message}`);
      }
    }
  } else {
    fs.mkdirSync(registrySourceDir, { recursive: true });
  }

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

  // Transform internal imports to use the better-auth-ui package
  // Transform hooks, lib, and organization refetcher to point to the local copies
  content = content.replace(
    /from ["'](\.\/|\.\.\/)*(lib\/)?organization-refetcher["']/g,
    'from "@/components/auth/organization-refetcher"',
  );
  content = content.replace(
    /from ["'](\.\/|\.\.\/)*(lib\/)?auth-ui-provider["']/g,
    'from "@/components/auth/auth-ui-provider"',
  );

  // Transform types, localization, server, and other lib files to point to the npm package (pure, no context)
  content = content.replace(
    /from ["'](\.\/|\.\.\/)*(types|localization|server|view-paths|lib)\/?([^"']*)["']/g,
    'from "better-auth-ui"',
  );

  content = content.replace(
    /from ["'](\.\/|\.\.\/)*(hooks)\/([^"']*)["']/g,
    'from "@/components/auth/$2/$3"',
  );

  // Components transformations
  content = content.replace(
    /from ["'](\.\/|\.\.\/)*(auth|organization|account|settings)\/([^"']*)["']/g,
    'from "@/components/$2/$3"',
  );
  content = content.replace(
    /from ["'](\.\/|\.\.\/)*components\/(auth|organization|account|settings)\/([^"']*)["']/g,
    'from "@/components/$2/$3"',
  );
  content = content.replace(
    /from ["'](\.\/|\.\.\/)*(components\/)?captcha\/([^"']*)["']/g,
    'from "@/components/captcha/$3"',
  );

  // Root components transformations
  content = content.replace(
    /from ["'](\.\/|\.\.\/)+(auth-loading|form-error|password-input|provider-icons|redirect-to-sign-in|redirect-to-sign-up|signed-in|signed-out|user-avatar|user-button|user-view)["']/g,
    'from "@/components/$2"',
  );

  // Global transformations for shadcn UI components
  content = content.replace(
    /from ["'](\.\/|\.\.\/)*ui\/?([^"']*)["']/g,
    'from "@/components/ui/$2"',
  );

  fs.writeFileSync(dest, content);
}

copyAndTransform();
