import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async () => {
  return json({
    amazonStocks: await db.amzn.findMany(),
  });
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>highestPriceOfTheDay</Th>
              <Th>into</Th>
              <Th isNumeric>id</Th>
              <Th>timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.amazonStocks.map(({ highestPriceOfTheDay, lowestPriceOfTheDay, id, timestamp }) => (
              <Tr key={id}>
                <Td>{highestPriceOfTheDay}</Td>
                <Td>{lowestPriceOfTheDay}</Td>
                <Td>{id}</Td>
                <Td>
                  {new Date(timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </div>
  );
}
