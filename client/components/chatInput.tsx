import { Button, Input } from "@nextui-org/react";
import React from "react";
import { BiImageAdd, BiSend } from "react-icons/bi";

function ChatInput({
  handleImageChange,
  handleSendMessage,
  image,
  message,
  setMessage,
}: {
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  image: File | null;
  message: string;
  setMessage: (message: string) => void;
}) {
  return (
    <div className="z-50 flex items-center w-full p-2 px-6 space-x-2 dark:bg-black">
      <div className="flex w-full bg-[#F4F4F5] dark:bg-neutral-800 rounded-2xl h-full">
        <Input
          placeholder="Message"
          size="lg"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex items-center p-2">
          <label className="cursor-pointer" htmlFor="img">
            {}
            <BiImageAdd
              className="text-xl text-gray-500 hover:text-violet-700"
              size={24}
            />
            <input
              accept="image/*"
              className="hidden"
              id="img"
              type="file"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {image && (
        <div className="mt-2">
          <strong>Selected Image:</strong> {image.name}
        </div>
      )}

      <Button
        isIconOnly
        className="rounded-full shadow-xl bg-violet-900"
        size="lg"
        onClick={handleSendMessage}
      >
        <BiSend className="text-2xl text-white hover:animate-appearance-in" />
      </Button>
    </div>
  );
}

export default ChatInput;
