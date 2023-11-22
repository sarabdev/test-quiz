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
} from "@chakra-ui/react";
import { TfiSearch } from "react-icons/tfi";
import axios from "axios";
import { useState, useEffect } from "react";
import AdminCategoriesList from "./adminCategoriesList";
function AdminMain() {
  const [categories, setCategories] = useState([]);
  const [allcategories, setAllCategories] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [category, setCategory] = useState("");
  const toast = useToast();
  useEffect(() => {
    axios
      .get(`http://localhost:4000/catagories`)
      .then((res) => {
        setAllCategories(res.data);
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = () => {
    if (category === "") {
      return;
    }
    axios
      .post(`http://localhost:4000/catagories`, { name: category })
      .then((res) => {
        toast({
          position: "top-right",
          title: "Catogary Created.",
          description: "We've created your catagory for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        axios
          .get(`http://localhost:4000/catagories`)
          .then((res) => {
            setAllCategories(res.data);
            setCategories(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        toast({
          position: "top-right",
          title: err.response.data.message,
          description: "We've not created your catagory for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
  };
  const refresh = () => {
    axios
      .get(`http://localhost:4000/catagories`)
      .then((res) => {
        setAllCategories(res.data);
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleButtonClick = (inputValue) => {
    if (inputValue === "") {
      setAllCategories([...categories]);
    } else {
      const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setAllCategories(filteredCategories);
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
            Create new Category
          </ModalHeader>
          <ModalCloseButton mt="12px" />
          <ModalBody>
            <FormControl>
              <Box flex="1">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter Category name"
                />
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
            CATEGORIES
          </Box>
          <Button colorScheme="blue" onClick={onOpen}>
            ADD CATEGORY
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
                placeholder="Search for categories "
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
          Categories
        </Box>
        {allcategories.length > 0 ? (
          <TableContainer boxShadow="xl" p="20px" rounded="20px">
            <Table variant="simple" colorScheme="gray">
              <TableCaption textTransform="uppercase">Categories</TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Quizs</Th>
                  <Th textAlign="end">Update</Th>
                  <Th textAlign="end">Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allcategories &&
                  allcategories.map((item) => (
                    <AdminCategoriesList
                      key={item.id}
                      refresh={refresh}
                      category={item}
                    />
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Box textAlign="center">No Categories</Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminMain;
