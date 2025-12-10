import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image as ChakraImage,
  AspectRatio,
} from "@chakra-ui/react";
import { Lightbulb, ArrowRight, CheckCircle } from "lucide-react";

const imagePaths = ["/IMG_03.bmp", "/IMG_09.bmp", "/IMG_21.bmp"];

export default function EvaluationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentIndex = location.state?.currentIndex || 0;
  
  const [ratingA, setRatingA] = useState(null);
  const [ratingB, setRatingB] = useState(null);
  const [isPortrait, setIsPortrait] = useState(false);

  const isLastPair = currentIndex === imagePaths.length - 1;

  const handleNext = () => {
    if (ratingA && ratingB) {
      console.log("Selections:", {
        A: ratingA,
        B: ratingB,
        slika: imagePaths[currentIndex],
      });
      
      if (isLastPair) {
        navigate("/summary", {
          state: {
            totalPairs: imagePaths.length,
          },
        });
      } else {
        const nextIndex = currentIndex + 1;
        
        navigate("/pause", {
          state: {
            completedPairs: currentIndex + 1,
            totalPairs: imagePaths.length,
            nextIndex: nextIndex,
          },
        });
      }
      
      setRatingA(null);
      setRatingB(null);
    }
  };

  const currentImg = imagePaths[currentIndex];

  useEffect(() => {
    const img = new Image();
    img.src = currentImg;
    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, [currentImg]);

  const OptionButtons = ({ rating, setRating }) => {
    const options = [1, 2, 3, 4, 5];
    return (
      <HStack mt="1rem" justify="center" spacing={{ base: "2", md: "4" }}>
        {options.map((option) => (
          <Button
          key={option}
          w={{ base: "3rem", sm: "3.5rem", md: "4rem", lg: "4.2rem" }}
          h={{ base: "3rem", sm: "3.5rem", md: "4rem", lg: "4.2rem" }}
          fontSize={{ base: "md", sm: "md", md: "lg", lg: "lg" }}
          borderRadius="full"

          bg={rating === option ? "#7b904f" : "white"}  
          color={rating === option ? "white" : "#a0b36f"}
          border="0.25rem solid"
          borderColor={rating === option ? "#225811ff" : "#a0b36f"} 

          _hover={{
            bg: "#7b904f",
            color: "white",
            transform: "scale(1.05)",
            fontSize: "l"
          }}

          _active={{
            bg: "#7b904f",
            fontSize: "l",
            color: "white",
            borderColor: "white",
            transform: "scale(0.98)",
          }}

          onClick={() => setRating(option)}
        >
          {option}
        </Button>

        ))}
      </HStack>
    );
  };

  const ImageCard = ({ label, rating, setRating }) => (
    <VStack flex="1" w="100%" gap={{ base: "2rem", md: "1.25rem" }}>
      <AspectRatio
        ratio={isPortrait ? 3 / 4 : 4 / 3}
        maxW={
          isPortrait
            ? { base: "100%", md: "350px", lg: "400px" }
            : { base: "100%", md: "450px", lg: "600px" }
        }
        w={
          isPortrait
            ? { base: "100%", md: "80%", lg: "75%" }
            : { base: "100%", md: "90%", lg: "90%" }
        }
        mx="auto"
      >
        <Box
          bg="#eef0e4ff"
          borderRadius="2xl"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="4px solid"
          borderColor="#a0b36f"
          boxShadow="2xl"
          padding="2"
        >
          <ChakraImage
            src={currentImg}
            alt={label}
            objectFit="contain"
            w="100%"
            h="100%"
          />
        </Box>
      </AspectRatio>

      <Box
        bg="#eef0e4ff"
        w={{ base: "95%", sm: "90%", md: "80%", lg: "75%" }}
        py={{ base: "1rem", md: "1rem" }}
        borderRadius="xl"
        textAlign="center"
        boxShadow="lg"
        border="3px solid"
        borderColor="#a0b36f"
      >
        <Text
          color="#1a202c"
          fontSize={{ base: "xl", sm: "2xl", md: "2xl", lg: "xl" }}
          fontWeight="bold"
        >
          {label}
        </Text>
        <OptionButtons rating={rating} setRating={setRating} />
      </Box>
    </VStack>
  );

  return (
    <Box 
      minH="100vh" 
      bg="linear-gradient(to right, #c8cf9fff, #edf0da)" 
      py={{ base: "1rem", md: "2rem" }} 
      px={{ base: "1rem", md: "1.5rem" }}
    >
      <Container maxW="100vw" w="100%">
        <VStack gap={{ base: "1rem", md: "1.5rem" }} align="stretch">
          <Box bg="white" p={{ base: "1rem", md: "2rem" }} borderRadius="2xl" boxShadow="xl">
            <Heading fontSize={{ base: "xl", md: "4xl" }} color="#1a202c" fontWeight="bold" mb="0.5rem">
              Par {currentIndex + 1} od {imagePaths.length}
            </Heading>
            <HStack gap="0.75rem" color="#1a202c" align="flex-start">
              <Lightbulb size={28} color="#a0b36f" />
              <Text fontSize={{ base: "md", md: "xl" }} fontWeight="medium">
                Odaberite ocjenu ispod svake slike.
              </Text>
            </HStack>
            <Text fontSize={{ base: "sm", md: "lg" }} color="#1a202c" mb="1rem" fontWeight="medium">
              Skala ocjenjivanja:{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">1</Text> - Jako loše,{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">2</Text> - Loše,{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">3</Text> - Srednje,{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">4</Text> - Dobro,{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">5</Text> - Izvrsno
            </Text>
          </Box>

          <Box bg="white" borderRadius="2xl" p={{ base: "1rem", md: "2rem" }} boxShadow="2xl">
            <HStack
              gap={{ base: "6rem", lg: "0.5rem" }}
              align="flex-start"
              justify="center"
              flexDirection={{ base: "column", lg: "row" }}
              w="100%"
            >
              <ImageCard label="Slika A" rating={ratingA} setRating={setRatingA} />
              <ImageCard label="Slika B" rating={ratingB} setRating={setRatingB} />
            </HStack>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              w={{ base: "100%", md: "25%" }}
              bg={!ratingA || !ratingB ? "gray.400" : "#a0b36f"}
              color={!ratingA || !ratingB ? "gray.700" : "black"}
              size="lg"
              fontWeight="bold"
              fontSize={{ base: "lg", md: "xl" }}
              borderRadius="2xl"
              _hover={{
                bg: !ratingA || !ratingB ? "gray.400" : "#7b904f",
                transform: !ratingA || !ratingB ? "none" : "scale(1.05)",
                boxShadow: "md",
              }}
              _active={{
                bg: !ratingA || !ratingB ? "gray.400" : "#7b904f",
                transform: "scale(0.98)",
              }}
              onClick={handleNext}
              disabled={!ratingA || !ratingB}
              cursor={!ratingA || !ratingB ? "not-allowed" : "pointer"}
              py="6"
              mb="3"
            >
              {!ratingA || !ratingB 
                ? "Ocijenite slike" 
                : isLastPair 
                  ? "Završi" 
                  : "Sljedeći par"}
              {ratingA && ratingB && (
                isLastPair ? (
                  <CheckCircle size={30} style={{ marginLeft: "0.5rem" }} />
                ) : (
                  <ArrowRight size={30} style={{ marginLeft: "0.5rem" }} />
                )
              )}
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}