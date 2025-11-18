// Simple Express server to save files directly to codebase
// Run with: node server.js

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

// Load environment variables from .env file
let envVars = {};
try {
  const envContent = require('fs').readFileSync(path.join(__dirname, '.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.log('No .env file found or error reading it:', error.message);
}

const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from current directory
app.use(express.static('.'));

// Helper function to ensure directory exists
async function ensureDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
  }
}

// Save file endpoint
app.post('/api/save/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const data = req.body;
    
    // Validate type
    const validTypes = ['ocs', 'clans', 'stories', 'lore'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }
    
    // Ensure directory exists
    const dirPath = path.join(__dirname, 'data', type);
    await ensureDirectory(dirPath);
    
    // Save file
    const filePath = path.join(dirPath, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    res.json({ success: true, message: `${type} saved successfully` });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete file endpoint
app.delete('/api/delete/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    // Validate type
    const validTypes = ['ocs', 'clans', 'stories', 'lore'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }
    
    // Delete file
    const filePath = path.join(__dirname, 'data', type, `${id}.json`);
    try {
      await fs.unlink(filePath);
      res.json({ success: true, message: `${type} deleted successfully` });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.json({ success: true, message: 'File already deleted' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: error.message });
  }
});

// List files endpoint (for loading)
app.get('/api/list/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate type
    const validTypes = ['ocs', 'clans', 'stories', 'lore'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }
    
    const dirPath = path.join(__dirname, 'data', type);
    try {
      const files = await fs.readdir(dirPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      const items = [];
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(dirPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          const data = JSON.parse(content);
          items.push(data);
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
        }
      }
      
      res.json(items);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Directory doesn't exist yet, return empty array
        res.json([]);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single file endpoint
app.get('/api/get/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    // Validate type
    const validTypes = ['ocs', 'clans', 'stories', 'lore'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }
    
    const filePath = path.join(__dirname, 'data', type, `${id}.json`);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      res.json(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'File not found' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get GitHub token from .env (only on localhost for security)
app.get('/api/github-token', (req, res) => {
  // Only allow on localhost
  const host = req.get('host') || '';
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    return res.status(403).json({ error: 'Token endpoint only available on localhost' });
  }
  
  const token = envVars.GITHUB_TOKEN;
  if (token) {
    res.json({ token });
  } else {
    res.status(404).json({ error: 'GitHub token not found in .env file' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Files will be saved to: ${path.join(__dirname, 'data')}`);
  if (envVars.GITHUB_TOKEN) {
    console.log(`✅ GitHub token loaded from .env`);
  } else {
    console.log(`⚠️  No GitHub token found in .env file`);
  }
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

