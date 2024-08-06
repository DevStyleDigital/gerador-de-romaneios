import type { RequestTypeDetailed } from "@/types/request";
import {
	Document,
	Font,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
	page: {
		backgroundColor: "#fff",
		color: "rgba(0, 0, 0, 0.6)",
		padding: 24,
		fontSize: 10,
		fontWeight: "normal",
		position: "relative",
	},
	containerFlex: {
		display: "flex",
		flexDirection: "row",
		gap: 16,
		padding: "16px 0",
	},
	borderBottom: {
		borderBottom: "1px solid #e1e1e1",
	},
	school: {
		textAlign: "right",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		gap: "8px",
	},
	entityInfoContainer: {
		display: "flex",
		flexDirection: "column",
		gap: 12,
		width: "50%",
		padding: "8px 0",
	},
	entityInfoFlex: {
		display: "flex",
		flexDirection: "row",
	},
	cityHall: {
		borderRight: "1px solid #e1e1e1",
	},
	entityInfo: {
		display: "flex",
		flexDirection: "column",
		gap: 4,
		width: "100%",
	},
	entityInfoTitle: {
		color: "rgb(0, 0, 0)",
		fontWeight: "semibold",
	},
	table: {
		marginTop: 0,
	},
	tableRow: {
		display: "flex",
		flexDirection: "row",
		borderBottom: "1px solid #e1e1e1",
		padding: "5px 8px",
	},
	col1: {
		width: "300px",
	},
	col2: {
		width: `calc(${100 / 4}% - 300px - 70px)`,
	},
	col3: {
		width: `calc(${100 / 4}% - 300px - 70px)`,
	},
	col4: {
		width: "70px",
	},
	emblems: {
		display: "flex",
		flexDirection: "row",
		width: "50%",
		gap: 8,
	},
	image: {
		width: "calc(50% + 16px)",
		height: "auto",
		aspectRatio: "1/1",
	},
	signatureContainer: {
		position: "absolute",
		bottom: 24,
		left: 24,
		right: 24,
		border: "1px solid #000",
		padding: 8,
	},
	signatureRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	signatureCol: {
		display: "flex",
		flexDirection: "column",
		width: "50%",
	},
	signatureText: {
		fontSize: 10,
		width: "80%",
		fontWeight: "bold",
		paddingTop: "8px",
		paddingBottom: "24px",
		borderBottom: "1px solid #000",
	},
	signatureField: {
		borderBottom: "1px solid #000",
	},
});

const Signature = ({ texts }: { texts: JSX.Element[] }) => (
	<View style={styles.signatureContainer}>
		<View
			style={{ marginBottom: "10px", display: "flex", flexDirection: "row" }}
		>
			<Text style={{ width: "100%" }}>
				Data do Recebimento: ______/______/2024
			</Text>
			<Text
				style={{
					width: "100%",
					textTransform: "uppercase",
					fontSize: "16px",
					fontWeight: "bold",
					backgroundColor: "#f1f1f1",
					padding: "0 4px",
				}}
			>
				{texts.map((item, i) =>
					i === texts.length - 1 ? item : <>{item} - </>,
				)}
			</Text>
		</View>
		<View style={styles.signatureRow}>
			<View style={styles.signatureCol}>
				<Text style={styles.signatureText}>Nome do recebedor:</Text>
				<Text style={styles.signatureText}>CPF do recebedor:</Text>
				<Text style={styles.signatureText}>Cargo do recebedor:</Text>
			</View>
			<View style={styles.signatureCol}>
				<Text style={styles.signatureText}>Nome do conferente:</Text>
				<Text style={styles.signatureText}>CPF do conferente:</Text>
				<Text style={styles.signatureText}>Cargo do conferente:</Text>
			</View>
		</View>
	</View>
);

