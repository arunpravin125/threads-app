import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserPages from "./Pages/UserPages";
import PostPage from "./Pages/PostPage";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./Pages/ChatPage";

const App = () => {
  const user = useRecoilValue(userAtom);
  console.log("user in Data :", user);
  return (
    <Box position={"relative"} w="full">
      <Container maxW="720px">
        <Header />

        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          ></Route>
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          ></Route>
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          ></Route>
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <CreatePost />
                  <UserPages />
                </>
              ) : (
                <UserPages />
              )
            }
          ></Route>
          <Route path="/:username/post/:pid" element={<PostPage />}></Route>
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          ></Route>
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
