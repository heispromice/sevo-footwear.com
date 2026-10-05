import type {
  CustomerOrderStatus,
  OrderFulfillment,
} from "@/content/order-preview";
import { cn } from "@/lib/utils";

type StatusStep = {
  key: CustomerOrderStatus;
  label: string;
};

type ExceptionalOrderStatus = Extract<
  CustomerOrderStatus,
  "NEEDS_CORRECTION" | "EXPIRED" | "CANCELLED"
>;

const sharedSteps: StatusStep[] = [
  {
    key: "PENDING_PAYMENT",
    label: "Order placed",
  },
  {
    key: "PAYMENT_SUBMITTED",
    label: "Payment submitted",
  },
  {
    key: "PAYMENT_VERIFIED",
    label: "Payment verified",
  },
  {
    key: "PROCESSING",
    label: "Processing",
  },
];

const deliverySteps: StatusStep[] = [
  ...sharedSteps,
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
  },
];

const pickupSteps: StatusStep[] = [
  ...sharedSteps,
  {
    key: "READY_FOR_PICKUP",
    label: "Ready for pickup",
  },
  {
    key: "COLLECTED",
    label: "Collected",
  },
];

const stepOrder: CustomerOrderStatus[] = [
  "PENDING_PAYMENT",
  "PAYMENT_SUBMITTED",
  "PAYMENT_VERIFIED",
  "PROCESSING",
  "OUT_FOR_DELIVERY",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "COLLECTED",
];

export function OrderStatus({
  status,
  fulfillment,
}: {
  status: CustomerOrderStatus;
  fulfillment: OrderFulfillment;
}) {
  if (
    status === "NEEDS_CORRECTION" ||
    status === "EXPIRED" ||
    status === "CANCELLED"
  ) {
    return <ExceptionalStatus status={status} />;
  }

  const steps = fulfillment === "DELIVERY" ? deliverySteps : pickupSteps;

  const activeIndex = stepOrder.indexOf(status);

  return (
    <div className="border border-border p-5 md:p-6">
      <div className="flex items-center justify-between gap-6">
        <p className="sevo-label">Order progress</p>

        <span className="sevo-meta text-muted-foreground">
          {statusLabel(status)}
        </span>
      </div>

      <ol className="mt-7">
        {steps.map((step, index) => {
          const currentIndex = stepOrder.indexOf(step.key);
          const completed = activeIndex >= currentIndex;
          const current = activeIndex === currentIndex;

          return (
            <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[5px] top-3 h-[calc(100%-4px)] w-px",
                    completed ? "bg-foreground" : "bg-border",
                  )}
                />
              )}

              <span
                className={cn(
                  "relative z-10 mt-0.5 h-3 w-3 shrink-0 border",
                  completed
                    ? "border-foreground bg-foreground"
                    : "border-border bg-background",
                )}
                aria-hidden="true"
              />

              <div className="-mt-1">
                <p
                  className={cn(
                    "text-sm",
                    current
                      ? "font-medium"
                      : !completed
                        ? "text-muted-foreground"
                        : undefined,
                  )}
                >
                  {step.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ExceptionalStatus({ status }: { status: ExceptionalOrderStatus }) {
  const content: Record<
    ExceptionalOrderStatus,
    {
      title: string;
      body: string;
    }
  > = {
    NEEDS_CORRECTION: {
      title: "Payment needs correction",
      body: "The payment could not be verified. Follow the instructions provided by SEVO and submit corrected payment evidence.",
    },

    EXPIRED: {
      title: "Order expired",
      body: "The payment reservation period ended before the order was completed.",
    },

    CANCELLED: {
      title: "Order cancelled",
      body: "This order is no longer active.",
    },
  };

  const current = content[status];

  return (
    <div className="border border-border p-5 md:p-6">
      <p className="sevo-meta text-muted-foreground">
        {status.replaceAll("_", " ")}
      </p>

      <h2 className="sevo-display mt-3 text-2xl">{current.title}</h2>

      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
        {current.body}
      </p>
    </div>
  );
}

function statusLabel(status: CustomerOrderStatus) {
  const labels: Record<CustomerOrderStatus, string> = {
    PENDING_PAYMENT: "Payment pending",
    PAYMENT_SUBMITTED: "Payment submitted",
    PAYMENT_VERIFIED: "Payment verified",
    PROCESSING: "Processing",
    OUT_FOR_DELIVERY: "Out for delivery",
    READY_FOR_PICKUP: "Ready for pickup",
    DELIVERED: "Delivered",
    COLLECTED: "Collected",
    NEEDS_CORRECTION: "Needs correction",
    EXPIRED: "Expired",
    CANCELLED: "Cancelled",
  };

  return labels[status];
}
