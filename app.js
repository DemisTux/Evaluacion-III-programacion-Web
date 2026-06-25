const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taller_jdm'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos MySQL');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/crear', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crear.html'));
});

app.get('/api/vehiculos', (req, res) => {
    const query = 'SELECT id_vehiculo, marca, modelo, ano, matricula, motor, precio FROM vehiculos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/api/vehiculos', (req, res) => {
    const { marca, modelo, ano, matricula, motor, precio } = req.body;
    const query = 'INSERT INTO vehiculos (marca, modelo, ano, matricula, motor, precio) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [marca, modelo, ano, matricula, motor, precio], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id_vehiculo: result.insertId, marca, modelo, ano, matricula, motor, precio });
    });
});

app.delete('/api/vehiculos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM vehiculos WHERE id_vehiculo = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Vehículo eliminado con éxito' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});