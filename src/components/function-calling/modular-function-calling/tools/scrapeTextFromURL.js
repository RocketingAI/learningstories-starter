async function scrapeTextFromURL({ url }) {
    console.group('Function Called: scrapeTextFromURL({ url })');
    console.log('url:', url);
    const apiUrl = `https://us-central1-rocketing-ai.cloudfunctions.net/scrapeTextFromUrl?url=${url}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            let text;
            if (contentType && contentType.includes("application/json")) {
                const jsonData = await response.json();
                text = jsonData.text; // Assuming the JSON has a 'text' field
            } else {
                text = await response.text();
            }
            console.groupEnd();
            return { webpageText: text };
        } else {
            console.groupEnd();
            return `Failed to retrieve webpage text: ${response.statusText}`;
        }
    } catch (error) {
        console.groupEnd();
        return `Error fetching webpage text: ${error.message}`;
    }
}

const function_scrapeTextFromURL = {
    type: "function",
    function: {
        name: 'scrapeTextFromURL',
        description: "This function scrapes text from a given URL",
        parameters: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "url of a company webpage",
                }
            },
            required: ["url"],
        },
    },
};

export { scrapeTextFromURL, function_scrapeTextFromURL };