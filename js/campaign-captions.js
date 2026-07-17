// Campaign captions shared by the Our Work gallery and the service-page galleries
// (our-work.html, services/field-activations.html, services/merchandising.html).
// Keyed by campaignSlug(title). Kept separate from the generated gallery data so
// rebuilds of js/work-gallery-data.js don't erase them.

// Turn a campaign title into a slug, e.g. "Roast & Rhyme" -> "roast-rhyme"
function campaignSlug(title) {
  return (title || '')
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const campaignCaptions = {
  'dove': 'Elevating shopper engagement across Modern and General Trade channels as we activate the Unilever International AFCON Multi-Brand Promotion with Dove. Through impactful in-store visibility, strategic brand displays, and interactive on-ground demonstrations, our team delivers a premium brand experience that inspires confidence, freshness, and excitement among consumers.',
  'rwenzori-marathon-launch': 'We were honored to exclusively manage the press launch of the Rwenzori Marathon on behalf of Coca-Cola Beverages Uganda in Namanve. Scheduled for 24 August 2024 in Kasese District, Western Uganda, the marathon brought together partners committed to promoting health, community, and sustainability. As part of our partnership, we also delivered hydration stations along the race routes, ensuring participants stayed refreshed with Rwenzori Mineral Water throughout the event.',
  'rwenzori-marathon': 'Proud to support the Rwenzori Marathon by delivering seamless hydration services on behalf of Coca-Cola Beverages Uganda. From the starting line to the finish, our team ensured hydration stations remained fully stocked with Rwenzori Mineral Water, helping participants stay refreshed and perform at their best throughout the race.',
  'roast-rhyme': 'We crafted below-the-line experiences that spark engagement and drive sales at Roast and Rhyme — think interactive events, social media buzz, and strategic partnerships that unlock the secrets to marketing success.',
  'hamper-promo': 'We crafted the magic of gifting where customers redeemed their exclusive Unilever Christmas Hamper, filled with all their favorite brands and products.',
  'coke-studio': 'We offered brand activation and customer engagement for the Coke Studio campaign, thrilling neighborhoods with exciting mall activations. Customers spun the wheel for a chance to win amazing prizes, including #CokeStudio merchandise and VIP concert tickets.',
  'fanta-movie-time': 'Golden Marketing delivered an engaging brand activation as Fanta transformed the school into a vibrant hub of entertainment and immersive brand experiences. Students enjoyed interactive games, exciting product sampling, a 360° camera experience, and an exclusive VIP cinema session, creating memorable moments while strengthening brand engagement.',
  'vim-launch': 'Golden Marketing brought energy, precision, and presence to the Vim Launch Event, introducing powerful new cleaning solutions designed for everyday impact.',
  'promo': 'Golden Marketing successfully executed a high-impact activation for 22Bet, driving brand awareness through engaging roadshows, interactive consumer engagements, and live AFCON match screenings. By creating immersive fan experiences, we connected audiences with the brand while showcasing the diverse range of products and offerings from 22Bet.',
  'back-to-school': 'The Unilever Back to School Campaign, fully activated by us, brings together essential school care products, creating convenient and value-driven bundles for students and families at the start of every school term. By combining key Unilever essentials into affordable packages, the campaign makes school preparation easier while delivering greater value and convenience to consumers.',
  'heads-up': 'We managed and amplified the Heads Up safety campaign event with Shell Vivo, bringing out the need for safety on the road and among road users.',
  'fanta-snacking': 'We merchandised and promoted the collaboration between Fanta Pineapple and Sums snacks through in-store promos and immersive customer engagements to drive awareness and sales.',
  'world-freestyle-football': 'As the official BTL agency for Coca-Cola Beverages Uganda, we partnered and successfully executed the World Freestyle Football Event from concept to completion. Beyond the event, we created immersive brand experiences, offering revelers and guests an opportunity to engage with Predator Energy in a truly memorable and impactful way.'
};
