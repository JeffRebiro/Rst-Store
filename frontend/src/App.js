import { Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import TestScreen from "./screens/TestScreen";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Flex
        as="main"
        mt="72px"
        direction="column"
        py="6"
        px="6"
        bgColor="white"
      >
        <Routes>
          <Route path="/" element={<TestScreen />} />
          <Route path="/test" element={<TestScreen />} />
          {/* Comment out all other routes */}
        </Routes>
      </Flex>
      <Footer />
    </BrowserRouter>
  );
}

export default App;