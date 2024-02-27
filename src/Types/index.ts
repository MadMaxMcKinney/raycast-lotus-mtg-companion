export interface ScryfallCardQuery {
    total_cards: number;
    data: ScryfallCard[];
}

export interface ScryfallCard {
    id: string;
    name: string;
    released_at: string;
    uri: string;
    scryfall_uri: string;
    image_uris: {
        small: string;
        normal: string;
        large: string;
        png: string;
        art_crop: string;
        border_crop: string;
    };
    mana_cost: string;
    cmc: number;
    power?: string;
    toughness?: string;
    type_line: string;
    oracle_text: string;
    flavor_text?: string;
    colors: string[];
    color_identity: string[];
    set: string;
    set_name: string;
    keywords: string[];
    collector_number: string;
    rarity: string;
    artist: string;
    set_uri: string;
    rulings_uri: string;
    prices: {
        usd: string;
        usd_foil: string;
    };
    card_faces?: ScryfallCard[];
}

export interface Mana {
    color: string;
    symbol: string;
}
