import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

const BASE = import.meta.env.VITE_SUPABASE_URL + "/functions/v1";

async function callFunction(name: string, body: object) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(`${BASE}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "AI request failed");
  return data;
}

export function useAIAnalyst() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyse(expenses: any[], budget: any, currency: string) {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const data = await callFunction("ai-analyst", {
        expenses,
        budget,
        currency,
      });
      setResult(data.insight);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return { result, loading, error, analyse };
}

export function useAISavingsCoach() {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getTip(expenses: any[], budget: any, currency: string) {
    setLoading(true);
    setError("");
    setTip("");
    try {
      const data = await callFunction("ai-savings-coach", {
        expenses,
        budget,
        currency,
      });
      setTip(data.tip);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return { tip, loading, error, getTip };
}

export function useAIParseExpense() {
  const [parsed, setParsed] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function parse(text: string) {
    setLoading(true);
    setError("");
    setParsed(null);
    try {
      const data = await callFunction("ai-parse-expense", { text });
      if (data.error) {
        setError(data.error);
      } else setParsed(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return { parsed, loading, error, parse, setParsed };
}

export function useAICategorise() {
  async function categorise(note: string): Promise<string> {
    const data = await callFunction("ai-categorise", { note });
    return data.category ?? "Other";
  }
  return { categorise };
}

export function useAIBudgetAdvisor() {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getAdvice(
    income: number,
    goal: string,
    currency: string,
    timeframe: string,
  ) {
    setLoading(true);
    setError("");
    setAdvice("");
    try {
      const data = await callFunction("ai-budget-advisor", {
        income,
        goal,
        currency,
        timeframe,
      });
      setAdvice(data.advice);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return { advice, loading, error, getAdvice };
}

export function useAIOverspend() {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function explain(
    expenses: any[],
    budget: any,
    currency: string,
    spent: number,
    expected: number,
  ) {
    setLoading(true);
    setError("");
    setExplanation("");
    try {
      const data = await callFunction("ai-overspend", {
        expenses,
        budget,
        currency,
        spent,
        expected,
      });
      setExplanation(data.explanation);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  return { explanation, loading, error, explain };
}
