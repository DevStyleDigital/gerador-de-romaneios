"use client";
import type { CityHall } from "@/types/city-hall";
import type { Cooperative } from "@/types/cooperative";
import React from "react";
import {
  LOCAL_STORAGE_REQUEST,
  getFromLocalStorage,
} from "../utils/loacal-storage";
import type { RequestType } from "@/types/request";

export type RequestsContextProps = {
  requests: RequestType[];
  setRequests: React.Dispatch<React.SetStateAction<RequestType[]>>;
  setLoadingRequests: (value: boolean) => void;
  loadingRequests: boolean;
  cityHalls: (CityHall & {
    schools: { id: number; number: number; name: string; csv_name: string }[];
  })[];
  cooperatives: Cooperative[];
  routes: {
    weight: number;
    requestIds: Set<string>;
  }[];
  setRoutes: React.Dispatch<
    React.SetStateAction<
      {
        weight: number;
        requestIds: Set<string>;
      }[]
    >
  >;
};
const RequestsContext = React.createContext<RequestsContextProps>(
  {} as RequestsContextProps
);
export const useRequests = () => React.useContext(RequestsContext);

export const RequestsProvider = ({
  children,
  cityHalls,
  cooperatives,
}: {
  children: React.ReactNode;
  cityHalls: RequestsContextProps["cityHalls"];
  cooperatives: Cooperative[];
}) => {
  const [requests, setRequests] = React.useState<RequestType[]>([]);
  const [loadingRequests, setLoadingRequests] = React.useState(false);
  const [routes, setRoutes] = React.useState<
    {
      weight: number;
      requestIds: Set<string>;
    }[]
  >([{
    weight: 0,
    requestIds: new Set() as Set<string>,
  }]);

  React.useEffect(() => {
    const storedData = getFromLocalStorage(LOCAL_STORAGE_REQUEST);
    if (storedData) {
      setLoadingRequests(true);
      setRequests(storedData);
      setLoadingRequests(false);
    }
  }, []);

  const values = React.useMemo(() => {
    return {
      requests,
      setRequests,
      loadingRequests,
      setLoadingRequests,
      cityHalls,
      cooperatives,
      routes,
      setRoutes,
    };
  }, [requests, cityHalls, cooperatives, routes, loadingRequests]);

  return (
    <RequestsContext.Provider value={values}>
      {children}
    </RequestsContext.Provider>
  );
};
