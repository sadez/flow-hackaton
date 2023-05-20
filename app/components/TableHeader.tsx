import { Th, Thead, Tr } from '@chakra-ui/react';

function TableHeader() {
  return (
    <Thead>
      <Tr>
        <Th>highestPriceOfTheDay</Th>
        <Th>into</Th>
        <Th isNumeric>id</Th>
        <Th>timestamp</Th>
      </Tr>
    </Thead>
  );
}

export default TableHeader;
