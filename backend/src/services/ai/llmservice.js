const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if(!GEMINI_API_KEY){
    console.warn("GEMINI_API_KEY is not set.")
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generate = async function(prompt, model = "gemini-2.0-flash", temperature = 0.7, max_tokens = 150, system = "You are a helpful assistant"){
    try {
        const modelInstance = genAI.getGenerativeModel({ 
            model: model
        });
        
        // Combine system instruction with prompt
        const fullPrompt = `${system}\n\n${prompt}`;
        
        const result = await modelInstance.generateContent({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: max_tokens
            }
        });
        
        const response = result.response;
        const text = response.text();
        
        return {
            raw: result,
            text: text || ""
        };
    } catch(error) {
        console.error('LLM error:', error.message);
        throw new Error(`LLM error: ${error.message}`);
    }
}

module.exports = {
    generate
};
