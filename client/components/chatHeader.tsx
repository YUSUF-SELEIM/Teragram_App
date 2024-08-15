import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";
function ChatHeader({
  chattingWithName,
  handleBackClick,
}: {
  chattingWithName: string | null;
  handleBackClick: () => void;
}) {
  return (
    <>
      {chattingWithName && (
        <div className="fixed z-50 flex items-center space-x-3 shadow-inner w-full p-4  text-white bg-neutral-100 dark:bg-[#27272A]">
          <BiArrowBack
            className="text-2xl text-black md:hidden dark:text-white"
            onClick={handleBackClick}
          />

          <Image
            alt={chattingWithName || "user"}
            className="rounded-full"
            height={42}
            src={
              //   chat.users[0]?.imageUrl ||
              `https://avatar.iran.liara.run/username?username=${chattingWithName}`
            }
            width={42}
          />
          <h1 className="text-xl font-medium text-black dark:text-white">
            {chattingWithName}
          </h1>
        </div>
      )}
    </>
  );
}

export default ChatHeader;
