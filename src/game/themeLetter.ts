export const THEMES = [
    'Filmes de terror', 'Filmes de ação', 'Animações', 'Séries de TV', 'Cidades do mundo',
    'Países', 'Comidas', 'Sobremesas', 'Frutas', 'Jogos de videogame', 'Personagens de jogos',
    'Times de futebol', 'Jogadores famosos', 'Bandas', 'Cantores(as)', 'Músicas', 'Animais',
    'Profissões', 'Objetos de casa', 'Marcas famosas', 'Aplicativos', 'Personagens de filmes',
    'Heróis de quadrinhos', 'Celebridades', 'Streamers/Youtubers'
];


const LETTERS = [
    // letras mais amigáveis repetidas para aumentar probabilidade
    'A', 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'M', 'N', 'O', 'P', 'R', 'S', 'S', 'T', 'U', 'V'
    // opcional: incluir K,W,Y quando desejar
];


export function pickTheme(): string {
    return THEMES[Math.floor(Math.random() * THEMES.length)];
}


export function pickLetter(): string {
    return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}