import { ReceivedChatMessage } from "@livekit/components-react";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

const ChatMessage = ({
  participantName,
  message,
}: {
  participantName?: String;
  message: ReceivedChatMessage;
}) => {
  const isSender = participantName === message?.from?.identity;

  return (
    <div className={clsx("flex", isSender && "flex-row-reverse")}>
      <div className={clsx("rounded-full mr-2", isSender && "hidden")}>
        <Image src="/profile.png" alt="profile" width="40" height="40" />
      </div>
      <div
        className={clsx(
          "w-64 p-2 rounded-lg",
          isSender ? "bg-blue-300" : "bg-gray-300"
        )}
      >
        <div className="flex items-center justify-between text-sm">
          <p
            className={clsx(
              "font-medium w-1/2",
              isSender && "text-blue-800",
              "truncate"
            )}
          >
            {isSender ? "Kamu" : message?.from?.identity}
          </p>
          <p className={clsx(isSender && "text-blue-700")}>
            {new Date(message?.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div
          className={clsx(
            "mt-2 text-justify break-words",
            isSender && "text-blue-700"
          )}
        >
          {message.message}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
