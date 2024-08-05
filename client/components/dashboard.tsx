import React from "react";
import {
  AiOutlineUser,
  AiOutlineMessage,
  AiOutlineTeam,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import Image from "next/image";
import nookies from "nookies";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between p-4 shadow-xl dark:text-white">
      <Image
        alt={"logo"}
        className="transition-transform transform duration-250 hover:-rotate-12"
        height={50}
        src="/logo.png"
        width={50}
      />
      <nav>
        <ul className="flex flex-col items-center h-full space-y-8">
          <li>
            <button onClick={() => {}}>
              <AiOutlineUser className="text-2xl transform hover:scale-125 hover:text-violet-400" />
            </button>
          </li>
          <li>
            <button onClick={() => {}}>
              <AiOutlineMessage className="text-2xl transform hover:scale-125 hover:text-violet-400" />
            </button>
          </li>
          <li>
            <button onClick={() => {}}>
              <AiOutlineTeam className="text-2xl transform hover:scale-125 hover:text-violet-400" />
            </button>
          </li>
          <li>
            <button onClick={() => {}}>
              <AiOutlineSetting className="text-2xl transform hover:scale-125 hover:text-violet-400" />
            </button>
          </li>
        </ul>
      </nav>
      <div>
        <button
          onClick={() => {
            // Destroy token cookie
            nookies.destroy(null, "token", { path: "/" });
            router.push("/");
          }}
        >
          <AiOutlineLogout className="text-2xl transform rotate-180 hover:scale-125 hover:text-violet-400" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
