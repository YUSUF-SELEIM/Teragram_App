import { BiArrowBack } from "react-icons/bi";

function ChatHeader({
  chattingWithImageUrl,
  chattingWithName,
  handleBackClick,
}: {
  chattingWithImageUrl: string;
  chattingWithName: string | null;
  handleBackClick: () => void;
}) {
  console.log(chattingWithImageUrl);

  return (
    <>
      {chattingWithName && (
        <div className="fixed z-50 flex items-center space-x-3 shadow-inner w-full p-4  text-white bg-neutral-100 dark:bg-[#27272A]">
          <BiArrowBack
            className="text-2xl text-black md:hidden dark:text-white"
            onClick={handleBackClick}
          />
          <img
            alt={chattingWithName || "user"}
            className="rounded-full w-10 h-10"
            src={
              chattingWithImageUrl ||
              `https://avatar.iran.liara.run/username?username=${chattingWithName}`
            }
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
