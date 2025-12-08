import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  List,
} from '@chakra-ui/react';
import { BookOpen, Clock, AlertCircle, Settings } from 'lucide-react';

export default function InstructionScreen() {
  const navigate = useNavigate();
  const handleStartTest = () => {
    navigate('/evaluation');
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(to right, #c8cf9fff, #edf0da)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 4, md: 8 }}
    >
      <Container maxW={{ base: "100%", md: "80%", lg: "60%" }} px={{ base: 4, md: 0 }}>
        <Box
          bg="#f7f7f7ff"
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          boxShadow="2xl"
        >
          <VStack gap={{ base: 8, md: 10 }} align="stretch">

            <Box display="flex" alignItems="center" gap="3" mb="2">
              <BookOpen color="#a0b36f" size={40} />
              <Heading
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                color="#1a202c"
                fontWeight="bold"
              >
                Upute
              </Heading>
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap="3" mb="3">
                <Box
                  bg="#a0b36f"
                  color="white"
                  borderRadius="full"
                  w={{ base: "28px", md: "32px" }}
                  h={{ base: "28px", md: "32px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                >
                  1
                </Box>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  color="#1a202c"
                  fontWeight="bold"
                >
                  Pregled protokola
                </Heading>
              </Box>

              <Text
                color="#1a202c"
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                mb="4"
              >
                Protokol koji se koristi je <strong>DSCQS</strong> (Double Stimulus Continuous Quality Scale).
              </Text>

              <Text
                color="#1a202c"
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                fontWeight="bold"
                mb="4"
              >
                Kako funkcionira:
              </Text>

              <List.Root
                color="#1a202c"
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                gap={{ base: 3, md: 4 }}
                ml="6"
              >
                <List.Item>
                  Vidjet ćete 2 slike jednu pored druge — jedna je original, druga je kolorizirana.
                </List.Item>
                <List.Item>
                  Nećete znati koja je koja.
                </List.Item>
                <List.Item>
                  Ocijenite svaku sliku na skali od 1 do 5.
                </List.Item>
                <List.Item>
                  Razlika između ocjena pokazuje utjecaj obrade na kvalitetu slike.
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap="3" mb="3">
                <Box
                  bg="#a0b36f"
                  color="white"
                  borderRadius="full"
                  w={{ base: "28px", md: "32px" }}
                  h={{ base: "28px", md: "32px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                >
                  2
                </Box>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  color="#1a202c"
                  fontWeight="bold"
                >
                  Skala kvalitete
                </Heading>
              </Box>

              <Text
                color="#1a202c"
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                mb="3"
              >
                Koristit ćete sljedeću skalu kvalitete:
              </Text>

              <VStack gap={{ base: 2, md: 3 }} align="stretch" ml="6">
                {[
                  ["1 - Jako loše", "Iznimno loša kvaliteta s velikim nedostatcima"],
                  ["2 - Loše", "Ispodprosječna kvaliteta sa značajnim nedostatcima"],
                  ["3 - Srednje", "Prihvatljiva kvaliteta s uočljivim nedostatcima"],
                  ["4 - Dobro", "Dobra kvaliteta s minimalnim nedostatcima"],
                  ["5 - Izvrsno", "Izvanredna kvaliteta bez nedostataka"]
                ].map(([title, desc]) => (
                  <Box display="flex" gap="3" fontSize={{ base: "md", md: "lg", lg: "xl" }} key={title}>
                    <Text color="#1a202c" fontWeight="bold" minW="100px">
                      {title}
                    </Text>
                    <Text color="#1a202c">{desc}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap="3" mb="3">
                <Box
                  bg="#a0b36f"
                  color="white"
                  borderRadius="full"
                  w={{ base: "28px", md: "32px" }}
                  h={{ base: "28px", md: "32px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize={{ base: "md", md: "lg" }}
                >
                  3
                </Box>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  color="#1a202c"
                  fontWeight="bold"
                >
                  Napomene
                </Heading>
              </Box>

              <VStack gap={{ base: 3, md: 4 }} align="stretch" ml="6">
                {[
                  [Clock, "Odvojite dovoljno vremena za ocjenjivanje svakog uzorka."],
                  [AlertCircle, "Jednom kad započnete, ne možete pauzirati ili se vratiti natrag."],
                  [Settings, "Vaši se odgovori automatski spremaju nakon svake procjene."]
                ].map(([Icon, text], i) => (
                  <Box display="flex" gap="3" alignItems="flex-start" key={i}>
                    <Icon
                      color="#a0b36f"
                      size={24}
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    <Text color="#1a202c" fontSize={{ base: "md", md: "lg", lg: "xl" }}>
                      {text}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>

            <Box display="flex" justifyContent="center" mt="4">
              <Button
                w={{ base: "60%", md: "40%", lg: "30%" }}
                bg="#a0b36f"
                color="black"
                size="lg"
                fontWeight="bold"
                fontSize={{ base: "lg", md: "xl" }}
                borderRadius="2xl"
                _hover={{ 
                  bg: "#7b904f",
                  transform: "scale(1.05)",
                  boxShadow: "md",
                }}
                _active={{ 
                  bg: "#7b904f",
                  transform: "scale(0.98)",
                }}
                onClick={handleStartTest}
                py="6"
                mb="3"
              >
                Započni test
              </Button>
            </Box>

          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
