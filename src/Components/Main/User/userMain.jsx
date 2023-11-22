import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  DrawerOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { BiSolidCategory } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import { RiFlashlightFill } from "react-icons/ri";
import { useState, useEffect } from "react";

import UserCategoryList from "./userCategoryList";

export default function UserMain() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [categories, setCategories] = useState([]);
  const [quiz, setQuiz] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/catagories`)
      .then((res) => {
        setCategories(res.data);
        setQuiz(res.data[0].quiz);
      })
      .catch((err) => console.log(err));
  }, []);
  const quiztodisplay = (quiz) => {
    setQuiz(quiz);
  };

  return (
    <Box
      as="section"
      bg={useColorModeValue("gray.50", "gray.700")}
      minH="100vh">
      <SidebarContent
        categorie={categories}
        quiztodisplay={quiztodisplay}
        display={{ base: "none", md: "unset" }}
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent
            quiztodisplay={quiztodisplay}
            categorie={categories}
            w="full"
            borderRight="none"
          />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          w="full"
          px="4"
          d={{ base: "flex", md: "none" }}
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          bg={useColorModeValue("white", "gray.800")}
          justify={{ base: "space-between", md: "flex-end" }}
          boxShadow="lg"
          h="14">
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={onOpen}
            icon={<FiMenu />}
            size="md"
          />

          <Flex align="center">
            <Icon as={RiFlashlightFill} h={8} w={8} />
          </Flex>
        </Flex>

        <UserCategoryList quiz={quiz} />
      </Box>
    </Box>
  );
}

const SidebarContent = ({ quiztodisplay, ...props }) => (
  <Box
    as="nav"
    pos="fixed"
    top="0"
    left="0"
    zIndex="sticky"
    h="full"
    overflowX="hidden"
    overflowY="auto"
    bg={useColorModeValue("white", "gray.800")}
    borderColor={useColorModeValue("inherit", "gray.700")}
    borderRightWidth="1px"
    w="60"
    {...props}>
    <VStack h="full" w="full" alignItems="flex-start" justify="space-between">
      <Box w="full">
        <Flex px="4" py="5" align="center">
          <Icon as={RiFlashlightFill} h={8} w={8} />
          <Text
            fontSize="2xl"
            ml="2"
            color={useColorModeValue("brand.500", "white")}
            fontWeight="semibold">
            QuizTime
          </Text>
        </Flex>

        <Flex
          direction="column"
          as="nav"
          fontSize="md"
          color="gray.600"
          aria-label="Main Navigation">
          {props.categorie ? (
            <Box
              display="flex"
              alignItems="center"
              gap="10px"
              ml="25px"
              fontSize="20px"
              fontWeight="600"
              mb="15px">
              <BiSolidCategory />
              Categories
            </Box>
          ) : (
            <Box fontSize="20px" fontWeight="600">
              No Categories
            </Box>
          )}

          {props.categorie &&
            props.categorie.map((category) => {
              return (
                <Box
                  key={category.id}
                  onClick={() => {
                    quiztodisplay(category.quiz);
                  }}>
                  <NavItem>
                    <Box ml="12px">{category.name} </Box>
                  </NavItem>
                </Box>
              );
            })}
        </Flex>
      </Box>
    </VStack>
  </Box>
);

const NavItem = (props) => {
  const color = useColorModeValue("gray.600", "gray.300");

  const { icon, children } = props;
  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      color={useColorModeValue("inherit", "gray.400")}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.900"),
        color: useColorModeValue("gray.900", "gray.200"),
      }}>
      {icon && (
        <Icon
          mx="2"
          boxSize="4"
          _groupHover={{
            color: color,
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};
