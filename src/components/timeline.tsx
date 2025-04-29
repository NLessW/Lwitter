import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  query,
  orderBy,
  limit,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
import { db } from "../routes/firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  fileData?: string;
  tweet: string;
  userId: string;
  username: string;
  createAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createAt", "desc"),
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const docs = snapshot.docs.map((doc) => {
      //     const {fileData, tweet, userId, username, createAt} = doc.data();
      //     return {
      //         fileData, tweet, userId, username, createAt,
      //         id: doc.id
      //     }
      // });

      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const { fileData, tweet, userId, username, createAt } = doc.data();
          return {
            fileData,
            tweet,
            userId,
            username,
            createAt,
            id: doc.id,
          };
        });
        setTweets(docs);
      });
    };
    fetchTweets();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
