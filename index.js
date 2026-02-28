const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({
    mensaje: '🌤️ Bienvenido a la API de Clima y Geografía',
    version: '1.0.0',
    endpoints: {
      clima_actual: '/api/clima?ciudad=Madrid',
      pronostico:   '/api/pronostico?ciudad=CiudadDeMexico',
      coordenadas:  '/api/coordenadas?ciudad=BuenosAires',
    }
  });
});

const climaRoutes = require('./src/routes/clima');
app.use('/api', climaRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});