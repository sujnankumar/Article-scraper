const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Enriches an article using an LLM based on reference contents.
 * @param {Object} originalArticle - { title, content }
 * @param {Object[]} references - Array of { url, content }
 * @returns {Promise<string>} - The enriched article content in markdown/HTML
 */
const enrichArticle = async (originalArticle, references) => {
    try {
        console.log(`Enriching article: ${originalArticle.title}`);

        const referenceContext = references.map((ref, i) =>
            `Reference ${i + 1} [Source: ${ref.url}]:\n${ref.content.substring(0, 2000)}`
        ).join('\n\n');

        const prompt = `
            You are a professional content editor. I want you to update and improve an existing article based on two high-ranking reference articles found on Google.

            Original Title: ${originalArticle.title}
            Original Content: ${originalArticle.content}

            ---
            Reference Articles Content:
            ${referenceContext}
            ---

            Task:
            1. Rewrite the original article to make it more professional, well-formatted, and informative.
            2. Match the style, depth, and formatting quality of the top-ranking reference articles.
            3. Ensure the content is unique and not just a direct copy.
            4. **CRITICAL**: At the bottom of the article, add a "References" section citing the sources provided in the reference context.
            5. Return the updated article content in a clean format (use Markdown for headers and lists).

            Updated Article:
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or gpt-4
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error enriching article with LLM:', error.message);
        return originalArticle.content; // Fallback to original
    }
};

module.exports = enrichArticle;
