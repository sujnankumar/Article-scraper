const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

/**
 * Enriches an article using Google Gemini based on reference contents.
 * @param {Object} originalArticle - { title, content }
 * @param {Object[]} references - Array of { url, content }
 * @returns {Promise<string>} - The enriched article content in markdown/HTML
 */
const enrichArticle = async (originalArticle, references) => {
    try {
        console.log(`Enriching article using Gemini: ${originalArticle.title}`);

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let enrichedContent = response.text().trim();

        // Safeguard: Ensure References section exists
        if (!enrichedContent.includes('## References')) {
            const referencesList = references.map(ref => `- [${ref.url}](${ref.url})`).join('\n');
            enrichedContent += `\n\n---\n## References\n${referencesList}`;
        }

        return enrichedContent;
    } catch (error) {
        console.error('Error enriching article with Gemini:', error.message);
        return originalArticle.content; // Fallback to original
    }
};

module.exports = enrichArticle;
