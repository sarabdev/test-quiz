import {
  Td,
  Tr,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  Button,
  Stack,
  Input,
  Flex,
  useToast,
  Select,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";

function AdminQuizList({ quiz, refresh }) {
  const navigation = useNavigate();
  const [unit, setUnit] = useState("seconds");
  const toast = useToast();
  const [updateQuiz, setUpdateQuiz] = useState({
    name: "",
    time: 0,
  });

  const updateCategory = (id) => {
    if (updateQuiz.name === "" || updateQuiz.time === "") {
      return toast({
        position: "top-right",
        title: "Enter the values",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    let timeInSeconds = parseInt(updateQuiz.time, 10);
    if (unit === "minutes") {
      timeInSeconds *= 60;
    } else if (unit === "hours") {
      timeInSeconds *= 3600;
    }

    axios
      .patch(`http://localhost:4000/quiz/${id}`, {
        name: updateQuiz.name,
        time: timeInSeconds,
      })
      .then((res) => {
        toast({
          position: "top-right",
          title: "Quiz Updated.",
          description: "We've Update quiz for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refresh();
        setUpdateQuiz({ name: "", time: "" });
      })
      .catch((err) => {
        toast({
          position: "top-right",
          title: err.response.data.message,
          description: "We've not update quiz for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  const deleteQuiz = (id) => {
    axios
      .delete(`http://localhost:4000/quiz/${id}`)
      .then((res) => {
        toast({
          position: "top-right",
          title: "Quiz Updated.",
          description: "We've Update quiz for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refresh();
      })
      .catch((err) => {
        toast({
          position: "top-right",
          title: err.response.data.message,
          description: "We've not update quiz for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  return (
    <Tr _hover={{ boxShadow: "lg", rounded: "10px" }} py="5px" key={quiz.id}>
      <Td
        cursor="pointer"
        onClick={() => {
          navigation(`${quiz.id}/questions`);
        }}>
        {quiz.name}
      </Td>
      <Td
        cursor="pointer"
        onClick={() => {
          navigation(`${quiz.id}/questions`);
        }}>
        {quiz.questions.length}
      </Td>
      <Td
        cursor="pointer"
        onClick={() => {
          navigation(`${quiz.id}/questions`);
        }}>
        {quiz.time}
      </Td>
      <Td textAlign="end">
        <Popover placement="auto">
          <PopoverTrigger>
            <EditIcon cursor="pointer" _hover={{ color: "blue.500" }} />
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Edit Quiz</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Stack spacing={4}>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter name"
                    value={updateQuiz.name}
                    onChange={(e) => {
                      setUpdateQuiz((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                  />
                  <Flex>
                    <Input
                      type="number"
                      name="time"
                      id="time"
                      value={updateQuiz.time}
                      placeholder="Enter time"
                      onChange={(e) => {
                        setUpdateQuiz((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }));
                      }}
                    />
                    <Select
                      value={unit}
                      onChange={(e) => {
                        setUnit(e.target.value);
                      }}>
                      <option value="seconds">Seconds</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </Select>
                  </Flex>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      updateCategory(quiz.id);
                    }}>
                    Save
                  </Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Td>
      <Td textAlign="end">
        <Button
          onClick={() => {
            deleteQuiz(quiz.id);
          }}
          colorScheme="teal"
          _hover={{ bg: "red.500" }}>
          <AiOutlineDelete />
        </Button>
      </Td>
    </Tr>
  );
}

export default AdminQuizList;
