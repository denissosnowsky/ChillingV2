"use client";

import { useStorageUpload } from "@thirdweb-dev/react";

import { NOTIFICATION_MESSAGES } from "@/constants";
import { useMakeNotification } from "@/hooks/useMakeNotification";

type UseUploadImageToIpfs = (image: Blob) => Promise<string>;

export const useUploadImageToIpfs = (): UseUploadImageToIpfs => {
  const { dispatchError } = useMakeNotification();

  const { mutateAsync: upload } = useStorageUpload();

  const uploadToIpfs = async (image: Blob): Promise<string> => {
    let imageHash: string;

    try {
      const uploadUrl = await upload({
        data: [image],
        options: {
          uploadWithGatewayUrl: true,
          uploadWithoutDirectory: true,
        },
      });

      const splittedBySlash = uploadUrl[0].split("/");
      imageHash = splittedBySlash.pop() ?? "";

      if (!imageHash) {
        imageHash = splittedBySlash.pop() ?? " ";
      }
    } catch {
      dispatchError(NOTIFICATION_MESSAGES.imageUploadError);
      imageHash = " ";
    }

    return imageHash;
  };

  return uploadToIpfs;
};
