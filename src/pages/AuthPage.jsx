import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../lib/supabase";

const Page = styled.main`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2vh;
  position: relative;
  overflow: hidden;
  font-family: Arial, sans-serif;
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1682946128105-c829f3e6a7ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBiZXR0aW5nJTIwc3RhZGl1bXxlbnwxfHx8fDE3NzE3ODEyMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  pointer-events: none;
`;

const Card = styled.section`
  border: 0.12vh solid #334155;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(1.8vh);
  -webkit-backdrop-filter: blur(1.8vh);
  border-radius: 1vh;
  box-shadow: 0 2.8vh 5.6vh -1.3vh rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 56vh;
  color: #ffffff;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 3.8vh;
  line-height: 1.1;
  font-weight: 700;
  text-align: center;
`;

const BodyText = styled.p`
  margin: 0;
  color: #94a3b8;
  font-size: 1.8vh;
  text-align: center;
`;

const ErrorText = styled.p`
  margin: 1vh 0 0;
  color: #fecaca;
`;

const SuccessText = styled.p`
  margin: 1vh 0 0;
  color: #bbf7d0;
`;

const Form = styled.form`
  display: grid;
  gap: 1.2vh;
  margin-top: 2vh;
`;

const TabRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1%;
  width: 100%;
  background: rgba(15, 23, 42, 0.75);
  border: 0.12vh solid #334155;
  border-radius: 1vh;
  padding: 0.6vh;
`;

const TabButton = styled.button`
  border: 0;
  border-radius: 0.8vh;
  padding: 1vh 0;
  font-size: 1.7vh;
  font-weight: 700;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#ecfeff" : "#94a3b8")};
  background: ${(props) =>
    props.$active ? "linear-gradient(135deg, #10b981, #14b8a6)" : "transparent"};
`;

const FieldLabel = styled.label`
  color: #cbd5e1;
  font-size: 1.6vh;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  border: 0.12vh solid #334155;
  background: rgba(15, 23, 42, 0.55);
  color: #f8fafc;
  border-radius: 1vh;
  padding: 1vh 1.2vw;
  outline: none;
  font-size: 1.8vh;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 0.25vh rgba(20, 184, 166, 0.15);
  }
`;

const Button = styled.button`
  width: 100%;
  border: 0;
  border-radius: 1vh;
  padding: 1.1vh 1.4vw;
  font-size: 1.8vh;
  font-weight: 700;
  color: #ecfeff;
  background: linear-gradient(135deg, #10b981, #14b8a6);
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CardHeader = styled.div`
  padding: 2.4vh 3vw 1.6vh;
  text-align: left;
`;

const CardContent = styled.div`
  padding: 0 3vw 2.4vh;
`;

export default function AuthPage({ claims }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  const isVerifying = verifying || Boolean(tokenHash);

  useEffect(() => {
    if (!tokenHash) {
      return;
    }

    // Strip token from URL immediately so dev StrictMode remounts
    // do not submit duplicate verify requests for the same token.
    navigate("/auth", { replace: true });
    supabase.auth
      .verifyOtp({
        token_hash: tokenHash,
        type: type || "email",
      })
      .then(({ error }) => {
        if (error) {
          setAuthError(error.message);
        } else {
          setAuthSuccess(true);
          navigate("/", { replace: true });
        }
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [navigate, tokenHash, type]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        shouldCreateUser: false,
      },
    });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }

    setLoading(false);
  };

  if (claims) {
    return <Navigate to="/" replace />;
  }

  if (isVerifying) {
    return (
      <Page>
        <BackgroundImage />
        <Card>
          <CardHeader>
            <Title>Authentication</Title>
            <BodyText>Confirming your magic link...</BodyText>
          </CardHeader>
          <CardContent>
            <BodyText>Loading...</BodyText>
          </CardContent>
        </Card>
      </Page>
    );
  }

  if (authError) {
    return (
      <Page>
        <BackgroundImage />
        <Card>
          <CardHeader>
            <Title>Authentication</Title>
            <ErrorText>Authentication failed</ErrorText>
          </CardHeader>
          <CardContent>
            <ErrorText>{authError}</ErrorText>
            <Form>
              <Button
                type="button"
                onClick={() => {
                  setAuthError(null);
                  navigate("/auth", { replace: true });
                }}
              >
                Return to login
              </Button>
            </Form>
          </CardContent>
        </Card>
      </Page>
    );
  }

  if (authSuccess) {
    return (
      <Page>
        <BackgroundImage />
        <Card>
          <CardHeader>
            <Title>Authentication</Title>
            <SuccessText>Authentication successful</SuccessText>
          </CardHeader>
          <CardContent>
            <BodyText>Loading your account...</BodyText>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <BackgroundImage />
      <Card>
        <CardHeader>
          <Title>Sportsbook Arbitrage Engine</Title>
          <BodyText>Sign in via magic link with your email below.</BodyText>
        </CardHeader>
        <CardContent>
          <TabRow>
            <TabButton
              type="button"
              $active={true}
            >
              Login
            </TabButton>
            <TabButton
              type="button"
              $active={false}
              onClick={() => alert("Not currently accepting new users.")}
            >
              Sign Up
            </TabButton>
          </TabRow>
          <Form onSubmit={handleLogin}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send login link</span>}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </Page>
  );
}