export const HtmlRequestTemplate = ({
	request,
}: { request: RequestTypeDetailed }) => {
	const [firstWord, secondWord, ...restName] = request.school.name
		.toLowerCase()
		.split(" ");

	function checkLastPage() {
		const firstPageItems = 18;
		const itemsPerPage = 30;
		const totalItems = request.foods.length;
		if (totalItems <= firstPageItems) {
			return totalItems <= 12;
		}
		const remainingItems = totalItems - firstPageItems;
		const itemsOnLastPage = remainingItems % itemsPerPage;
		const adjustedItemsOnLastPage =
			itemsOnLastPage === 0 ? itemsPerPage : itemsOnLastPage;
		return adjustedItemsOnLastPage === itemsPerPage - 12;
	}

	function getTextBetweenTags(doc: any, id: string) {
		const text = [];
		if (!doc?.content) return [];

		for (const item of doc.content) {
			if (
				(item.type !== "tag" && item.content) ||
				(item.type === "tag" && item?.attrs?.id?.includes(id))
			) {
				if (!item.content) continue;
				for (const content of item.content) {
					if (content.text?.length) text.push(<Text>{content.text}</Text>);
				}
			}
		}

		return text;
	}

	return (
		<Page size="A4" style={styles.page}>
			<View style={[styles.borderBottom, { position: "relative" }]}>
				<View style={styles.containerFlex}>
					<View style={styles.emblems}>
						<Image src={request.cityHall.emblem} style={styles.image} />
						<Image src={request.cooperative.emblem} style={styles.image} />
					</View>
					<View style={styles.school}>
						<Text style={{ fontSize: 12 }}>Data de Entrega: {request.date}</Text>
						<View style={[{ fontSize: 18 }, styles.entityInfoTitle]}>
							<Text>
								{firstWord.toUpperCase()} {secondWord?.toUpperCase() || ""}
							</Text>
							<Text>{restName?.join(" ").toUpperCase() || ""}</Text>
						</View>
						<Text>Telefone: {request.school.phone || "Não especificado"}</Text>
						<Text>Endereço: {request.school.address}</Text>
					</View>
				</View>
				<Text
					style={[
						styles.entityInfoTitle,
						{
							fontSize: 12,
							top: "-20px",
							margin: "8px auto 12px",
							position: "absolute",
						},
					]}
				>
					ROTA {request.route.toString().padStart(2, "0")} -{" "}
					{request.totalWeightRequest.toFixed(2)} Kg
				</Text>
				<Text
					style={[
						styles.entityInfoTitle,
						{
							fontSize: 24,
							margin: "8px auto 12px",
							position: "absolute",
							top: "40%",
							left: "57%",
							transform: "translate(-50%, -50%)",
						},
					]}
				>
					{request.school.number?.toString().padStart(2, "0") || ""}
				</Text>
			</View>

			<View style={styles.containerFlex}>
				<View style={[styles.entityInfoContainer, styles.cityHall]}>
					<View style={styles.entityInfo}>
						<Text style={styles.entityInfoTitle}>Prefeitura:</Text>
						<Text style={{ fontSize: 18 }}>{request.cityHall.name}</Text>
					</View>
					<View style={styles.entityInfoFlex}>
						<View style={styles.entityInfo}>
							<Text style={styles.entityInfoTitle}>CNPJ:</Text>
							<Text>{request.cityHall.cnpj}</Text>
						</View>
						<View style={styles.entityInfo}>
							<Text style={styles.entityInfoTitle}>Telefone:</Text>
							<Text>{request.cityHall.phone || "Não especificado"}</Text>
						</View>
					</View>
				</View>
				<View style={styles.entityInfoContainer}>
					<View style={styles.entityInfo}>
						<Text style={styles.entityInfoTitle}>Fornecedora:</Text>
						<Text>{request.cooperative.name}</Text>
					</View>
					<View style={styles.entityInfoFlex}>
						<View style={styles.entityInfo}>
							<Text style={styles.entityInfoTitle}>CNPJ:</Text>
							<Text>{request.cooperative.cnpj}</Text>
						</View>
						<View style={styles.entityInfo}>
							<Text style={styles.entityInfoTitle}>Telefone:</Text>
							<Text>{request.cooperative.phone || "Não especificado"}</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.table}>
				<View style={[styles.tableRow, { backgroundColor: "#e1e1e1" }]}>
					<Text style={[styles.col1, styles.entityInfoTitle]}>
						Nome do Alimento
					</Text>
					<Text style={[styles.col2, styles.entityInfoTitle]}>Ocorrências</Text>
					<Text style={[styles.col3, styles.entityInfoTitle]}>
						Unidade (Tipo)
					</Text>
					<Text style={[styles.col4, styles.entityInfoTitle]}>Quantidade</Text>
				</View>
				{request.foods.map((food, i) => {
					return (
						<View
							key={food.id}
							style={[
								styles.tableRow,
								{
									backgroundColor: i % 2 !== 0 ? "#f1f1f1" : "transparent",
								},
							]}
						>
							<Text style={[styles.col1, { fontSize: "14px" }]}>
								{food.name}
							</Text>
							<Text style={styles.col2}> </Text>
							<Text style={styles.col3}>
								{food.type === "ud"
									? "UND"
									: food.type === "mc"
										? "MÇ"
										: "KG"}
							</Text>
							<Text
								style={[
									styles.col4,
									{ fontSize: "14px", textAlign: "center", fontWeight: "bold" },
								]}
							>
								{food.quantity?.toFixed(1)}
							</Text>
						</View>
					);
				})}
			</View>
			{!checkLastPage() && (
				<View style={{ height: "330px", display: "flex" }} />
			)}
			<Signature
				texts={getTextBetweenTags(
					request.school.comments,
					request.cooperative.id,
				)}
			/>
			<Text
				style={{ position: "absolute", bottom: "4px", right: 24 }}
				render={({ pageNumber, totalPages }) =>
					`Escola Nº: ${request.school.number} - pg. ${pageNumber} / ${totalPages}`
				}
				fixed
			/>
		</Page>
	);
};

