import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Textarea,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { MdQuestionAnswer } from "react-icons/md";
import { TagsInput } from "react-tag-input-component";
import { useState } from "react";

function AdminQuestionList({ question, questionNumber, refresh }) {
  const [updateQuestion, setUpdateQuestion] = useState(question.question);
  const [updateSelected, setUpdateSelected] = useState(question.answers);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateQuest = (id) => {
    if (question === "" || updateSelected.length <= 0) {
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
    const questionWords = updateQuestion.split(" ");
    if (
      questionWords.length < 3 ||
      updateSelected.length >= questionWords.length
    ) {
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

    const notPresentInQuestions = updateSelected.filter(
      (word) => !updateQuestion.includes(word)
    );

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
      .patch(`http://localhost:4000/questions/${id}`, {
        question: updateQuestion,
        answers: updateSelected,
      })
      .then((res) => {
        toast({
          position: "top-right",
          title: "Question Updated.",
          description: "We've Update question for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refresh();
        onClose();
      })
      .catch((err) => {
        toast({
          position: "top-right",
          title: err.response.data.message,
          description: "We've not update question for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  const deleteQuestion = (id) => {
    axios
      .delete(`http://localhost:4000/questions/${id}`)
      .then((res) => {
        toast({
          position: "top-right",
          title: "Quiz Updated.",
          description: "We've Delete question for you.",
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
          description: "We've not Deleted quiz for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
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
          <ModalHeader fontSize={24} fontWeight="medium" color="#666">
            Update Question
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
                value={updateQuestion}
                onChange={(e) => setUpdateQuestion(e.target.value)}
              />
              <FormLabel>Answer</FormLabel>
              <TagsInput
                value={updateSelected}
                onChange={setUpdateSelected}
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
              <Button
                colorScheme="blue"
                type="submit"
                onClick={() => {
                  updateQuest(question.id);
                }}>
                Update
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton
              py="12px"
              _expanded={{ bg: "teal.500", color: "white" }}>
              <Box
                display="flex "
                justifyContent="space-between"
                w="100%"
                alignItems="center">
                <Box display="flex" alignItems="center" gap="10px">
                  <Box fontSize="20px" fontWeight="600">
                    <MdQuestionAnswer />
                  </Box>
                  <Box as="span" flex="1" textAlign="left">
                    Question no {questionNumber + 1}
                  </Box>
                </Box>
                <AccordionIcon />
              </Box>
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex flexDir="column" gap="10px">
              <Box>
                <Box fontWeight="600" fontSize="20px">
                  Question
                </Box>
                {question.question}
              </Box>
              <Box display="flex" flexDir="column">
                <Box fontWeight="600" fontSize="20px">
                  Answers
                </Box>
                <Box display="flex" gap="20px">
                  {question.answers.map((answer, index) => {
                    return <Box key={index}>{answer}</Box>;
                  })}
                </Box>
              </Box>
              <Box display="flex" gap="10px">
                <Button
                  leftIcon={<EditIcon />}
                  colorScheme="teal"
                  variant="solid"
                  onClick={() => {
                    onOpen();
                  }}>
                  Update
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  colorScheme="teal"
                  variant="solid"
                  onClick={() => {
                    deleteQuestion(question.id);
                  }}>
                  Delete
                </Button>
              </Box>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}

export default AdminQuestionList;
