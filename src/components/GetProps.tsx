import styled from "styled-components";
import type {ApiData} from "../interfaces/ApiData";


const SinglePropDiv=styled.div`
    display: grid;
    grid-template-columns: 8% 12% 12% 12% 15% 18% 12% 12%;
    align-items: center;
    justify-content: space-between;
    border: 2px dimgrey solid;
    background-color: #192539;
    font: calc(2px + 0.3vw) "Lucida Console";
    color: white;
    padding: 0 5% 0 3%;
    height: 8vh;
    margin: 1vh 1vw 1vh 1vw;

`;

const DataDiv = styled.div`

`;

type GetPropsProps = {
    data: ApiData[];
};

export const sportsList = [
    { id: "americanfootball_nfl", label: "NFL"},
    { id: "basketball_nba", label: "NBA"},
    { id: "icehockey_nhl", label: "NHL"},
    { id: "soccer_usa_mls", label: "MLS"},
    { id: "baseball_mlb", label: "MLB"},
    { id: "mma_mixed_martial_arts", label: "UFC"},
];

function sportCleanUp(sport: string) {
    for(let i = 0; i < sportsList.length; i++) {
        if(sportsList[i].id === sport) return sportsList[i].label;
    }
    return sport;
}

function stringCleanUp(time: string) {
    let pt1 = time.substring(0, 10);
    let pt2 = time.substring(11, 19);
    return pt2 + " " + pt1;
}

export default function GetProps({ data }: GetPropsProps) {

    return (
        <DataDiv>
            {
                data.map((p: ApiData) =>
                    <SinglePropDiv key={p.id}>
                        <h1>{sportCleanUp(p.sport)}</h1>
                        <h1>{p.player_name}</h1>
                        <h1>{p.market_type}</h1>
                        <h1>{p.line_value}</h1>
                        <h1>{p.over_book} Over @ {p.over_odds}</h1>
                        <h1>{p.under_book} Under @ {p.under_odds}</h1>
                        <h1>{p.profit_percent}%</h1>
                        <h1>{stringCleanUp(p.detected_at)}</h1>
                    </SinglePropDiv>
                )
            }
        </DataDiv>
    );
}
