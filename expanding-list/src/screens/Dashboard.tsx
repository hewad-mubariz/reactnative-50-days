import React from "react";
import { View, Text, StyleSheet } from "react-native";
type CirclePercentageProps = {
  color: string;
  title: string;
  percentage: number;
};
const CirclePercentage = ({
  color,
  title,
  percentage,
}: CirclePercentageProps) => (
  <View style={styles.circlePercentageContainer}>
    <View style={[styles.circle, { backgroundColor: color }]} />
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  </View>
);

const Dashboard = () => {
  const data = [
    { color: "#FF5733", title: "Groceries", percentage: 35 },
    { color: "#33C1FF", title: "Mobility", percentage: 25 },
    { color: "#33FFB5", title: "Eating Out", percentage: 15 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {data.map((item, index) => (
          <CirclePercentage
            key={index}
            color={item.color}
            title={item.title}
            percentage={item.percentage}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circlePercentageContainer: {
    flexDirection: "row",
    columnGap: 5,
    alignItems: "center",
    width: "30%",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 5,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 5,
  },
});

export default Dashboard;
