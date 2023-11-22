import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header/header";
import AdminMain from "./Components/Main/Admin/adminMain";
import AdminQuiz from "./Components/Quiz/adminQuiz";
import AdminQuestions from "./Components/Question/adminQuestions";
import UserMain from "./Components/Main/User/userMain";
import UserHeader from "./Components/Header/userHeader";
import UserQuiz from "./Components/Main/User/userQuiz";

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/admin" element={<Header />}>
          <Route exact index path="categories" element={<AdminMain />} />
          <Route
            path="/admin/categories/:categoryid/quiz"
            element={<AdminQuiz />}
          />
          <Route
            path="/admin/categories/:categoryid/quiz/:quizid/questions"
            element={<AdminQuestions />}
          />
        </Route>
        <Route path="/" element={<UserMain />} />
        <Route path="/quiz/:id" element={<UserQuiz />} />
      </Routes>
    </Box>
  );
};

export default App;
