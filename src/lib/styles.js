import styled from "styled-components";

export const Page = styled.main`
    font-family: Arial, sans-serif;
    background-image: linear-gradient(to bottom right, #2f3844, #3f4b5b, #5c6b7e);
    height: 100vh;
    color: #c0d6ef;
`;

export const Title = styled.h1`
    font-size: calc(2px + 3vw);
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 2.5%;
`;

export const UpperBoard = styled.div`
    display: flex;
    flex-direction: row;
`;

export const SignDiv = styled.div`
    flex-direction: column;
    margin-left: 5%;
    border: black solid 1px;
    border-radius: 1vh;
    text-align: center;
    background: #888888;
    color: black;
    width: 15%;
`;

export const Logo = styled.img`
    max-width: 100%;
    max-height: 100%;
    width: 5%;
    height: 5%;
    margin-left: 70%;
`;

export const SignText = styled.p`
    padding-top: 5%;
    font-size: calc(2px + 1.4vh);
`;

export const SignButton = styled.button`
    border: black solid 1px;
    margin: 5% 5% 5% 5%;
    width: 50%;
    height: 15%;
    border-radius: 1vh;
    padding: 5% 0 5% 0;
    font-size: calc(2px + 1.4vh);
    font-weight: 700;
    color: #c0d6ef;
    background: linear-gradient(135deg, #10b981, #14b8a6);
    cursor: pointer;
    justify-content: center;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;