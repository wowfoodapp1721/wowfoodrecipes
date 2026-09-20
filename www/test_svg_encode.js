// Test SVG compilation and matcher
function encodeSvg(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

const SVGS = {
  pasta: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_pasta" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3b2310"/><stop offset="100%" stop-color="#1c1106"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g_pasta)"/><circle cx="50" cy="50" r="36" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><path d="M30 45 Q50 25 70 45 Q50 65 30 45 Z" fill="#FBBF24" opacity="0.9"/><path d="M26 52 Q50 35 74 52 Q50 70 26 52 Z" fill="#FCD34D" opacity="0.8"/><path d="M35 38 Q50 58 65 38" fill="none" stroke="#D97706" stroke-width="3" stroke-linecap="round"/><path d="M32 58 Q50 40 68 58" fill="none" stroke="#B45309" stroke-width="3" stroke-linecap="round"/></svg>`),
  meat: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g_meat" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#450a0a"/><stop offset="100%" stop-color="#1c0505"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g_meat)"/><path d="M26 36 C22 48 24 64 36 72 C48 80 68 76 74 64 C80 52 76 34 64 26 C52 18 30 24 26 36 Z" fill="#DC2626"/><path d="M34 40 C32 48 34 60 42 66 C50 72 64 68 68 58 C72 48 68 36 58 30 C48 24 36 30 34 40 Z" fill="#B91C1C"/><path d="M42 46 C46 44 54 48 58 44 C62 40 56 34 50 36 C44 38 38 48 42 46 Z" fill="#FEE2E2" opacity="0.85"/><path d="M36 56 C40 54 46 62 54 58 C58 56 60 62 52 64 C44 66 32 58 36 56 Z" fill="#FEF2F2" opacity="0.8"/></svg>`)
};

console.log('Sample Pasta SVG Length:', SVGS.pasta.length);
console.log('Sample Meat SVG Length:', SVGS.meat.length);
