"use client";

import { PaperAirplaneIcon, StarIcon } from "@heroicons/react/16/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { joinStreaming } from "../actions/streaming";
import ChatMessage from "../components/ChatMessage";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Streaming } from "../types/Streaming";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { LiveKitRoom } from "@livekit/components-react";
import ViewerPlayer from "../components/ViewerPlayer";
import ChatBox from "../components/ChatBox";
import HostPlayer from "../components/HostPlayer";
import { NavbarContext } from "../contexts/navbarContext";

export default function Home() {
  // Context
  const { setIdentity } = useContext(NavbarContext);
  const [streaming, setStreaming] = useState<Streaming | null>(null);
  const [roomSignature, setRoomSignature] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [isForbidden, setIsForbidden] = useState<boolean>(false);
  const [room, setRoom] = useState();
  const isRoomAdmin = useMemo(
    () => roomSignature && roomSignature?.video.roomAdmin,
    [roomSignature]
  );

  const moderator = useMemo(() => streaming?.moderator, [streaming]);
  const slug = useMemo(() => roomSignature?.video.room, [roomSignature]);
  const participantName = useMemo(() => roomSignature?.sub, [roomSignature]);

  const searchParams = useSearchParams();

  const signed = searchParams.get("signed");

  useEffect(() => {
    if (signed) {
      if (!roomSignature) {
        joinStreaming({ signed })
          .then((res) => {
            console.log("OK");
            setStreaming(res.data ?? null);
            setRoomSignature(jwtDecode(res.data?.room_token ?? ""));
            setIdentity(jwtDecode(res.data?.room_token ?? "").sub ?? "Guest");
          })
          .catch((err) => {
            const { message, status } = JSON.parse(err.message);
            if (status === 404) {
              setIsNotFound(true);
            } else if (status === 403) {
              setIsForbidden(true);
            } else {
              toast.error(message);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [roomSignature, setIdentity, signed]);

  if (!signed) {
    return (
      <main className="bg-black flex items-center min-h-screen justify-center select-none">
        <h1 className="text-2xl flex items-center gap-x-3">
          PENS <span className="w-0.5 inline-block h-6 bg-white"></span>{" "}
          Politeknik Elektronika Negeri Surabaya
        </h1>
      </main>
    );
  } else if (isLoading) {
    return (
      <main className="bg-black flex items-center min-h-screen justify-center select-none">
        <div className="flex items-center">
          <svg className="spinner-ring" viewBox="25 25 50 50" strokeWidth="5">
            <circle cx="50" cy="50" r="20" />
          </svg>
        </div>
      </main>
    );
  } else if (isNotFound) {
    return (
      <main className="bg-black flex flex-col items-center min-h-screen justify-center select-none">
        <h1 className="text-2xl flex items-center gap-x-3">
          Streaming Tidak Ditemukan
        </h1>
        <Link
          href="/"
          className="mt-3 text-blue-400 hover:text-blue-600 transition-colors duration-300"
        >
          Kembali ke Beranda
        </Link>
      </main>
    );
  } else if (isForbidden) {
    return (
      <main className="bg-black flex flex-col items-center min-h-screen justify-center select-none">
        <h1 className="text-2xl flex items-center gap-x-3">
          URL Telah Kadaluarsa
        </h1>
        <Link
          href="/"
          className="mt-3 text-blue-400 hover:text-blue-600 transition-colors duration-300"
        >
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-white lg:h-screen lg:relative">
      <Navbar />
      <LiveKitRoom
        token={streaming?.room_token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL}
        className="lg:absolute lg:top-44 xl:top-32"
      >
        <section className="flex flex-col lg:flex-row gap-10 text-black mt-5 mx-10 md:mx-16 lg:mx-20 xl:mx-32">
          <div className="w-full lg:w-2/3 xl:w-3/4 h-full ">
            {isRoomAdmin ? (
              <HostPlayer roomSlug={slug} />
            ) : (
              <ViewerPlayer moderator={moderator} />
            )}
            <div className="mt-6">
              <h1 className="font-semibold text-2xl">Dasar Desain Figma</h1>
              <p className="text-gray-600 mt-1 text-justify text-xs sm:text-sm md:text-base">
                Figma adalah sebuah aplikasi web kolaboratif untuk user
                interface, dengan fitur-fitur luring tambahan yang tersedia pada
                aplikasi desktop untuk Windows dan macOS.
              </p>

              <div className="flex items-center justify-between gap-x-6">
                <p className="text-yellow-500 font-medium flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                  4.3
                  <span className="text-gray-300 text-sm ml-2">
                    (12.000+ Ulasan)
                  </span>
                </p>
                <p className="text-gray-500 flex items-center">
                  <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />2 Jam /
                  Sesi
                </p>
                <p className="text-gray-500 flex items-center">
                  <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
                  Beginner
                </p>
              </div>
              <p className="text-gray-500 mt-2">
                Dibuat oleh <span className="underline">Bintang Rezeka</span>
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <ChatBox participantName={participantName} />
          </div>
        </section>
      </LiveKitRoom>

      {/* <Footer /> */}
      <ToastContainer />
    </main>
  );
}
