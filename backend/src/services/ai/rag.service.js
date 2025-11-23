const { PromptManager } = require('./promptmanager');
const promptManager = new PromptManager();
const llm = require('./llmservice');


async function runRAG(text, question="", memories=[], opts={}){
    const templateObj = promptManager.getPrompt(opts.PromptID || "reflection_v1");
    if(!templateObj){
        throw new Error("Prompt template not found.");
    }
    const system = templateObj.system || "You are a helpful assistant";
    const memoriesJoined = (memories && memories.length) ? memories.slice(0, 5).join("\n- ") : "None";
    const prompt = templateObj.template
        .replace("{question}", question || "Why are you opening this site?")
        .replace("{text}", text)
        .replace("{memories}", memoriesJoined);

    const response = await llm.generate(prompt, "gpt-4o-mini", 0.7, 150, system);
    return {
        suggestion : response.text,
        metadata:{
            promptUsed: prompt
        }
    };
};

module.exports = {
    runRag: runRAG
};