async function scrapeTextFromURL({ url }: { url: string }) {
  console.group('Function Called: scrapeTextFromURL({ url })');
  console.log('url:', url);
  const apiUrl = `${process.env.PUBLIC_SCRAPE_API_URL}?url=${url}`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      let text: string;
      
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
    return `Error fetching webpage text: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

const function_scrapeTextFromURL = {
  type: "function" as const,
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
