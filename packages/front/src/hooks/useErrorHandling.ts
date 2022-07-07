import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Id } from "react-toastify";
import { omit } from "lodash";

import { ErrorMessages } from "@shared/error";
import { SocketMessage } from "@shared/message";
import { socket } from "../config/socket.config";
import storageUtils from "../utils/storage.utils";

export const useErrorHandling = () => {
  const navigate = useNavigate();
  let errors = useRef<Record<string, Id>>({}).current;

  useEffect(() => {
    socket.on(SocketMessage.ERROR, (error) => {
      const errorStr = JSON.stringify(error);

      const message =
        "message" in error ? error.message : JSON.stringify(error);

      // avoid duplicate errors by
      if (errorStr in errors) {
        toast.update(errors[errorStr], { render: message });
      } else {
        errors[errorStr] = toast.error(message, {
          onClose: () => {
            // clear from error queue
            errors = omit(errors, errorStr);
          },
        });
      }

      if (!("type" in error)) return;

      if (error.type === ErrorMessages.INVALID_SESSION) {
        storageUtils.removeSession();
        navigate("/");
      } else if (error.type === ErrorMessages.UNKNOWN_USER) {
        navigate("/");
      } else if (error.type === ErrorMessages.NOT_ALLOWED) {
        storageUtils.removeAdminToken();
        navigate("/");
      }
    });

    return () => {
      socket.off(SocketMessage.ERROR);
    };
  }, []);
};
