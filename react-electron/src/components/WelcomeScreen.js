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
import { BookOpen, Info, User, Settings } from 'lucide-react';

export default function WelcomeScreen() {
  const [username, setUsername] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (username.trim() === '') {
      setShowError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();

      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.name);
      console.log('✅ Korisnik uspješno spremljen');

      navigate("/instructions");
    } catch (err) {
      console.error("Backend error:", err);
      setShowError(true);
    }
  };

  const handleGoToAdmin = () => {
    navigate("/admin");
  };

  const AdminIcon = () => (
    <Box position="relative" w="18px" h="18px">
      <User size={18} />
      <Box position="absolute" bottom="-4px" right="-6px">
        <Settings size={12} />
      </Box>
    </Box>
  );

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
      <Button
        onClick={handleGoToAdmin}
        position="absolute"
        top={{ base: "8px", sm: "12px", md: "24px" }}
        right={{ base: "50%", sm: "32px", md: "56px" }}
        transform={{ base: "translateX(50%)", sm: "none" }}
        zIndex={10}
        size={{ base: "xs", md: "sm" }}
        px={{ base: 3, md: 4 }}
        bg="#a0b36f"
        color="black"
        borderRadius="full"
        _hover={{ bg: "#7b904f", transform: { base: "translateX(50%) scale(1.05)", sm: "scale(1.05)" } }}
        _active={{ bg: "#7b904f", transform: { base: "translateX(50%) scale(0.98)", sm: "scale(0.98)" } }}
      >
        <AdminIcon />
      </Button>
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
