import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spacer, Stack } from "styled-layout";

import { useAppState } from "../providers/AppStateProvider";
import { Button, Input, Label, Page, Link } from "../styles";
import { SocketMessage, SocketRequest } from "@shared/message";
import { socket } from "../config/socket.config";

export const JoinPage = () => {
  const { playerName, playerId, sessionId } = useAppState();

  const [gameId, setGameId] = useState(sessionId ?? "");
  const [nickname, setNickname] = useState(playerName ?? "");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    socket.emit(SocketRequest.JOIN, {
      sessionId: gameId,
      playerName: nickname,
      playerId: playerId ?? undefined,
    });
  };

  return (
    <Page>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Label>
            Game ID
            <Input value={gameId} onChange={(e) => setGameId(e.target.value)} />
          </Label>

          <Label>
            Nickname
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </Label>

          <Button type="submit">Join</Button>
        </Stack>
      </form>

      <Spacer axis="y" size="xl" />

      <Link to="/create">Create game</Link>
    </Page>
  );
};
