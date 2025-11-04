const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const provider = require('./provider');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "static" folder
app.use(express.static(path.join(__dirname, 'static')));

// Routes to serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'tester.html'));
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'tester-form.html'));
});

// API routes
app.get('/api/companies', (req, res) => {
    res.json(provider.getAllCompanies());
});

app.get('/api/companies/:id', (req, res) => {
    const company = provider.getCompanyById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
});

app.post('/api/companies', (req, res) => {
    const newCompany = provider.addCompany(req.body);
    res.json(newCompany);
});

app.put('/api/companies/:id', (req, res) => {
    const updated = provider.updateCompany(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Company not found' });
    res.json(updated);
});

app.delete('/api/companies/:id', (req, res) => {
    const deleted = provider.deleteCompany(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Company not found' });
    res.json(deleted);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
