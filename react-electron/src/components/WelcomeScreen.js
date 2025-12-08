import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Alert,
  CloseButton,
} from '@chakra-ui/react';
import { BookOpen, Info } from 'lucide-react';

export default function WelcomeScreen() {
  const [username, setUsername] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username.trim() === '') {
      setShowError(true);
      return;
    }
    setShowError(false);
    navigate('/instructions');
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(to right, #c8cf9fff, #edf0da)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="4"
      position="relative"
    >

      {showError && (
        <Box
          position="fixed"
          top="32px"
          left="50%"
          zIndex={9999}
          transform="translateX(-50%)"
          w="90%"
          maxW="430px"
        >
          <Alert.Root status="error" borderRadius="md" pr="12" bg="#ff6b6b">
            <Alert.Indicator />
            <Alert.Title color="white">Upišite svoje ime.</Alert.Title>
            <CloseButton
              onClick={() => setShowError(false)}
              position="absolute"
              right="8px"
              top="8px"
              color="white"
            />
          </Alert.Root>
        </Box>
      )}

      <Container maxW="container.md" px={{ base: 4, md: 0 }}>
        <Box
          bg="#f7f7f7ff"
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          boxShadow="2xl"
          w="100%"
          maxW="700px"
          mx="auto"
        >
          <VStack gap={8}>

            <Heading
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              color="#1a202c"
              fontFamily="serif"
              fontWeight="400"
              textAlign="center"
            >
              Dobrodošli!
            </Heading>

            <Box
              bg="#a0b36f"
              borderRadius="lg"
              p="4"
              w={{ base: "100%", md: "80%", lg: "60%" }}
            >
              <Box display="flex" alignItems="flex-start" mb="1" gap="2">
                <BookOpen color="#1a202c" size={28} />
                <Text
                  color="#1a202c"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="bold"
                  lineHeight="1.2"
                >
                  Kratke upute
                </Text>
              </Box>
              <Text color="#1a202c" fontSize={{ base: "sm", md: "md" }}>
                Ocijenit ćete niz koloriziranih slika prema vizualnoj kvaliteti u usporedbi s originalom.
              </Text>
            </Box>

            <Box w={{ base: "100%", md: "80%", lg: "60%" }}>
              <Text
                color="#1a202c"
                mb="2"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="medium"
              >
                Ime korisnika *
              </Text>
              <Input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (showError) setShowError(false);
                }}
                bg="#eef0e4ff"
                size="lg"
                borderRadius="md"
                borderColor="#a0b36f"
              />
            </Box>

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
              onClick={handleSubmit}
              py="6"
            >
              Predaj
            </Button>

            <Box
              border="2px solid"
              borderColor="#a0b36f"
              borderRadius="3xl"
              p="4"
              w={{ base: "100%", md: "90%" }}
              bg="#eef0e4ff"
            >
              <Box display="flex" gap="4" alignItems="flex-start">
                <Info size={40} color="#a0b36f" />
                <Text
                  color="#183455ff"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.6"
                >
                  Nakon predaje otvorit će se stranica s uputama. Pažljivo pročitajte upute jer nakon toga slijedi ocjenjivanje slika.
                </Text>
              </Box>
            </Box>

          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
