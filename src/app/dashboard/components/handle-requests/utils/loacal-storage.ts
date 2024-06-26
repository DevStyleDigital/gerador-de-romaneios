export const LOCAL_STORAGE_REQUEST = "REQUESTS";

export const saveToLocalStorage = (key: string, csvData: unknown) => {
	localStorage.setItem(key, JSON.stringify(csvData));
};

export const getFromLocalStorage = (key: string) => {
	const storedData = localStorage.getItem(key);
	return storedData ? JSON.parse(storedData) : null;
};