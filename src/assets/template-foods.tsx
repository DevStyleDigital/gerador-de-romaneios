import type { RequestType } from "@/types/request";
import { Document, Page, Text, View } from "@react-pdf/renderer";

export const PDFFoods = ({ foods }: { foods: RequestType["foods"] }) => {
	return (
		<Document>
			<Page
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
				{foods.map((food, i) => (
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
						<Text>{(food.quantity || 1) * (food.weight || 1)} Kg</Text>
					</View>
				))}
			</Page>
		</Document>
	);
};
