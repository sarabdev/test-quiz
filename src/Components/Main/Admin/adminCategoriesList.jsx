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
  useToast,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

function AdminCategoriesList({ category, refresh }) {
  const navigation = useNavigate();
  const toast = useToast();
  const [updateCategoryname, setUpdateCategoryname] = useState("");

  const updateCategory = (id) => {
    if (updateCategoryname === "") {
      return toast({
        position: "top-right",
        title: "Enter the value",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    axios
      .patch(`http://localhost:4000/catagories/${id}`, {
        name: updateCategoryname,
      })
      .then((res) => {
        toast({
          position: "top-right",
          title: "Catogary Created.",
          description: "We've Update catagory for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refresh();
        setUpdateCategoryname("");
      })
      .catch((err) => {
        toast({
          position: "top-right",
          title: err.response.data.message,
          description: "We've not update  catagory for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  const deleteCategory = (id) => {
    axios
      .delete(`http://localhost:4000/catagories/${id}`)
      .then((res) => {
        toast({
          position: "top-right",
          title: "Catogary Deleted.",
          description: "We've Deleted catagory for you.",
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
          description: "We've not delete  catagory for you.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(err);
      });
  };

  return (
    <Tr
      _hover={{ boxShadow: "lg", rounded: "10px" }}
      py="5px"
      key={category.id}>
      <Td
        cursor="pointer"
        onClick={() => {
          navigation(`${category.id}/quiz`);
        }}>
        {category.name}
      </Td>
      <Td
        cursor="pointer"
        onClick={() => {
          navigation(`${category.id}/quiz`);
        }}>
        {category.quiz.length}
      </Td>
      <Td textAlign="end">
        <Popover placement="auto">
          <PopoverTrigger>
            <EditIcon cursor="pointer" />
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Edit Category</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Stack spacing={4}>
                  <Input
                    type="text"
                    placeholder="Enter name"
                    value={updateCategoryname}
                    onChange={(e) => {
                      setUpdateCategoryname(e.target.value);
                    }}
                  />

                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      updateCategory(category.id);
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
            deleteCategory(category.id);
          }}
          colorScheme="teal"
          _hover={{ bg: "red.500" }}>
          <AiOutlineDelete />
        </Button>
      </Td>
    </Tr>
  );
}

export default AdminCategoriesList;
