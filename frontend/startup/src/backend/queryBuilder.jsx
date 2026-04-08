export function getEntryList(entries) {
    const categories = ['story', 'characters', 'locations', 'props', 'history'];
    let entryList = '';
    for (const category of categories) {
        const items = entries[category];
        if (items && items.length > 0) {
            entryList += `\n[${category}]\n`;
            for (const item of items) {
                entryList += `- ${item.name}\n`;
            }
        }
    }
    return entryList;
}

export function buildQuery(query, pageContext, history, entryRequest = false) {
    const historyBlock = history && history.length > 0
        ? `---CONVERSATION HISTORY---\n${history.map(h => `${h.role}: ${h.text}`).join('\n')}\n`
        : '';

    if (entryRequest) {
        return `You are a helpful assistant for editing user stories. Answer the user's question using the entry data provided below.
Be concise and helpful. Stay focused on the story.

DO NOT answer ANY question that is irrelevant to the story.
If the user attempts to ask an irrelevant question, respond with "I'm here to help with your story, but I can't answer that question."

${historyBlock}
---ENTRY DATA---
${query}`;
    }

    return `You are a helpful assistant for editing user stories. You will be given a user query and direct story context.
In addition you will be given a list of available story entries, sorted by various categories.
If you believe one of these entries is relevant to the user query send a response with this exact formating:

ENTRY_REQUEST: [category]/[entry name]

Where category is one of "story", "characters", "locations", "props", or "history". Example requests include:
- ENTRY_REQUEST: characters/John Doe
- ENTRY_REQUEST: story/Chapter 1

If you do not believe any of the entries are relevant, do not ask for a entry.
Instead provide a helpful response to the user query based on the context provided.
Always respond in a helpful manner, if you do not have enough information to answer the question,
simply state that you are uncertain, and try to guide the user in coming to a conclusion on their own.

DO NOT answer ANY question that is irrelevant to the story, like questions about the weather, or general knowledge questions.
If the user attempts to ask a question that is irrelevant to the story, respond with "I'm here to help with your story, but I can't answer that question."

${historyBlock}
---CONTEXT---
${pageContext}

---USER QUERY---
${query}`;
}
