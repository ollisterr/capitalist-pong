import { useEffect, useState } from "react";
import styled from "styled-components";
import { Stack } from "styled-layout";

import { commodities, Commodity, companies, Company } from "@shared/types";
import { Body, Button, Row, Title } from "../styles";
import { isAdminState, useAppState } from "../providers/AppStateProvider";

export const Shop = () => {
  const { gameState, canAfford, shoppingCart, invest, toggleCommodity } =
    useAppState();

  const { investments, commodities: items } = shoppingCart;

  if (!gameState || isAdminState(gameState)) return null;

  const { prices, marketRates, state } = gameState;

  return (
    <Stack spacing="xl">
      <Stack>
        <Title>Investments</Title>

        {(Object.entries(marketRates) as Array<[Company, number]>).map(
          ([company, stockPrice]) => (
            <InvestmentRow key={company}>
              <Stack axis="x">
                <Body bold>{company}</Body>

                <Body>(${stockPrice} per share)</Body>
              </Stack>

              <Stack axis="x" spacing="default" align="center">
                <Button
                  onClick={() => invest(company, -1)}
                  disabled={
                    (state.investments[company] ?? 0) <= 0 &&
                    (investments[company] ?? 0) <= 0
                  }
                >
                  Less
                </Button>

                <Body>
                  {state.investments[company]} ({investments[company] ?? 0})
                </Body>

                <Button
                  onClick={() => invest(company, 1)}
                  disabled={!canAfford(stockPrice)}
                >
                  More
                </Button>
              </Stack>
            </InvestmentRow>
          )
        )}
      </Stack>

      <Stack>
        <Title>Items</Title>

        {(Object.entries(prices) as Array<[Commodity, number]>).map(
          ([commodity, price]) => (
            <CommodityRow key={commodity}>
              <Body bold>{commodities[commodity]}</Body>

              <Body>{price} €</Body>

              <Button
                onClick={() => toggleCommodity(commodity)}
                disabled={!canAfford(price) && !items.includes(commodity)}
              >
                {items.includes(commodity) ? "REMOVE" : "BUY"}
              </Button>
            </CommodityRow>
          )
        )}
      </Stack>
    </Stack>
  );
};

const CommodityRow = styled(Row)`
  display: grid;
  grid-template-columns: 1fr auto auto;
`;

const InvestmentRow = styled(Row)`
  display: grid;
  grid-template-columns: 1fr auto;
`;
