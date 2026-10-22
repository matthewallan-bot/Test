import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-steel">Account</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-ink">
        Order history
      </h1>
      <p className="mt-3 text-ink-soft">
        Empty until paid orders exist for the signed-in user.
      </p>
      <div className="mt-8 border border-dashed border-ink/20 px-4 py-10 text-center text-ink-soft">
        No orders yet.{" "}
        <Link href="/merch" className="font-semibold text-signal">
          Shop merch
        </Link>
      </div>
      <p className="mt-4 text-sm text-steel">
        Example detail route:{" "}
        <Link href="/account/orders/FR-10042" className="text-signal">
          /account/orders/FR-10042
        </Link>
      </p>
    </div>
  );
}
