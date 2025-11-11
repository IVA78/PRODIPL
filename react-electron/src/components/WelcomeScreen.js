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
    console.log('Submitted username:', username);
    navigate('/instructions');
  };

  return (
    <Box minH="100vh" bg="#edf0da" display="flex" alignItems="center" justifyContent="center" p="4" position="relative">
      {showError && (
        <Box
          position="fixed"
          top="32px"
          left="50%"
          zIndex={9999}
          style={{ transform: 'translateX(-50%)' }}
          width="auto"
          maxW="430px"
          minW="280px"
        >
          <Alert.Root status="error" borderRadius="md" pr="12">
            <Alert.Indicator />
            <Alert.Title>Upišite svoje ime.</Alert.Title>
            <CloseButton
              onClick={() => setShowError(false)}
              position="absolute"
              right="8px"
              top="8px"
              color="inherit"
            />
          </Alert.Root>
        </Box>
      )}

      <Container maxW="container.sm">
        <Box
          h="60vh"
          bg="#0d5e4a"
          borderRadius="2xl"
          p={["6", "8"]}
          boxShadow="2xl"
          maxW="60%"
          mx="auto"
        >
          <VStack gap="6">
            <Heading
              fontSize="6xl"
              color="#fff"
              fontFamily="serif"
              fontWeight="400"
              letterSpacing="wide"
              mb="3.5"
            >
              Dobrodošli!
            </Heading>

            <Box bg="#eef0e4ff" borderRadius="lg" p="4" w="45%" mb="2.5">
              <Box display="flex" alignItems="flex-start" mb="1" gap="2">
                <BookOpen color="#2c5282" size={32} />
                <Text color="#2c5282" fontSize="xl" fontWeight="bold" lineHeight="1.2">
                  Kratke upute
                </Text>
              </Box>
              <Text color="#2c5282" fontSize="md" lineHeight="1.6">
                Ocijeniti ćete niz koloriziranih slika prema vizualnoj kvaliteti u usporedbi s originalom.
              </Text>
            </Box>

            <Box w="40%">
              <Text color="#eef0e4ff" mb="2" fontSize="xl" fontWeight="medium">
                Ime korisnika *
              </Text>
              <Input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (showError) setShowError(false);
                }}
                bg="#eef0e4ff"
                placeholder=""
                size="lg"
                borderRadius="md"
              />
            </Box>

            <Button
              w="25%"
              bg="#3182ce"
              color="#eef0e4ff"
              size="lg"
              fontWeight="bold"
              fontSize="xl"
              borderRadius="2xl"
              border="5px solid"
              borderColor="#eef0e4ff"
              _hover={{ bg: '#2c5282' }}
              _active={{ bg: '#2c5282' }}
              onClick={handleSubmit}
              py="6"
              mb="3"
            >
              Predaj
            </Button>

            <Box border="2px solid" borderColor="#e2e8f0" borderRadius="3xl" pt="3" pl="3" w="75%">
              <Box display="flex" gap="4" alignItems="flex-start">
                <Info size={50} color="#e2e8f0" />
                <Text color="#e2e8f0" fontSize="xl" lineHeight="1.6">
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
