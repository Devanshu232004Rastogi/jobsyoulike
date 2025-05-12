// Create this file in your project root or in a types directory
import { NextPage } from "next";
import { ReactElement } from "react";

// Next.js App Router types
export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

// This is the key type that matches the error message
export interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Your component props type
export interface ComponentPageProps {
  params: { companyId: string };
}

// Type guard to check if params is a Promise
export function isPromise<T>(value: any): value is Promise<T> {
  return value && typeof value.then === "function";
}

// Helper function to handle both Promise and direct object params
export async function resolveParams<T>(params: Promise<T> | T): Promise<T> {
  if (isPromise(params)) {
    return await params;
  }
  return params;
}
