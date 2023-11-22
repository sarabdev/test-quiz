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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  Flex,
  Select,
} from "@chakra-ui/react";
import { TfiSearch } from "react-icons/tfi";
import axios from "axios";
import { useState, useEffect } from "react";
import AdminQuizList from "./adminQuizList";
import { useParams } from "react-router";

function AdminQuiz() {
  const [quizs, setQuizs] = useState([]);
  const [allQuiz, setAllQuiz] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [unit, setUnit] = useState("seconds");
  const [quiz, setQuiz] = useState({
    name: "",
    time: "",
  });
  const { categoryid } = useParams();
  const toast = useToast();
  useEffect(() => {
    axios
      .get(`http://localhost:4000/quiz/${categoryid}`)
      .then((res) => {
        setAllQuiz(res.data);
        setQuizs(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = () => {
    if (quiz.name === "" || quiz.time === "") {
      return;
    }

    let timeInSeconds = parseInt(quiz.time, 10);
    if (unit === "minutes") {
      timeInSeconds *= 60;
    } else if (unit === "hours") {
      timeInSeconds *= 3600;
    }

    axios
      .post(`http://localhost:4000/quiz/${categoryid}`, {
        name: quiz.name,
        time: timeInSeconds,
      })
      .then((res) => {
        toast({
          position: "top-right",
          title: "Quiz Created.",
          description: "We've created Quiz for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        axios
          .get(`http://localhost:4000/quiz/${categoryid}`)
          .then((res) => {
            setAllQuiz(res.data);
            setQuizs(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        toast({
          position: "top-right",
          title: err.response.data.message,
          description: "We've not created Quiz for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  const refresh = () => {
    axios
      .get(`http://localhost:4000/quiz/${categoryid}`)
      .then((res) => {
        setAllQuiz(res.data);
        setQuizs(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const handleButtonClick = (inputValue) => {
    if (inputValue === "") {
      setAllQuiz([...quizs]);
    } else {
      const filteredCategories = quizs.filter((category) =>
        category.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setAllQuiz(filteredCategories);
    }
  };

  return (
    <Box>
      <Modal
        size="sm"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        closeOnOverlayClick={false}>
        <ModalOverlay backgroundColor="rgba(0, 0, 0, 0.8)" />
        <ModalContent rounded="base">
          <ModalHeader fontSize={24} fontWeight="medium" color="#666">
            Create new Quiz
          </ModalHeader>
          <ModalCloseButton mt="12px" />
          <ModalBody>
            <FormControl>
              <Box flex="1">
                <Flex gap="10px" flexDir="column">
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    onChange={(e) => {
                      setQuiz((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                    placeholder="Enter Quiz name"
                  />
                  <Flex gap="10px">
                    <Input
                      type="number"
                      id="time"
                      name="time"
                      onChange={(e) =>
                        setQuiz((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }))
                      }
                      placeholder="Enter time for quiz"
                    />
                    <Select value={unit} onChange={handleUnitChange}>
                      <option value="seconds">Seconds</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </Select>
                  </Flex>
                </Flex>
              </Box>
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
            Quizs
          </Box>
          <Button colorScheme="blue" onClick={onOpen}>
            Add Quiz
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
                placeholder="Search for Quiz "
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
          Quiz Categories
        </Box>
        {allQuiz.length > 0 ? (
          <TableContainer shadow="lg" p="20px" rounded="20px">
            <Table variant="simple" colorScheme="gray">
              <TableCaption textTransform="uppercase">Quiz</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Question</Th>
                  <Th>Time</Th>
                  <Th textAlign="end">Update</Th>
                  <Th textAlign="end">Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allQuiz &&
                  allQuiz.map((item) => (
                    <AdminQuizList
                      key={item.id}
                      refresh={refresh}
                      quiz={item}
                    />
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Box textAlign="center">No Quiz</Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminQuiz;
