import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router";

function Header() {
  return (
    <Box>
      <Box bg="gray.200" color="black" p="10px" w="100%">
        <Box fontSize="26px" fontWeight="500">
          Admin
        </Box>
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Header;
