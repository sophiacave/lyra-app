// likeone-imagegen MCP server
import express from 'express';
import { get_secret } from '../studio/lib/vault.mjs';
import mflux from 'mflux'; // Assuming mflux is a package that needs to be installed

const app = express();
const port = 3001;

app.use(express.json());

app.post('/generate', async (req, res) => {
    try {
        const modelKey = await get_secret('mflux_model_key');
        const { prompt } = req.body;
        const result = await mflux.generate({ modelKey, prompt });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`likeone-imagegen MCP server running at http://localhost:${port}`);
});