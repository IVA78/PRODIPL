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

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  const [isExporting, setIsExporting] = useState(false);

  // Filteri
  const [methodFilter, setMethodFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [imageFilter, setImageFilter] = useState("");

  // Filtriranje prije "slice"-anja
  const filteredRatings = ratings.filter((r) => {
    const matchesMethod = methodFilter ? r.method === methodFilter : true;
    const matchesUser = userFilter ? r.user_id === userFilter : true;
    const matchesImage = imageFilter ? r.filename === imageFilter : true;
    return matchesMethod && matchesUser && matchesImage;
  });

  // Onda prikaži samo dio
  const visibleRatings = filteredRatings.slice(0, visibleCount);

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

  const handleExport = () => {
    setIsExporting(true);

    // Formatiraj podatke s imenima korisnika
    const data = ratings.map((r) => {
      const user = users.find((u) => u.id === r.user_id);
      return {
        User: user ? user.name : "Nepoznato",
        Img_name: r.filename || r.image_id,
        Method: r.method || "-",
        Rate: r.score,
        Time_ms: r.time_ms,
        Timestamp: new Date(r.timestamp).toLocaleString("hr-HR"),
      };
    });

    // Generiraj CSV
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
      ),
    ];
    const csvData = csvRows.join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ratings_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
  };

  function aggregateByMethod(ratings) {
    const grouped = ratings.reduce((acc, r) => {
      if (!acc[r.method]) acc[r.method] = { totalScore: 0, count: 0 };
      acc[r.method].totalScore += r.score;
      acc[r.method].count += 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([method, data]) => ({
      method,
      avgScore: data.totalScore / data.count,
      count: data.count,
    }));
  }

  const aggregatedData = aggregateByMethod(ratings);

  // --- Unikatne vrijednosti za filtere
  const uniqueMethods = [...new Set(ratings.map((r) => r.method))].filter(
    Boolean
  );
  const uniqueImages = [...new Set(ratings.map((r) => r.filename))];
  const uniqueUsers = users || [];

  const points = ratings.map((r) => ({
    x: uniqueImages.indexOf(r.filename), // numerički index za X osu
    y: r.score,
    filename: r.filename,
    method: r.method,
    user: r.user_id,
  }));

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

      <Box
        bg="white"
        shadow="lg"
        borderRadius="2xl"
        mt={2}
        p={2}
        textAlign="center"
      >
        <Text color="gray.600" mb={3}>
          Odaberi metodu, sliku i korisnika
        </Text>
        {/* FILTERI */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          m={4}
          p={4}
          justifyContent="center"
          align={{ base: "stretch", md: "flex-end" }}
          bg="white"
          borderRadius="2xl"
          shadow="md"
        >
          {/* Filter po metodi */}
          <Box flex="1">
            <Text mb={1} fontWeight="semibold" color="gray.700">
              Filtriraj po metodi
            </Text>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #CBD5E0",
                backgroundColor: "#F7FAFC",
                fontSize: "14px",
              }}
            >
              <option value="">Sve metode</option>
              {uniqueMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Box>

          {/* Filter po slici */}
          <Box flex="1">
            <Text mb={1} fontWeight="semibold" color="gray.700">
              Filtriraj po slici
            </Text>
            <select
              value={imageFilter}
              onChange={(e) => setImageFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #CBD5E0",
                backgroundColor: "#F7FAFC",
                fontSize: "14px",
              }}
            >
              <option value="">Sve slike</option>
              {uniqueImages.map((filename) => (
                <option key={filename} value={filename}>
                  {filename}
                </option>
              ))}
            </select>
          </Box>

          {/* Filter po korisniku */}
          <Box flex="1">
            <Text mb={1} fontWeight="semibold" color="gray.700">
              Filtriraj po korisniku
            </Text>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #CBD5E0",
                backgroundColor: "#F7FAFC",
                fontSize: "14px",
              }}
            >
              <option value="">Svi korisnici</option>
              {uniqueUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </Box>
        </Flex>
      </Box>

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
            columns={7}
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
            <Text>Datum i vrijeme</Text>
            <Text>Pregled</Text>
          </SimpleGrid>

          {/* Rows */}
          {visibleRatings.map((r) => {
            const user = users.find((u) => u.id === r.user_id);

            return (
              <SimpleGrid
                key={r.id}
                columns={7}
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
                <Text>{new Date(r.timestamp).toLocaleString("hr-HR")}</Text>
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
              ml={4}
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
          {/* Gumb za reset filtera */}
          {visibleCount < ratings.length && (
            <Button
              onClick={() => {
                setMethodFilter("");
                setUserFilter("");
                setImageFilter("");
              }}
              mt={4}
              ml={4}
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
              Očisti filtere
            </Button>
          )}
          {/* Gumb za izvoz u CSV format */}
          {visibleCount < ratings.length && (
            <Button
              onClick={handleExport}
              isLoading={isExporting}
              mt={4}
              ml={4}
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
              Izvezi u CSV formatu
            </Button>
          )}
        </Box>
      </Box>

      <Box bg="white" shadow="md" borderRadius="xl" p={4} mt={2}>
        <Heading>Vizualizacije</Heading>
        <SimpleGrid p={10} m={5} columns={{ base: 1, md: 1, lg: 2 }}>
          <Box w="100%" h={{ base: "300px", md: "500px" }} p={5}>
            <Heading>Prosječna ocjena po metodi</Heading>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregatedData}>
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#84a59d" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box w="100%" h={{ base: "300px", md: "500px" }} p={5}>
            <Heading>Raspon ocjena po slici</Heading>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <XAxis
                  type="number"
                  dataKey="x"
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y + 10}
                      textAnchor="end"
                      transform={`rotate(-45, ${x}, ${y})`}
                      fontSize={12}
                    >
                      {uniqueImages[payload.value]}
                    </text>
                  )}
                />
                <YAxis type="number" dataKey="y" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name, props) => [value, "Score"]}
                  labelFormatter={(label) => uniqueImages[label]}
                />
                <Scatter data={points} fill="#38A169" />
              </ScatterChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
