"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, QrCode } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VenueDetails from "@/components/venueRegistration/VenueDetails";
import VenueLocation from "@/components/venueRegistration/VenueLocation";
import AccountSetup from "@/components/venueRegistration/AccountSetup";
import PaymentDetails from "@/components/venueRegistration/PaymentDetails";

export default function VenueSignupPage() {
  const [step, setStep] = useState(1);
  const [animateDirection, setAnimateDirection] = useState<"next" | "prev">(
    "next"
  );

  const [formData, setFormData] = useState({
    venueDetails: {
      venueName: "",
      venueType: "",
      capacity: 0,
      description: "",
    },
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
    },
    account: {
      name: "",
      email: "",
      position: "",
      plan: "",
    },
    payment: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolderName: "",
      billingAddress: "",
      city: "",
      country: "",
      zipCode: "",
    },
  });

  const goToNextStep = () => {
    setAnimateDirection("next");
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const goToPrevStep = () => {
    setAnimateDirection("prev");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = () => {
    console.log("Submitted form data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      {/* Gradient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 p-4 flex items-center justify-between">
        <Link
          href="https://netwok.app"
          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Home</span>
        </Link>
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs px-3 py-1 h-auto"
            asChild
          >
            <Link href="/venue/login">Venue Login</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-4">
            <div className=" rounded-xl p-2">
              <Image src="/logo.svg" alt="Logo" width={120} height={120} />
            </div>
          </div>

          <Card className="bg-gray-900/80 backdrop-blur-md border-0 shadow-2xl overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 flex items-center justify-between">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  onClick={goToPrevStep}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              ) : (
                <div className="w-8"></div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  {step === 1
                    ? "Venue Details"
                    : step === 2
                    ? "Location"
                    : step === 3
                    ? "Account Setup"
                    : "Payment"}
                </span>
              </div>

              <div className="w-8"></div>
            </div>

            <div className="px-4 py-3 bg-gray-800/50 flex justify-between">
              <div
                className={`h-1 flex-1 rounded-full ${
                  step >= 1
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gray-700"
                }`}
              ></div>
              <div className="w-2"></div>
              <div
                className={`h-1 flex-1 rounded-full ${
                  step >= 2
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gray-700"
                }`}
              ></div>
              <div className="w-2"></div>
              <div
                className={`h-1 flex-1 rounded-full ${
                  step >= 3
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gray-700"
                }`}
              ></div>
              <div className="w-2"></div>
              <div
                className={`h-1 flex-1 rounded-full ${
                  step >= 4
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gray-700"
                }`}
              ></div>
            </div>

            <CardContent className="p-5">
              <div
                className={`transition-all duration-300 ${
                  animateDirection === "next"
                    ? step === 1
                      ? "translate-x-0"
                      : "translate-x-full opacity-0 absolute"
                    : step === 1
                    ? "translate-x-0"
                    : "translate-x-full opacity-0 absolute"
                }`}
              >
                {step === 1 && (
                  <VenueDetails
                    data={formData.venueDetails}
                    updateData={(data) =>
                      setFormData((prev) => ({
                        ...prev,
                        venueDetails: { ...data, description: data.description || "" },
                      }))
                    }
                    onNext={goToNextStep}
                  />
                )}
              </div>

              <div
                className={`transition-all duration-300 ${
                  animateDirection === "next"
                    ? step === 2
                      ? "translate-x-0"
                      : step < 2
                      ? "translate-x-full opacity-0 absolute"
                      : "-translate-x-full opacity-0 absolute"
                    : step === 2
                    ? "translate-x-0"
                    : step < 2
                    ? "translate-x-full opacity-0 absolute"
                    : "-translate-x-full opacity-0 absolute"
                }`}
              >
                {/* {step === 2 && <VenueLocation onNext={goToNextStep} />} */}
                {step === 2 && (
                  <VenueLocation
                    data={formData.location}
                    updateData={(data) =>
                      setFormData((prev) => ({ ...prev, location: data }))
                    }
                    onNext={goToNextStep}
                    onPrev={goToPrevStep}
                  />
                )}
              </div>

              <div
                className={`transition-all duration-300 ${
                  animateDirection === "next"
                    ? step === 3
                      ? "translate-x-0"
                      : "-translate-x-full opacity-0 absolute"
                    : step === 3
                    ? "translate-x-0"
                    : "-translate-x-full opacity-0 absolute"
                }`}
              >
                {/* {step === 3 && <AccountSetup onNext={goToNextStep} />} */}
                {step === 3 && (
                  <AccountSetup
                    data={formData.account}
                    updateData={(data) =>
                      setFormData((prev) => ({ ...prev, account: data }))
                    }
                    onNext={goToNextStep}
                    onPrev={goToPrevStep}
                  />
                )}
              </div>

              <div
                className={`transition-all duration-300 ${
                  animateDirection === "next"
                    ? step === 4
                      ? "translate-x-0"
                      : "-translate-x-full opacity-0 absolute"
                    : step === 4
                    ? "translate-x-0"
                    : "-translate-x-full opacity-0 absolute"
                }`}
              >
                {/* {step === 4 && <PaymentDetails />} */}
                {step === 4 && (
                  <PaymentDetails
                    data={formData.payment}
                    updateData={(data) =>
                      setFormData((prev) => ({ ...prev, payment: data }))
                    }
                    onSubmit={handleFinalSubmit}
                    onPrev={goToPrevStep}
                  />
                )}
              </div>

              <div className="mt-5 text-center text-xs text-gray-500">
                By signing up, you agree to our{" "}
                <Link
                  href="https://netwok.app/terms"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="https://netwok.app/privacy"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Privacy Policy
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Benefits for venues */}
          <div className="mt-8 space-y-4 text-gray-300">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full p-2 mt-1">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Custom QR Codes</h3>
                <p className="text-sm text-gray-400">
                  Generate unique QR codes for your venue that visitors can scan
                  to join your network
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full p-2 mt-1">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Increase Revenue</h3>
                <p className="text-sm text-gray-400">
                  Extend visit duration and boost revenue by connecting visitors
                  in your venue
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-4 text-gray-500 text-xs text-center">
        <p>© {new Date().getFullYear()} Netwok. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link
            href="https://netwok.app/terms"
            className="hover:text-gray-300 transition-colors"
          >
            Terms
          </Link>
          <Link
            href="https://netwok.app/privacy"
            className="hover:text-gray-300 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="https://netwok.app/contact"
            className="hover:text-gray-300 transition-colors"
          >
            Help
          </Link>
        </div>
      </footer>
    </div>
  );
}
