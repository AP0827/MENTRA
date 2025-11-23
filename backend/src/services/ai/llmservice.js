// Using node-fetch or built-in fetch
const fetch = global.fetch || require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if(!OPENAI_API_KEY){
    console.warn("OPENAI_API_KEY is not set.")
}

const generate = async function(prompt, model = "gpt-4o-mini", temperature = 0.7, max_tokens = 150, system = "You are a helpful assistant"){
    const body = {
        model: model,
        messages:[
            {
                role:"system",
                content: system
            },
            {
                role:"user",
                content: prompt
            }
        ],
        max_tokens: max_tokens,
        temperature: temperature
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(body)
    });
    if(!res.ok){
        const text = await res.text();
        throw new Error(`LLM error ${res.status}: ${text}`);
    }
    

    const j = await res.json();
    // defensive: extract first assistant message
    const msg = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    return {
        raw: j,
        text: msg || ""
    };
}

module.exports = {
    generate
};
