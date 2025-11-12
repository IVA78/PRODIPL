import React, { useEffect, useState } from "react";

import {
  Box,
  Flex,
  Spinner,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  FormatNumber,
  Image,
  Button,
} from "@chakra-ui/react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ratingsRes] = await Promise.all([
          fetch("http://localhost:3001/api/users").then((r) => r.json()),
          fetch("http://localhost:3001/api/ratings").then((r) => r.json()),
        ]);

        setUsers(usersRes);
        setRatings(ratingsRes);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const avgScore =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(
          2
        )
      : 0;

  const avgTime =
    ratings.length > 0
      ? Math.round(
          ratings.reduce((sum, r) => sum + r.time_ms, 0) / ratings.length
        )
      : 0;

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="100vh" bg="gray.100">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const participantCount = users.filter((u) => u.role === "participant").length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  // Dohvat podataka za prikaz
  const visibleRatings = ratings.slice(0, visibleCount);

  return (
    <Box p={8} bg="linear-gradient(to right, #d9dfb6, #edf0da)" minH="100vh">
      <Box
        bg="white"
        shadow="lg"
        borderRadius="2xl"
        p={6}
        mb={2}
        textAlign="center"
      >
        <Heading size="2xl">📊 Evaluacija kolorizacije</Heading>
        <Text color="gray.600">Pregled korisnika, slika i ocjena</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
        {[
          { label: "Korisnici", value: participantCount, color: "#f6bd60" },

          {
            label: "Ukupno ocjena",
            value: ratings.length,
            color: "#84a59d",
          },
          { label: "Prosječna ocjena", value: avgScore, color: "#ff6b6b" },
          { label: "Prosječno vrijeme", value: avgTime, color: "#4a69bd" },
        ].map((stat) => (
          <Box
            key={stat.label}
            bg="white"
            shadow="lg"
            borderRadius="2xl"
            p={4}
            m={1}
            _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
          >
            <Stat.Root>
              <Stat.Label fontWeight="bold" mb={2}>
                {stat.label}
              </Stat.Label>
              <Stat.ValueText fontSize="3xl" color={stat.color}>
                <FormatNumber value={stat.value} />
              </Stat.ValueText>
            </Stat.Root>
          </Box>
        ))}
      </SimpleGrid>

      <Box bg="white" shadow="md" borderRadius="xl" p={4} mt={2}>
        {" "}
        <Heading size="md" mb={1} mt={5}>
          Rezultati ocjenjivanja
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>
          Ocjene ispitanika za kolorizirane slike
        </Text>
        <Box overflowX="auto">
          {/* Header */}
          <SimpleGrid
            columns={6}
            bg="#a0b36f"
            p={2}
            fontWeight="bold"
            borderRadius="md"
            mb={2}
          >
            <Text>Korisnik</Text>
            <Text>Slika</Text>
            <Text>Metoda</Text>
            <Text>Ocjena</Text>
            <Text>Vrijeme (ms)</Text>
            <Text>Pregled</Text>
          </SimpleGrid>

          {/* Rows */}
          {visibleRatings.map((r) => {
            const user = users.find((u) => u.id === r.user_id);

            return (
              <SimpleGrid
                key={r.id}
                columns={6}
                bg="white"
                p={2}
                mb={1}
                borderRadius="md"
                shadow="sm"
                alignItems="center"
              >
                <Text>{user ? user.name : "Nepoznato"}</Text>
                <Text>{r.filename || r.image_id}</Text>
                <Text>{r.method || "-"}</Text>
                <Text>{r.score}</Text>
                <Text>{r.time_ms}</Text>
                <Box>
                  {r.filename && r.method && (
                    <Image
                      src={`http://localhost:3001/images/${r.method}/${r.filename}`}
                      alt={r.filename}
                      boxSize="60px"
                      borderRadius="md"
                      objectFit="cover"
                    />
                  )}
                </Box>
              </SimpleGrid>
            );
          })}
          {/* Gumb za učitaj još */}
          {visibleCount < ratings.length && (
            <Button
              mt={4}
              onClick={loadMore}
              bg="#a0b36f" // osnovna boja
              color="black"
              fontWeight="bold"
              _hover={{
                bg: "#7b904f", // tamnija verzija
                transform: "scale(1.05)",
                boxShadow: "md",
              }}
              _active={{
                bg: "#7b904f", // ista tamnija boja pri kliku
                transform: "scale(0.98)",
              }}
              borderRadius="xl"
              px={6}
              py={3}
              shadow="sm"
            >
              Učitaj još
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
