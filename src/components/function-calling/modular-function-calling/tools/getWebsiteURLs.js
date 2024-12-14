async function getWebsiteURLs({ url, maxUrls = 100 }) {
    console.group('Function Called: getWebsiteURLs({ url, maxUrls })');
    console.log('url:', url);
    console.log('maxUrls:', maxUrls);
    const apiUrl = `https://us-central1-trelus-data.cloudfunctions.net/getWebsiteURLs?url=${url}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            let urls;
            if (contentType && contentType.includes("application/json")) {
                const jsonData = await response.json();
                urls = jsonData.urls; // Extract the 'urls' array from the response
            } else {
                const text = await response.text();
                try {
                    const jsonData = JSON.parse(text);
                    urls = jsonData.urls;
                } catch (parseError) {
                    console.error('Error parsing response as JSON:', parseError);
                    return `Error: Unable to parse response as JSON`;
                }
            }
            // Limit the number of URLs
            const limitedUrls = urls.slice(0, maxUrls);
            console.log(`Returning ${limitedUrls.length} URLs`);
            console.groupEnd();
            return { websiteURLs: limitedUrls };
        } else {
            console.groupEnd();
            return `Failed to retrieve website URLs: ${response.statusText}`;
        }
    } catch (error) {
        console.groupEnd();
        return `Error fetching website URLs: ${error.message}`;
    }
}

const function_getWebsiteURLs = {
    type: "function",
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
                    description: "Maximum number of URLs to return (default: 100)",
                },
            },
            required: ["url"],
        },
    },
};

export { getWebsiteURLs, function_getWebsiteURLs };

// async function getWebsiteURLs({ url }) {
//     console.group('Function Called: getWebsiteURLs({ url })');
//     console.log('url:', url);
//     const apiUrl = `https://us-central1-trelus-data.cloudfunctions.net/getWebsiteURLs?url=${url}`;
//     try {
//         const response = await fetch(apiUrl);
//         if (response.ok) {
//             const contentType = response.headers.get("content-type");
//             let urls;
//             if (contentType && contentType.includes("application/json")) {
//                 const jsonData = await response.json();
//                 urls = jsonData.urls; // Extract the 'urls' array from the response
//             } else {
//                 const text = await response.text();
//                 try {
//                     const jsonData = JSON.parse(text);
//                     urls = jsonData.urls;
//                 } catch (parseError) {
//                     console.error('Error parsing response as JSON:', parseError);
//                     return `Error: Unable to parse response as JSON`;
//                 }
//             }
//             console.groupEnd();
//             return { websiteURLs: urls };
//         } else {
//             console.groupEnd();
//             return `Failed to retrieve website URLs: ${response.statusText}`;
//         }
//     } catch (error) {
//         console.groupEnd();
//         return `Error fetching website URLs: ${error.message}`;
//     }
// }

// const function_getWebsiteURLs = {
//     type: "function",
//     function: {
//         name: 'getWebsiteURLs',
//         description: "This function gets a list of all the webpage addresses for a given root website URL by scraping the website site map.",
//         parameters: {
//             type: "object",
//             properties: {
//                 url: {
//                     type: "string",
//                     description: "url of a company webpage",
//                 }
//             },
//             required: ["url"],
//         },
//     },
// };

// export { getWebsiteURLs, function_getWebsiteURLs };
