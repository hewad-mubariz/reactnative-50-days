import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AppUserInfo } from "../../../@types/types";

export const TopEarners = () => {
  const [data, setData] = useState<AppUserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Variable to track if the component is still mounted

    const fetchTopEarners = async () => {
      try {
        const response = await fetch(
          "https://www.staging.api.scoopit.lol/v1/leaderboard/topEarnedRewards",
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NDUiLCJub25jZSI6MywiYXVkIjoiU2Nvb3BpT1NBcHAiLCJpc3MiOiJodHRwczovL3N0YWdpbmcuYXBpLnNjb29waXQubG9sIiwiaWF0IjoxNzI0MDAxMjM0LCJleHAiOjE3MjUyMTA4MzR9.c1oO5h4ZqXdZOYeQtsGnHa5cXItRcHA8uEmWembuD-6V_02DD5dJgDFuZI1c5j5SAfHePmu6OgoN163pMLHP2PX3Sf5LA-pUbOcIMw_VVGdgZdvuYYQ6YT3Dci_ag4FSlCS1JgnME393aunkcG0BWQ2h1ARROfvm1OS4w3pcN1hosTFOmNXzoXECegzAqW_W-9cnZAi_wGPi5cQhVthZLw3R9oGVKE61eFFgMeAiNlW7j6IrYTgP0oyCBwPWSd8wCRTTW1W-Zti-5kfRG-2doXyFtiPRw0fc8KevgUEuWt2_uYdZVrzByAO-Gt5ap97orYqfQwzYfl66WfFnrmUq7g",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();

        // Only update state if the component is still mounted
        if (isMounted) {
          setData(result.topCollectors);
        }
      } catch (error) {
        if (isMounted) {
          console.error(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTopEarners();

    return () => {
      isMounted = false; // Cleanup function sets the flag to false when the component unmounts
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.fcDisplayName}</Text>
          <Text style={styles.earnings}>
            Rewards Earned: ${item.totalRewardsEarned}
          </Text>
          <Text style={styles.collectibles}>
            Collectibles Owned: {item.numOwnedCollectibles}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  earnings: {
    fontSize: 14,
    color: "green",
  },
  collectibles: {
    fontSize: 14,
    color: "blue",
  },
});
