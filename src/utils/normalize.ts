// Normaliza um título para checagem de duplicata.
// - remove acentos/diacríticos
// - remove artigos iniciais comuns (pt/en/es)
// - tira pontuação/simbolos e espaços extras
// - caixa alta
export function normalizeTitle(input: string): string {
    let s = input.trim();
    // remove acentos
    s = s.normalize('NFD').replace(/\p{Diacritic}+/gu, '');
    // remove pontuação
    s = s.replace(/[\p{P}\p{S}]+/gu, ' ');
    // artigos iniciais (ex.: "o ", "a ", "the ")
    const articles = ['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'the', 'el', 'la', 'los', 'las', 'un', 'una'];
    const rx = new RegExp(`^(?:${articles.join('|')})\s+`, 'i');
    s = s.replace(rx, '');
    // collapse espaços
    s = s.replace(/\s+/g, ' ').trim();
    return s.toUpperCase();
}