import { useCallback } from "react";
import { useNotification } from "@web3uikit/core";
import { IPosition } from "@web3uikit/core/dist/lib/Notification/types";

type UseMakeNotification = {
  dispatchSuccess: (message: string) => void;
  dispatchError: (message: string) => void;
  dispatchTransaction: (
    message: string,
    tx: { wait: Function }
  ) => Promise<void>;
};

export const useMakeNotification = (): UseMakeNotification => {
  const dispatch = useNotification();

  const commonConfig: {
    position: IPosition;
  } = {
    position: "topR",
  };

  const dispatchSuccess = useCallback(
    (message: string) => {
      dispatch({
        ...commonConfig,
        type: "success",
        title: "Success",
        message,
      });
    },
    [] // eslint-disable-line
  );

  const dispatchError = useCallback(
    (message: string) => {
      dispatch({
        ...commonConfig,
        type: "error",
        title: "Error",
        message,
      });
    },
    [] // eslint-disable-line
  );

  const dispatchTransaction = useCallback(
    async (message: string, tx: { wait: Function }) => {
      await tx.wait(1);
      dispatch({
        ...commonConfig,
        type: "success",
        title: "Success",
        message,
      });
    },
    [] // eslint-disable-line
  );

  return {
    dispatchSuccess,
    dispatchError,
    dispatchTransaction,
  };
};
