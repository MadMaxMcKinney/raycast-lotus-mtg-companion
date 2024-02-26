import { ActionPanel, Detail, Color } from "@raycast/api";
import { ScryfallCard } from "../../types";
import { formatRarityName, getCardImage, getMana, getRarityColor } from "../../util";
import { SharedCardActions } from "../Actions";

interface CardDetailProps {
    card: ScryfallCard;
}

export function CardDetail({ card }: CardDetailProps) {
    const markdown = `
![](${getCardImage(card)}?raycast-width=350&raycast-height=300)

${card.oracle_text}

${card.flavor_text ? `*${card.flavor_text}*` : ""}
`;

    return (
        <Detail
            markdown={markdown}
            navigationTitle={card.name}
            metadata={
                <Detail.Metadata>
                    {/* Card info */}
                    <Detail.Metadata.Label title="Name" text={card.name} />
                    <Detail.Metadata.Label title="Type" text={card.type_line} />
                    <Detail.Metadata.TagList title="Mana">
                        {getMana(card)?.map((mana, index) => (
                            <Detail.Metadata.TagList.Item text={mana.symbol} color={mana.color} key={index} />
                        ))}
                    </Detail.Metadata.TagList>
                    <Detail.Metadata.Label title="CMC" text={card.cmc.toString()} />
                    {card.power && <Detail.Metadata.Label title="Power" text={card.power} icon={"sword.png"} />}
                    {card.toughness && (
                        <Detail.Metadata.Label title="Toughness" text={card.toughness} icon={"shield.png"} />
                    )}
                    {card.keywords.length > 0 && (
                        <>
                            <Detail.Metadata.Separator />
                            <Detail.Metadata.TagList title="Keywords">
                                {card.keywords.map((keyword) => (
                                    <Detail.Metadata.TagList.Item
                                        key={keyword}
                                        text={keyword}
                                        color={Color.PrimaryText}
                                    />
                                ))}
                            </Detail.Metadata.TagList>
                        </>
                    )}
                    {/* Misc info */}
                    <Detail.Metadata.Separator />
                    <Detail.Metadata.Label title="Set" text={card.set_name} />
                    <Detail.Metadata.Label title="Collector Number" text={card.collector_number} />
                    <Detail.Metadata.TagList title="Rarity">
                        <Detail.Metadata.TagList.Item text={formatRarityName(card)} color={getRarityColor(card)} />
                    </Detail.Metadata.TagList>
                    {/* Price info */}
                    <Detail.Metadata.Separator />
                    <Detail.Metadata.TagList title="Prices">
                        <Detail.Metadata.TagList.Item text={`$${card.prices.usd}`} color={"raycast-primary-text"} />
                        <Detail.Metadata.TagList.Item
                            text={`Foil: $${card.prices.usd_foil}`}
                            color={"raycast-primary-text"}
                        />
                    </Detail.Metadata.TagList>
                    {/* Artist */}
                    <Detail.Metadata.Separator />
                    <Detail.Metadata.Label title="Artist" text={card.artist} />
                    {/* Open */}
                    <Detail.Metadata.Separator />
                    <Detail.Metadata.Link title="Scryfall" target={card.scryfall_uri} text="Open in Browser" />
                </Detail.Metadata>
            }
            actions={
                <ActionPanel>
                    <SharedCardActions card={card} />
                </ActionPanel>
            }
        />
    );
}
