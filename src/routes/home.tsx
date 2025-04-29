import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
import { createGlobalStyle } from "styled-components";
const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  height: 100vh;
`;
const GlobalStyle = createGlobalStyle`::-webkit-scrollbar {
display:none;
}`;

export default function Home() {
  return (
    <Wrapper>
      <GlobalStyle />
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
