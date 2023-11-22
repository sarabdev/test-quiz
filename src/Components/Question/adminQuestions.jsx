import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Box,
  Input,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { TagsInput } from "react-tag-input-component";
import { TfiSearch } from "react-icons/tfi";
import axios from "axios";
import { useState, useEffect } from "react";
import AdminQuestionList from "./adminQuestionList";
import { useParams } from "react-router";

function AdminQuestions() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [selected, setSelected] = useState([]);
  const toast = useToast();
  const { quizid } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/questions/${quizid}`)
      .then((res) => {
        setAllQuestions(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = () => {
    if (question === "" || selected.length <= 0) {
      toast({
        position: "top-right",
        title: "Invalid Credentials",
        description: "Input the values",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const questionWords = question.split(" ");
    if (questionWords.length < 3 || selected.length >= questionWords.length) {
      toast({
        position: "top-right",
        title: "Invalid Credentials",
        description:
          "Answers Should be less then Question and question should me more than 3 words",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const notPresentInQuestions = selected.filter(
      (word) => !question.includes(word)
    );
    // Filter the answers array to get elements that are not present in the questions array
    // const notPresentInQuestions = selected.filter(
    //   (answer) => !questionWords.includes(answer)
    // );

    if (notPresentInQuestions.length > 0) {
      toast({
        position: "top-right",
        title: "Invalid Credentials",
        description: "Answers are not present in the question",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    axios
      .post(`http://localhost:4000/questions/${quizid}`, {
        question,
        answers: selected,
      })
      .then((res) => {
        toast({
          position: "top-right",
          title: "Questions Created.",
          description: "We've created Question for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setQuestion("");
        setSelected([]);
        onClose();
        axios
          .get(`http://localhost:4000/questions/${quizid}`)
          .then((res) => {
            setAllQuestions(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        toast({
          position: "top-right",
          title: err.response.data.message,
          description: "We've not created Question for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  const refresh = () => {
    axios
      .get(`http://localhost:4000/questions/${quizid}`)
      .then((res) => {
        setAllQuestions(res.data);
        // setQuestion(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleButtonClick = (inputValue) => {
    if (inputValue === "") {
      setAllQuestions([...question]);
    } else {
      const filteredCategories = question.filter((category) =>
        category.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setAllQuestions(filteredCategories);
    }
  };

  return (
    <Box>
      <Modal
        size="md"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        closeOnOverlayClick={false}>
        <ModalOverlay backgroundColor="rgba(0, 0, 0, 0.8)" />
        <ModalContent rounded="base">
          <ModalHeader
            onClick={() => {
              setQuestion("");
            }}
            fontSize={24}
            fontWeight="medium"
            color="#666">
            Create new Question
          </ModalHeader>
          <ModalCloseButton mt="12px" />
          <ModalBody>
            <FormControl
              id="question"
              display="flex"
              flexDir="column"
              gap="10px">
              <FormLabel>Question</FormLabel>
              <Textarea
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <FormLabel>Answer</FormLabel>
              <TagsInput
                value={selected}
                onChange={setSelected}
                name="fruits"
                placeHolder="Enter to add new answer"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup spacing="2">
              <Button colorScheme="blue" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit" onClick={onSubmit}>
                CREATE
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box w={{ base: "100%", xl: "60%" }} mx="auto" p="20px" mt="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box color="#666" fontSize="1.514rem">
            Questions
          </Box>
          <Button colorScheme="blue" onClick={onOpen}>
            Add Question
          </Button>
        </Box>
        <Box
          display="flex"
          flexDir={{ base: "column", lg: "row" }}
          alignItems="center"
          gap="20px"
          py="15px"
          px="25px"
          bg="white"
          mt="20px"
          borderWidth="1px"
          borderColor=" gray.300"
          borderStyle="solid">
          <Box display="flex" flex="1" w="full" gap="10px" alignItems="center">
            <Box color="#999">
              <TfiSearch size={24} />
            </Box>
            <Box flex="1">
              <Input
                onChange={(e) => {
                  handleButtonClick(e.target.value);
                }}
                type="text"
                placeholder="Search for Question "
                w="full"
                _hover={{ ring: "1" }}
                _focus={{ outline: "none" }}
                pl="6px"
                flex="1"
                py="10px"
              />
            </Box>
          </Box>
        </Box>

        <Box
          fontSize="22px"
          mt="30px"
          mb="15px"
          fontWeight="500"
          textTransform="uppercase">
          Questions
        </Box>
        {allQuestions.length > 0 ? (
          allQuestions &&
          allQuestions.map((item, index) => (
            <AdminQuestionList
              questionNumber={index}
              key={item.id}
              refresh={refresh}
              question={item}
            />
          ))
        ) : (
          <Box textAlign="center">No Question</Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminQuestions;
