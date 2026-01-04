/**
 * Serverless API endpoint voor het zoeken van aanbiedingen via GraphQL
 * Compatibel met Google Assistant / Dialogflow Fulfillment
 */

// GraphQL query template voor het zoeken van aanbiedingen (allefolders.nl schema)
const SEARCH_OFFERS_QUERY = `
  query SearchResult($searchResults: SearchResultsInput!, $pagination: PaginationInput!) {
    searchResults(searchResults: $searchResults, pagination: $pagination) {
      __typename
      ... on SearchOfferList {
        offers {
          id
          name
          description
          discountPercent
          priceAfterDiscount
          priceBeforeDiscount
          brochureId
          pageIndex
          shop {
            id
            fileUrl(version: SMALL)
            slug
            name
            __typename
          }
          hotspot {
            id
            ... on HotspotProductEntity {
              fileUrl(version: SMALL)
              __typename
            }
            __typename
          }
          __typename
        }
        searchMethod
        __typename
      }
      ... on SearchNoResults {
        status
        __typename
      }
    }
  }
`;

/**
 * Haalt aanbiedingen op via GraphQL (allefolders.nl)
 */
async function fetchOffersFromGraphQL(searchTerm, graphqlEndpoint, apiKey, contextHeader) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/graphql-response+json, application/graphql+json, application/json',
      'Origin': 'https://www.allefolders.nl'
    };

    // Voeg jafolders-context header toe als beschikbaar
    if (contextHeader) {
      headers['jafolders-context'] = contextHeader;
    }

    // Voeg Authorization header toe als API key beschikbaar is
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        operationName: 'SearchResult',
        query: SEARCH_OFFERS_QUERY,
        variables: {
          searchResults: {
            query: searchTerm,
            searchMethod: 'EXACT_OFFER_CATEGORY_NAME'
          },
          pagination: {
            limit: 20,
            offset: 0
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    // Extract offers uit SearchOfferList
    const searchResults = data.data?.searchResults;
    if (searchResults?.__typename === 'SearchOfferList') {
      return searchResults.offers || [];
    } else if (searchResults?.__typename === 'SearchNoResults') {
      return [];
    }

    return [];
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    throw error;
  }
}

/**
 * Formatteert aanbiedingen voor Google Assistant response
 */
function formatOffersForAssistant(offers, searchTerm) {
  if (!offers || offers.length === 0) {
    return {
      fulfillmentText: `Geen aanbiedingen gevonden voor "${searchTerm}". Probeer een andere zoekterm.`,
      offers: []
    };
  }

  const offerTexts = offers.map((offer, index) => {
    const productName = offer.name || 'Onbekend product';
    const price = offer.priceAfterDiscount || 0;
    const originalPrice = offer.priceBeforeDiscount;
    const discountPercent = offer.discountPercent || 0;
    const shopName = offer.shop?.name || 'Onbekende winkel';
    const description = offer.description || '';

    const discountText = discountPercent > 0 ? `${discountPercent}% korting` : '';
    const priceText = price > 0 ? `€${price.toFixed(2)}` : '';
    const originalPriceText = originalPrice && originalPrice > price ? ` (was €${originalPrice.toFixed(2)})` : '';

    return `${index + 1}. ${productName}${priceText ? ` - ${priceText}` : ''}${originalPriceText}${discountText ? ` - ${discountText}` : ''}${shopName ? ` bij ${shopName}` : ''}${description ? ` - ${description}` : ''}`;
  }).join('\n');

  const fulfillmentText = offers.length === 1
    ? `Ik heb 1 aanbieding gevonden voor "${searchTerm}":\n\n${offerTexts}`
    : `Ik heb ${offers.length} aanbiedingen gevonden voor "${searchTerm}":\n\n${offerTexts}`;

  return {
    fulfillmentText,
    offers: offers.map(offer => ({
      id: offer.id,
      productName: offer.name,
      price: offer.priceAfterDiscount,
      originalPrice: offer.priceBeforeDiscount,
      discount: offer.priceBeforeDiscount && offer.priceAfterDiscount 
        ? offer.priceBeforeDiscount - offer.priceAfterDiscount 
        : null,
      discountPercentage: offer.discountPercent,
      store: offer.shop ? {
        id: offer.shop.id,
        name: offer.shop.name,
        slug: offer.shop.slug,
        logoUrl: offer.shop.fileUrl
      } : null,
      imageUrl: offer.hotspot?.fileUrl || null,
      description: offer.description,
      brochureId: offer.brochureId,
      pageIndex: offer.pageIndex
    }))
  };
}

/**
 * Hoofdfunctie voor de serverless endpoint
 */
export default async function handler(req, res) {
  // CORS headers voor cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request voor CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Alleen GET en POST requests ondersteunen
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      fulfillmentText: 'Deze endpoint ondersteunt alleen GET en POST requests.'
    });
  }

  try {
    // Haal zoekterm op uit query parameters of request body
    const searchTerm = req.method === 'GET' 
      ? req.query.searchTerm || req.query.q
      : req.body?.searchTerm || req.body?.query?.searchTerm || req.body?.queryResult?.parameters?.searchTerm;

    if (!searchTerm || searchTerm.trim() === '') {
      return res.status(400).json({
        error: 'Missing search term',
        fulfillmentText: 'Geef alstublieft een zoekterm op. Bijvoorbeeld: "cola" of "melk".'
      });
    }

    // Haal environment variables op
    const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || 'https://api.jafolders.com/graphql';
    const graphqlApiKey = process.env.GRAPHQL_API_KEY;
    const jafoldersContext = process.env.JAFOLDERS_CONTEXT || 'allefolders;nl;web;1;1';

    // Haal aanbiedingen op via GraphQL
    const offers = await fetchOffersFromGraphQL(
      searchTerm.trim(),
      graphqlEndpoint,
      graphqlApiKey,
      jafoldersContext
    );

    // Formatteer response voor Google Assistant
    const formattedResponse = formatOffersForAssistant(offers, searchTerm.trim());

    // Return response in Google Assistant / Dialogflow format
    return res.status(200).json({
      fulfillmentText: formattedResponse.fulfillmentText,
      fulfillmentMessages: [
        {
          text: {
            text: [formattedResponse.fulfillmentText]
          }
        }
      ],
      payload: {
        offers: formattedResponse.offers,
        searchTerm: searchTerm.trim(),
        count: formattedResponse.offers.length
      }
    });

  } catch (error) {
    console.error('API error:', error);

    // Bepaal het type fout en geef een passende response
    let errorMessage = 'Er is een fout opgetreden bij het zoeken naar aanbiedingen.';
    let statusCode = 500;

    if (error.message.includes('fetch failed') || error.message.includes('network')) {
      errorMessage = 'Er is een netwerkfout opgetreden. Controleer uw internetverbinding en probeer het opnieuw.';
    } else if (error.message.includes('GraphQL')) {
      errorMessage = 'De externe service is momenteel niet beschikbaar. Probeer het later opnieuw.';
    }

    return res.status(statusCode).json({
      error: error.message,
      fulfillmentText: errorMessage,
      fulfillmentMessages: [
        {
          text: {
            text: [errorMessage]
          }
        }
      ]
    });
  }
}

