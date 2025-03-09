const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Import cors
const app = express();
const port = 5001;

const apiKey = 'db38a5d763b88ba86b2b735f9eb241cd';

app.use(cors()); // Use cors middleware
app.use(express.static('public'));

app.get('/search', (req, res) => {
    const { query, with_genres, type } = req.query;
    const endpoint = query 
        ? `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=en-US&query=${query}` 
        : `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&language=en-US&with_genres=${with_genres}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
