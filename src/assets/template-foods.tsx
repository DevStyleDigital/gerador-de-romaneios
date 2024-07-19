import type { RequestType } from "@/types/request";
import { Document, Page, Text, View, type Styles } from "@react-pdf/renderer";

const styles = {
  page: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.6)",
    padding: 24,
    fontSize: 10,
    fontWeight: "normal",
    position: "relative",
  } as Styles,
  row: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    borderBottom: "1px solid rgb(0,0,0,0.3)",
    padding: "8px 4px",
  } as Styles,
  col: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    width: '50%',
    marginRight: '40px',
  } as Styles,
};

export const PDFFoods = ({
  foods: foodsByRoute,
}: {
  foods: {
    foods: RequestType["foods"];
    schools: {
      number?: number;
      total: number;
    }[];
  }[];
}) => {
  const foodsTotals = [] as RequestType["foods"];
  let foodsTotalsTotal = 0;

  return (
    <Document>
      {foodsByRoute.map((foods, index) => {
        let total = 0;
        return (
          <Page key={index.toString()} size="A4" style={styles.page}>
            <Text style={{ fontSize: "18px" }}>
              Rota: {(index + 1).toString().padStart(2, "0")}
            </Text>
            {foods.foods.map((food, i) => {
              const weight = (food.quantity || 1) * (food.weight || 1);
              total += weight;
              const existingFood = foodsTotals.find((f) => f.id === food.id);
              if (
                existingFood &&
                existingFood.type === food.type &&
                existingFood.weight === food.weight
              ) {
                existingFood.quantity! += food.quantity || 0;
              } else {
                foodsTotals.push(food);
              }

              return (
                <View key={i.toString()} style={styles.row}>
                  <View style={styles.col}>
                    <Text>{food.name}</Text>
                    <Text>{weight.toFixed(2)} Kg</Text>
                  </View>
                  <View style={styles.col}>
                    <Text>
                      {food.quantity} {food.type === "kg" && "KILOS"}
                      {food.type === "mc" && "MAÇOS"}
                      {food.type === "ud" && "UNIDADES"}
                    </Text>
                  </View>
                </View>
              );
            })}
            <View style={styles.row}>
              <Text>TOTAL:</Text>
              <Text>{total.toFixed(2)} Kg</Text>
            </View>
            <Text style={{ marginTop: "40px" }}>Peso das escolas</Text>
            <View
              style={{
                marginTop: "16px",
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {foods.schools
                .sort((a, b) => (a.number || 0) - (b.number || 0))
                .map((school) => (
                  <View key={school.number}>
                    <Text>Nº {school.number} - </Text>
                    <Text>{school.total.toFixed(2)} Kg</Text>
                  </View>
                ))}
            </View>
          </Page>
        );
      })}

      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: "18px" }}>Rota: TOTAL</Text>
        {foodsTotals.map((food, i) => {
          const weight = (food.quantity || 1) * (food.weight || 1);
          foodsTotalsTotal += weight;

          return (
            <View key={i.toString()} style={styles.row}>
              <View style={styles.col}>
                <Text>{food.name}</Text>
                <Text>{weight.toFixed(2)} Kg</Text>
              </View>
              <View style={styles.col}>
                <Text>
                  {food.quantity} {food.type === "kg" && "KILOS"}
                  {food.type === "mc" && "MAÇOS"}
                  {food.type === "ud" && "UNIDADES"}
                </Text>
              </View>
            </View>
          );
        })}
        <View style={styles.row}>
          <Text>TOTAL:</Text>
          <Text>{foodsTotalsTotal.toFixed(2)} Kg</Text>
        </View>
      </Page>
    </Document>
  );
};
