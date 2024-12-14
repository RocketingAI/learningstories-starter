interface GetWebsiteURLsArgs {
  url: string;
  maxUrls?: number;
}

interface WebsiteURLsResponse {
  urls: string[];
}

async function getWebsiteURLs({ url, maxUrls = 100 }: GetWebsiteURLsArgs) {
  console.group('Function Called: getWebsiteURLs({ url, maxUrls })');
  console.log('url:', url);
  console.log('maxUrls:', maxUrls);
  const apiUrl = `${process.env.PUBLIC_WEBSITE_URLS_API}?url=${url}`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      let urls: string[];
      
      if (contentType && contentType.includes("application/json")) {
        const jsonData = await response.json() as WebsiteURLsResponse;
        urls = jsonData.urls;
      } else {
        const text = await response.text();
        try {
          const jsonData = JSON.parse(text) as WebsiteURLsResponse;
          urls = jsonData.urls;
        } catch (parseError) {
          console.error('Error parsing response as JSON:', parseError);
          throw new Error('Unable to parse response as JSON');
        }
      }
      
      // Limit the number of URLs
      const limitedUrls = urls.slice(0, maxUrls);
      console.log(`Returning ${limitedUrls.length} URLs`);
      console.groupEnd();
      return { websiteURLs: limitedUrls };
    } else {
      console.groupEnd();
      throw new Error(`Failed to retrieve website URLs: ${response.statusText}`);
    }
  } catch (error) {
    console.groupEnd();
    throw new Error(`Error fetching website URLs: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

const function_getWebsiteURLs = {
  type: "function" as const,
  function: {
    name: 'getWebsiteURLs',
    description: "This function gets a list of webpage addresses for a given root website URL by scraping the website site map, with a default limit of 100 URLs.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "url of a company webpage",
        },
        maxUrls: {
          type: "number",
          description: "maximum number of URLs to return (default: 100)",
        },
      },
      required: ["url"],
    },
  },
};

export { getWebsiteURLs, function_getWebsiteURLs };
