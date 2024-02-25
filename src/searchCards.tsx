/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { Color, Grid, Icon, Action, ActionPanel, useNavigation } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { ScryfallCardQuery, ScryfallCard } from "./Types";
import { getCardImage } from "./Util";
import { CardDetail } from "./Details/CardDetail";
import { SharedCardActions } from "./Actions";

export default function Command() {
    const [searchText, setSearchText] = useState("");
    const [gridSize, setGridSize] = useState(4);
    const { isLoading, data } = useFetch<ScryfallCardQuery>(`https://api.scryfall.com/cards/search?q=${searchText}`, {
        // to make sure the screen isn't flickering when the searchText changes
        keepPreviousData: true,
        onError: (error) => console.error("Failed to fetch data:", error),
        // to make we don't send a request when the searchText is empty
        execute: searchText !== "",
    });
    const { push } = useNavigation();

    const gridSizes = [3, 4, 5];

    return (
        <Grid
            columns={gridSize}
            aspectRatio="2/3"
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
                data?.data.map((card) => (
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
                                        push(<CardDetail card={card} />);
                                    }}
                                />
                                <SharedCardActions card={card} />
                            </ActionPanel>
                        }
                    />
                ))}
        </Grid>
    );
}
