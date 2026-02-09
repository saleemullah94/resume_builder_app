require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ==================== DATABASE FILE ====================

const DATA_DIR = path.join(__dirname, 'data');
const DATABASE_FILE = path.join(DATA_DIR, 'resumes.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database file if it doesn't exist
if (!fs.existsSync(DATABASE_FILE)) {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify({ resumes: [] }, null, 2));
}

function readResumes() {
    try {
        const data = fs.readFileSync(DATABASE_FILE, 'utf8');
        return JSON.parse(data).resumes || [];
    } catch (error) {
        console.error('Error reading resume file:', error);
        return [];
    }
}

function writeResumes(resumes) {
    try {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify({ resumes }, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing resume file:', error);
        return false;
    }
}

// ==================== API ROUTES ====================

// GET - Retrieve all resumes
app.get('/api/resume', (req, res) => {
    try {
        const resumes = readResumes();
        res.json({
            success: true,
            count: resumes.length,
            data: resumes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving resumes',
            error: error.message
        });
    }
});

// GET - Retrieve single resume by ID
app.get('/api/resume/:id', (req, res) => {
    try {
        const resumes = readResumes();
        const resume = resumes.find(r => r.id === req.params.id);
        
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }
        
        res.json({
            success: true,
            data: resume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving resume',
            error: error.message
        });
    }
});

// POST - Save new resume
app.post('/api/resume/save', (req, res) => {
    try {
        const resumeData = req.body;
        const resumes = readResumes();
        
        const resumeId = Date.now().toString();
        
        resumeData.id = resumeId;
        resumeData.createdAt = new Date();
        resumeData.updatedAt = new Date();
        
        resumes.push(resumeData);
        const success = writeResumes(resumes);
        
        if (success) {
            res.status(201).json({
                success: true,
                message: 'Resume saved successfully',
                resumeId: resumeId,
                data: resumeData
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving resume to database'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving resume',
            error: error.message
        });
    }
});

// PUT - Update existing resume
app.put('/api/resume/:id', (req, res) => {
    try {
        const resumeId = req.params.id;
        const updatedData = req.body;
        const resumes = readResumes();
        
        const index = resumes.findIndex(r => r.id === resumeId);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }
        
        resumes[index] = {
            ...resumes[index],
            ...updatedData,
            id: resumeId,
            updatedAt: new Date()
        };
        
        const success = writeResumes(resumes);
        
        if (success) {
            res.json({
                success: true,
                message: 'Resume updated successfully',
                data: resumes[index]
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error updating resume'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating resume',
            error: error.message
        });
    }
});

// DELETE - Delete resume
app.delete('/api/resume/:id', (req, res) => {
    try {
        const resumeId = req.params.id;
        const resumes = readResumes();
        
        const filteredResumes = resumes.filter(r => r.id !== resumeId);
        
        if (filteredResumes.length === resumes.length) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }
        
        const success = writeResumes(filteredResumes);
        
        if (success) {
            res.json({
                success: true,
                message: 'Resume deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error deleting resume'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting resume',
            error: error.message
        });
    }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Resume Builder API is running',
        timestamp: new Date()
    });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Resume Builder Mobile App`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api/resume`);
    console.log(`💾 Database: ${fs.existsSync(DATABASE_FILE) ? 'JSON (Local)' : 'Not initialized'}\n`);
});

module.exports = app;
