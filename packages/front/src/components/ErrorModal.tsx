import { SocketMessage } from "@shared/message";
import { useEffect } from "react";
import { socket } from "../config/socket.config";
import { useAppState } from "../providers/AppStateProvider";

export const ErrorModal = () => {
  const { error, setError } = useAppState();

  useEffect(() => {
    socket.on(SocketMessage.ERROR, setError);

    return () => {
      socket.off(SocketMessage.ERROR);
    };
  }, []);

  return error ? <div>{error}</div> : null;
};
