import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/paymentService";
import LoadingDelight from "@/components/LoadingDelight";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const tripId = searchParams.get("tripId");

  useEffect(() => {
    const confirmPayment = async () => {
      if (tripId) {
        try {
          await paymentService.confirmPaymentSuccess(Number(tripId));
          setLoading(false);
        } catch (err) {
          console.error("Failed to confirm payment:", err);
          setError(true);
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError(true);
      }
    };

    confirmPayment();
  }, [tripId]);

  if (loading) {
    return <LoadingDelight label="Confirming your payment..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-destructive animate-spin" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          We couldn't confirm your payment. Please contact support or check your trips.
        </p>
        <Button onClick={() => navigate("/client/trips")} className="font-bold uppercase tracking-wider">
          Go to My Trips
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce-slow">
        <CheckCircle className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
        Payment Successful!
      </h1>
      <p className="text-muted-foreground max-w-md mb-8 font-medium">
        Your move has been successfully scheduled. You can now track its progress in your dashboard.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/client/trips")} className="font-bold uppercase tracking-wider px-8 h-12">
          View My Trip
        </Button>
        <Button variant="outline" onClick={() => navigate("/client")} className="font-bold uppercase tracking-wider px-8 h-12">
          Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
