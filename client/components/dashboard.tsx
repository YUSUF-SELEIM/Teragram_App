import React from "react";
import { BiUserCircle, BiLogOutCircle } from "react-icons/bi";
import nookies from "nookies";
import { useRouter } from "next/navigation";

import { ThemeSwitch } from "./theme-switch";

const Dashboard = ({ toggleUserInfo }: { toggleUserInfo: () => void }) => {
  const router = useRouter();

  return (
    <div className="relative md:w-[5%] w-[13%] flex flex-col items-center justify-between h-full p-4 bg-neutral-200 dark:bg-neutral-950 py-7 dark:text-white">
      <nav>
        <ul className="flex flex-col items-center h-full space-y-8">
          <li>
            <button onClick={toggleUserInfo}>
              <BiUserCircle className="text-2xl transform hover:scale-125" />
            </button>
          </li>

          <li>
            <ThemeSwitch />
          </li>
          <li>
            <button
              onClick={() => {
                // Destroy token cookie
                nookies.destroy(null, "token", { path: "/" });
                router.push("/");
              }}
            >
              <BiLogOutCircle className="text-2xl transform hover:scale-125" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
