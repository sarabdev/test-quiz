import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import QuizImage from "../../../assests/quiz.png";

function UserCategoryList(props) {
  const navigate = useNavigate();
  return (
    <Box
      as="main"
      p={{ base: 4, lg: 6, xl: 14 }}
      minH="30rem"
      bg={useColorModeValue("auto", "gray.800")}>
      <Container
        bg="white"
        boxShadow="lg"
        rounded="20px"
        maxW="6xl"
        p={{ base: 8, md: 12 }}>
        <Flex
          flexWrap="wrap"
          justifyContent="space-around"
          gap="25px"
          columnGap="20px"
          spacing={10}
          mb={4}>
          {props.quiz.length > 0 ? (
            props.quiz.map((item) => {
              return (
                <Box
                  w="320px"
                  key={item.id}
                  p={6}
                  rounded="lg"
                  display="flex"
                  gap="10px"
                  justifyContent="space-between"
                  textAlign="center"
                  flexDir="column"
                  border="1px solid"
                  pos="relative"
                  bg="#EDF2F7"
                  _hover={{
                    boxShadow:
                      "0 4px 6px rgba(160, 174, 192, 0.6), 0 4px 6px rgba(9, 17, 28, 0.4)",
                  }}>
                  <Flex
                    p={2}
                    w="max-content"
                    color="white"
                    bgGradient="linear(to-br, #228be6, #15aabf)"
                    rounded="md"
                    marginInline="auto"
                    pos="absolute"
                    left={0}
                    right={0}
                    top="-1.5rem"
                    boxShadow="lg">
                    <Image src={QuizImage} />
                  </Flex>
                  <Box
                    fontWeight="semibold"
                    fontSize={{ base: "large", lg: "xl", xl: "2xl" }}
                    mt={6}>
                    {item.name}
                  </Box>
                  <Text fontSize="md" mt={4}>
                    Do {item.questions ? ` ${item.questions.length} ` : " 0 "}
                    questions in {item.time} seconds
                  </Text>
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      navigate(`quiz/${item.id}`);
                    }}>
                    Start Quiz
                  </Button>
                </Box>
              );
            })
          ) : (
            <Box fontSize="24px" fontWeight="600">
              No Quiz
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

export default UserCategoryList;
