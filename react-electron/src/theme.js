import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#edf0da",
        color: "gray.800",
      },
    },
  },
});

export default theme;
