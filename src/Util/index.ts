import { Mana, ScryfallCard } from "../Types";

export function getCardImage(card: ScryfallCard) {
    if (card.image_uris) {
        return card.image_uris.png;
    } else if (card.card_faces) {
        return card.card_faces[0].image_uris.png;
    } else {
        return "";
    }
}

export function getMana(card: ScryfallCard) {
    const manaList: Mana[] = [];
    if (card.mana_cost) {
        for (const match of card.mana_cost.matchAll(/{(.)}/g)) {
            // match[0] is the full match, match[1] is the first group which is the mana value
            switch (match[1]) {
                case "W":
                    manaList.push({ color: "#F5CF76", symbol: "W" });
                    break;
                case "U":
                    manaList.push({ color: "#4490C3", symbol: "U" });
                    break;
                case "B":
                    manaList.push({ color: "Black", symbol: "B" });
                    break;
                case "R":
                    manaList.push({ color: "#ED5F67", symbol: "R" });
                    break;
                case "G":
                    manaList.push({ color: "#5DC553", symbol: "G" });
                    break;
                default:
                    manaList.push({ color: "#C5BEBB", symbol: match[1] });
                    break;
            }
        }
    } else {
        return null;
    }
    return manaList;
}
