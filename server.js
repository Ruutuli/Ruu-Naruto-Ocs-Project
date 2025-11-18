// Simple Express server to save files directly to codebase
// Run with: node server.js

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

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

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Files will be saved to: ${path.join(__dirname, 'data')}`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

