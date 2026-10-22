"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddToCartButton({
  sku,
  skus,
}: {
  sku?: string;
  skus: { sku: string; name: string }[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(sku ?? skus[0]?.sku ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function add() {
    if (!selected) return;
    setPending(true);
    setMessage(null);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku: selected, quantity: 1 }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setPending(false);
    if (!res.ok) {
      setMessage(data.error ?? "Could not add to cart");
      return;
    }
    router.push("/cart");
    router.refresh();
  }

  return (
    <div className="mt-8 space-y-4">
      <label className="block text-sm font-medium text-ink">
        Variant
        <select
          className="mt-2 w-full border border-ink/20 bg-paper px-3 py-2"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {skus.map((v) => (
            <option key={v.sku} value={v.sku}>
              {v.name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={add}
        disabled={pending || !selected}
        className="rounded-sm bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-wide text-paper hover:bg-signal-deep disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add to cart"}
      </button>
      {message ? <p className="text-sm text-signal">{message}</p> : null}
    </div>
  );
}
