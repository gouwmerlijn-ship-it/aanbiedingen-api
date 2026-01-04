/**
 * Serverless API endpoint voor het zoeken van aanbiedingen via GraphQL
 * Compatibel met Google Assistant / Dialogflow Fulfillment
 */

// GraphQL query template voor het zoeken van aanbiedingen
const SEARCH_OFFERS_QUERY = `
  query SearchOffers($searchTerm: String!) {
    searchOffers(searchTerm: $searchTerm) {
      id
      productName
      price
      originalPrice
      discount
      discountPercentage
      store {
        id
        name
        address
        city
      }
      imageUrl
      validUntil
      description
    }
  }
`;

/**
 * Haalt aanbiedingen op via GraphQL
 */
async function fetchOffersFromGraphQL(searchTerm, graphqlEndpoint, apiKey) {
  try {
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey ? `Bearer ${apiKey}` : '',
        ...(apiKey ? {} : {})
      },
      body: JSON.stringify({
        query: SEARCH_OFFERS_QUERY,
        variables: {
          searchTerm: searchTerm
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

    return data.data?.searchOffers || [];
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
    const discountText = offer.discountPercentage 
      ? `${offer.discountPercentage}% korting`
      : offer.discount 
      ? `€${offer.discount.toFixed(2)} korting`
      : '';

    return `${index + 1}. ${offer.productName} - €${offer.price.toFixed(2)}${offer.originalPrice ? ` (was €${offer.originalPrice.toFixed(2)})` : ''}${discountText ? ` - ${discountText}` : ''}${offer.store ? ` bij ${offer.store.name}` : ''}${offer.validUntil ? ` - geldig tot ${offer.validUntil}` : ''}`;
  }).join('\n');

  const fulfillmentText = offers.length === 1
    ? `Ik heb 1 aanbieding gevonden voor "${searchTerm}":\n\n${offerTexts}`
    : `Ik heb ${offers.length} aanbiedingen gevonden voor "${searchTerm}":\n\n${offerTexts}`;

  return {
    fulfillmentText,
    offers: offers.map(offer => ({
      id: offer.id,
      productName: offer.productName,
      price: offer.price,
      originalPrice: offer.originalPrice,
      discount: offer.discount,
      discountPercentage: offer.discountPercentage,
      store: offer.store ? {
        name: offer.store.name,
        address: offer.store.address,
        city: offer.store.city
      } : null,
      imageUrl: offer.imageUrl,
      validUntil: offer.validUntil,
      description: offer.description
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
    const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT;
    const graphqlApiKey = process.env.GRAPHQL_API_KEY;

    if (!graphqlEndpoint) {
      console.error('GRAPHQL_ENDPOINT environment variable is not set');
      return res.status(500).json({
        error: 'Server configuration error',
        fulfillmentText: 'Er is een configuratiefout opgetreden. Neem contact op met de beheerder.'
      });
    }

    // Haal aanbiedingen op via GraphQL
    const offers = await fetchOffersFromGraphQL(
      searchTerm.trim(),
      graphqlEndpoint,
      graphqlApiKey
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

