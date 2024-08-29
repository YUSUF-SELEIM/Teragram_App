import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FaPen } from "react-icons/fa";
import { Button, Input, Spinner } from "@nextui-org/react";

const GET_USER_INFO = gql`
  query GetUserInfo($id: ID!) {
    getUserInfo(id: $id) {
      id
      name
      imageUrl
    }
  }
`;

const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo($id: ID!, $name: String, $imageUrl: String) {
    updateUserInfo(id: $id, name: $name, imageUrl: $imageUrl) {
      id
      name
      imageUrl
    }
  }
`;

const UserInfo = ({ id }: { id: string }) => {
  const { data, loading, error } = useQuery(GET_USER_INFO, {
    variables: { id },
  });
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [updateUserInfo] = useMutation(UPDATE_USER_INFO);

  useEffect(() => {
    if (data) {
      setName(data.getUserInfo.name);
      setImageUrl(
        data.getUserInfo.imageUrl ||
          `https://avatar.iran.liara.run/username?username=${data.getUserInfo.name}`,
      );
    }
  }, [data]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();

      setIsUploading(true);

      formData.append("file", file);
      formData.append("upload_preset", "Teragram");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        console.log(data);
        const uploadedImageUrl = data.secure_url;

        setImageUrl(uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    if (name === "") {
      setIsSaving(false);

      return;
    }
    updateUserInfo({
      variables: {
        id,
        name,
        imageUrl,
      },
    })
      .then((response) => {
        console.log("User info updated:", response.data.updateUserInfo);
        setIsSaving(false);
      })
      .catch((error) => {
        console.error("Error updating user info:", error);
      });
  };

  if (loading)
    return (
      <div className="absolute top-0 right-0 z-50 flex flex-col items-center justify-center w-full h-full bg-neutral-100 dark:bg-neutral-900 dark:text-white">
        <Spinner color="secondary" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="absolute top-0 right-0 z-50 w-full h-full bg-neutral-100 dark:bg-neutral-900 dark:text-white">
      <div className="w-full h-full">
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
          <div className="relative">
            <img
              alt="User"
              className="w-32 h-32 border-4 border-gray-300 rounded-full dark:border-gray-700"
              src={imageUrl}
            />
            <input
              accept="image/*"
              className="hidden"
              id="profile-image-input"
              type="file"
              onChange={handleImageChange}
            />
            <label
              className="absolute bottom-0 right-0 p-2 text-white rounded-full shadow-lg cursor-pointer bg-violet-700 hover:bg-violet-500"
              htmlFor="profile-image-input"
            >
              {""}
              <FaPen />
            </label>
          </div>
          {isUploading && (
            <p className="text-gray-500 dark:text-gray-300">Uploading...</p>
          )}
          <div className="text-center">
            <Input
              color="secondary"
              errorMessage="Name Cannot be empty"
              isInvalid={name === ""}
              type="text"
              value={name}
              variant="underlined"
              onChange={handleNameChange}
            />
          </div>
          <Button color="secondary" variant="shadow" onClick={handleSave}>
            {isSaving ? <Spinner color="white" size="sm" /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
