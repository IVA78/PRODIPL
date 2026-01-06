import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { Award, Clock, User, Settings } from "lucide-react";

function SummaryScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPairs, ratingsData } = location.state || {
    totalPairs: 20,
    ratingsData: []
  };

  const [stats, setStats] = useState({
    pairsWithSameRating: 0,
    averageTimeSeconds: 0,
    averageMinutes: 0,
    averageRemainingSeconds: 0,
    totalTimeMinutes: 0,
    totalTimeSeconds: 0,
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const calculateStats = () => {
      try {
        let ratings = ratingsData;

        if (!ratings || ratings.length === 0) {
          const savedRatings = localStorage.getItem("userRatings");
          if (savedRatings) {
            ratings = JSON.parse(savedRatings);
            console.log("✅Ocjene učitane iz localStorage");
          } else {
            console.warn("Nema spremljenih ocjena u localStorage");
            setLoading(false);
            return;
          }
        } else {
          console.log("✅Ocjene primljene kroz state");
        }

        const pairsWithSameRating = ratings.filter(
          (rating) => rating.sameRating === true
        ).length;

        ratings.forEach((rating, index) => {
          console.log(
            `Par ${index + 1}: A=${rating.ratingA}, B=${rating.ratingB}, iste=${rating.sameRating}`
          );
        });

        console.log(
          `📊 Ukupno parova s istim ocjenama: ${pairsWithSameRating}`
        );

        const totalTimeMs = ratings.reduce(
          (sum, rating) => sum + rating.timeMs,
          0
        );

        const averageTimeSeconds =
          ratings.length > 0
            ? Math.round(totalTimeMs / ratings.length / 1000)
            : 0;

        console.log(
          `⏱️ Prosječno vrijeme po paru: ${averageTimeSeconds} sekundi`
        );

        const totalTimeSecondsAll = Math.round(totalTimeMs / 1000);
        const totalTimeMinutes = Math.floor(totalTimeSecondsAll / 60);
        const remainingSeconds = totalTimeSecondsAll % 60;

        console.log(
          `⏱️ Ukupno vrijeme: ${totalTimeMinutes} minuta i ${remainingSeconds} sekundi`
        );

        const averageMinutes = Math.floor(averageTimeSeconds / 60);
        const averageRemainingSeconds = averageTimeSeconds % 60;

        setStats({
          pairsWithSameRating,
          averageTimeSeconds,
          averageMinutes,
          averageRemainingSeconds,
          totalTimeMinutes,
          totalTimeSeconds: remainingSeconds,
        });
        setLoading(false);
      } catch (error) {
        console.error("Greška pri izračunu statistike:", error);
        setLoading(false);
      }
    };

    calculateStats();
  }, [ratingsData]);

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
            Izračunavanje statistike...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(to right, #c8cf9fff, #edf0da)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "1rem", md: "2rem" }}
      py={{ base: "2rem", md: "3rem" }}
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

          {/* Kartica s brojem parova */}
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
                {totalPairs === 1
                  ? "par"
                  : totalPairs < 5
                  ? "para"
                  : "parova"}{" "}
                slika.
              </Text>
              <Text
                color="#1a202c"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="semibold"
                textAlign="center"
                lineHeight="1.6"
              >
                Broj parova gdje su originalna i kolorizirana slika jednako ocijenjene je{" "}
                <Text as="span" color="#193599ff" fontWeight="bold">
                  {stats.pairsWithSameRating}
                </Text>
                .
              </Text>
            </VStack>
          </Box>

          {/* Kartica s vremenom */}
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
                  {stats.averageTimeSeconds < 60 ? (
                    <Text as="span" color="#193599ff" fontWeight="bold">
                      {stats.averageTimeSeconds}{" "}
                      {stats.averageTimeSeconds === 1
                        ? "sekunda"
                        : stats.averageTimeSeconds < 5
                        ? "sekunde"
                        : "sekundi"}
                    </Text>
                  ) : (
                    <>
                      <Text as="span" color="#193599ff" fontWeight="bold">
                        {stats.averageMinutes}
                      </Text>{" "}
                      {stats.averageMinutes === 1
                        ? "minuta"
                        : stats.averageMinutes < 5
                        ? "minute"
                        : "minuta"}{" "}
                      i{" "}
                      <Text as="span" color="#193599ff" fontWeight="bold">
                        {stats.averageRemainingSeconds}
                      </Text>{" "}
                      {stats.averageRemainingSeconds === 1
                        ? "sekunda"
                        : stats.averageRemainingSeconds < 5
                        ? "sekunde"
                        : "sekundi"}
                    </>
                  )}
                  .
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
                  {stats.totalTimeMinutes > 0 && (
                    <>
                      <Text as="span" color="#193599ff" fontWeight="bold">
                        {stats.totalTimeMinutes}
                      </Text>{" "}
                      {stats.totalTimeMinutes === 1
                        ? "minuta"
                        : stats.totalTimeMinutes < 5
                        ? "minute"
                        : "minuta"}
                      {stats.totalTimeSeconds > 0 && " i "}
                    </>
                  )}
                  {(stats.totalTimeSeconds > 0 ||
                    stats.totalTimeMinutes === 0) && (
                    <>
                      <Text as="span" color="#193599ff" fontWeight="bold">
                        {stats.totalTimeSeconds}
                      </Text>{" "}
                      {stats.totalTimeSeconds === 1
                        ? "sekunda"
                        : stats.totalTimeSeconds < 5
                        ? "sekunde"
                        : "sekundi"}
                    </>
                  )}
                  .
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