export const PDFRequests = ({
	requests,
}: { requests: RequestTypeDetailed[] }) => {
	const requestsByRoutes = requests.reduce((acc, request) => {
		const routeIndex = acc.findIndex(
			(requestsByRoute) => requestsByRoute[0].route === request.route,
		);
		if (routeIndex === -1) acc.push([request]);
		else acc[routeIndex].push(request);
		return acc;
	}, [] as RequestTypeDetailed[][]);

	return (
		<Document>
			{requests.map((request, i) => (
				<HtmlRequestTemplate key={i.toString()} request={request} />
			))}
			{requestsByRoutes.map((requestsByRoute) => (
				<Page key={requestsByRoute[0].route} size="A4" style={styles.page}>
					<View
						style={{
							fontSize: 14,
							borderBottom: "1px solid #000",
							marginBottom: "8px",
							paddingBottom: "8px",
						}}
					>
						<Image
							src={requestsByRoute[0].cooperative.emblem}
							style={{
								width: "40px",
								height: "40px",
								aspectRatio: "1/1",
								position: "absolute",
								top: "0",
								right: "0",
							}}
						/>
						<Text
							style={{
								fontSize: 18,
								textAlign: "center",
								marginBottom: "8px",
							}}
						>
							Relatório de Entrega{" "}
							<Text style={{ fontSize: 12 }}>Data de Entrega: {requestsByRoute[0].date}</Text>
						</Text>
						<Text style={{ fontSize: "12px" }}>
							<Text style={{ fontWeight: "bold", fontSize: "14px" }}>
								PREFEITURA:
							</Text>{" "}
							{requestsByRoute[0].cityHall.name}
						</Text>
						<Text style={{ fontSize: "12px" }}>
							<Text style={{ fontWeight: "bold", fontSize: "14px" }}>
								FORNECEDORA:
							</Text>{" "}
							{requestsByRoute[0].cooperative.name}
						</Text>
						<Text style={{ fontSize: "12px" }}>
							<Text style={{ fontWeight: "bold", fontSize: "14px" }}>
								ROTA:
							</Text>{" "}
							{requestsByRoute[0].route.toString().padStart(2, "0")}
						</Text>
					</View>

					{requestsByRoute.map((request, i) => (
						<View
							key={i.toString()}
							style={{
								marginBottom: "8px",
								padding: "8px",
								border: "1px solid #000",
							}}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									marginBottom: "8px",
								}}
							>
								<Text style={{ fontWeight: "bold" }}>
									- Nº {request.school.number}
								</Text>
								<Text style={{ fontWeight: "bold" }}>
									- {request.school.name}
								</Text>
								<Text style={{ fontWeight: "bold" }}>
									- Peso Total: {request.totalWeightRequest.toFixed(2)} Kg
								</Text>
							</View>
							<Text style={{ marginBottom: "8px" }}>
								{request.foods.map((food, i) => (
									<Text key={food.id}>
										{food.name} - {food.quantity?.toFixed(1)}{" "}
										{food.type === "ud"
											? "UND"
											: food.type === "mc"
												? "MÇ"
												: "KG"}
										{i !== request.foods.length - 1 ? " / " : ""}
									</Text>
								))}
							</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									marginBottom: "8px",
								}}
							>
								<Text>Data: ______/______/2024 </Text>
								<Text> - CPF: ___________________________</Text>
								<Text> - Assinatura: ____________________________</Text>
							</View>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text>
									Ocorrências:
									____________________________________________________________________________________
								</Text>
							</View>
						</View>
					))}
					<Text
						style={{ position: "absolute", bottom: "4px", right: 24 }}
						render={({ pageNumber, totalPages }) =>
							`pg. ${pageNumber} / ${totalPages}`
						}
						fixed
					/>
				</Page>
			))}
		</Document>
	);
};
