import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/constants/colors";

export function OrderForm() {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Order & payment</Text>
        <Text style={styles.subtitle}>
          Review your items, delivery details and complete your secure payment.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your order</Text>

        <View style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Pro plan</Text>
            <Text style={styles.itemSubtitle}>
              1 month · Unlimited projects
            </Text>
          </View>
          <Text style={styles.itemPrice}>$12.00</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Priority support</Text>
            <Text style={styles.itemSubtitle}>24/7 chat · 2h response</Text>
          </View>
          <Text style={styles.itemPrice}>$4.00</Text>
        </View>

        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Billed monthly</Text>
          </View>
          <View style={styles.chipOutline}>
            <Text style={styles.chipOutlineText}>Cancel anytime</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subtotal</Text>
          <Text style={styles.rowValue}>$16.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Service fee</Text>
          <Text style={styles.rowValue}>$0.80</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Tax (10%)</Text>
          <Text style={styles.rowValue}>$1.68</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabelAccent}>Promo "WELCOME10"</Text>
          <Text style={styles.rowValueAccent}>- $1.60</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total due today</Text>
          <Text style={styles.totalValue}>$16.88</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact & delivery</Text>

        <Text style={styles.inputLabel}>Email for receipt</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Full name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
        />

        <Text style={styles.inputLabel}>Country / region</Text>
        <TextInput
          style={styles.input}
          placeholder="United States"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.inputLabel}>Street address</Text>
        <TextInput
          style={styles.input}
          placeholder="123 Market Street"
          placeholderTextColor={colors.muted}
        />

        <View style={styles.rowInputs}>
          <View style={styles.half}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="San Francisco"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.inputLabel}>ZIP / Postal code</Text>
            <TextInput
              style={styles.input}
              placeholder="94103"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment details</Text>

        <Text style={styles.inputLabel}>Card number</Text>
        <TextInput
          style={styles.input}
          placeholder="4242 4242 4242 4242"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={19}
        />

        <View style={styles.rowInputs}>
          <View style={styles.half}>
            <Text style={styles.inputLabel}>Expiry</Text>
            <TextInput
              style={styles.input}
              placeholder="MM / YY"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>Cardholder name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
        />

        <Text style={styles.inputLabel}>Billing ZIP</Text>
        <TextInput
          style={styles.input}
          placeholder="10001"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={10}
        />

        <Text style={styles.inputLabel}>Order notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add any special instructions for your order…"
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={3}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  chipRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ecfeff",
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primaryDark,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  chipOutline: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOutlineText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  rowLabelAccent: {
    fontSize: 15,
    color: colors.primaryDark,
  },
  rowValueAccent: {
    fontSize: 15,
    color: colors.primaryDark,
    fontWeight: "600",
  },
  textArea: {
    minHeight: 90,
    paddingTop: 14,
    textAlignVertical: "top",
  },
});
