const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, 'static', 'companies-data.json');

function readData() {
    return JSON.parse(fs.readFileSync(dataFile));
}

function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function getAllCompanies() {
    return readData();
}

function getCompanyById(id) {
    const companies = readData();
    return companies.find(c => c.symbol === id);
}

function addCompany(company) {
    const companies = readData();
    companies.push(company);
    writeData(companies);
    return company;
}

function updateCompany(id, newData) {
    const companies = readData();
    const index = companies.findIndex(c => c.symbol === id);
    if (index === -1) return null;
    companies[index] = {...companies[index], ...newData};
    writeData(companies);
    return companies[index];
}

function deleteCompany(id) {
    let companies = readData();
    const index = companies.findIndex(c => c.symbol === id);
    if (index === -1) return null;
    const deleted = companies.splice(index, 1);
    writeData(companies);
    return deleted[0];
}

module.exports = { getAllCompanies, getCompanyById, addCompany, updateCompany, deleteCompany };
