const fs = require('fs');
const path = require('path');

exports.PromptManager = class PromptManager{
    constructor(){
        this.prompts = this.loadPrompts();
    }

    loadPrompts(){
        const promptspath = path.join(__dirname, '../../docs/prompts/prompts.json');
        const rawdata = fs.readFileSync(promptspath, 'utf8');
        return JSON.parse(rawdata);
    }

    getPrompt(id = "reflection_v1"){
        return this.prompts[id];
    }
}