import styled from "styled-components";
import { Page, SignButton, SignDiv, SignText, Title, UpperBoard, Logo } from "../lib/styles.js";
import arrows from "../assets/arrows.png";
import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSupabaseJwt} from "../lib/useSupabaseJWT.js";
import GetProps from "../components/GetProps";
import type {ApiData} from "../interfaces/ApiData";

const PropsPage = styled(Page)`
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
`;

const PropsUpperBoard = styled(UpperBoard)`
    align-items: center;
`;

const PropsLogo = styled(Logo)`
    width: 5%;
    min-width: 56px;
    height: auto;
    margin-left: auto;
    margin-right: 5%;
`;

const FiltersDiv = styled.div`
    display: flex;
    flex-direction: row;
    margin: 2% 5%;
    justify-content: center;
    gap: 5%;
    flex-shrink: 0;
`;

const Select = styled.select`
    border: black solid 1px;
    border-radius: 1vh;
    padding: 0.5% 1% 0.5% 1%;
    background: linear-gradient(135deg, #10b981, #14b8a6);
    cursor: pointer;
    justify-content: center;

    font-size: calc(2px + 1.8vh);
    font-weight: 500;
    color: #131313;
`;

const Buttons = styled.button`
    border: black solid 1px;
    border-radius: 1vh;
    padding: 0.5% 1% 0.5% 1%;
    background: linear-gradient(135deg, #10b981, #14b8a6);
    cursor: pointer;
    justify-content: center;

    font-size: calc(2px + 1.8vh);
    font-weight: 500;
    color: #131313;
`;

const Input = styled.input`
    border: black solid 1px;
    border-radius: 1vh;
    padding: 0.5% 1% 0.5% 1%;
    background: linear-gradient(135deg, #10b981, #14b8a6);
    cursor: pointer;
    justify-content: center;
`;

const ApiDataDiv = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 2vh;
`;

export const sportsList = [
    { id: "americanfootball_nfl", label: "NFL"},
    { id: "basketball_nba", label: "NBA"},
    { id: "icehockey_nhl", label: "NHL"},
    { id: "soccer_usa_mls", label: "MLS"},
    { id: "baseball_mlb", label: "MLB"},
    { id: "mma_mixed_martial_arts", label: "UFC"},
];

type SportWithProps = Exclude<(typeof sportsList)[number]["id"], "icehockey_nhl" | "soccer_usa_mls" | "baseball_mlb" | "mma_mixed_martial_arts">;

const propsBySport: Record<SportWithProps, { props: { id: string; label: string }[] }> = {
    americanfootball_nfl: {
        props: [
            {id: "player_pass_tds", label: "Passing TD's O/U"},
            {id: "player_rush_yds", label: "Rushing Yards O/U"},
            {id: "player_rec_yds", label: "Receiving Yards O/U"}
        ],
    },
    basketball_nba: {
        props: [
            { id: "player_points", label: "Player Points O/U"},
            { id: "player_rebounds", label: "Player Rebounds O/U"},
            { id: "player_assists", label: "Player Assists O/U"},
        ],
    },
};

type FetchBody = {
    token: string;
    sport: string;
    market: string;
};

type Claims = {
    email?: string;
};

type PropsPageProps = {
    claims: Claims;
    onLogout: () => void | Promise<void>;
};
//"https://arbitrage-engine-6asj.onrender.com/arbitrage/fetch"
async function fetchData({ token, sport, market }: FetchBody) {
    const res = await fetch("http://127.0.0.1:8000/arbitrage/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ sport, market }),
    });
    if (!res.ok) {
        alert("Failed To Fetch Data");
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    alert("Data Fetched Successfully");
    return res.json();
}

export default function Props({ claims, onLogout }: PropsPageProps) {

    const [selectedSport, setSelectedSport] = useState("None");
    const [selectedProp, setSelectedProp] = useState("None");

    const propsMap = selectedSport in propsBySport
        ? propsBySport[selectedSport as keyof typeof propsBySport].props
        : [];
    const navigate = useNavigate();

    const jwt = useSupabaseJwt();

    const handleFetch = async () => {
        if (!jwt || selectedSport === "None") return;
        try {
            const fetched = await fetchData({
                token: jwt,
                sport: selectedSport,
                market: "prop",
            });
            setData(Array.isArray(fetched) ? fetched : []);
        } catch (err) {
            console.error(err);
        }
    };

    const [data, setData] = useState<ApiData[]>([]);
    const [minProfit, setMinProfit] = useState(0);

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const matchesProp = selectedProp === "None" || row.market_type === selectedProp;
            const matchesSport = selectedSport === "None" || row.sport === selectedSport;
            const matchesProfit = row.profit_percent >= minProfit;

            return matchesProp && matchesSport && matchesProfit;
        });
    }, [data, selectedProp, selectedSport, minProfit]);

    useEffect(() => {
        async function fetchData() {
            const rawData = await fetch("https://arbitrage-engine-6asj.onrender.com/arbitrage/props");
            const results = await rawData.json();
            setData(Array.isArray(results) ? results : []);
        }
        fetchData()
            .then(() => console.log("Data Fetched Successfully."))
            .catch((e : Error) => console.error("Fetch failure: " + e));
    }, []);

    return (

        <PropsPage>
            <Title>Prop Arbitrage</Title>
            <PropsUpperBoard>
                <SignDiv>
                    <SignText>Logged in as: <br/>{claims.email}</SignText>
                    <SignButton onClick={onLogout}>Sign Out</SignButton>
                </SignDiv>
                <PropsLogo src={arrows} alt="Logo" />
            </PropsUpperBoard>
            <FiltersDiv>
                <Buttons onClick={() => navigate("/")}>Home</Buttons>
                <Select
                    id="sport"
                    value={selectedSport}
                    onChange={(e) => {setSelectedSport(e.target.value); setSelectedProp("None")}}
                >
                    <option value="None">Sport</option>
                    {sportsList.map((sport) => (
                        <option key={sport.id} value={sport.id}>{sport.label}</option>
                    ))}
                </Select>
                <Select
                    id="prop"
                    value={selectedProp}
                    onChange={(e) => {setSelectedProp(e.target.value)}}
                >
                    <option value="None">Select Prop</option>
                    {propsMap.map((prop) => (
                        <option key={prop.id} value={prop.id}>{prop.label}</option>
                    ))}
                </Select>
                <Input
                    type="number"
                    step="0.10"
                    min=""
                    value={minProfit}
                    onChange={(e) => setMinProfit(Number(e.target.value) || 0)}
                    placeholder="Min Profit %"
                    />
                <Buttons>Display Results</Buttons>
                <Buttons onClick={handleFetch}>Fetch & Display</Buttons>
            </FiltersDiv>
            <ApiDataDiv>
                <GetProps data={filteredData}/>
            </ApiDataDiv>
        </PropsPage>

    );
}
