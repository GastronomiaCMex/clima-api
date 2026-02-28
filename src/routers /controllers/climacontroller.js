const axios = require('axios');

async function obtenerCoordenadas(ciudad) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es`;
  const respuesta = await axios.get(url);

  if (!respuesta.data.results || respuesta.data.results.length === 0) {
    throw new Error(`Ciudad "${ciudad}" no encontrada`);
  }

  const lugar = respuesta.data.results[0];
  return {
    nombre:   lugar.name,
    pais:     lugar.country,
    latitud:  lugar.latitude,
    longitud: lugar.longitude,
  };
}

exports.climaActual = async (req, res) => {
  try {
    const { ciudad } = req.query;
    if (!ciudad) return res.status(400).json({ error: 'Debes enviar ?ciudad=NombreDeCiudad' });

    const coords = await obtenerCoordenadas(ciudad);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitud}&longitude=${coords.longitud}&current_weather=true&timezone=auto`;
    const { data } = await axios.get(url);
    const clima = data.current_weather;

    res.json({
      ciudad:      coords.nombre,
      pais:        coords.pais,
      temperatura: `${clima.temperature} °C`,
      viento:      `${clima.windspeed} km/h`,
      es_de_dia:   clima.is_day === 1 ? 'Sí' : 'No',
      actualizado: clima.time,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.pronostico = async (req, res) => {
  try {
    const { ciudad } = req.query;
    if (!ciudad) return res.status(400).json({ error: 'Debes enviar ?ciudad=NombreDeCiudad' });

    const coords = await obtenerCoordenadas(ciudad);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitud}&longitude=${coords.longitud}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const { data } = await axios.get(url);

    const dias = data.daily.time.map((fecha, i) => ({
      fecha,
      temp_maxima:   `${data.daily.temperature_2m_max[i]} °C`,
      temp_minima:   `${data.daily.temperature_2m_min[i]} °C`,
      precipitacion: `${data.daily.precipitation_sum[i]} mm`,
    }));

    res.json({ ciudad: coords.nombre, pais: coords.pais, pronostico: dias });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.coordenadas = async (req, res) => {
  try {
    const { ciudad } = req.query;
    if (!ciudad) return res.status(400).json({ error: 'Debes enviar ?ciudad=NombreDeCiudad' });

    const coords = await obtenerCoordenadas(ciudad);
    res.json(coords);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};