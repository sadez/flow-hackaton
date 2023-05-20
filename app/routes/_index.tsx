import { Flex, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import TableHeader from '~/components/TableHeader';
import { getAmazonsStocks, getGooglesStocks } from '~/models/stocks.server';

export const loader = async () => {

  const amazonsStocks = await getAmazonsStocks();
  console.log(amazonsStocks);
  // get highestPriceOfTheDay (the vertices of a curve of array) 
  // let pics = []
  // let highestPriceOfTheDay = 0
  // let lowestPriceOfTheDay = 0
  // let id = 0
  // let timestamp = 0
  // for (let i = 0; i < amazonsStocks.length; i++) {
  //   if (amazonsStocks[i].highestPriceOfTheDay > highestPriceOfTheDay) {
  //     highestPriceOfTheDay = amazonsStocks[i].highestPriceOfTheDay
  //     lowestPriceOfTheDay = amazonsStocks[i].lowestPriceOfTheDay
  //     id = amazonsStocks[i].id
  //     timestamp = amazonsStocks[i].timestamp
  //   }
  // }
  // pics.push({ highestPriceOfTheDay, lowestPriceOfTheDay, id, timestamp })

  // console.log(pics);
  

  const googleStocks = await getGooglesStocks();
 
  return json({
    amazonStocks: amazonsStocks,
    googleStocks: googleStocks,
  });
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <Flex>
      <TableContainer>
        <Table variant='simple'>
          <TableHeader />
         
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
        </Table>
      </TableContainer>
      <TableContainer>
        <Table variant='simple'>
          <TableHeader />
          <Tbody>
            {data.googleStocks.map(({ highestPriceOfTheDay, lowestPriceOfTheDay, id, timestamp }) => (
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
      
        </Table>
      </TableContainer>
    </Flex>
  );
}
