import styled from "styled-components";

import { commodities, Commodity, Company, Prices } from "@shared/types";
import { Body, Button, Row, Title } from "../styles";
import { useAppState } from "../providers/AppStateProvider";
import { SocketRequest } from "@shared/message";
import { socket } from "../config/socket.config";
import { Stack } from "styled-layout";

export const Shop = () => {
  const { gameState } = useAppState();

  if (!gameState) return null;

  const { prices, marketRates, state } = gameState;

  const purchase = (commodity: Commodity) => {
    socket.emit(SocketRequest.PURCHASE, commodity);
  };

  return !Array.isArray(state) ? (
    <Stack>
      <Title>Investments</Title>

      {(Object.entries(marketRates) as Array<[Company, number]>).map(
        ([company, stockPrice]) => (
          <InvestmentRow key={company}>
            <Body bold>{company}</Body>

            <Stack axis="x" spacing="default" align="center">
              <Button>Less</Button>

              <Body>
                {state.investments[company]} (${stockPrice} per share)
              </Body>

              <Button>More</Button>
            </Stack>
          </InvestmentRow>
        )
      )}

      <Title>Items</Title>

      {(Object.entries(prices) as Array<[Commodity, number]>).map(
        ([commodity, price]) => (
          <CommodityRow key={commodity}>
            <Body bold>{commodities[commodity]}</Body>

            <Body>{price} €</Body>

            <Button onClick={() => purchase(commodity)}>BUY</Button>
          </CommodityRow>
        )
      )}
    </Stack>
  ) : null;
};

const CommodityRow = styled(Row)`
  display: grid;
  grid-template-columns: 1fr auto auto;
`;

const InvestmentRow = styled(Row)`
  display: grid;
  grid-template-columns: 1fr auto;
`;
