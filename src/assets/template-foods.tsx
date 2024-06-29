import type { RequestType } from "@/types/request";
import { Document, Page, Text, View } from "@react-pdf/renderer";

export const PDFFoods = ({
	foods: foodsByRoute,
}: { foods: RequestType["foods"][] }) => {
	let total = 0;

	return (
		<Document>
			{foodsByRoute.map((foods, index) => (
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
					{foods.map((food, i) => {
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
				</Page>
			))}
		</Document>
	);
};
