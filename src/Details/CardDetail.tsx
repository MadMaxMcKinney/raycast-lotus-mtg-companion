import { ActionPanel, Detail, Color, Icon } from "@raycast/api";
import { ScryfallCard } from "../Types";
import { getCardImage, getMana } from "../Util";
import { SharedCardActions } from "../Actions";

interface CardDetailProps {
    card: ScryfallCard;
}

export function CardDetail({ card }: CardDetailProps) {
    const markdown = `
![](${getCardImage(card)}?raycast-width=350&raycast-height=300)

${card.oracle_text}
`;

    return (
        <Detail
            markdown={markdown}
            navigationTitle={card.name}
            metadata={
                <Detail.Metadata>
                    <Detail.Metadata.Label title="Name" text={card.name} />
                    <Detail.Metadata.Label title="Type" text={card.type_line} />
                    <Detail.Metadata.TagList title="Mana">
                        {getMana(card)?.map((mana, index) => (
                            <Detail.Metadata.TagList.Item text={mana.symbol} color={mana.color} key={index} />
                        ))}
                    </Detail.Metadata.TagList>
                    <Detail.Metadata.Label title="CMC" text={card.cmc.toString()} />
                    <Detail.Metadata.Label title="Power" text={card.power} />
                    <Detail.Metadata.Label title="Toughness" text={card.toughness} />
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
                    <Detail.Metadata.Separator />
                    <Detail.Metadata.Label title="Artist" text={card.artist} />
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
