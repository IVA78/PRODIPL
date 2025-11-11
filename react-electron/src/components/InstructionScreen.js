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
    console.log('Starting test...');
    navigate('/evaluation');
  };

  return (
    <Box minH="100vh" bg="#edf0da" display="flex" alignItems="center" justifyContent="center" p="8">
      <Container maxW="60%">
        <Box
          bg="#0d5e4a"
          borderRadius="2xl"
          p={["6", "8"]}
          boxShadow="2xl"
        >
          <VStack gap="10" align="stretch">
            <Box display="flex" alignItems="center" gap="3" mb="2">
              <BookOpen color="#eef0e4ff" size={50} />
              <Heading
                fontSize="5xl"
                color="#eef0e4ff"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                Upute
              </Heading>
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap="3" mb="3">
                <Box
                  bg="#eef0e4ff"
                  color="#0d5e4a"
                  borderRadius="full"
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  1
                </Box>
                <Heading fontSize="4xl" color="#eef0e4ff" fontWeight="bold">
                  Pregled protokola
                </Heading>
              </Box>
              
              <Text color="#eef0e4ff" fontSize="xl" mb="4">
                Protokol koji se koristi je <strong>DSCQS</strong> (Double Stimulus Continuous Quality Scale).
              </Text>

              <Text color="#eef0e4ff" fontSize="xl" fontWeight="bold" mb="4">
                Kako funkcionira:
              </Text>

              <List.Root color="#eef0e4ff" fontSize="xl" gap="4" ml="6">
                <List.Item>
                  Vidjet ćete 2 slike jednu pored druge, jedna slika je original, a druga je kolorizirana verzija
                </List.Item>
                <List.Item>
                  Nećete znati koja je koja
                </List.Item>
                <List.Item>
                  Pažljivo pogledajte slike te ocijenite kvalitetu svake od njih na skali od 1 do 5
                </List.Item>
                <List.Item>
                  Razlika između ocjena pokazat će nam koliko je obrada utjecala na kvalitetu slike
                </List.Item>
              </List.Root>
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap="3" mb="3">
                <Box
                  bg="#eef0e4ff"
                  color="#0d5e4a"
                  borderRadius="full"
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  2
                </Box>
                <Heading fontSize="4xl" color="#eef0e4ff" fontWeight="bold">
                  Skala kvalitete
                </Heading>
              </Box>

              <Text color="#eef0e4ff" fontSize="xl" mb="3">
                Koristit ćete sljedeću skalu kvalitete:
              </Text>

              <VStack gap="2" align="stretch" ml="6">
                <Box display="flex" gap="3" fontSize="xl">
                  <Text color="#eef0e4ff" fontWeight="bold" minW="100px">1 - Jako loše</Text>
                  <Text color="#eef0e4ff">Iznimno loša kvaliteta sa velikim nedostatcima</Text>
                </Box>
                <Box display="flex" gap="3" fontSize="xl">
                  <Text color="#eef0e4ff" fontWeight="bold" minW="100px">2 - Loše</Text>
                  <Text color="#eef0e4ff">Ispodprosječna kvaliteta sa značajnim nedostatcima</Text>
                </Box>
                <Box display="flex" gap="3" fontSize="xl">
                  <Text color="#eef0e4ff" fontWeight="bold" minW="100px">3 - Srednje</Text>
                  <Text color="#eef0e4ff">Prihvatljiva kvaliteta s manjim, ali uočljivim nedostatcima</Text>
                </Box>
                <Box display="flex" gap="3" fontSize="xl">
                  <Text color="#eef0e4ff" fontWeight="bold" minW="100px">4 - Dobro</Text>
                  <Text color="#eef0e4ff">Prihvatljiva kvaliteta s minimalnim nedostatcima</Text>
                </Box>
                <Box display="flex" gap="3" fontSize="xl">
                  <Text color="#eef0e4ff" fontWeight="bold" minW="100px">5 - Izvrsno</Text>
                  <Text color="#eef0e4ff">Izvanredna kvaliteta bez nedostataka</Text>
                </Box>
              </VStack>
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap="3" mb="3">
                <Box
                  bg="#eef0e4ff"
                  color="#0d5e4a"
                  borderRadius="full"
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  3
                </Box>
                <Heading fontSize="4xl" color="#eef0e4ff" fontWeight="bold">
                  Napomene
                </Heading>
              </Box>

              <VStack gap="3" align="stretch" ml="6">
                <Box display="flex" gap="3" alignItems="flex-start">
                  <Clock color="#eef0e4ff" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <Text color="#eef0e4ff" fontSize="xl">
                    Odvojite dovoljno vremena za ocjenjivanje svakog uzorka. Procjena kvalitete zahtijeva pažljivu pozornost.
                  </Text>
                </Box>

                <Box display="flex" gap="3" alignItems="flex-start">
                  <AlertCircle color="#eef0e4ff" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <Text color="#eef0e4ff" fontSize="xl">
                    Jednom kad započnete ne možete pauzirati ili se vratiti natrag.
                  </Text>
                </Box>

                <Box display="flex" gap="3" alignItems="flex-start">
                  <Settings color="#eef0e4ff" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <Text color="#eef0e4ff" fontSize="xl">
                    Vaši odgovori se automatski spremaju nakon svake procjene.
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Box display="flex" justifyContent="center" mt="4">
              <Button
                w="30%"
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
