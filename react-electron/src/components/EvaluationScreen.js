import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image as ChakraImage,
} from '@chakra-ui/react';
import { Lightbulb, ArrowRight } from 'lucide-react';

const imagePaths = [
  '/IMG_03.bmp',
  '/IMG_09.bmp',
  '/IMG_21.bmp'
];

export default function EvaluationScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratingA, setRatingA] = useState(3);
  const [ratingB, setRatingB] = useState(3);
  const [isPortrait, setIsPortrait] = useState(false);

  const ratings = [
    { value: 1, label: 'Jako loše' },
    { value: 2, label: 'Loše' },
    { value: 3, label: 'Srednje' },
    { value: 4, label: 'Dobro' },
    { value: 5, label: 'Izvrsno' }
  ];

  const handleNext = () => {
    console.log('Ratings:', { A: ratingA, B: ratingB, slika: imagePaths[currentIndex] });
    setRatingA(3);
    setRatingB(3);
    setCurrentIndex((cur) => (cur + 1) % imagePaths.length);
  };

  const currentImg = imagePaths[currentIndex];
  useEffect(() => {
    const img = new Image();
    img.src = currentImg;
    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, [currentImg]);

  const RatingScale = ({ side, rating, setRating }) => {
    return (
      <Box position="relative" display="flex" flexDirection="column" alignItems="center">
        <Box
          position="absolute"
          left="50%"
          top="0"
          bottom="0"
          w="0.25rem"
          bg="#eef0e4ff"
          transform="translateX(-50%)"
        />

        <VStack gap="0" position="relative" py="1.5rem">
          {ratings.map((item) => (
            <Box key={item.value} position="relative" h="5.625rem" display="flex" alignItems="center">
              <Box
                position="absolute"
                left={side === 'left' ? 'auto' : '-2.5rem'}
                right={side === 'left' ? '-2.5rem' : 'auto'}
                w="2.5rem"
                h="0.1875rem"
                bg="#eef0e4ff"
              />
              <Box
                as="button"
                onClick={() => setRating(item.value)}
                w="3.75rem"
                h="3.75rem"
                borderRadius="full"
                bg={rating === item.value ? '#2c5282' : '#eef0e4ff'}
                border="0.25rem solid"
                borderColor={rating === item.value ? '#eef0e4ff' : '#2c5282'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: 'scale(1.15)',
                  bg: rating === item.value ? '#2c5282' : '#d4d7c5',
                  boxShadow: '0 0.25rem 0.75rem rgba(0,0,0,0.3)'
                }}
                position="relative"
                zIndex="2"
              />
            </Box>
          ))}
        </VStack>
      </Box>
    );
  };

  const RatingLabels = () => (
    <VStack gap="0" py="1.5rem">
      {ratings.map((item) => (
        <Box
          key={item.value}
          h="5.625rem"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px="1.5rem"
        >
          <Box
            bg="teal.700"
            px="1.5rem"
            py="0.75rem"
            borderRadius="lg"
            minW="11.25rem"
            textAlign="center"
            boxShadow="xl"
          >
            <Text color="#eef0e4ff" fontWeight="bold" fontSize="2xl" mb="0.25rem">
              {item.value}
            </Text>
            <Text color="#eef0e4ff" fontSize="xl" fontWeight="medium">
              {item.label}
            </Text>
          </Box>
        </Box>
      ))}
    </VStack>
  );


  return (
    <Box minH="100vh" bg="#edf0da" py="2rem" px="1.5rem">
      <Container maxW="100vw" w="100rem">
        <VStack gap="1.5rem" align="stretch">
          {/* Header */}
          <Box>
            <Heading fontSize="5xl" color="#183455ff" fontWeight="bold" mb="1rem">
              Par {currentIndex + 1} od {imagePaths.length}
            </Heading>
            <HStack gap="0.75rem" color="#183455ff">
              <Lightbulb size={30} />
              <Text fontSize="2xl" fontWeight="medium">
                Ocijenite obje slike nezavisno, ne znajući koja je original.
              </Text>
            </HStack>
          </Box>

          {/* Main Content */}
          <Box
            bg="#0d5e4a"
            borderRadius="2xl"
            p="3rem"
            boxShadow="2xl"
          >
            <HStack gap="3rem" align="center" justify="center">
              {/* Image A */}
              <VStack gap="1.25rem" flex="1" maxW="30rem">
                <Box
                  bg="#eef0e4ff"
                  borderRadius="2xl"
                  w="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  overflow="hidden"
                  boxShadow="lg"
                  maxW={isPortrait ? "25rem" : "30rem"}
                  maxH={isPortrait ? "60vh" : "70vh"}
                >
                  <ChakraImage
                    src={currentImg}
                    alt="Slika A"
                    objectFit="contain"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <Box
                  bg="teal.700"
                  w="80%"
                  py="1rem"
                  borderRadius="xl"
                  textAlign="center"
                  boxShadow="md"
                >
                  <Text color="#eef0e4ff" fontSize="3xl" fontWeight="bold">
                    Slika A
                  </Text>
                </Box>
              </VStack>

              {/* Scale A */}
              <Box display="flex" alignItems="center">
                <VStack gap="0">
                  <Text color="#eef0e4ff" fontSize="4xl" fontWeight="bold" mb="1rem">
                    A
                  </Text>
                  <RatingScale side="left" rating={ratingA} setRating={setRatingA} />
                </VStack>
              </Box>

              {/* Rating Labels */}
              <Box display="flex" alignItems="center" mt="20">
                <RatingLabels />
              </Box>

              {/* Scale B */}
              <Box display="flex" alignItems="center">
                <VStack gap="0">
                  <Text color="#eef0e4ff" fontSize="4xl" fontWeight="bold" mb="1rem">
                    B
                  </Text>
                  <RatingScale side="right" rating={ratingB} setRating={setRatingB} />
                </VStack>
              </Box>

              {/* Image B */}
              <VStack gap="1.25rem" flex="1" maxW="30rem">
                <Box
                  bg="#eef0e4ff"
                  borderRadius="2xl"
                  w="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  overflow="hidden"
                  boxShadow="lg"
                  maxW={isPortrait ? "25rem" : "30rem"}
                  maxH={isPortrait ? "60vh" : "70vh"}
                >
                  <ChakraImage
                    src={currentImg}
                    alt="Slika A"
                    objectFit="contain"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <Box
                  bg="teal.700"
                  w="100%"
                  py="1rem"
                  borderRadius="xl"
                  textAlign="center"
                  boxShadow="md"
                >
                  <Text color="#eef0e4ff" fontSize="3xl" fontWeight="bold">
                    Slika B
                  </Text>
                </Box>
              </VStack>
            </HStack>
          </Box>

          <Box display="flex" justifyContent="flex-end">
             <Button
                w="25%"
                bg="#3182ce"
                color="#eef0e4ff"
                size="lg"
                fontWeight="bold"
                fontSize="xl"
                borderRadius="2xl"
                _hover={{ bg: '#2c5282' }}
                _active={{ bg: '#2c5282' }}
                onClick={handleNext}
                py="6"
                mb="3"
              >
                Sljedeći par <ArrowRight size={30} />
              </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
