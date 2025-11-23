// Using node-fetch or built-in fetch
const fetch = global.fetch || require('node-fetch');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Assuming env var

if (!OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set.");
}

const generateEmbedding = async function(text) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-ada-002"
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Embedding error ${res.status}: ${text}`);
  }

  const j = await res.json();
  return j.data[0].embedding;
};

module.exports = {
  generateEmbedding
};