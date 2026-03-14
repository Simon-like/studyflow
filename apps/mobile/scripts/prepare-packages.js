#!/usr/bin/env node
/**
 * EAS Build 预处理脚本
 * 将 packages 复制到 mobile 目录以确保 EAS 能正确访问
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '../..');
const targetDir = path.join(projectRoot, 'embedded-packages');

const packages = ['shared', 'api', 'theme'];

console.log('🚀 Preparing packages for EAS Build...');
console.log('Workspace root:', workspaceRoot);
console.log('Target dir:', targetDir);

// 创建目标目录
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 复制 packages
for (const pkg of packages) {
  const srcDir = path.join(workspaceRoot, 'packages', pkg);
  const destDir = path.join(targetDir, pkg);
  
  if (!fs.existsSync(srcDir)) {
    console.error(`❌ Package not found: ${srcDir}`);
    process.exit(1);
  }
  
  // 删除旧目录
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true });
  }
  
  // 复制目录
  fs.mkdirSync(destDir, { recursive: true });
  
  // 递归复制文件
  function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist') {
          fs.mkdirSync(destPath, { recursive: true });
          copyRecursive(srcPath, destPath);
        }
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  copyRecursive(srcDir, destDir);
  console.log(`✅ Copied @studyflow/${pkg}`);
}

// 创建 package.json 文件来模拟 workspace 包
const sharedPkg = {
  "name": "@studyflow/shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
};

const apiPkg = {
  "name": "@studyflow/api",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@studyflow/shared": "file:../shared",
    "axios": "^1.6.2"
  }
};

const themePkg = {
  "name": "@studyflow/theme",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
};

fs.writeFileSync(
  path.join(targetDir, 'shared/package.json'),
  JSON.stringify(sharedPkg, null, 2)
);
fs.writeFileSync(
  path.join(targetDir, 'api/package.json'),
  JSON.stringify(apiPkg, null, 2)
);
fs.writeFileSync(
  path.join(targetDir, 'theme/package.json'),
  JSON.stringify(themePkg, null, 2)
);

console.log('✅ Package.json files created');
console.log('✅ All packages prepared successfully!');
