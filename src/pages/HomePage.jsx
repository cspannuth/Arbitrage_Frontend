import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import arrows from "../assets/arrows.png";
import { Page, SignButton, SignDiv, SignText, Title, UpperBoard, Logo } from "../lib/styles.js";

const SubTitle = styled.h2`
    text-align: center;
    font-size: calc(2px + 2vw);
`;

const HomeSignButton = styled(SignButton)`
    padding-bottom: 10%;
`;

const ButtonDiv = styled.div`
    display: flex;
    justify-content: center;
`;

const Buttons = styled.button`
    border: black solid 1px;
    margin: 5% 5% 5% 5%;
    width: 100%;
    border-radius: 1vh;
    padding: 2vh;
    font-size: 1.8vh;
    font-weight: 700;
    color: #c0d6ef;
    background: linear-gradient(135deg, #10b981, #14b8a6);
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;


export default function HomePage({ claims, onLogout }) {
    const navigate = useNavigate();
  return (
    <Page>
        <Title>Arbitrage Dashboard</Title>
        <UpperBoard>
            <SignDiv>
                <SignText>Logged in as: <br/>{claims.email}</SignText>
                <HomeSignButton onClick={onLogout}>Sign Out</HomeSignButton>
            </SignDiv>
            <Logo src={arrows} alt="Logo" />
        </UpperBoard>
        <SubTitle>Services</SubTitle>
        <ButtonDiv>
            <Buttons onClick={() => navigate("/props")}>Prop Arbitrage</Buttons>
            <Buttons>Moneyline Arbitrage</Buttons>
            <Buttons>Spread Arbitrage</Buttons>
        </ButtonDiv>
        <ButtonDiv>
            <Buttons>Plus EV Bets</Buttons>
            <Buttons>Coming Soon!</Buttons>
            <Buttons>Coming Soon!</Buttons>
        </ButtonDiv>
    </Page>
  );
}
