import { Th, Thead, Tr } from '@chakra-ui/react';

function TableHeader() {
  return (
    <Thead>
      <Tr>
        <Th>Date</Th>
        <Th>Action</Th>
        <Th>Name</Th>
        <Th>Prix unitaire</Th>
        <Th>Nombre d’actions</Th>
        <Th>Total</Th>
        <Th>Portefeuille</Th>
      </Tr>
    </Thead>
  );
}

export default TableHeader;
