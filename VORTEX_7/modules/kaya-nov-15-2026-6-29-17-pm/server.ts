import express from 'express';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { createServer as createViteServer } from 'vite';

const nodeRequire = createRequire(import.meta.url || pathToFileURL(path.join(process.cwd(), 'server.ts')).href);
const { ZipArchive } = nodeRequire('archiver');

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  children?: TreeNode[];
}

function getDirectoryTree(dirPath: string, relativePath = ''): TreeNode[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    if (
      entry.name.startsWith('.') ||
      entry.name === 'node_modules' ||
      entry.name === 'dist' ||
      entry.name === 'bun.lock' ||
      entry.name === 'package-lock.json'
    ) {
      continue;
    }

    const rel = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    const full = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        path: rel,
        type: 'dir',
        children: getDirectoryTree(full, rel),
      });
    } else {
      let size = 0;
      try {
        size = fs.statSync(full).size;
      } catch {}
      nodes.push({
        name: entry.name,
        path: rel,
        type: 'file',
        size,
      });
    }
  }

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 2);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

  app.use((req, res, next) => {
    if (req.path === '/sw.js' || req.path === '/' || req.path === '/index.html') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  });

  // Endpoint to get the complete project build tree
  app.get('/api/build-tree', (_req, res) => {
    try {
      const tree = getDirectoryTree(process.cwd());
      res.json({ name: 'omni-product-studio', type: 'dir', path: '', children: tree });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Endpoint to view file content from the tree
  app.get('/api/file-content', (req, res) => {
    try {
      const relPath = String(req.query.path || '').trim();
      if (!relPath || relPath.includes('..') || path.isAbsolute(relPath)) {
        return res.status(400).json({ error: 'Invalid file path' });
      }
      const fullPath = path.join(process.cwd(), relPath);
      if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        return res.status(404).json({ error: 'File not found' });
      }
      const ext = path.extname(fullPath).toLowerCase();
      const isBinary = ['.png', '.jpg', '.jpeg', '.webp', '.ico', '.svg'].includes(ext);
      if (isBinary) {
        const buffer = fs.readFileSync(fullPath);
        const mime = ext === '.png' ? 'image/png' : ext === '.svg' ? 'image/svg+xml' : 'image/jpeg';
        return res.json({ path: relPath, isBinary: true, mime, dataUrl: `data:${mime};base64,${buffer.toString('base64')}` });
      }
      const content = fs.readFileSync(fullPath, 'utf8');
      res.json({ path: relPath, content, isBinary: false, size: fs.statSync(fullPath).size });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Endpoint to download an individual file from the tree
  app.get('/api/download-file', (req, res) => {
    try {
      const relPath = String(req.query.path || '').trim();
      if (!relPath || relPath.includes('..') || path.isAbsolute(relPath)) {
        return res.status(400).send('Invalid file path');
      }
      const fullPath = path.join(process.cwd(), relPath);
      if (!fs.existsSync(fullPath)) return res.status(404).send('Not found');
      res.download(fullPath, path.basename(fullPath));
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  });

  // Endpoint to download the full open source codebase as a .zip archive
  app.get('/api/download-code', (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="omni-product-studio.zip"');

      const archive = new ZipArchive({
        zlib: { level: 9 },
      });

      archive.on('error', (err) => {
        console.error('Archive error:', err);
        if (!res.headersSent) res.status(500).send({ error: err.message });
      });

      archive.pipe(res);

      archive.glob('**/*', {
        cwd: process.cwd(),
        ignore: [
          'node_modules/**',
          'dist/**',
          '.git/**',
          '*.log',
          '.DS_Store',
          'coverage/**',
        ],
        dot: true,
      });

      archive.finalize();
    } catch (e: any) {
      console.error('Failed to create code zip:', e);
      res.status(500).json({ error: e.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Studio server running on http://localhost:${PORT}`);
  });
}

startServer();