import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { BiArrowBack } from "react-icons/bi";
import { Input, Spinner } from "@nextui-org/react";

const GET_All_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      imageUrl
    }
  }
`;

const CREATE_SINGLE_CHAT = gql`
  mutation CreateChat($type: ChatType!, $userIds: [ID!]!) {
    createChat(type: $type, userIds: $userIds) {
      id
      type
    }
  }
`;

function Users({
  myId,
  setIsUsersVisible,
  onChatCreated, // Callback to trigger refetch
}: {
  myId: string;
  setIsUsersVisible: (value: boolean) => void;
  onChatCreated: () => void;
}) {
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // Query to fetch all users
  const { loading, error, data } = useQuery(GET_All_USERS);

  // Mutation to create a chat
  const [createSingleChat] = useMutation(CREATE_SINGLE_CHAT);

  if (loading)
    return (
      <div className="absolute top-0 right-0 z-50 flex flex-col items-center justify-center w-full h-full bg-neutral-100 dark:bg-neutral-900 dark:text-white">
        <Spinner color="secondary" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  // Filter users based on the search term
  const filteredUsers = data.getAllUsers.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle user selection and chat creation
  const isUserSelected = async (myId: string, userId: string) => {
    try {
      const { data } = await createSingleChat({
        variables: {
          type: "SINGLE",
          userIds: [userId, myId],
        },
      });

      console.log("Created chat:", data);
      setIsUsersVisible(false);
      onChatCreated(); // Trigger refetch in parent component
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  return (
    <div className="absolute top-0 right-0 z-50 w-full h-full bg-neutral-100 dark:bg-neutral-900 dark:text-white">
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center w-full p-4 space-x-4">
          <button
            className="dark:text-white"
            onClick={() => setIsUsersVisible(false)}
          >
            <BiArrowBack className="text-2xl transform hover:scale-125 hover:text-violet-400" />
          </button>
          <Input
            placeholder="Search Users"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ul className="p-2 space-y-1">
          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No users found
            </p>
          )}
          {filteredUsers.map((user: any) => (
            <button
              key={user.id}
              className="flex items-center w-full p-2 space-x-4 rounded-md cursor-pointer dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-800"
              onClick={() => isUserSelected(myId, user.id)}
            >
              <img
                alt={user.name}
                className="rounded-full w-10 h-10"
                src={
                  user.imageUrl ||
                  `https://avatar.iran.liara.run/username?username=${user.name}`
                }
              />
              <div className="min-w-0 text-left">
                <h2 className="truncate text-md">{user.name}</h2>
                <p className="text-sm font-light text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Users;
