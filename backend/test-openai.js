require('dotenv').config();
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OPENAI_API_KEY not found in .env file');
    return;
  }

  console.log('Testing OpenAI API key...');
  console.log('Key starts with:', apiKey.substring(0, 20) + '...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say "Hello, I am working!" if you can read this.' }
        ],
        max_tokens: 20
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('OPENAI API key is VALID!');
      console.log('Response:', data.choices[0].message.content);
      console.log('\nYour key works! The backend should generate AI insights now.');
    } else {
      console.error('OPENAI API key is INVALID');
      console.error('Error:', data.error?.message || JSON.stringify(data));
      console.log('\nPlease update your OPENAI_API_KEY in backend/.env');
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testOpenAI();
