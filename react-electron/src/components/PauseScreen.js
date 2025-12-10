import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  Circle,
} from "@chakra-ui/react";
import { Settings, Info } from "lucide-react";

function PauseScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completedPairs, totalPairs, nextIndex } = location.state || { 
    completedPairs: 0, 
    totalPairs: 20,
    nextIndex: 0
  };
  
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      navigate("/evaluation", {
        state: { currentIndex: nextIndex }
      });
    }
  }, [countdown, navigate, nextIndex]);

  const handleResume = () => {
    navigate("/evaluation", {
      state: { currentIndex: nextIndex }
    });
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(to right, #c8cf9fff, #edf0da)" 
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "1rem", md: "2rem" }}
    >
      <Container maxW="600px" w="100%">
        <VStack gap={{ base: "2rem", md: "3rem" }} align="center">
          <Circle
            size={{ base: "120px", md: "160px", lg: "180px" }}
            bg="white"
            border="6px solid"
            borderColor="#a0b36f"
            boxShadow="2xl"
          >
            <Text
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
              fontWeight="bold"
              color="#7b904f"
            >
              {countdown}
            </Text>
          </Circle>

          <VStack gap={{ base: "1rem", md: "1.5rem" }} w="100%">
            <Box
              bg="white"
              w="100%"
              py={{ base: "1rem", md: "1.25rem" }}
              px={{ base: "1.5rem", md: "2rem" }}
              borderRadius="xl"
              boxShadow="lg"
              border="3px solid"
              borderColor="#a0b36f"
            >
              <Box display="flex" alignItems="center" gap="1rem">
                <Settings size={24} color="#7b904f" />
                <Text
                  color="#1a202c"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="medium"
                >
                  Prešli ste {completedPairs} od {totalPairs} parova.
                </Text>
              </Box>
            </Box>

            <Box
              bg="white"
              w="100%"
              py={{ base: "1rem", md: "1.25rem" }}
              px={{ base: "1.5rem", md: "2rem" }}
              borderRadius="xl"
              boxShadow="lg"
              border="3px solid"
              borderColor="#a0b36f"
            >
              <Box display="flex" alignItems="center" gap="1rem">
                <Info size={24} color="#7b904f" />
                <Text
                  color="#1a202c"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="medium"
                >
                  Nastavite odmah ili pričekajte 5 sekundi.
                </Text>
              </Box>
            </Box>
          </VStack>

          <Button
            w={{ base: "100%", md: "80%" }}
            bg="#a0b36f"
            color="black"
            size="lg"
            fontWeight="bold"
            fontSize={{ base: "lg", md: "xl" }}
            borderRadius="2xl"
            py={{ base: "6", md: "7" }}
            boxShadow="lg"
            _hover={{
              bg: "#7b904f",
              transform: "scale(1.05)",
              boxShadow: "xl",
            }}
            _active={{
              bg: "#7b904f",
              transform: "scale(0.98)",
            }}
            onClick={handleResume}
          >
            Nastavi odmah
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

export default PauseScreen;