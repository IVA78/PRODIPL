import React from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { Award, Clock } from "lucide-react";

function SummaryScreen() {
  const location = useLocation();
  const { totalPairs } = location.state || { totalPairs: 20 };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(to right, #c8cf9fff, #edf0da)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "1rem", md: "2rem" }}
      py={{ base: "2rem", md: "3rem" }}
    >
      <Container maxW="700px" w="100%">
        <VStack gap={{ base: "2rem", md: "2.5rem" }} align="center">
          <Heading
            fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
            color="#1a202c"
            fontWeight="bold"
            textAlign="center"
            mb={{ base: "1rem", md: "1.5rem" }}
          >
            Hvala na sudjelovanju!
          </Heading>

          <Box
            bg="#fff"
            w="100%"
            py={{ base: "1.5rem", md: "2rem" }}
            px={{ base: "1.5rem", md: "2.5rem" }}
            borderRadius="2xl"
            boxShadow="2xl"
            border="4px solid"
            borderColor="#a0b36f"
          >
            <VStack gap="0.75rem" align="center">
              <Award size={40} color="#7b904f" strokeWidth={2.5} />
              <Text
                color="#1a202c"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="semibold"
                textAlign="center"
                lineHeight="1.6"
              >
                Ocijenili ste{" "}
                <Text as="span" color="#193599ff" fontWeight="bold">
                  {totalPairs}
                </Text>{" "}
                parova slika.
              </Text>
              <Text
                color="#1a202c"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="semibold"
                textAlign="center"
                lineHeight="1.6"
              >
                Broj parova s istim ocjenama je{" "}
                <Text as="span" color="#193599ff" fontWeight="bold">
                  2
                </Text>.
              </Text>
            </VStack>
          </Box>

          <Box
            bg="#fff"
            w="100%"
            py={{ base: "1.5rem", md: "2rem" }}
            px={{ base: "1.5rem", md: "2.5rem" }}
            borderRadius="2xl"
            boxShadow="2xl"
            border="4px solid"
            borderColor="#a0b36f"
          >
            <VStack gap="0.75rem" align="center">
              <Clock size={40} color="#7b904f" strokeWidth={2.5} />

              <VStack gap="0.2rem">
                <Text
                  color="#1a202c"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="semibold"
                  textAlign="center"
                  lineHeight="1.6"
                >
                  Prosječno vrijeme odlučivanja
                </Text>
                <Text
                  color="#1a202c"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="semibold"
                  textAlign="center"
                  lineHeight="1.6"
                >
                  po paru je{" "}
                  <Text as="span" color="#193599ff" fontWeight="bold">
                    25 sekundi
                  </Text>.
                </Text>
              </VStack>

              <Box h="0.75rem" />

              <VStack gap="0.2rem">
                <Text
                  color="#1a202c"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="semibold"
                  textAlign="center"
                  lineHeight="1.6"
                >
                  Cjelokupna evaluacija trajala je
                </Text>
                <Text
                  color="#1a202c"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="semibold"
                  textAlign="center"
                  lineHeight="1.6"
                >
                  <Text as="span" color="#193599ff" fontWeight="bold">
                    6 minuta
                  </Text>.
                </Text>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default SummaryScreen;
