import styled from "styled-components";

import { commodities, Commodity, Prices } from "@shared/types";
import { Body, Button, Row } from "../styles";

interface Props {
  prices: Prices;
  purchase: (x: Commodity) => void;
}

export const Shop = ({ prices, purchase }: Props) => {
  return (
    <div>
      {(Object.entries(prices) as Array<[Commodity, number]>).map(
        ([commodity, price]) => (
          <CommodityRow key={commodity}>
            <Body bold>{commodities[commodity]}</Body>

            <Body>{price} €</Body>

            <Button onClick={() => purchase(commodity)}>BUY</Button>
          </CommodityRow>
        )
      )}
    </div>
  );
};

const CommodityRow = styled(Row)`
  display: grid;
  grid-template-columns: 1fr auto auto;
`;
