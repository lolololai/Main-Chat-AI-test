import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, normalizePath, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * ทำให้ไฟล์ใน public/ "เพิ่มปุ๊บ เห็นปั๊บ" ทั้งใน dev และ build:
 *
 * 1. Dev: เสิร์ฟไฟล์จาก public/ โดยเช็กจากดิสก์ทุก request
 *    (Vite 7 เก็บรายชื่อไฟล์ public ตอน start — ถ้า mount จาก Docker แล้ว watcher
 *     พลาด event ไฟล์ใหม่ เว็บจะตกไปหา index.html แทน → ตรงนี้แก้ให้ชัวร์)
 * 2. Dev: คอย copy ไฟล์ public/ → dist/ ทันทีที่มีการ add/change/unlink
 *    (ไม่ต้องรัน npm run build เองอีกต่อไป เผื่อเอา dist ไป serve ต่อ)
 */
function livePublicAssets(): Plugin {
  const MIME: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.avif': 'image/avif',
    '.bmp': 'image/bmp',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
  };

  return {
    name: 'live-public-assets',
    apply: 'serve',

    configureServer(server) {
      const publicDir = normalizePath(server.config.publicDir);
      const distDir = normalizePath(path.resolve(server.config.root, 'dist'));

      // sync รอบแรกตอน start เผื่อ dist เก่ากว่า public อยู่แล้ว (เคสที่เจอตอนแรก)
      fs.cpSync(publicDir, distDir, { recursive: true, force: true });

      // --- (1) เสิร์ฟไฟล์ public แบบ dynamic ---
      // middleware ที่เพิ่มใน configureServer จะรันก่อน internal middleware ของ Vite
      server.middlewares.use((req, res, next) => {
        const raw = (req.url || '').split('?')[0];
        let urlPath = raw;
        try {
          urlPath = decodeURIComponent(raw);
        } catch {
          /* ใช้ raw ต่อไปถ้า decode ไม่ได้ */
        }
        if (!urlPath.startsWith('/')) return next();

        const ext = path.extname(urlPath).toLowerCase();
        if (!MIME[ext]) return next();

        // '.' + '/profiles/x.jpg' -> './profiles/x.jpg' (กัน path หลุด publicDir)
        const abs = path.resolve(publicDir, '.' + urlPath);
        if (!normalizePath(abs).startsWith(publicDir + '/')) return next();

        let stat: fs.Stats;
        try {
          stat = fs.statSync(abs);
        } catch {
          return next(); // ไม่มีไฟล์ → ปล่อยให้ Vite / SPA fallback จัดการ
        }
        if (!stat.isFile()) return next();

        res.statusCode = 200;
        res.setHeader('Content-Type', MIME[ext]);
        res.setHeader('Content-Length', String(stat.size));
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Accept-Ranges', 'bytes');
        if (req.method === 'HEAD') return res.end();
        fs.createReadStream(abs).pipe(res);
      });

      // --- (2) sync public -> dist ทุกครั้งที่มีไฟล์เพิ่ม/เปลี่ยน/ลบ ---
      const sync = (file: string, unlink = false) => {
        const src = normalizePath(file);
        if (!src.startsWith(publicDir + '/')) return;

        const rel = src.slice(publicDir.length + 1);
        const dest = path.resolve(distDir, rel);
        if (!normalizePath(dest).startsWith(distDir + '/')) return;

        fs.mkdirSync(path.dirname(dest), { recursive: true });
        if (unlink) fs.rmSync(dest, { force: true });
        else fs.copyFileSync(src, dest);
      };

      server.watcher.on('add', (file) => sync(file));
      server.watcher.on('change', (file) => sync(file));
      server.watcher.on('unlink', (file) => sync(file, true));
    },
  };
}

export default defineConfig({
  plugins: [react(), livePublicAssets()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/messages': {
        target: process.env.VITE_BE_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
      '/status': {
        target: process.env.VITE_BE_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
