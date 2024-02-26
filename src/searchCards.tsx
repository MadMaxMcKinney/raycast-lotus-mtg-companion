/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import { Grid, Icon, Action, ActionPanel, useNavigation, LocalStorage } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { ScryfallCard, ScryfallCardQuery } from "./types";
import { getCardImage } from "./util";
import { CardDetail } from "./components/Details/CardDetail";
import { SharedCardActions } from "./components/Actions";

export default function Command() {
    const [searchText, setSearchText] = useState("");
    const [recentSearchedCards, setRecentSearchedCards] = useState<ScryfallCard[]>([]);
    const [gridSize, setGridSize] = useState(4);
    const { isLoading, data } = useFetch<ScryfallCardQuery>(`https://api.scryfall.com/cards/search?q=${searchText}`, {
        // to make sure the screen isn't flickering when the searchText changes
        keepPreviousData: true,
        onError: (error) => console.error("Failed to fetch data:", error),
        // to make we don't send a request when the searchText is empty
        execute: searchText !== "",
    });
    const { push } = useNavigation();

    // Load recent searched cards from local storage
    useEffect(() => {
        (async () => {
            try {
                // Perform asynchronous operations
                const recentSearchedCards = await LocalStorage.getItem<string>("recent-searched-cards");
                if (recentSearchedCards) {
                    setRecentSearchedCards(JSON.parse(recentSearchedCards) as ScryfallCard[]);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        })();
    }, []);

    const gridSizes = [3, 4, 5];

    function addRecentSearchedCard(card: ScryfallCard) {
        // Add the card to the recent searched cards, and make sure we only keep the last 15 cards
        const newRecentSearchedCards = [card, ...recentSearchedCards.slice(0, 13)];

        LocalStorage.setItem("recent-searched-cards", JSON.stringify(newRecentSearchedCards));
        setRecentSearchedCards(newRecentSearchedCards);
    }

    return (
        <Grid
            columns={gridSize}
            aspectRatio="2/3"
            searchBarPlaceholder="Search for cards"
            inset={Grid.Inset.Small}
            isLoading={isLoading}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            throttle
            fit={Grid.Fit.Fill}
            searchBarAccessory={
                <Grid.Dropdown
                    tooltip="Select grid size"
                    storeValue
                    onChange={(newValue) => setGridSize(Number(newValue))}
                >
                    {gridSizes.map((size) => (
                        <Grid.Dropdown.Item key={size} title={size.toString() + " Columns"} value={size.toString()} />
                    ))}
                </Grid.Dropdown>
            }
        >
            {!isLoading &&
                searchText.length > 0 &&
                data?.data.map((card) => (
                    // TODO: Move this into it's own component so we can reuse it below easily
                    <Grid.Item
                        key={card.id}
                        title={card.name}
                        subtitle={card.set_name}
                        content={{ source: getCardImage(card), fallback: Icon.Wand }}
                        actions={
                            <ActionPanel>
                                <Action
                                    title="View More"
                                    icon={Icon.ArrowsExpand}
                                    onAction={() => {
                                        addRecentSearchedCard(card);
                                        push(<CardDetail card={card} />);
                                    }}
                                />
                                <SharedCardActions card={card} />
                            </ActionPanel>
                        }
                    />
                ))}
            {!isLoading && searchText.length === 0 && recentSearchedCards.length > 0 && (
                <>
                    <Grid.Section title="Recently searched cards">
                        {recentSearchedCards.map((card) => (
                            <Grid.Item
                                key={card.id}
                                title={card.name}
                                subtitle={card.set_name}
                                content={{ source: getCardImage(card), fallback: Icon.Wand }}
                                actions={
                                    <ActionPanel>
                                        <Action
                                            title="View More"
                                            icon={Icon.ArrowsExpand}
                                            onAction={() => {
                                                addRecentSearchedCard(card);
                                                push(<CardDetail card={card} />);
                                            }}
                                        />
                                        <SharedCardActions card={card} />
                                    </ActionPanel>
                                }
                            />
                        ))}
                    </Grid.Section>
                </>
            )}
        </Grid>
    );
}
