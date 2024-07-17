import type { RequestType } from "@/types/request";
import { Document, Page, Text, View } from "@react-pdf/renderer";

export const PDFFoods = ({
  foods: foodsByRoute,
}: {
  foods: ({
    foods: RequestType["foods"],
    schools: {
      number?: number;
      total: number;
    }[];
  })[];
}) => {
  return (
    <Document>
      {foodsByRoute.map((foods, index) => {
        let total = 0;
        return (
          <Page
            key={index.toString()}
            size="A4"
            style={{
              backgroundColor: "#fff",
              color: "rgba(0, 0, 0, 0.6)",
              padding: 24,
              fontSize: 10,
              fontWeight: "normal",
              position: "relative",
            }}
          >
            <Text>Rota: {(index + 1).toString().padStart(2, "0")}</Text>
            {foods.foods.map((food, i) => {
              const weight = (food.quantity || 1) * (food.weight || 1);
              total += weight;

              return (
                <View
                  key={i.toString()}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    borderBottom: "1px solid rgb(0,0,0,0.3)",
                    padding: "8px 4px",
                  }}
                >
                  <Text>{food.name}</Text>
                  <Text>{weight.toFixed(2)} Kg</Text>
                </View>
              );
            })}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                borderBottom: "1px solid rgb(0,0,0,0.3)",
                padding: "8px 4px",
              }}
            >
              <Text>TOTAL:</Text>
              <Text>{total.toFixed(2)} Kg</Text>
            </View>
            <Text
              style={{
                marginTop: "40px",
              }}
            >
              Peso das escolas
            </Text>
            <View
              style={{
                marginTop: "16px",
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {foods.schools.map((school) => (
                <View key={school.number}>
                  <Text>Nº {school.number} - </Text>
                  <Text>{school.total.toFixed(2)} Kg</Text>
                </View>
              ))}
            </View>
          </Page>
        );
      })}
    </Document>
  );
};
