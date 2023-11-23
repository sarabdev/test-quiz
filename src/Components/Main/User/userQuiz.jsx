import {
  Box,
  Input,
  Button,
  VStack,
  Center,
  keyframes,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function calculateRemainingTime(timeStr, spenttimeStr) {
  console.log(timeStr, spenttimeStr);
  const timeParts = timeStr.split(":");
  const spenttimeParts = spenttimeStr.split(":");
  const timeSeconds =
    parseInt(timeParts[0]) * 3600 +
    parseInt(timeParts[1]) * 60 +
    parseInt(timeParts[2]);
  const spenttimeSeconds =
    parseInt(spenttimeParts[0]) * 3600 +
    parseInt(spenttimeParts[1]) * 60 +
    parseInt(spenttimeParts[2]);

  // Calculate the remaining time in seconds
  const remainingSeconds = timeSeconds - spenttimeSeconds;

  // Convert remainingSeconds back to "00:00:00" format
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const remainingTimeStr = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return remainingTimeStr;
}

function UserQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [inputAnswers, setInputAnswers] = useState([]);
  const [blanks, setBlanks] = useState([]);
  const [isNextButtonVisible, setIsNextButtonVisible] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [succes, setSucces] = useState(false);
  const [answer, setAnswer] = useState(true);
  const [splitQuestion, setSplitQuestion] = useState([]);
  const [time, setTime] = useState(0);
  const navigate = useNavigate();

  let timerInterval;
  useEffect(() => {
    timerInterval = setInterval(() => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds > 0) {
        const newTotalSeconds = totalSeconds - 1;
        const newHours = Math.floor(newTotalSeconds / 3600);
        const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
        const newSeconds = newTotalSeconds % 60;
        const newTime = `${String(newHours).padStart(2, "0")}:${String(
          newMinutes
        ).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
        if (!showStats) {
          setTime(newTime);
        }
      } else {
        clearInterval(timerInterval);
        setSucces(false);
        setShowStats(true);
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [time]);

  useEffect(() => {
    axios
      .get(`${REACT_APP_SERVER_URL}quiz/${id}/quiz`)
      .then((res) => {
        setQuiz(res.data);
        setTime(formatTime(res.data.time));
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    let splitQuestionArray = [];
    let startIndex = 0;
    if (quiz?.questions && quiz.questions[currentQuestionIndex]?.answers) {
      for (let answer of quiz.questions[currentQuestionIndex].answers) {
        const answerIndex =
          quiz.questions[currentQuestionIndex].question.indexOf(answer);

        if (answerIndex !== -1) {
          const beforeAnswer = quiz.questions[currentQuestionIndex].question
            .substring(startIndex, answerIndex)
            .trim();
          if (beforeAnswer !== "") {
            splitQuestionArray.push(beforeAnswer);
          }
          splitQuestionArray.push(answer);
          startIndex = answerIndex + answer.length;
        }
      }
      const remainingPart = quiz.questions[currentQuestionIndex]?.question
        ?.substring(startIndex)
        .trim();
      if (remainingPart !== "") {
        splitQuestionArray.push(remainingPart);
      }
    }
    setSplitQuestion(splitQuestionArray);
    if (splitQuestionArray) {
      const initialiput = Array(splitQuestionArray.length).fill("");
      setInputAnswers(initialiput);
    }
  }, [quiz, currentQuestionIndex, quiz?.questions]);

  useEffect(() => {
    if (quiz.questions && quiz.questions.length > 0) {
      const initialAnswers = quiz.questions[currentQuestionIndex].answers.map(
        (answer) => answer
      );
      setUserAnswers(initialAnswers);

      setBlanks(
        splitQuestion.map((word) => (initialAnswers.includes(word) ? word : ""))
      );
    }
  }, [quiz, splitQuestion]);

  useEffect(() => {
    if (blanks) {
      const foundIndex = blanks.findIndex((item) => item);
      if (foundIndex !== -1) {
        const firstInput = document.querySelector(`.input-${foundIndex}`);
        if (firstInput) {
          firstInput.focus();
        }
      }
    }
  }, [blanks]);

  const handleAnswerChange = (index, value) => {
    console.log(userAnswers);
    const matchingAnswers = blanks.find((input, checkindex) => {
      if (input) {
        if (input.charAt(0) === value) {
          if (checkindex === index) {
            setAnswer(false);
            return blanks[index];
          }
        }
        return false;
      }
    });
    if (answer) {
      const inputCopy = [...inputAnswers];
      inputCopy[index] = value;
      setInputAnswers(inputCopy);
    }

    var showbtnarray;
    if (matchingAnswers) {
      const inputAnswersCopy = [...inputAnswers];
      inputAnswersCopy[index] = matchingAnswers;
      showbtnarray = inputAnswersCopy;
      setInputAnswers(inputAnswersCopy);
      var nextIndex;
      for (let i = index + 1; i <= blanks.length; i++) {
        if (blanks[i]) {
          nextIndex = i;
          break;
        }
      }
      const nextInput = document.querySelector(`.input-${nextIndex}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
    var showBtn;
    if (showbtnarray) {
      showBtn = showbtnarray.every((answer, index) => answer === blanks[index]);
    }

    if (showBtn) {
      setIsNextButtonVisible(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setSucces(true);
      setAnswer(true);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setIsNextButtonVisible(false);
      setBlanks([]);
      setSplitQuestion([]);
      const initialiput = Array(
        quiz.questions[currentQuestionIndex + 1].question.split(" ").length
      ).fill("");
      setInputAnswers(initialiput);
      const initialAnswers = quiz.questions[
        currentQuestionIndex + 1
      ].answers.map((answer) => answer);
      setUserAnswers(initialAnswers);
      console.log(initialAnswers);
      // setBlanks(
      //   quiz.questions[currentQuestionIndex + 1].question
      //     .split(" ")
      //     .map((word) => (initialAnswers.includes(word) ? word : ""))
      // );
    } else {
      clearInterval(timerInterval);
      setShowStats(true);
      setSucces(true);
      return;
    }
  };

  const animationKeyframes = keyframes`
  0% { opacity:0 }
  100% {opacity:1}
`;
  const animation = `${animationKeyframes} 1s  infinite`;

  return (
    <Center h="100vh" alignItems="center" bg="#EDF2F7">
      {quiz.questions && currentQuestionIndex < quiz.questions.length ? (
        !showStats && (
          <Box bg="white" p="20px" display="flex" flexDir="column" gap="20px">
            <Box display="flex" gap="40px" justifyContent="space-between">
              <Box fontSize="24px" fontWeight="600">
                Question no {currentQuestionIndex + 1}:
              </Box>
              <Box
                fontSize="24px"
                fontWeight="600"
                animation={
                  parseInt(time.split(":")[2]) < 10 ? animation : "black"
                }
                color={parseInt(time.split(":")[2]) < 10 ? "red" : "black"}>
                {time}
              </Box>
            </Box>
            <VStack spacing={4} align="stretch">
              <Box>
                <span style={{ fontWeight: 600 }}>
                  {currentQuestionIndex + 1}:
                </span>
                <Box display="inline-flex" gap="12px" alignItems="center">
                  {splitQuestion.map((word, index) => (
                    <span key={index}>
                      {quiz.questions[currentQuestionIndex].answers.includes(
                        word
                      ) ? (
                        <Input
                          variant="flushed"
                          style={{
                            width: `${word.replace(/\s/g, "").length * 9}px`,
                          }} // Adjust the multiplier as needed for the desired width
                          className={`input-${index}`}
                          value={inputAnswers[index]}
                          onChange={(e) => {
                            handleAnswerChange(index, e.target.value);
                          }}
                        />
                      ) : (
                        <span>{word} </span>
                      )}
                    </span>
                  ))}
                </Box>
              </Box>
              {isNextButtonVisible && (
                <Center>
                  <Button
                    w="full"
                    mt="10px"
                    colorScheme="teal"
                    onClick={handleNextQuestion}>
                    Next
                  </Button>
                </Center>
              )}
            </VStack>
          </Box>
        )
      ) : (
        <Box>No Question</Box>
      )}
      {showStats && (
        <Box bg="white" p="30px">
          <Box>
            <Center fontSize="26px" fontWeight="600" mb="15px">
              Quiz Stats
            </Center>
            <Center fontSize="20px" fontWeight="500">
              Completed
              {!succes
                ? ` ${currentQuestionIndex} `
                : ` ${currentQuestionIndex + 1} `}
              questions out of {quiz.questions.length} in
              {calculateRemainingTime(formatTime(quiz.time), time)}
            </Center>
            <Box mt="30px">
              {quiz.questions.map((ques, ind) => (
                <div key={ind}>
                  <Box fontSize="22px" fontWeight="600">
                    Question no {ind + 1}
                  </Box>
                  <Box display="flex" flexDir="row" gap="5px">
                    {/* {ques.question.split(" ").map((word, index) => (
                      <Box key={index}>
                        <Box>
                          {ques.answers.includes(word) ? (
                            <Box>({word})</Box>
                          ) : (
                            <Box>{word} </Box>
                          )}
                        </Box>
                      </Box>
                    ))} */}
                    {ques.question}
                  </Box>
                </div>
              ))}
            </Box>
          </Box>
          <Center>
            <Button
              w="full"
              mt="20px"
              colorScheme="teal"
              onClick={() => {
                navigate("/");
              }}>
              Back to Categories
            </Button>
          </Center>
        </Box>
      )}
    </Center>
  );
}

export default UserQuiz;
