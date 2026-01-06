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
  Spinner,
  Presence,
} from "@chakra-ui/react";
import { Lightbulb, ArrowRight, CheckCircle } from "lucide-react";

const API_URL = "http://localhost:3001/api";

export default function EvaluationScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = location.state?.currentIndex || 0;

  const [ratingA, setRatingA] = useState(null);
  const [ratingB, setRatingB] = useState(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [imagePairs, setImagePairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [allRatings, setAllRatings] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement ||
      !!document.webkitFullscreenElement ||
      !!document.mozFullScreenElement ||
      !!document.msFullscreenElement
  );
  const userId = localStorage.getItem("userId");

  // sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      const currentlyFullscreen =
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement;
      setIsFullscreen(currentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    document.addEventListener("mozfullscreenchange", handleFsChange);
    document.addEventListener("MSFullscreenChange", handleFsChange);

    // provjera odmah pri mountu (važna nakon vraćanja s /pause)
    handleFsChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
      document.removeEventListener("mozfullscreenchange", handleFsChange);
      document.removeEventListener("MSFullscreenChange", handleFsChange);
    };
  }, []);

  const handleEnterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      // isFullscreen se ažurira u event handleru
    } catch (err) {
      console.error("Greška pri ulasku u fullscreen:", err);
    }
  };

  const ensureExitFullscreen = async () => {
    const currentlyFullscreen =
      !!document.fullscreenElement ||
      !!document.webkitFullscreenElement ||
      !!document.mozFullScreenElement ||
      !!document.msFullscreenElement;

    if (!currentlyFullscreen) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      // isFullscreen se ažurira u event handleru
    } catch (err) {
      console.error("Greška pri izlasku iz fullscreen-a:", err);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      ensureExitFullscreen();
    } else {
      handleEnterFullscreen();
    }
  };

  useEffect(() => {
    if (currentIndex === 0) {
      localStorage.removeItem("userRatings");
      setAllRatings([]);
    } else {
      const savedRatings = localStorage.getItem("userRatings");
      if (savedRatings) {
        setAllRatings(JSON.parse(savedRatings));
      } else {
        setAllRatings([]);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/images`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pairs = await response.json();
        console.log("✅ Slike uspješno primljene:", pairs.length, "parova");

        const prepared = pairs.map((pair) => {
          const methods = Object.keys(pair.variants);
          const randomMethod =
            methods[Math.floor(Math.random() * methods.length)];
          const variant = pair.variants[randomMethod];
          const variantWithId = {
            ...variant,
            id: variant.id,
          };

          const isOriginalA = Math.random() > 0.5;

          return {
            imageA: isOriginalA ? pair.original : variantWithId,
            imageB: isOriginalA ? variantWithId : pair.original,
            baseName: pair.baseName,
          };
        });

        setImagePairs(prepared);
        setLoading(false);
      } catch (error) {
        console.error("Greška pri dohvatu slika:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  useEffect(() => {
    if (imagePairs.length > 0 && currentIndex < imagePairs.length) {
      const img = new Image();
      img.src = imagePairs[currentIndex].imageA.url;
      img.onload = () => {
        setIsPortrait(img.height > img.width);
      };
    }
  }, [imagePairs, currentIndex]);

  const isLastPair = currentIndex === imagePairs.length - 1;

  const handleNext = async () => {
    if (ratingA && ratingB && userId && imagePairs.length > 0) {
      const timeSpent = Date.now() - startTime;
      const currentPair = imagePairs[currentIndex];

      if (!currentPair.imageA.id || !currentPair.imageB.id) {
        console.error("ID slika nije definiran:", {
          idA: currentPair.imageA.id,
          idB: currentPair.imageB.id,
          imageA: currentPair.imageA,
          imageB: currentPair.imageB,
        });
        alert("Greška: ID slika nije pronađen. Provjerite backend podatke.");
        return;
      }

      const ratingData = {
        userId: userId,
        idA: currentPair.imageA.id,
        idB: currentPair.imageB.id,
        ratingA: ratingA,
        ratingB: ratingB,
        time_ms: timeSpent,
      };

      try {
        console.log("📤 Šaljem ocjene na backend:", ratingData);

        const response = await fetch(`${API_URL}/ratings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ratingData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newRating = {
          pairIndex: currentIndex,
          ratingA: Number(ratingA),
          ratingB: Number(ratingB),
          timeMs: timeSpent,
          sameRating: Number(ratingA) === Number(ratingB),
        };

        const updatedRatings = [...allRatings, newRating];
        localStorage.setItem("userRatings", JSON.stringify(updatedRatings));
        console.log("💾 Podatci spremljeni u localStorage:", newRating);
        console.log(
          `   Iste ocjene: ${newRating.sameRating} (A=${newRating.ratingA}, B=${newRating.ratingB})`
        );
        console.log(`   Svi spremljeni parovi:`, updatedRatings);

        if (isLastPair) {
          // uvijek pokušaj izaći iz fullscreen-a prije summary
          await ensureExitFullscreen();

          navigate("/summary", {
            state: {
              totalPairs: imagePairs.length,
              ratingsData: updatedRatings,
            },
          });
        } else {
          const nextIndex = currentIndex + 1;

          navigate("/pause", {
            state: {
              completedPairs: currentIndex + 1,
              totalPairs: imagePairs.length,
              nextIndex: nextIndex,
              ratingsData: updatedRatings,
            },
          });
        }

        setRatingA(null);
        setRatingB(null);
      } catch (error) {
        console.error("Greška pri spremanju ocjena:", error);
        alert("Greška pri spremanju ocjena. Pokušajte ponovno.");
      }
    }
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        bg="linear-gradient(to right, #c8cf9fff, #edf0da)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap="1rem">
          <Spinner size="xl" color="#7b904f" thickness="4px" />
          <Text fontSize="xl" color="#1a202c" fontWeight="medium">
            Učitavanje slika...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (!userId) {
    return (
      <Box
        minH="100vh"
        bg="linear-gradient(to right, #c8cf9fff, #edf0da)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xl" color="#1a202c" fontWeight="medium">
          Greška: Korisnik nije prijavljen
        </Text>
      </Box>
    );
  }

  if (imagePairs.length === 0) {
    return (
      <Box
        minH="100vh"
        bg="linear-gradient(to right, #c8cf9fff, #edf0da)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xl" color="#1a202c" fontWeight="medium">
          Nema dostupnih slika
        </Text>
      </Box>
    );
  }

  const currentPair = imagePairs[currentIndex];

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
              fontSize: "l",
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

  const ImageCard = ({ label, imageUrl, rating, setRating }) => (
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
            src={imageUrl}
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
          <Box
            bg="white"
            p={{ base: "1rem", md: "2rem" }}
            borderRadius="2xl"
            boxShadow="xl"
          >
            <HStack justify="space-between" align="flex-start" mb="0.5rem">
              <Heading
                fontSize={{ base: "xl", md: "4xl" }}
                color="#1a202c"
                fontWeight="bold"
              >
                Par {currentIndex + 1} od {imagePairs.length}
              </Heading>

              <Button
                size="sm"
                bg="#a0b36f"
                color="black"
                borderRadius="lg"
                _hover={{ bg: "#7b904f" }}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "Izađi iz fullscreen-a" : "Uđi u fullscreen"}
              </Button>
            </HStack>

            <HStack gap="0.75rem" color="#1a202c" align="flex-start">
              <Lightbulb size={28} color="#a0b36f" />
              <VStack align="flex-start" spacing={1}>
                <Text fontSize={{ base: "md", md: "xl" }} fontWeight="medium">
                  Odaberite ocjenu ispod svake slike.
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="#4a5568"
                  fontWeight="medium"
                >
                  Preporuka: uključite fullscreen za jasniji prikaz slika.
                </Text>
              </VStack>
            </HStack>

            <Text
              fontSize={{ base: "sm", md: "lg" }}
              color="#1a202c"
              mb="1rem"
              fontWeight="medium"
            >
              Skala ocjenjivanja:{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">
                1
              </Text>{" "}
              - Jako loše,{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">
                2
              </Text>{" "}
              - Loše,{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">
                3
              </Text>{" "}
              - Srednje,{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">
                4
              </Text>{" "}
              - Dobro,{" "}
              <Text as="span" color="#7b904f" fontWeight="bold">
                5
              </Text>{" "}
              - Izvrsno
            </Text>
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            p={{ base: "1rem", md: "2rem" }}
            boxShadow="2xl"
          >
            <Presence
              present
              key={currentIndex}
              _open={{
                animation: "fade-in 300ms ease-out",
              }}
            >
              <HStack
                gap={{ base: "6rem", lg: "0.5rem" }}
                align="flex-start"
                justify="center"
                flexDirection={{ base: "column", lg: "row" }}
                w="100%"
              >
                <ImageCard
                  label="Slika A"
                  imageUrl={currentPair.imageA.url}
                  rating={ratingA}
                  setRating={setRatingA}
                />
                <ImageCard
                  label="Slika B"
                  imageUrl={currentPair.imageB.url}
                  rating={ratingB}
                  setRating={setRatingB}
                />
              </HStack>
            </Presence>
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