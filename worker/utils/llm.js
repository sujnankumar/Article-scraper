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
            You are an expert SEO Content Strategist and Editor. Your goal is to take an original article and rewrite it using insights from two top-performing competitor articles discovered via Google Search.

            Original Title: ${originalArticle.title}
            Original Content: ${originalArticle.content}

            ---
            Competitor Reference 1 [Source: ${references[0]?.url}]:
            ${references[0]?.content.substring(0, 2500)}
            ---
            Competitor Reference 2 [Source: ${references[1]?.url}]:
            ${references[1]?.content.substring(0, 2500)}
            ---

            INSTRUCTIONS:
            1. **SEO Optimization**: Improve the keyword density, headings structure (H1, H2, H3), and overall readability.
            2. **Format**: Use rich Markdown formatting. Include a clear introduction, structured body with descriptive subheadings, and a concise conclusion.
            3. **Style**: Match the authoritative and professional tone of the competitor articles while keeping the content unique.
            4. **Enrichment**: Incorporate valuable points or perspectives found in the competitor articles that were missing from the original.
            5. **Citations**: At the very end of the article, under a horizontal rule (---), add a section titled "## References". List the two competitor URLs provided above as clickable links.

            REWRITTEN SEO-OPTIMIZED ARTICLE:
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or gpt-4
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        });

        let enrichedContent = response.choices[0].message.content.trim();

        // Safeguard: Ensure References section exists
        if (!enrichedContent.includes('## References')) {
            const referencesList = references.map(ref => `- [${ref.url}](${ref.url})`).join('\n');
            enrichedContent += `\n\n---\n## References\n${referencesList}`;
        }

        return enrichedContent;
    } catch (error) {
        console.error('Error enriching article with LLM:', error.message);
        return originalArticle.content; // Fallback to original
    }
};

module.exports = enrichArticle;
