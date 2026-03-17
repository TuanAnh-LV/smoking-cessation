import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PaymentService } from "../../services/payment.service";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("token");
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    if (orderId) {
      PaymentService.acceptPaypalOrder({ orderId })
        .then((res) => {
          console.log("Capture success:", res);
          setStatus("success");
        })
        .catch((err) => {
          console.error("Capture failed:", err);
          setStatus("fail");
        });
    } else {
      console.error("No orderId found in URL");
      setStatus("fail");
    }
  }, [orderId]);

  const goHome = () => navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
        {status === "processing" && (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Processing your payment...
            </h2>
            <p className="text-gray-500">
              Please wait while we confirm your transaction.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your membership has been activated.
            </p>
            <button
              onClick={goHome}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            >
              Go to Home
            </button>
          </>
        )}

        {status === "fail" && (
          <>
            <div className="text-red-500 text-5xl mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              There was a problem completing your payment. Please try again or
              contact support.
            </p>
            <button
              onClick={goHome}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
            >
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
