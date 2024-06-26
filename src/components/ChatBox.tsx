import React, { KeyboardEventHandler, useCallback, useMemo } from "react";
import ChatMessage from "./ChatMessage";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { useChat } from "@livekit/components-react";

const ChatBox = ({ participantName }: { participantName: string }) => {
  const [message, setMessage] = React.useState<string>("");
  const { chatMessages, send, isSending } = useChat();

  const reverseMessages = useMemo(
    () => chatMessages.sort((a, b) => a.timestamp - b.timestamp),
    [chatMessages]
  );

  const handleChangeMessage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessage(e.target.value);
  };

  const onEnter = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (message.trim().length > 0 && send) {
          await send(message).catch((err) => console.error(err));
          setMessage("");
        }
      }
    },
    [message, send]
  );

  const onSend = useCallback(async () => {
    if (message.trim().length > 0 && send) {
      await send(message).catch((err) => console.error(err));
      setMessage("");
    }
  }, [message, send]);

  return (
    <>
      <p className="font-medium text-center text-lg mb-4">Live Chat</p>
      <div className="bg-gray-50 w-full h-96 lg:h-[450px] xl:h-[500px] 2xl:h-[550px] rounded-md overflow-y-auto px-6 py-6 mx-auto flex flex-col gap-y-3">
        {reverseMessages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg}
            participantName={participantName}
          />
        ))}
      </div>
      <label htmlFor="chat" className="relative">
        <input
          value={message}
          onChange={handleChangeMessage}
          onKeyDown={onEnter}
          className="input input-bordered bg-transparent border-gray-300 mt-4 text-black w-full placeholder:text-xs "
          placeholder="Masukan pesan kamu disini"
        />
        <button onClick={onSend} disabled={message.trim().length === 0}>
          <PaperAirplaneIcon className="inset-0 ms-auto absolute pointer-events-none text-gray-500 size-4 mr-2" />
        </button>
      </label>
    </>
  );
};

export default ChatBox;
