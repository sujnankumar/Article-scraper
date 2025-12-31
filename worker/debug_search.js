const axios = require('axios');
const fs = require('fs');

const query = "Can Chatbots Boost Small Business Growth? blog article";
const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

const debugSearch = async () => {
    try {
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        fs.writeFileSync('ddg_debug.html', data);
        console.log('Saved ddg_debug.html');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

debugSearch();
